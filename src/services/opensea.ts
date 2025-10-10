import { NFT } from '../types';

const OPENSEA_API_URL = '/functions/v1/opensea-proxy';

const mapOpenseaToNFT = (openseaNft: any): NFT => {
  return {
    id: openseaNft.identifier,
    title: openseaNft.name,
    image: openseaNft.image_url,
    description: openseaNft.description || 'No description available.',
    creator: {
      name: openseaNft.creator?.user?.username || 'Unknown',
      avatar: openseaNft.creator?.profile_img_url || '',
      verified: openseaNft.creator?.config === 'verified',
    },
    owner: {
      name: openseaNft.owners[0]?.user?.username || 'Unknown',
      avatar: openseaNft.owners[0]?.profile_img_url || '',
    },
    price: openseaNft.last_sale?.total_price ? parseFloat(openseaNft.last_sale.total_price) / 10**18 : 0,
    currency: 'ETH',
    likes: 0,
    views: 0,
    category: openseaNft.collection,
    isListed: !!openseaNft.last_sale,
  };
};

export const fetchNFTsByCategory = async (category: string, limit: number = 10): Promise<NFT[]> => {
  try {
    const response = await fetch(`${OPENSEA_API_URL}/collection/${category}/nfts?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch NFTs by category');
    const data = await response.json();
    return data.nfts.map(mapOpenseaToNFT);
  } catch (error) {
    console.error('Error fetching NFTs by category:', error);
    return [];
  }
};

export const searchNFTs = async (query: string, limit: number = 10): Promise<NFT[]> => {
  try {
    const response = await fetch(`${OPENSEA_API_URL}/assets?search[query]=${query}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to search for NFTs');
    const data = await response.json();
    return data.assets.map(mapOpenseaToNFT);
  } catch (error) {
    console.error('Error searching for NFTs:', error);
    return [];
  }
};

export const fetchNFTById = async (chain: string, contractAddress: string, tokenId: string): Promise<NFT | null> => {
  try {
    const response = await fetch(`${OPENSEA_API_URL}/chain/${chain}/contract/${contractAddress}/nfts/${tokenId}`);
    if (!response.ok) throw new Error('Failed to fetch NFT by ID');
    const data = await response.json();
    return mapOpenseaToNFT(data.nft);
  } catch (error) {
    console.error('Error fetching NFT by ID:', error);
    return null;
  }
};