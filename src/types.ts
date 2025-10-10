export interface NFT {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  isListed: boolean;
  category: string;
  likes: number;
  views: number;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  owner: {
    name: string;
    avatar: string;
  };
  history?: {
    event: string;
    price: number;
    date: string;
  }[];
  tags?: string[];
  royalty?: number;
  auction_end?: string;
  description: string;
  floorPrice?: number;
  totalVolume?: number;
  buyLink?: string;
  contractAddress?: string;
}

export interface NFTCollection {
  address: string;
  name: string;
  image: string;
  description: string;
  category: string;
  creatorAddress: string;
  chain: string;
  floorPrice: number;
  marketplaceLink: string;
}