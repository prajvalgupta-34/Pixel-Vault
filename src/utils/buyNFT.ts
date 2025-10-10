import { ethers } from "ethers";

// TODO: Replace with the actual ABI of your NFT contract
const ABI = [
  "function buyNFT(uint26) public payable"
];

async function buyNFT(contractAddress: string, tokenId: string, price: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, ABI, signer);
  const tx = await contract.buyNFT(tokenId, {
    value: ethers.parseEther(price),
  });
  await tx.wait();
  return tx;
}

export default buyNFT;