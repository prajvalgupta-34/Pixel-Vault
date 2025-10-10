
  import { createRoot } from "react-dom/client";
  import Moralis from "moralis";
  import App from "./App.tsx";
  import "./index.css";
  import { SessionContextProvider } from "@supabase/auth-helpers-react";
  import { supabase } from "./utils/supabase/client.ts";
  
  Moralis.start({
    apiKey: import.meta.env.VITE_MORALIS_API_KEY,
  });

  createRoot(document.getElementById("root")!).render(
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  );
  