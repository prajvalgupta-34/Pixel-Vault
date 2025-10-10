import React, { useState, useEffect } from 'react';
import { NFTCard } from './NFTCard';
import { NFT } from '../types';
import { fetchFamousNFTs } from '../services/famousNFTs';

interface LiveNFTFeedProps {
  filters?: {
    categories?: string[];
  };
  onQuickBuy?: (nft: NFT) => void;
}

const LiveNFTFeed: React.FC<LiveNFTFeedProps> = ({ filters, onQuickBuy }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const loadNfts = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeCategories = filters?.categories?.map(c => c.toLowerCase()) || ['all'];
      let allNfts: NFT[] = [];

      const famousCategories = ['art', 'comics', 'poems', 'stories'];

      const categoriesToFetch = activeCategories.includes('all') || activeCategories.length === 0
        ? famousCategories
        : activeCategories.filter(c => famousCategories.includes(c));

      const nftPromises = categoriesToFetch.map(category => {
        return fetchFamousNFTs(category as 'art' | 'comics' | 'poems' | 'stories');
      });

      const nftResults = await Promise.all(nftPromises);
      allNfts = nftResults.flat();

      const nftsWithFallbacks = allNfts.map(nft => ({
        ...nft,
        creator: {
          ...nft.creator,
          avatar: nft.creator?.avatar || 'https://i.imgur.com/5d8bSzg.png',
        },
        owner: {
          ...nft.owner,
          avatar: nft.owner?.avatar || 'https://i.imgur.com/5d8bSzg.png',
        }
      }));
      setNfts(nftsWithFallbacks);

    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNfts();
    const intervalId = setInterval(loadNfts, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [filters]);

  if (loading) {
    return <div>Loading NFTs...</div>;
  }

  if (error) {
    return <div>Error fetching NFTs: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {nfts.map((asset) => (
        <NFTCard key={`${asset.id}-${asset.title}`} nft={asset} onQuickBuy={onQuickBuy} onNFTListed={loadNfts} />
      ))}
    </div>
  );
};

export default LiveNFTFeed;