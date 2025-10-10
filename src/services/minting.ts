import { NFTStorage, File } from 'nft.storage';

const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_API_KEY;

if (!NFT_STORAGE_KEY) {
  throw new Error('VITE_NFT_STORAGE_API_KEY is not defined in .env');
}

const client = new NFTStorage({ token: NFT_STORAGE_KEY });

/**
 * Stores the NFT image and metadata on IPFS.
 * @param image The NFT image file.
 * @param title The title of the NFT.
 * @param description The description of the NFT.
 * @returns The IPFS URL of the metadata.
 */
export const storeNFT = async (image: File, title: string, description: string): Promise<string> => {
  // The NFTStorage.store method automatically handles uploading and linking the image.
  // It needs the image as a File or Blob.
  const metadata = await client.store({
    name: title,
    description: description,
    image: image,
  });
  
  return metadata.url;
};