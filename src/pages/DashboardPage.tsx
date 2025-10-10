import { useState, useRef, useEffect } from 'react';
import { User, Wallet, TrendingUp, Eye, Heart, Edit, Settings, Copy, ExternalLink, Palette, Info, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Switch } from '../components/ui/switch';
import { NFTCard } from '../components/NFTCard';
import { NFT } from '../types';
import MarketplaceSidebar from '../components/MarketplaceSidebar';
import { TrendingTags } from '../components/TrendingTags';
import { fetchNFTsByCategory } from '../services/opensea';
import { connectWallet } from '../utils/blockchain';
import { buyNft } from '../services/buy';
import { toast } from 'sonner';
import { recordTransaction } from '../services/supabase';


interface DashboardPageProps {
  onQuickBuy: (nft: NFT) => void;
}

export function DashboardPage({ onQuickBuy: _onQuickBuy }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('Art');
  const walletAddress = "0x742d35Cc6560C2537c26aA40c0E9F4d8E9D123AA";
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profile, setProfile] = useState({
    displayName: 'John Doe',
    bio: 'Digital artist and NFT creator passionate about pushing the boundaries of digital art.',
    website: 'https://johndoe.art',
    twitter: '@johndoe_art',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  const handleBuyNft = async (nft: NFT) => {
    toast.info("Connecting to wallet...", {
      description: "Please approve the connection in MetaMask.",
    });
    const signer = await connectWallet();
    if (signer) {
      toast.info("Processing transaction...", {
        description: "Please confirm the transaction in MetaMask.",
      });
      const tx = await buyNft(nft, signer);
      if (tx) {
        toast.success("Purchase Successful!", {
          description: `You have successfully purchased ${nft.title}.`,
        });
        // Record the transaction in Supabase
        const buyerAddress = await signer.getAddress();
        await recordTransaction(nft, buyerAddress, nft.owner.name, tx.hash);
      } else {
        toast.error("Purchase Failed", {
          description: "The transaction was cancelled or failed.",
        });
      }
    } else {
       toast.error("Wallet Connection Failed", {
        description: "Please connect your wallet to proceed.",
      });
    }
  };

  useEffect(() => {
    const loadAllNfts = async () => {
      const categories = ['art', 'comics', 'poems', 'stories'];
      const allNftsPromises = categories.map(category => fetchNFTsByCategory(category));
      const results = await Promise.all(allNftsPromises);
      const allNfts = results.flat();
      setNfts(allNfts);
    };
    loadAllNfts();
  }, []);

  const refreshNFTs = async () => {
    const categories = ['art', 'comics', 'poems', 'stories'];
    const allNftsPromises = categories.map(category => fetchNFTsByCategory(category));
    const results = await Promise.all(allNftsPromises);
    const allNfts = results.flat();
    setNfts(allNfts);
  };

  // Mock data for user's NFTs
  const ownedNFTs = nfts.filter(nft => nft.owner?.name === walletAddress);
  const createdNFTs = nfts.filter(nft => nft.creator?.name === 'Bored Ape Yacht Club').slice(0, 4);
  const listedNFTs = ownedNFTs.filter(nft => nft.isListed);

  const filteredNFTs = ownedNFTs.filter(nft => selectedCategory === '' || nft.category.toLowerCase() === selectedCategory.toLowerCase());

  const stats = {
    totalOwned: ownedNFTs.length,
    totalCreated: createdNFTs.length,
    totalSales: 12,
    totalVolume: 45.6,
    totalViews: createdNFTs.reduce((sum, nft) => sum + nft.views, 0),
    totalLikes: createdNFTs.reduce((sum, nft) => sum + nft.likes, 0)
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock wallet address

  return (
    <div className="min-h-screen bg-background flex">
      <MarketplaceSidebar onSelectCategory={setSelectedCategory} activeCategory={selectedCategory} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                      <AvatarImage src={profile.avatar || 'https://i.imgur.com/5d8bSzg.png'} />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8"
                      onClick={handleAvatarClick}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={profile.displayName}
                            onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Input
                            id="bio"
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={() => setIsEditing(false)}>Save</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Verified</span>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Wallet className="h-4 w-4" />
                            <span>{formatWalletAddress(walletAddress)}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(walletAddress)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <a href={`https://etherscan.io/address/${walletAddress}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View on Etherscan
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Settings</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Theme</h4>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                              <Label htmlFor="light-mode">Light</Label>
                              <Switch id="light-mode" />
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                              <Label htmlFor="dark-mode">Dark</Label>
                              <Switch id="dark-mode" />
                            </div>
                          </div>
                          <Button variant="ghost" className="w-full justify-start">About Us</Button>
                          <Button variant="ghost" className="w-full justify-start">Privacy Policy</Button>
                          <Button variant="ghost" className="w-full justify-start">Contact</Button>
                          <Button variant="ghost" className="w-full justify-start">Feedback</Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalOwned}</div>
                  <div className="text-sm text-muted-foreground">Owned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalCreated}</div>
                  <div className="text-sm text-muted-foreground">Created</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalSales}</div>
                  <div className="text-sm text-muted-foreground">Sales</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.totalVolume}</div>
                  <div className="text-sm text-muted-foreground">Volume (ETH)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600 flex items-center justify-center space-x-1">
                    <Eye className="h-5 w-5" />
                    <span>{stats.totalViews}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 flex items-center justify-center space-x-1">
                    <Heart className="h-5 w-5" />
                    <span>{stats.totalLikes}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </CardContent>
              </Card>
            </div>

            {/* NFT Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="owned">Owned ({stats.totalOwned})</TabsTrigger>
                <TabsTrigger value="created">Created ({stats.totalCreated})</TabsTrigger>
                <TabsTrigger value="listed">Listed ({listedNFTs.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-8">
                <div className="space-y-8">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Recent Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { type: 'Sale', nft: 'Neon Dreams #001', amount: '2.5 ETH', time: '2 hours ago' },
                          { type: 'Listed', nft: 'Pixel Warrior', amount: '1.8 ETH', time: '1 day ago' },
                          { type: 'Minted', nft: 'Geometric Harmony', amount: null, time: '3 days ago' },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <Badge variant={
                                activity.type === 'Sale' ? 'default' :
                                activity.type === 'Listed' ? 'secondary' : 'outline'
                              }>
                                {activity.type}
                              </Badge>
                              <span className="font-medium">{activity.nft}</span>
                            </div>
                            <div className="text-right">
                              {activity.amount && (
                                <p className="font-medium">{activity.amount}</p>
                              )}
                              <p className="text-sm text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Portfolio Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold">78.4 ETH</div>
                          <div className="text-sm text-green-600">+12.5% this month</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Total Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold">45.6 ETH</div>
                          <div className="text-sm text-blue-600">From 12 sales</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="owned" className="mt-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your NFT Collection</h3>
                    <TrendingTags />
                  </div>
                  
                  {ownedNFTs.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">You don't own any NFTs yet.</p>
                        <Button className="mt-4">Explore Marketplace</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredNFTs.map((nft) => (
                        <NFTCard
                          key={nft.id}
                          nft={nft}
                          onQuickBuy={handleBuyNft}
                          onNFTListed={refreshNFTs}
                          currentUserAddress={walletAddress}
                          showQuickBuy={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="created" className="mt-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Creations</h3>
                    <Button>Create New NFT</Button>
                  </div>
                  
                  {createdNFTs.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">You haven't created any NFTs yet.</p>
                        <Button className="mt-4">Start Creating</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {createdNFTs.map((nft) => (
                        <NFTCard
                          key={nft.id}
                          nft={nft}
                          onQuickBuy={handleBuyNft}
                          onNFTListed={refreshNFTs}
                          currentUserAddress={walletAddress}
                          showQuickBuy={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="listed" className="mt-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Listed for Sale</h3>
                    <Button variant="outline">Manage Listings</Button>
                  </div>
                  
                  {listedNFTs.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">You have no NFTs listed for sale.</p>
                        <Button className="mt-4">List an NFT</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {listedNFTs.map((nft) => (
                        <NFTCard
                          key={nft.id}
                          nft={nft}
                          onQuickBuy={handleBuyNft}
                          onNFTListed={refreshNFTs}
                          currentUserAddress={walletAddress}
                          showQuickBuy={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}