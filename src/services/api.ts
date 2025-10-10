import Moralis from 'moralis';
import { NFT } from '../types';
import { resolveIpfsUrl } from '../utils/helpers';


export const fetchFilteredNFTs = async (): Promise<NFT[]> => {
    // Using a placeholder address as the component does not provide one.
    // This can be replaced with a dynamic address later.
    const walletAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik Buterin's address

    try {
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            chain: 1,
            address: walletAddress,
        });

        const mappedNfts = response.result.map((nftResult) => {
            const nft = nftResult.toJSON();
            let metadata: any = {};
            if (typeof nft.metadata === 'string') {
                try {
                    metadata = JSON.parse(nft.metadata);
                } catch (e) { /* Ignore parsing error */ }
            } else if (nft.metadata) {
                metadata = nft.metadata;
            }

            const imageUrl = resolveIpfsUrl(metadata?.image || metadata?.image_url);

            return {
                id: `${nft.tokenAddress}-${nft.tokenId}`,
                title: metadata?.name || 'No Title',
                image: imageUrl,
                price: 0, // getWalletNFTs does not return price information
                currency: 'ETH',
                isListed: false, // getWalletNFTs does not return listing status
                category: 'uncategorized', // Category needs to be derived from metadata
                likes: 0,
                views: 0,
                creator: {
                    name: 'Unknown', // minter_address is not available in this response
                    avatar: '',
                    verified: !nft.possibleSpam,
                },
                owner: {
                    name: nft.ownerOf || 'Unknown',
                    avatar: '',
                },
                description: metadata?.description || 'No Description',
                buyLink: '', // getWalletNFTs does not return a buy link
            };
        });

        return mappedNfts;
    } catch (error) {
        console.error('Failed to fetch wallet NFTs:', error);
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response: { status: number, data: any } };
            console.error('Moralis API Error:', httpError.response.status, httpError.response.data);
        }
        return [];
    }
};