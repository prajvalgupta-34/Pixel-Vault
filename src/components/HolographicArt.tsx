import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HolographicArtProps {
  nft: any;
  onQuickBuy: (nft: any) => void;
}

export function HolographicArt({ nft, onQuickBuy }: HolographicArtProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  return (
    <div className="relative flex items-center justify-center min-h-[600px]">
      {/* Holographic Base */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        onMouseMove={handleMouseMove}
      >
        {/* Holographic Platform */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-4 bg-gradient-to-r from-purple-500/20 via-cyan-500/30 to-pink-500/20 rounded-full blur-sm" />
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-80 h-2 bg-gradient-to-r from-purple-500/40 via-cyan-500/50 to-pink-500/40 rounded-full" />

        {/* 3D Holographic Frame */}
        <motion.div
          className="relative group"
          animate={{
            rotateY: mousePosition.x * 20 - 10,
            rotateX: -(mousePosition.y * 20 - 10),
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          style={{ perspective: 1000 }}
        >
          {/* Outer Glow Ring */}
          <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-pink-500/30 blur-xl animate-pulse" />
          
          {/* Holographic Border */}
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-500/50 via-cyan-500/50 to-pink-500/50 blur-sm" />
          
          {/* Main Container */}
          <motion.div
            className="relative w-80 h-80 bg-black/80 backdrop-blur-lg rounded-2xl border border-cyan-500/50 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Holographic Scan Lines */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse" />
            
            {/* NFT Image */}
            <div className="relative w-full h-full p-4">
              <ImageWithFallback
                src={nft.image}
                alt={nft.title}
                className="w-full h-full object-cover rounded-xl"
              />
              
              {/* Holographic Overlay */}
              <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-purple-500/20 via-transparent to-cyan-500/20 pointer-events-none" />
            </div>

            {/* Floating Info Panel */}
            <motion.div
              className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-lg rounded-xl p-4 border border-cyan-500/30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-lg font-bold text-white mb-1">{nft.title}</h3>
              <p className="text-sm text-cyan-400 mb-2">by {nft.creator?.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">{nft.price} ETH</span>
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-white text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onQuickBuy(nft)}
                >
                  Buy Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Rotating Energy Rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-purple-500/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full border border-pink-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-500 rounded-full"
            style={{
              top: `${20 + Math.sin(i) * 60}%`,
              left: `${20 + Math.cos(i) * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}