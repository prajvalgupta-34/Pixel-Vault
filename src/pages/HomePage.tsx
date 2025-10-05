import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Filter, Grid3X3, List, Zap, Rocket, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FilterSidebar } from '../components/FilterSidebar';
import LiveNFTFeed from '../components/LiveNFTFeed';
import { ParticleBackground } from '../components/ParticleBackground';
import { HolographicArt } from '../components/HolographicArt';
import { NeonButton } from '../components/NeonButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import { connectWallet } from '../utils/blockchain';
import { ethers } from 'ethers';
import { NFT } from '../types';
import { fetchLiveNfts } from '../services/moralis';

interface HomePageProps {
  onQuickBuy: (nft: NFT) => void;
}

export function HomePage({ onQuickBuy }: HomePageProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [filters, setFilters] = useState({
    contractAddress: ''
  });
  const navigate = useNavigate();

  const featuredNFT = nfts.length > 0 ? nfts[0] : {};
  const trendingCollections = nfts.slice(0, 3);

  // Mock market stats
  const marketStats = {
    totalSales: '240k',
    totalNFTs: '100k', 
    totalUsers: '50k'
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  useEffect(() => {
    const fetchFeaturedNft = async () => {
      const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API_KEY || '';
      if (!MORALIS_API_KEY) {
        console.error('Moralis API key is not set.');
        setLoading(false);
        return;
      }

      const options = {
        method: 'GET',
        headers: { 'X-API-KEY': MORALIS_API_KEY },
      };
      
      const contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'; // BAYC contract
      const url = `https://deep-index.moralis.io/api/v2/nft/${contractAddress}?chain=eth&format=decimal&limit=1`;

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Failed to fetch featured NFT');
        
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          const asset = data.result[0];
          let metadata = { name: '', description: '', image: '' };
          if (asset.metadata) {
            try {
              metadata = JSON.parse(asset.metadata);
            } catch (e) {
              console.error('Failed to parse metadata for featured NFT:', e);
            }
          }
          const resolveIpfsUrl = (url: string | undefined) => {
            if (url && url.startsWith('ipfs://')) {
              return `https://ipfs.io/ipfs/${url.substring(7)}`;
            }
            return url || '';
          };
          const featured: NFT = {
            id: asset.token_id,
            title: metadata.name || asset.name || 'No title',
            image: resolveIpfsUrl(metadata.image),
            price: 0,
            currency: 'ETH',
            isListed: false,
            category: asset.symbol || 'uncategorized',
            likes: 0,
            views: 0,
            creator: { name: 'Unknown', avatar: '', verified: false },
            owner: { name: asset.owner_of, avatar: '' },
            description: metadata.description || '',
          };
          setNfts([featured]);
        }
      } catch (error) {
        console.error('Error fetching featured NFT:', error);
      } finally {
        setLoading(false);
      }
    };

    document.documentElement.classList.add('dark');
    fetchFeaturedNft();
  }, []);


  const handleConnectWallet = async () => {
    const walletSigner = await connectWallet();
    if (walletSigner) {
      setSigner(walletSigner);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="inline-block h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <>
          {/* Particle Background */}
          <ParticleBackground />
          
          {/* Cyber Grid Background */}
          <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none z-0" />

          {/* Hero Section */}
          <section className="relative z-10 min-h-screen flex items-center overflow-hidden">
            <div className="container mx-auto px-4 py-16">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                >
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <Badge variant="secondary" className="w-fit bg-purple-500/20 text-purple-300 border-purple-500/50 neon-glow">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Welcome to the Metaverse
                    </Badge>
                    
                    <motion.h1
                      className="text-5xl lg:text-7xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.4 }}
                    >
                      <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent neon-text">
                        Future of
                      </span>
                      <br />
                      <span className="text-white neon-text">
                        Digital Art
                      </span>
                    </motion.h1>
                    
                    <motion.p
                      className="text-xl text-gray-300 max-w-md leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.6 }}
                    >
                      Discover, collect, and trade extraordinary NFTs in the most advanced marketplace in the metaverse.
                    </motion.p>
                  </motion.div>
                  
                  <motion.div
                    className="flex flex-wrap gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    {!signer ? (
                      <NeonButton size="lg" onClick={handleConnectWallet}>
                        <Zap className="h-5 w-5 mr-2" />
                        Connect Wallet
                      </NeonButton>
                    ) : (
                      <NeonButton
                        size="lg"
                        onClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        <Rocket className="h-5 w-5 mr-2" />
                        Explore NFTs
                      </NeonButton>
                    )}
                    <NeonButton
                      size="lg"
                      variant="secondary"
                      onClick={() => navigate('/mint')}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Create NFT
                    </NeonButton>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    className="grid grid-cols-3 gap-8 pt-8 border-t border-purple-500/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                  >
                    <div className="text-center">
                      <motion.div
                        className="text-3xl font-bold text-cyan-400 neon-text"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      >
                        {marketStats.totalSales}+
                      </motion.div>
                      <div className="text-sm text-gray-400">Total Sales</div>
                    </div>
                    <div className="text-center">
                      <motion.div
                        className="text-3xl font-bold text-purple-400 neon-text"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.4 }}
                      >
                        {marketStats.totalNFTs}+
                      </motion.div>
                      <div className="text-sm text-gray-400">Artworks</div>
                    </div>
                    <div className="text-center">
                      <motion.div
                        className="text-3xl font-bold text-pink-400 neon-text"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.6 }}
                      >
                        {marketStats.totalUsers}+
                      </motion.div>
                      <div className="text-sm text-gray-400">Artists</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Content - Holographic Art Display */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <HolographicArt nft={featuredNFT} onQuickBuy={onQuickBuy} />
                </motion.div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1 h-16 bg-gradient-to-b from-purple-500 to-transparent rounded-full" />
            </motion.div>
          </section>

          {/* Trending Collections */}
          <section className="relative z-10 container mx-auto px-4 py-20">
            <motion.div
              className="space-y-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-white neon-text">Trending Collections</h2>
                <p className="text-gray-400 text-lg">Discover the hottest collections in the metaverse</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingCollections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 hover:border-cyan-500/50 transition-all duration-300 neon-glow">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center neon-glow">
                          <span className="text-white font-bold">#{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{collection.title}</h3>
                          <p className="text-sm text-gray-400">by {collection.creator.name}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {nfts.slice(0, 3).map((nft, i) => (
                          <div key={i} className="aspect-square rounded-xl overflow-hidden border border-purple-500/30">
                            <ImageWithFallback
                              src={nft.image}
                              alt={nft.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Floor Price</p>
                          <p className="font-bold text-cyan-400">{collection.floorPrice} ETH</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Volume</p>
                          <p className="font-bold text-purple-400">{collection.totalVolume} ETH</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* NFT Marketplace */}
          <section id="marketplace" className="relative z-10 container mx-auto px-4 pb-20">
            <motion.div
              className="space-y-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-white neon-text mb-2">Explore NFTs</h2>
                  <p className="text-gray-400 text-lg">Browse through our vast collection of digital artworks</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterSidebarOpen(true)}
                    className="md:hidden border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 lg:w-fit bg-card/50 backdrop-blur-lg border border-purple-500/30">
                  <TabsTrigger value="trending" className="data-[state=active]:bg-purple-500/30">Trending</TabsTrigger>
                  <TabsTrigger value="recent" className="data-[state=active]:bg-purple-500/30">Recent</TabsTrigger>
                  <TabsTrigger value="art" className="data-[state=active]:bg-purple-500/30">Art</TabsTrigger>
                  <TabsTrigger value="gaming" className="data-[state=active]:bg-purple-500/30">Gaming</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-8">
                  <div className="flex gap-8">
                    {/* Desktop Filter Sidebar */}
                    <div className="hidden md:block w-64 flex-shrink-0">
                      <FilterSidebar
                        isOpen={true}
                        onClose={() => {}}
                        onFiltersChange={handleFiltersChange}
                      />
                    </div>

                    {/* Mobile Filter Sidebar */}
                    <FilterSidebar
                      isOpen={isFilterSidebarOpen}
                      onClose={() => setIsFilterSidebarOpen(false)}
                      onFiltersChange={handleFiltersChange}
                    />

                    {/* NFT Grid */}
                    <div className="flex-1">
                      <LiveNFTFeed contractAddress={filters.contractAddress || '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </section>
        </>
      )}
    </div>
  );
}