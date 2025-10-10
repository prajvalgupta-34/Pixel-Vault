import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';
import { NeonButton } from './NeonButton';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { NFT } from '../types';

interface ListNFTModalProps {
  nft: NFT;
  onClose: () => void;
  onNFTListed: () => void;
}

export const ListNFTModal: React.FC<ListNFTModalProps> = ({ nft, onClose, onNFTListed }) => {
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleListNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const priceInEth = parseFloat(price);
      if (isNaN(priceInEth) || priceInEth <= 0) {
        toast.error('Please enter a valid price.');
        return;
      }

      // This is where you would interact with your smart contract
      // For now, we'll just update the Supabase table
      console.log(`Listing NFT ${nft.id} for ${priceInEth} ETH`);

      const { error } = await supabase
        .from('nfts')
        .update({ for_sale: true, price: priceInEth })
        .eq('id', nft.id);

      if (error) throw error;

      toast.success('NFT listed successfully!');
      onNFTListed();
      onClose();
    } catch (error: any) {
      console.error('Error listing NFT:', error);
      toast.error(error.message || 'Failed to list NFT.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-full max-w-md p-8 mx-4 border rounded-lg shadow-2xl bg-gray-900 border-cyan-400/50 shadow-cyan-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-2xl font-bold text-center text-cyan-400">List Your NFT</h2>
        <form onSubmit={handleListNFT}>
          <div className="mb-6">
            <Label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-300">
              Price (ETH)
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-800 border rounded-md border-cyan-400/50 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., 0.5"
              required
            />
          </div>
          <NeonButton type="submit" disabled={isLoading}>
            {isLoading ? 'Listing...' : 'List for Sale'}
          </NeonButton>
        </form>
      </div>
    </motion.div>
  );
};