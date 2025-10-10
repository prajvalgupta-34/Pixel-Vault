import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share, Flag, ExternalLink, Clock, Eye, User, Award, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { NFTCard } from '../components/NFTCard';
import { NFT } from '../types';
import { TransactionHistory } from '../components/TransactionHistory';
import { Bidding } from '../components/Bidding';
import { fetchNFTsByCategory } from '../services/opensea';
import { useEffect } from 'react';
import { buyNft } from '../services/buy';
import { connectWallet } from '../utils/blockchain';
import { ethers } from 'ethers';

interface NFTDetailPageProps {
  onQuickBuy: (nft: NFT) => void;
}

export function NFTDetailPage({ onQuickBuy }: NFTDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const handleBuyNow = async () => {
    if (nft && signer) {
      const transaction = await buyNft(nft, signer);
      if (transaction) {
        // Handle successful transaction
      }
    }
  };

  useEffect(() => {
    const loadNfts = async () => {
      setLoading(true);
      // Fetch a general list of NFTs, using 'art' as a default category for now
      const fetchedNfts = await fetchNFTsByCategory('art');
      setNfts(fetchedNfts);
      setLoading(false);
    };

    loadNfts();
  }, []);

  useEffect(() => {
    const connect = async () => {
      const walletSigner = await connectWallet();
      if (walletSigner) {
        setSigner(walletSigner);
      }
    };
    connect();
  }, []);

  const nft = nfts.find(n => n.id === id);
  const relatedNFTs = nfts.filter(n => n.id !== id && n.category === nft?.category).slice(0, 4);

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">NFT Not Found</h1>
        <p className="text-muted-foreground mb-8">The NFT you're looking for doesn't exist.</p>
        <Link to="/">
          <Button>Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* NFT Image */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <ImageWithFallback
                  src={nft.image}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* NFT Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Properties</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {nft.tags?.map((tag: string, index: number) => (
                    <div key={index} className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        {tag}
                      </div>
                      <div className="font-semibold capitalize">{tag}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 50) + 1}% rare
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* NFT Details */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{nft.category}</Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{nft.views} views</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{nft.likes} likes</span>
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold">{nft.title}</h1>

              {/* Creator & Owner */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={nft.creator.avatar || 'https://i.imgur.com/5d8bSzg.png'} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-muted-foreground">Creator</p>
                      <div className="flex items-center space-x-1">
                        <p className="font-medium">{nft.creator.name}</p>
                        {nft.creator.verified && (
                          <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={nft.owner.avatar || 'https://i.imgur.com/5d8bSzg.png'} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-muted-foreground">Owner</p>
                      <p className="font-medium">{nft.owner.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Purchase */}
            {nft.auction_end ? (
              <Bidding nft={nft} />
            ) : nft.isListed ? (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold">{nft.price} {nft.currency}</span>
                        <span className="text-muted-foreground">($4,250.30)</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                      <Button size="lg" variant="outline">
                        Make Offer
                      </Button>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Sale ends in 2 days</span>
                      </div>
                      <span>{nft.royalty}% royalty</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {showFullDescription ? nft.description : `${nft.description.slice(0, 200)}...`}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Contract Address</p>
                    <p className="font-mono text-sm">0x742d35...c0532925</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Token ID</p>
                    <p className="font-mono text-sm">{nft.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Token Standard</p>
                    <p className="text-sm">ERC-721</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blockchain</p>
                    <p className="text-sm">Ethereum</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-8">
              <TransactionHistory nftId={nft.id} />
            </TabsContent>

            <TabsContent value="offers" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">No offers yet</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related NFTs */}
        {relatedNFTs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">More from this collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedNFTs.map((relatedNft) => (
                <NFTCard
                  key={relatedNft.id}
                  nft={relatedNft}
                  onQuickBuy={onQuickBuy}
                  onNFTListed={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}