import { supabase } from '../utils/supabase/client';
import { NFT } from '../types';

export const recordTransaction = async (nft: NFT, buyerAddress: string, sellerAddress: string, txHash: string) => {
  // In a real app, you would look up profile IDs based on wallet addresses.
  // For now, we'll insert null for buyer_id and seller_id as the schema allows it if we remove the foreign key constraint,
  // or we would need a more complex profile lookup system.
  // Let's assume for now we can't get the profile IDs.
  
  // A better approach given the schema is to update the NFT's history.
  // Let's fetch the NFT's current history first.
  const { data: nftData, error: fetchError } = await supabase
    .from('nfts')
    .select('history')
    .eq('id', nft.id)
    .single();

  if (fetchError) {
    console.error('Error fetching NFT history:', fetchError);
    return null;
  }

  const newHistoryEntry = {
    event: 'Sold',
    from: sellerAddress,
    to: buyerAddress,
    price: nft.price,
    date: new Date().toISOString(),
    txHash: txHash,
  };

  const updatedHistory = nftData.history ? [...nftData.history, newHistoryEntry] : [newHistoryEntry];

  const { data, error } = await supabase
    .from('nfts')
    .update({ history: updatedHistory, owner_name: buyerAddress })
    .eq('id', nft.id);

  if (error) {
    console.error('Error recording transaction:', error);
    return null;
  }

  return data;
};

export const listNftForSale = async (nftId: string, price: number) => {
  const { data, error } = await supabase
    .from('nfts')
    .update({ isListed: true, price: price })
    .eq('id', nftId);

  if (error) {
    console.error('Error listing NFT for sale:', error);
    return null;
  }

  return data;
};
export const logTransaction = async (nftId: string, buyerAddress: string, sellerAddress: string, price: number, txHash: string) => {
  // In a real app, you would look up profile IDs based on wallet addresses.
  // For now, we'll use placeholders.
  const buyerId = null; // Replace with actual profile ID lookup
  const sellerId = null; // Replace with actual profile ID lookup

  const { data, error } = await supabase
    .from('transactions')
    .insert([
      { 
        nft_id: nftId, 
        buyer_id: buyerId, 
        seller_id: sellerId, 
        price: price,
        tx_hash: txHash // Assuming you add a tx_hash column to your transactions table
      },
    ]);

  if (error) {
    console.error('Error logging transaction:', error);
    return null;
  }

  return data;
};