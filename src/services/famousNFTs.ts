import { getContractNFTs } from './moralis';
import { NFT } from '../types';
import { EvmChain } from '@moralisweb3/common-evm-utils';

const CHAIN = EvmChain.ETHEREUM;

const CONTRACT_ADDRESSES = {
  art: [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', // Bored Ape Yacht Club
    '0xfbeef911dc5821886e1dda71586d90ed28174b7d', // KnownOrigin
  ],
  comics: [
    '0x9a69597c0165e5e541a9a7a229119f00a8a13f5b', // Stoner Cats
  ],
  stories: [
    '0x3B3ee1931Dc30C1957379ACc9bB4f8374E50506a', // Foundation
  ],
  poems: [
    '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270', // Art Blocks
  ],
};

export async function fetchFamousNFTs(category: 'art' | 'comics' | 'stories' | 'poems'): Promise<NFT[]> {
  const addresses = CONTRACT_ADDRESSES[category];
  if (!addresses || addresses.length === 0) {
    return [];
  }

  const allNfts: NFT[] = [];
  for (const address of addresses) {
    const nfts = await getContractNFTs(address, CHAIN, category);
    allNfts.push(...nfts);
  }
  return allNfts;
}