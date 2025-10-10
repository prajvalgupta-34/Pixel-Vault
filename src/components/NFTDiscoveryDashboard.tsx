import React, { useState, useEffect } from 'react';
import {
  getTopNFTCollectionsByMarketCap,
  getHottestNFTCollectionsByTradingVolume,
  getNFTCollectionsByCreator,
} from '../services/moralis';
import { NFTCollection } from '../types';
import { CollectionCard } from './CollectionCard';

interface CategorySectionProps {
  title: string;
  category: string;
  fetchCollections: (category: string) => Promise<NFTCollection[]>;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, category, fetchCollections }) => {
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true);
        const data = await fetchCollections(category);
        setCollections(data);
      } catch (err) {
        setError(`Failed to fetch ${title} NFTs.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, [category, fetchCollections, title]);

  if (loading) return <div>Loading {title} NFTs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.address}
            collection={collection}
          />
        ))}
      </div>
    </div>
  );
};

const NFTDiscoveryDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<NFTCollection[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      // Simple creator name to wallet address lookup (placeholder)
      const creatorWalletAddress = getCreatorWalletAddress(searchTerm);
      if (creatorWalletAddress) {
        const results = await getNFTCollectionsByCreator(creatorWalletAddress);
        setSearchResults(results);
      } else {
        // If not a known creator name, assume it's a direct wallet address
        const results = await getNFTCollectionsByCreator(searchTerm);
        setSearchResults(results);
      }
    } catch (err) {
      setSearchError('Failed to fetch creator NFTs. Please check the address or name.');
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Placeholder for creator name to wallet address lookup
  const getCreatorWalletAddress = (nameOrAddress: string): string | null => {
    const creatorMap: { [key: string]: string } = {
      'vitalik': '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Example: Vitalik Buterin's address
      // Add more mappings as needed
    };
    // Check if it's a known name, otherwise assume it's an address
    return creatorMap[nameOrAddress.toLowerCase()] || nameOrAddress;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">NFT Discovery Dashboard</h1>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by creator name or wallet address"
          className="p-3 rounded-l-lg border-t border-b border-l border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-blue-500 w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          className="p-3 rounded-r-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none"
          onClick={handleSearch}
          disabled={searchLoading}
        >
          {searchLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searchError && <div className="text-red-500 text-center mb-4">{searchError}</div>}

      {searchResults ? (
        <div>
          <h2 className="text-3xl font-bold mb-4 text-white">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.length > 0 ? (
              searchResults.map((collection) => (
                <CollectionCard
                  key={collection.address}
                  collection={collection}
                />
              ))
            ) : (
              <p className="text-white">No NFTs found for this creator.</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <CategorySection title="Top Art NFTs" category="art" fetchCollections={getTopNFTCollectionsByMarketCap} />
          <CategorySection title="Top Comics NFTs" category="comics" fetchCollections={getTopNFTCollectionsByMarketCap} />
          <CategorySection title="Top Poems NFTs" category="poems" fetchCollections={getTopNFTCollectionsByMarketCap} />
          <CategorySection title="Top Stories NFTs" category="stories" fetchCollections={getTopNFTCollectionsByMarketCap} />
        </div>
      )}
    </div>
  );
};

export default NFTDiscoveryDashboard;