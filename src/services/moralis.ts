import { NFT } from '../types';

export const fetchLiveNfts = async (): Promise<NFT[]> => {
  // This function is no longer responsible for fetching NFTs directly.
  // The LiveNFTFeed component now handles this.
  // Returning an empty array to avoid duplicate API calls.
  return [];
};