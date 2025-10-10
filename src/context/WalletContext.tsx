import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { connectWallet as connectWalletUtil } from '../utils/blockchain';

interface WalletContextType {
  signer: ethers.JsonRpcSigner | null;
  provider: ethers.BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const connectWallet = async () => {
    try {
      const signer = await connectWalletUtil();
      if (signer) {
        setSigner(signer);
        setProvider(signer.provider as ethers.BrowserProvider);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setSigner(null);
    setProvider(null);
  };

  return (
    <WalletContext.Provider value={{ signer, provider, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};