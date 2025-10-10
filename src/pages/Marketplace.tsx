import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNFTsByCategory, searchNFTs } from '../services/opensea';
import { NFTCard } from '../components/NFTCard';
import { NFT } from '../types';

const Marketplace: React.FC = () => {
  const [categorizedNfts, setCategorizedNfts] = useState<{ category: string; nfts: NFT[] }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NFT[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const categories = ['comics', 'poems', 'stories'];

  useEffect(() => {
    const fetchCategorizedNFTs = async () => {
      setLoading(true);
      const allNfts = await Promise.all(
        categories.map(async (category) => {
          const nfts = await fetchNFTsByCategory(category, 10);
          return { category, nfts };
        })
      );
      setCategorizedNfts(allNfts);
      setLoading(false);
    };

    fetchCategorizedNFTs();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      const results = await searchNFTs(searchQuery, 10);
      setSearchResults(results);
      setSearchLoading(false);
    };

    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">NFT Marketplace</h1>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for NFTs or collections..."
          className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <motion.div
            className="inline-block h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : searchQuery.trim() !== '' ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((nft) => (
                <NFTCard key={nft.id} nft={nft} onQuickBuy={() => {}} onNFTListed={() => {}} />
              ))}
            </div>
          ) : (
            <p>No NFTs found for this search.</p>
          )}
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <motion.div
            className="inline-block h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : (
        <div>
          {categorizedNfts.map(({ category, nfts }) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nfts.length > 0 ? (
                  nfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} onQuickBuy={() => {}} onNFTListed={() => {}} />
                  ))
                ) : (
                  <p>No NFTs found in this category.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;