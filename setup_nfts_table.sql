-- Drop the existing table to ensure a clean slate
DROP TABLE IF EXISTS nfts;

-- Create the table again with the correct schema
CREATE TABLE nfts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  price NUMERIC,
  currency TEXT,
  creator_name TEXT,
  creator_avatar TEXT,
  creator_verified BOOLEAN,
  owner_name TEXT,
  owner_avatar TEXT,
  category TEXT,
  tags TEXT[],
  likes INT,
  views INT,
  isListed BOOLEAN,
  minted BOOLEAN DEFAULT false,
  royalty INT,
  history JSONB,
  -- New columns for auctions
  auction_end TIMESTAMPTZ,
  current_bid NUMERIC,
  highest_bidder UUID REFERENCES profiles(id)
);

-- Insert the data with the corrected array syntax
INSERT INTO nfts (id, title, description, image, price, currency, creator_name, creator_avatar, creator_verified, owner_name, owner_avatar, category, tags, likes, views, isListed, royalty, history) VALUES
('1', 'Cybernetic Dream', 'A vibrant exploration of a futuristic cityscape, blending organic and artificial elements.', 'https://images.unsplash.com/photo-1640102VudGljJTIwaG9sb2dyYXBoaWMlMjBhcnR8ZW58MXx8fHwxNzU5Mzk5NzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 0.5, 'ETH', 'John Doe', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', true, 'Jane Smith', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400', 'Art', '{"futuristic", "cyberpunk", "vibrant"}', 120, 1500, true, 10, '[{"event": "Minted", "from": null, "to": "John Doe", "price": null, "date": "2023-01-15T10:30:00Z"}, {"event": "Sold", "from": "John Doe", "to": "Jane Smith", "price": 0.5, "date": "2023-02-20T14:00:00Z"}]'),
('2', 'Galactic Voyager', 'An interstellar journey captured in a single moment, showcasing the beauty of the cosmos.', 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHNwYWNlJTIwYXJ0fGVufDF8fHx8MTc1OTM5OTc1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 0.8, 'ETH', 'Alice Johnson', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400', true, 'Bob Williams', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'Art', '{"space", "abstract", "colorful"}', 250, 3200, true, 12, '[{"event": "Minted", "from": null, "to": "Alice Johnson", "price": null, "date": "2023-03-10T11:00:00Z"}, {"event": "Sold", "from": "Alice Johnson", "to": "Bob Williams", "price": 0.8, "date": "2023-04-05T18:30:00Z"}]'),
('3', 'Neon Noir', 'A gritty depiction of a rain-soaked alley in a cyberpunk metropolis.', 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwY2l0eXxlbnwxfHx8fDE3NTkzOTk3NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 1.2, 'ETH', 'Charlie Brown', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', false, 'Diana Prince', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'Photography', '{"cyberpunk", "city", "neon"}', 400, 8000, true, 8, '[{"event": "Minted", "from": null, "to": "Charlie Brown", "price": null, "date": "2023-05-01T09:00:00Z"}, {"event": "Sold", "from": "Charlie Brown", "to": "Diana Prince", "price": 1.2, "date": "2023-06-15T12:45:00Z"}]'),
('4', 'Pixel Warrior', 'A retro-inspired character design for a fictional video game.', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NTkzOTk3NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 0.2, 'ETH', 'Eve Adams', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', true, 'Frank White', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', 'Gaming', '{"pixel art", "8-bit", "character"}', 80, 1200, false, 15, '[{"event": "Minted", "from": null, "to": "Eve Adams", "price": null, "date": "2023-07-22T16:20:00Z"}]', false);

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  avatar_url TEXT,
  website TEXT
);

-- Collections Table
CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT
);

-- Transactions Table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  nft_id TEXT REFERENCES nfts(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  price NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Bids Table
CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  nft_id TEXT REFERENCES nfts(id),
  bidder_id UUID REFERENCES profiles(id),
  amount NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL, -- e.g., 'new_bid', 'sale', 'follow'
  data JSONB, -- e.g., { "bidder_name": "John", "amount": 1.5 }
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
