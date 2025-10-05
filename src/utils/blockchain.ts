import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// This function connects to the user's wallet (e.g., MetaMask)
export const connectWallet = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Request account access
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      console.log("Connected to wallet:", await signer.getAddress());
      return signer;
    } catch (error) {
      console.error("User denied account access");
    }
  } else {
    console.error("No Ethereum browser extension detected, install MetaMask!");
  }
};

// This is a placeholder for your NFT contract's ABI
const nftContractABI: any[] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function totalSupply() view returns (uint256)",
];

// This is the Bored Ape Yacht Club contract address on Ethereum mainnet
// This is the Pudgy Penguins contract address on Ethereum mainnet
const nftContractAddress = "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8";

// This function creates a contract instance
export const getNFTContract = (signer: ethers.Signer) => {
  return new ethers.Contract(nftContractAddress, nftContractABI, signer);
};

// This function fetches NFT data from the blockchain
export const fetchNFTs = async () => {
  const config = {
    apiKey: "_gg7w5BbF-IqS4s_aE-O8_p_1A9c-t_", // Using a public demo key
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  try {
    const response = await alchemy.nft.getNftsForContract(nftContractAddress, { pageSize: 20 });
    const nfts = response.nfts.map(nft => {
      return {
        id: nft.tokenId,
        title: nft.name || 'No Title',
        description: nft.description || '',
        image: nft.media[0]?.gateway || '',
        creator: { name: "Pudgy Penguins", verified: true },
        owner: { name: 'N/A' },
        price: 0,
        currency: 'ETH',
        category: 'Collectibles',
        tags: [],
        likes: 0,
        views: 0,
        isListed: true,
        royalty: 0,
        license: 'N/A',
        createdAt: nft.timeLastUpdated,
        history: [],
      };
    });
    return nfts;
  } catch (error) {
    console.error("Could not fetch NFTs:", error);
  }
};

// This function allows a user to mint an NFT
export const mintNFT = async (signer: ethers.Signer, tokenURI: string) => {
  const contract = getNFTContract(signer);
  try {
    const transaction = await contract.mint(tokenURI);
    await transaction.wait();
    console.log("NFT minted successfully!");
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
};