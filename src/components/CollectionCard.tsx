import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NFTCollection } from '../types';

interface CollectionCardProps {
  collection: NFTCollection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
          {/* Collection Image */}
          <Link to={collection.marketplaceLink} target="_blank" rel="noopener noreferrer" className="block relative">
            <div className="aspect-square overflow-hidden bg-muted/20 rounded-t-lg relative">
              <ImageWithFallback
                src={collection.image}
                alt={collection.name}
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

          {/* External Link Button */}
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
              asChild
            >
              <a href={collection.marketplaceLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 text-purple-300" />
              </a>
            </Button>
          </motion.div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-black/80 backdrop-blur-sm border border-cyan-500/50 text-cyan-300">
              {collection.category ?? 'uncategorized'}
            </Badge>
          </div>

          {/* Energy Border */}
          <motion.div
            className="absolute inset-0 rounded-t-lg border-2 border-transparent"
            animate={{
              borderColor: isHovered
                ? ['rgba(139, 92, 246, 0.5)', 'rgba(6, 182, 212, 0.5)', 'rgba(236, 72, 153, 0.5)', 'rgba(139, 92, 246, 0.5)']
                : 'rgba(0, 0, 0, 0)'
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <CardContent className="p-4 bg-card/30 backdrop-blur-sm">
          {/* Title and Creator */}
          <div className="space-y-3">
            <div>
              <Link to={collection.marketplaceLink} target="_blank" rel="noopener noreferrer" className="block">
                <h3 className="font-semibold text-white hover:text-cyan-400 transition-colors line-clamp-1">
                  {collection.name}
                </h3>
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                <Avatar className="h-5 w-5 border border-purple-500/50">
                  <AvatarFallback className="text-xs bg-purple-500/20 text-purple-300">
                    {collection.creatorAddress?.[2] || '0x'} {/* Display first two chars of address */}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-400">
                  by {collection.creatorAddress ? `${collection.creatorAddress.substring(0, 6)}...${collection.creatorAddress.substring(collection.creatorAddress.length - 4)}` : 'Unknown'}
                </span>
              </div>
            </div>

            {/* Floor Price and Chain */}
            <div className="flex items-center justify-between">
              <div>
                {collection.floorPrice > 0 ? (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Floor Price</p>
                    <p className="font-semibold text-cyan-400 neon-text">
                      {collection.floorPrice} USD
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Floor Price</p>
                    <p className="font-semibold text-gray-400">
                      N/A
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Zap className="h-3 w-3" />
                <span>{collection.chain}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};