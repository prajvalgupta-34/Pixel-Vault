import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSearch: (query: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, darkMode, onToggleDarkMode, onSearch }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onSearch={onSearch} />
      <main>{children}</main>
      <footer className="bg-muted/30 border-t mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  PixelVault
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                The world's first and largest digital marketplace for crypto collectibles and non-fungible tokens.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Discord
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Instagram
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  All NFTs
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Art
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Gaming
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Music
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Photography
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Profile
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  My Collections
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Settings
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Help Center
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  About
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Careers
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Terms
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary">
                  Privacy
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PixelVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};