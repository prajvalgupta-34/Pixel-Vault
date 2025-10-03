import { Hono } from 'npm:hono@4.2.7'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Configure CORS for frontend access
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

app.use('*', logger(console.log))

// Create Supabase client with service role for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// User Management Routes
app.post('/make-server-8d1b3022/auth/signup', async (c) => {
  try {
    const { email, password, displayName, walletAddress } = await c.req.json()

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        display_name: displayName,
        wallet_address: walletAddress 
      },
      email_confirm: true // Auto-confirm since email server isn't configured
    })

    if (authError) {
      console.log('Auth signup error:', authError)
      return c.json({ error: authError.message }, 400)
    }

    // Store user profile in KV store
    const userProfile = {
      id: authData.user.id,
      email,
      displayName,
      walletAddress,
      bio: '',
      website: '',
      twitter: '',
      avatar: '',
      verified: false,
      totalNFTs: 0,
      totalSales: 0,
      totalVolume: 0,
      createdAt: new Date().toISOString()
    }

    await kv.set(`user:${authData.user.id}`, userProfile)
    await kv.set(`wallet:${walletAddress}`, authData.user.id)

    return c.json({ user: authData.user, profile: userProfile })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

app.get('/make-server-8d1b3022/auth/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const profile = await kv.get(`user:${userId}`)

    if (!profile) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ profile })
  } catch (error) {
    console.log('Get profile error:', error)
    return c.json({ error: 'Failed to fetch user profile' }, 500)
  }
})

app.put('/make-server-8d1b3022/auth/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const accessToken = c.req.header('Authorization')?.split(' ')[1]

    // Verify user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const updates = await c.req.json()
    const existingProfile = await kv.get(`user:${userId}`)

    if (!existingProfile) {
      return c.json({ error: 'User not found' }, 404)
    }

    const updatedProfile = { ...existingProfile, ...updates, updatedAt: new Date().toISOString() }
    await kv.set(`user:${userId}`, updatedProfile)

    return c.json({ profile: updatedProfile })
  } catch (error) {
    console.log('Update profile error:', error)
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

// NFT Management Routes
app.post('/make-server-8d1b3022/nfts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    // Verify user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user) {
      return c.json({ error: 'Unauthorized - please connect your wallet' }, 401)
    }

    const nftData = await c.req.json()
    const nftId = `nft_${Date.now()}_${Math.random().toString(36).substring(2)}`

    const nft = {
      id: nftId,
      title: nftData.title,
      description: nftData.description,
      image: nftData.image,
      category: nftData.category,
      tags: nftData.tags || [],
      price: parseFloat(nftData.price),
      currency: 'ETH',
      royalty: nftData.royalty,
      license: nftData.license,
      supply: nftData.supply || 1,
      creatorId: user.id,
      ownerId: user.id,
      isListed: true,
      likes: 0,
      views: 0,
      contractAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      tokenId: Math.floor(Math.random() * 100000),
      createdAt: new Date().toISOString(),
      history: [
        {
          event: 'Minted',
          from: null,
          to: user.id,
          price: null,
          date: new Date().toISOString()
        },
        {
          event: 'Listed',
          price: parseFloat(nftData.price),
          date: new Date().toISOString()
        }
      ]
    }

    await kv.set(`nft:${nftId}`, nft)
    
    // Update user's NFT count
    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile) {
      userProfile.totalNFTs = (userProfile.totalNFTs || 0) + 1
      await kv.set(`user:${user.id}`, userProfile)
    }

    // Add to user's created NFTs list
    const userNFTs = await kv.get(`user_nfts:${user.id}`) || []
    userNFTs.push(nftId)
    await kv.set(`user_nfts:${user.id}`, userNFTs)

    return c.json({ nft, message: 'NFT minted successfully!' })
  } catch (error) {
    console.log('Mint NFT error:', error)
    return c.json({ error: 'Failed to mint NFT' }, 500)
  }
})

