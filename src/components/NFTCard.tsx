import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Eye, MoreHorizontal, ShoppingCart, ExternalLink, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NeonButton } from './NeonButton';
import { NFT } from '../types.ts';

interface NFTCardProps {
  nft: NFT;
  onQuickBuy?: (nft: NFT) => void;
  showQuickBuy?: boolean;
}

export function NFTCard({ nft, onQuickBuy, showQuickBuy = true }: NFTCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleQuickBuy = (e: React.MouseEvent | null) => {
    e?.preventDefault();
    e?.stopPropagation();
    onQuickBuy?.(nft);
  };

  const handleQuickBuyWrapper = () => {
    handleQuickBuy(null);
  }

  return (
    <motion.div
      className="group"
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: 1000 }}
    >
      <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-lg border border-purple-500/30 hover:border-cyan-500/50 transition-all duration-300 neon-glow">
        <div className="relative">
          {/* NFT Image */}
          <Link to={`/nft/${nft.id}`} className="block relative">
            <div className="aspect-square overflow-hidden bg-muted/20 rounded-t-lg relative">
              <ImageWithFallback
                src={nft.image}
                alt={nft.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onLoad={() => setIsImageLoaded(true)}
              />
              
              {/* Holographic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Scan Lines Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-muted/20 animate-pulse" />
              )}
            </div>
          </Link>

          {/* Action Buttons Overlay */}
          <motion.div 
            className="absolute top-3 right-3 flex items-center space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-black/80 backdrop-blur-sm border border-purple-500/50 hover:bg-purple-500/20"
              onClick={handleLike}
            >
              <Heart
                className={`h-4 w-4 ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-purple-300'}`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-black/80 backdrop-blur-sm border border-purple-500/50 hover:bg-purple-500/20"
                >
                  <MoreHorizontal className="h-4 w-4 text-purple-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-lg border border-purple-500/50">
                <DropdownMenuItem className="text-gray-300 hover:bg-purple-500/20">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Etherscan
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-purple-500/20">Share</DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-purple-500/20">Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-black/80 backdrop-blur-sm border border-cyan-500/50 text-cyan-300">
              {nft.category ?? 'uncategorized'}
            </Badge>
          </div>

          {/* Quick Buy Button */}
          {showQuickBuy && nft.isListed && onQuickBuy && (
            <motion.div 
              className="absolute bottom-3 right-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                scale: isHovered ? 1 : 0.8 
              }}
              transition={{ duration: 0.2 }}
            >
              <NeonButton
                size="sm"
                onClick={handleQuickBuyWrapper}
              >
                <Zap className="h-4 w-4 mr-1" />
                Quick Buy
              </NeonButton>
            </motion.div>
          )}

          {/* Energy Border */}
          <motion.div
            className="absolute inset-0 rounded-t-lg border-2 border-transparent"
            animate={{
              borderColor: isHovered 
                ? ['rgba(139, 92, 246, 0.5)', 'rgba(6, 182, 212, 0.5)', 'rgba(236, 72, 153, 0.5)', 'rgba(139, 92, 246, 0.5)']
                : 'transparent'
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <CardContent className="p-4 bg-card/30 backdrop-blur-sm">
          {/* Title and Creator */}
          <div className="space-y-3">
            <div>
              <Link to={`/nft/${nft.id}`} className="block">
                <h3 className="font-semibold text-white hover:text-cyan-400 transition-colors line-clamp-1">
                  {nft.title}
                </h3>
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                <Avatar className="h-5 w-5 border border-purple-500/50">
                  {nft.creator && (
                    <>
                      <AvatarImage src={nft.creator.avatar} />
                      <AvatarFallback className="text-xs bg-purple-500/20 text-purple-300">
                        {nft.creator?.name?.[0]}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <span className="text-sm text-gray-400">
                  by {nft.creator?.name}
                </span>
                {nft.creator?.verified && (
                  <div className="h-4 w-4 bg-cyan-500 rounded-full flex items-center justify-center neon-glow">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price and Stats */}
            <div className="flex items-center justify-between">
              <div>
                {(nft.isListed && nft.price > 0) ? (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="font-semibold text-cyan-400 neon-text">
                      {nft.price} {nft.currency}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="font-semibold text-gray-400">
                      Not for sale
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <motion.div 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.1 }}
                >
                  <Heart className={`h-3 w-3 ${isLiked ? 'text-pink-500' : ''}`} />
                  <span>{nft.likes ?? 0}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.1 }}
                >
                  <Eye className="h-3 w-3" />
                  <span>{nft.views ?? 0}</span>
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}