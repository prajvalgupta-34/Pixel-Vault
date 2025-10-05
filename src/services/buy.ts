import { NFT } from '../types';
import { ethers, parseEther } from 'ethers';

export const buyNft = async (nft: NFT, signer: ethers.Signer) => {
  try {
    const transaction = await signer.sendTransaction({
      to: nft.owner.name, // Assuming owner's name is their address
      value: parseEther(nft.price.toString()),
    });
    await transaction.wait();
    return transaction;
  } catch (error) {
    console.error('Error buying NFT:', error);
    return null;
  }
};