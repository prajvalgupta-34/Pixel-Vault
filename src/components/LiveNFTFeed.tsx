import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NFTCard } from './NFTCard';
import { NFT } from '../types';

interface LiveNFTFeedProps {
  contractAddress?: string;
}

const LiveNFTFeed: React.FC<LiveNFTFeedProps> = ({ contractAddress }) => {
  const [assets, setAssets] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNfts = async () => {
      setLoading(true);
      setError(null);

      const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API_KEY || '';
      if (!MORALIS_API_KEY) {
        setError('Moralis API key is not set.');
        setLoading(false);
        return;
      }

      const options = {
        method: 'GET',
        headers: {
          'X-API-KEY': MORALIS_API_KEY,
        },
      };

      // The /nft/search endpoint is deprecated. We now fetch NFTs by contract address.
      // This component requires a contractAddress to be provided.
      if (!contractAddress) {
        setError('A contract address must be provided to fetch NFTs.');
        setLoading(false);
        return;
      }
      const url = `https://deep-index.moralis.io/api/v2/nft/${contractAddress}?chain=eth&format=decimal&limit=12`;

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Moralis API Error:', errorBody);
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        
        const nftsWithPrices = await Promise.all(
          data.result.map(async (asset: any) => {
            let price = 0;
            let isListed = false;

            try {
              const priceResponse = await fetch(
                `https://deep-index.moralis.io/api/v2/nft/${asset.token_address}/${asset.token_id}/lowestprice`,
                options
              );
              if (priceResponse.ok) {
                const priceData = await priceResponse.json();
                if (priceData && priceData.amount) {
                  price = parseFloat(ethers.formatEther(priceData.amount));
                  isListed = true;
                }
              }
            } catch (e) {
              console.error(`Could not fetch price for NFT ${asset.token_id}:`, e);
            }

            let metadata = { name: '', description: '', image: '' };
            if (asset.metadata) {
              try {
                metadata = JSON.parse(asset.metadata);
              } catch (e) {
                console.error('Failed to parse metadata for NFT:', asset.token_id, e);
              }
            }

            const resolveIpfsUrl = (url: string | undefined) => {
              if (url && url.startsWith('ipfs://')) {
                return `https://ipfs.io/ipfs/${url.substring(7)}`;
              }
              return url || '';
            };

            return {
              id: asset.token_id,
              title: metadata.name || asset.name || 'No title',
              image: resolveIpfsUrl(metadata.image),
              price: price,
              currency: 'ETH',
              isListed: isListed,
              category: asset.symbol || 'uncategorized',
              likes: 0,
              views: 0,
              creator: { name: 'Unknown', avatar: '', verified: false },
              owner: { name: asset.owner_of, avatar: '' },
              description: metadata.description || '',
            };
          })
        );
        setAssets(nftsWithPrices);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNfts();
  }, [contractAddress]);

  if (loading) {
    return <div>Loading NFTs...</div>;
  }

  if (error) {
    return <div>Error fetching NFTs: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <NFTCard key={asset.id} nft={asset} />
      ))}
    </div>
  );
};

export default LiveNFTFeed;