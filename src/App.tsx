import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { NFTDetailPage } from "./pages/NFTDetailPage";
import { MintPage } from "./pages/MintPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AuthPage } from "./pages/AuthPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SearchPage } from "./pages/SearchPage"; // Import SearchPage
import Marketplace from "./pages/Marketplace";
import ErrorBoundary from "./components/ErrorBoundary";
import { WalletProvider } from "./context/WalletContext";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Force dark mode for futuristic theme
    return true;
  });
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleQuickBuy = (nft: any) => {
    // Simulate purchase with mock behavior
    toast.loading("Processing purchase...", { id: "purchase" });

    setTimeout(() => {
      toast.success(`Successfully purchased "${nft.title}"!`, {
        id: "purchase",
        duration: 5000,
      });
    }, 2000);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <ErrorBoundary>
      <Router>
        <WalletProvider>
          <Layout darkMode={darkMode} onToggleDarkMode={toggleDarkMode} onSearch={handleSearch}>
            <Routes>
              <Route
                path="/"
                element={<HomePage onQuickBuy={handleQuickBuy} />}
              />
              <Route
                path="/preview_page.html"
                element={<HomePage onQuickBuy={handleQuickBuy} />}
              />
              <Route
                path="/nft/:id"
                element={<NFTDetailPage onQuickBuy={handleQuickBuy} />}
              />
              <Route path="/mint" element={<MintPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={<DashboardPage onQuickBuy={handleQuickBuy} />}
              />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} /> {/* New search route */}
              <Route path="/marketplace" element={<Marketplace />} />
              {/* Catch-all route for unknown paths */}
              <Route
                path="*"
                element={<HomePage onQuickBuy={handleQuickBuy} />}
              />
            </Routes>
            <Toaster position="bottom-right" />
          </Layout>
        </WalletProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;