app.get('/make-server-8d1b3022/nfts', async (c) => {
  try {
    const category = c.req.query('category')
    const minPrice = c.req.query('minPrice')
    const maxPrice = c.req.query('maxPrice')
    const isListed = c.req.query('listed')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = parseInt(c.req.query('offset') || '0')

    // Get all NFT keys
    const nftKeys = await kv.getByPrefix('nft:')
    let nfts = nftKeys.map(item => item.value)

    // Apply filters
    if (category && category !== 'All') {
      nfts = nfts.filter(nft => nft.category === category)
    }
    
    if (minPrice) {
      nfts = nfts.filter(nft => nft.price >= parseFloat(minPrice))
    }
    
    if (maxPrice) {
      nfts = nfts.filter(nft => nft.price <= parseFloat(maxPrice))
    }
    
    if (isListed === 'true') {
      nfts = nfts.filter(nft => nft.isListed)
    }

    // Sort by creation date (newest first)
    nfts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Apply pagination
    const paginatedNFTs = nfts.slice(offset, offset + limit)
    
    // Enhance with user data
    const enhancedNFTs = await Promise.all(paginatedNFTs.map(async (nft) => {
      const creator = await kv.get(`user:${nft.creatorId}`)
      const owner = await kv.get(`user:${nft.ownerId}`)
      
      return {
        ...nft,
        creator: creator ? {
          name: creator.displayName || 'Unknown',
          avatar: creator.avatar || '',
          verified: creator.verified || false
        } : { name: 'Unknown', avatar: '', verified: false },
        owner: owner ? {
          name: owner.displayName || 'Unknown',
          avatar: owner.avatar || ''
        } : { name: 'Unknown', avatar: '' }
      }
    }))

    return c.json({ 
      nfts: enhancedNFTs, 
      total: nfts.length,
      hasMore: offset + limit < nfts.length 
    })
  } catch (error) {
    console.log('Get NFTs error:', error)
    return c.json({ error: 'Failed to fetch NFTs' }, 500)
  }
})

app.get('/make-server-8d1b3022/nfts/:id', async (c) => {
  try {
    const nftId = c.req.param('id')
    const nft = await kv.get(`nft:${nftId}`)

    if (!nft) {
      return c.json({ error: 'NFT not found' }, 404)
    }

    // Increment view count
    nft.views = (nft.views || 0) + 1
    await kv.set(`nft:${nftId}`, nft)

    // Get creator and owner data
    const creator = await kv.get(`user:${nft.creatorId}`)
    const owner = await kv.get(`user:${nft.ownerId}`)

    const enhancedNFT = {
      ...nft,
      creator: creator ? {
        name: creator.displayName || 'Unknown',
        avatar: creator.avatar || '',
        verified: creator.verified || false
      } : { name: 'Unknown', avatar: '', verified: false },
      owner: owner ? {
        name: owner.displayName || 'Unknown',
        avatar: owner.avatar || ''
      } : { name: 'Unknown', avatar: '' }
    }

    return c.json({ nft: enhancedNFT })
  } catch (error) {
    console.log('Get NFT error:', error)
    return c.json({ error: 'Failed to fetch NFT' }, 500)
  }
})

app.post('/make-server-8d1b3022/nfts/:id/purchase', async (c) => {
  try {
    const nftId = c.req.param('id')
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    // Verify user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user) {
      return c.json({ error: 'Unauthorized - please connect your wallet' }, 401)
    }

    const nft = await kv.get(`nft:${nftId}`)
    if (!nft) {
      return c.json({ error: 'NFT not found' }, 404)
    }

    if (!nft.isListed) {
      return c.json({ error: 'NFT is not for sale' }, 400)
    }

    if (nft.ownerId === user.id) {
      return c.json({ error: 'You cannot purchase your own NFT' }, 400)
    }

    // Update NFT ownership
    const previousOwnerId = nft.ownerId
    nft.ownerId = user.id
    nft.isListed = false
    
    // Add to transaction history
    nft.history.push({
      event: 'Sold',
      from: previousOwnerId,
      to: user.id,
      price: nft.price,
      date: new Date().toISOString()
    })

    await kv.set(`nft:${nftId}`, nft)

    // Update seller's stats
    const seller = await kv.get(`user:${previousOwnerId}`)
    if (seller) {
      seller.totalSales = (seller.totalSales || 0) + 1
      seller.totalVolume = (seller.totalVolume || 0) + nft.price
      await kv.set(`user:${previousOwnerId}`, seller)
    }

    // Update buyer's NFT list
    const buyerNFTs = await kv.get(`user_nfts:${user.id}`) || []
    buyerNFTs.push(nftId)
    await kv.set(`user_nfts:${user.id}`, buyerNFTs)

    // Remove from seller's NFT list
    const sellerNFTs = await kv.get(`user_nfts:${previousOwnerId}`) || []
    const updatedSellerNFTs = sellerNFTs.filter(id => id !== nftId)
    await kv.set(`user_nfts:${previousOwnerId}`, updatedSellerNFTs)

    return c.json({ 
      message: `Successfully purchased "${nft.title}" for ${nft.price} ETH!`,
      transaction: {
        nftId,
        buyer: user.id,
        seller: previousOwnerId,
        price: nft.price,
        date: new Date().toISOString()
      }
    })
  } catch (error) {
    console.log('Purchase NFT error:', error)
    return c.json({ error: 'Failed to purchase NFT' }, 500)
  }
})

