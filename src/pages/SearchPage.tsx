import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NFT } from '../types';
import { searchNFTs } from '../services/opensea';
import { NFTCard } from '../components/NFTCard';

export function SearchPage() {
  const [searchResults, setSearchResults] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      if (query) {
        const nfts = await searchNFTs(query);
        setSearchResults(nfts);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-20">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold text-center mb-12 text-white neon-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Search Results for "{query}"
        </motion.h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <motion.div
              className="inline-block h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : searchResults.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {searchResults.map((nft) => (
              <NFTCard key={nft.id} nft={nft} onQuickBuy={() => {}} onNFTListed={() => {}} />
            ))}
          </motion.div>
        ) : (
          <motion.p
            className="text-center text-gray-400 text-xl mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            No NFTs found for "{query}". Try a different search term.
          </motion.p>
        )}
      </div>
    </div>
  );
}