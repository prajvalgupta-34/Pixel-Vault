import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';

export const WalletBalance = () => {
  const { signer } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (signer) {
        try {
          const address = await signer.getAddress();
          const balance = await signer.provider.getBalance(address);
          setBalance(ethers.formatEther(balance));
        } catch (err) {
          console.error('Error fetching balance:', err);
          setError('Failed to fetch balance');
        }
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, [signer]);

  return (
    <motion.div
      className="flex items-center space-x-2 text-cyan-400 neon-text"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Wallet className="h-5 w-5" />
      {balance !== null ? (
        <span>{parseFloat(balance).toFixed(4)} ETH</span>
      ) : (
        <span className="text-gray-500">{error || 'Loading...'}</span>
      )}
    </motion.div>
  );
};