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

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Force dark mode for futuristic theme
    return true;
  });

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

  return (
    <Router>
      <Layout darkMode={darkMode} onToggleDarkMode={toggleDarkMode}>
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
          <Route
            path="/dashboard"
            element={<DashboardPage onQuickBuy={handleQuickBuy} />}
          />
          {/* Catch-all route for unknown paths */}
          <Route
            path="*"
            element={<HomePage onQuickBuy={handleQuickBuy} />}
          />
        </Routes>
        <Toaster position="bottom-right" />
      </Layout>
    </Router>
  );
}

export default App;