// Force reload
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, BookOpen, FileText, Feather, Palette, ChevronDown, PanelLeft } from 'lucide-react';
import { fetchNFTsByCategory } from '../services/opensea';
import { NFT } from '../types';

const categories = [
  { name: 'Comics', icon: BookOpen, count: 12, tags: ['🔥 Hot', 'New'] },
  { name: 'Stories', icon: FileText, count: 8, tags: ['💎 Top'] },
  { name: 'Poems', icon: Feather, count: 23, tags: [] },
  { name: 'Art', icon: Palette, count: 42, tags: ['🚀 Trending'] },
];

interface MarketplaceSidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const MarketplaceSidebar = ({ activeCategory, onSelectCategory }: MarketplaceSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadNfts = async () => {
      if (activeCategory) {
        setIsLoading(true);
        const categoryKey = activeCategory.toLowerCase() as 'art' | 'comics' | 'stories' | 'poems';
        try {
          const fetchedNfts = await fetchNFTsByCategory(categoryKey);
          setNfts(fetchedNfts);
        } catch (error) {
          console.error("Failed to fetch NFTs", error);
          setNfts([]); // Clear NFTs on error
        } finally {
          setIsLoading(false);
        }
      } else {
        setNfts([]);
      }
    };

    loadNfts(); // Initial fetch

    const intervalId = setInterval(loadNfts, 45000); // Refresh every 45 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount or when activeCategory changes
  }, [activeCategory]);


  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 288 : 80 }}
      transition={{ duration: 0.3 }}
      className="bg-black/50 backdrop-blur-lg h-screen flex flex-col text-white border-r border-cyan-500/20 filter-sidebar overflow-y-auto"
    >
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold text-cyan-400 tracking-widest">MARKET</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-cyan-500/10">
          <PanelLeft />
        </button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className={`w-full p-2 rounded-lg bg-gray-900/50 border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${isOpen ? 'pl-10' : 'pl-2'}`}
          />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {categories.map((category) => (
          <div key={category.name}>
            <button
              onClick={() => onSelectCategory(category.name === activeCategory ? '' : category.name)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-cyan-500/10 text-left"
            >
              <div className="flex items-center space-x-3">
                <category.icon className="text-cyan-400" size={20} />
                {isOpen && <span className="font-semibold">{category.name}</span>}
              </div>
              {isOpen && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{category.count}</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${activeCategory === category.name ? 'rotate-180' : ''}`}
                  />
                </div>
              )}
            </button>
            <AnimatePresence>
              {isOpen && activeCategory === category.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-5 pt-2 space-y-2 overflow-hidden"
                >
                  {isLoading ? (
                    <p className="text-center text-gray-400">Loading...</p>
                  ) : (
                    nfts.slice(0, 5).map(nft => (
                      <div key={nft.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700/50">
                        <img src={nft.image} alt={nft.title} className="w-8 h-8 bg-gray-600 rounded object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold truncate">{nft.title}</p>
                          <p className="text-xs text-gray-400">{nft.price} ETH</p>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-cyan-500/20">
        {/* Wallet info can go here */}
      </div>
    </motion.aside>
  );
};

export default MarketplaceSidebar;