app.post('/make-server-8d1b3022/nfts/:id/like', async (c) => {
  try {
    const nftId = c.req.param('id')
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const nft = await kv.get(`nft:${nftId}`)
    if (!nft) {
      return c.json({ error: 'NFT not found' }, 404)
    }

    const userLikes = await kv.get(`user_likes:${user.id}`) || []
    const isLiked = userLikes.includes(nftId)

    if (isLiked) {
      // Unlike
      nft.likes = Math.max(0, (nft.likes || 0) - 1)
      const updatedLikes = userLikes.filter(id => id !== nftId)
      await kv.set(`user_likes:${user.id}`, updatedLikes)
    } else {
      // Like
      nft.likes = (nft.likes || 0) + 1
      userLikes.push(nftId)
      await kv.set(`user_likes:${user.id}`, userLikes)
    }

    await kv.set(`nft:${nftId}`, nft)

    return c.json({ 
      liked: !isLiked,
      likes: nft.likes 
    })
  } catch (error) {
    console.log('Like NFT error:', error)
    return c.json({ error: 'Failed to toggle like' }, 500)
  }
})

app.get('/make-server-8d1b3022/users/:userId/nfts', async (c) => {
  try {
    const userId = c.req.param('userId')
    const type = c.req.query('type') || 'owned' // owned, created, liked

    let nftIds = []
    
    if (type === 'owned' || type === 'created') {
      nftIds = await kv.get(`user_nfts:${userId}`) || []
    } else if (type === 'liked') {
      nftIds = await kv.get(`user_likes:${userId}`) || []
    }

    const nfts = await Promise.all(nftIds.map(async (nftId) => {
      const nft = await kv.get(`nft:${nftId}`)
      if (!nft) return null

      // Filter by type
      if (type === 'created' && nft.creatorId !== userId) return null
      if (type === 'owned' && nft.ownerId !== userId) return null

      const creator = await kv.get(`user:${nft.creatorId}`)
      const owner = await kv.get(`user:${nft.ownerId}`)

      return {
        ...nft,
        creator: creator ? {
          name: creator.displayName || 'Unknown',
          avatar: creator.avatar || '',
          verified: creator.verified || false
        } : { name: 'Unknown', avatar: '', verified: false },
        owner: owner ? {
          name: owner.displayName || 'Unknown',
          avatar: owner.avatar || ''
        } : { name: 'Unknown', avatar: '' }
      }
    }))

    const validNFTs = nfts.filter(nft => nft !== null)
    
    return c.json({ nfts: validNFTs })
  } catch (error) {
    console.log('Get user NFTs error:', error)
    return c.json({ error: 'Failed to fetch user NFTs' }, 500)
  }
})

// Marketplace statistics
app.get('/make-server-8d1b3022/stats', async (c) => {
  try {
    const nftKeys = await kv.getByPrefix('nft:')
    const userKeys = await kv.getByPrefix('user:')
    
    const nfts = nftKeys.map(item => item.value)
    const users = userKeys.map(item => item.value)

    const totalSales = nfts.reduce((sum, nft) => {
      const soldEvents = nft.history?.filter(h => h.event === 'Sold') || []
      return sum + soldEvents.length
    }, 0)

    const totalVolume = nfts.reduce((sum, nft) => {
      const soldEvents = nft.history?.filter(h => h.event === 'Sold') || []
      return sum + soldEvents.reduce((eventSum, event) => eventSum + (event.price || 0), 0)
    }, 0)

    const stats = {
      totalNFTs: nfts.length,
      totalUsers: users.length,
      totalSales,
      totalVolume,
      averagePrice: totalSales > 0 ? totalVolume / totalSales : 0,
      listedNFTs: nfts.filter(nft => nft.isListed).length
    }

    return c.json({ stats })
  } catch (error) {
    console.log('Get stats error:', error)
    return c.json({ error: 'Failed to fetch marketplace stats' }, 500)
  }
})

// Health check
app.get('/make-server-8d1b3022/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() })
})

Deno.serve(app.fetch)