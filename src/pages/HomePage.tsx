import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Rocket } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { NeonButton } from '../components/NeonButton';
import { useNavigate } from 'react-router-dom';
import { connectWallet } from '../utils/blockchain';
import { ethers } from 'ethers';
import { NFT } from '../types';
import NFTDiscoveryDashboard from '../components/NFTDiscoveryDashboard';
import { ParticleBackground } from '../components/ParticleBackground';
import { HolographicArt } from '../components/HolographicArt';
import { NFTCard } from '../components/NFTCard';
import { fetchNFTsByCategory, fetchNFTById } from '../services/opensea';

interface HomePageProps {
  onQuickBuy: (nft: NFT) => void;
}

export function HomePage({ onQuickBuy }: HomePageProps) {
  const [loading, setLoading] = useState(true);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [featuredNFT, setFeaturedNFT] = useState<NFT | null>(null);
  const [artNfts, setArtNfts] = useState<NFT[]>([]);
  const [comicNfts, setComicNfts] = useState<NFT[]>([]);
  const [poemNfts, setPoemNfts] = useState<NFT[]>([]);
  const [storyNfts, setStoryNfts] = useState<NFT[]>([]);

  const navigate = useNavigate();

  // Mock market stats
  const marketStats = {
    totalSales: '240k',
    totalNFTs: '100k',
    totalUsers: '50k'
  };

  useEffect(() => {
    // Force dark mode for the futuristic theme
    document.documentElement.classList.add('dark');
    
    const fetchFeaturedNft = async () => {
      const contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'; // BAYC
      const tokenId = '8522'; // A specific cool-looking Ape
      const chain = 'ethereum';

      try {
        const asset = await fetchNFTById(chain, contractAddress, tokenId);
        if (!asset) throw new Error('Featured NFT not found');

        setFeaturedNFT(asset);
      } catch (error) {
        console.error('Error fetching featured NFT:', error);
      }
    };
    
    const loadPageData = async () => {
      setLoading(true);
      await fetchFeaturedNft();
      
      const fetchedArtNfts = await fetchNFTsByCategory('art');
      setArtNfts(fetchedArtNfts);

      const fetchedComicNfts = await fetchNFTsByCategory('comics');
      setComicNfts(fetchedComicNfts);

      const fetchedPoemNfts = await fetchNFTsByCategory('poems');
      setPoemNfts(fetchedPoemNfts);

      const fetchedStoryNfts = await fetchNFTsByCategory('stories');
      setStoryNfts(fetchedStoryNfts);

      setLoading(false);
    };

    loadPageData();
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
                        onClick={() => document.getElementById('nft-discovery')?.scrollIntoView({ behavior: 'smooth' })}
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
                  <HolographicArt nft={featuredNFT || {} as NFT} onQuickBuy={onQuickBuy} />
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

          {/* NFT Discovery Dashboard */}
          <section id="nft-discovery" className="relative z-10 py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12 text-white neon-text">Discover Unique NFTs</h2>

              {/* Art NFTs */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold mb-6 text-purple-400 neon-text">Art</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {artNfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} onQuickBuy={() => navigate(`/nft/${nft.id}`)} onNFTListed={() => {}} />
                  ))}
                </div>
              </div>

              {/* Comic NFTs */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold mb-6 text-cyan-400 neon-text">Comics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {comicNfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} onQuickBuy={() => navigate(`/nft/${nft.id}`)} onNFTListed={() => {}} />
                  ))}
                </div>
              </div>

              {/* Poem NFTs */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold mb-6 text-pink-400 neon-text">Poems</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {poemNfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} onQuickBuy={() => navigate(`/nft/${nft.id}`)} onNFTListed={() => {}} />
                  ))}
                </div>
              </div>

              {/* Stories NFTs */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold mb-6 text-green-400 neon-text">Stories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {storyNfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} onQuickBuy={() => navigate(`/nft/${nft.id}`)} onNFTListed={() => {}} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}