export interface NFT {
  id: string;
  title: string;
  description: string;
  image: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  owner: {
    name: string;
    avatar: string;
  };
  price: number;
  currency: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  isListed: boolean;
  royalty: number;
  license: string;
  createdAt: string;
  history: {
    event: string;
    from?: string;
    to?: string;
    price?: number;
    date: string;
  }[];
}

export const mockNFTs: NFT[] = [
  {
    id: "1",
    title: "Neon Dreams #001",
    description: "A vibrant digital artwork exploring the intersection of technology and dreams. This piece represents the future of digital art with its stunning neon aesthetics.",
    image: "https://images.unsplash.com/photo-1665927965041-2cf09509dd48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwbmVvbiUyMGFic3RyYWN0fGVufDF8fHx8MTc1OTI5NTQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "CyberArtist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      verified: true
    },
    owner: {
      name: "CyberArtist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    },
    price: 2.5,
    currency: "ETH",
    category: "Digital Art",
    tags: ["neon", "abstract", "digital", "futuristic"],
    likes: 234,
    views: 1892,
    isListed: true,
    royalty: 10,
    license: "Creative Commons",
    createdAt: "2024-09-15",
    history: [
      { event: "Minted", to: "CyberArtist", date: "2024-09-15" },
      { event: "Listed", price: 2.5, date: "2024-09-15" }
    ]
  },
  {
    id: "2",
    title: "Pixel Warrior",
    description: "A nostalgic tribute to classic gaming with modern digital art techniques. This pixel art character embodies the spirit of retro gaming.",
    image: "https://images.unsplash.com/photo-1634324173063-909962333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGdhbWluZyUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NTkzMTYxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "PixelMaster",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      verified: true
    },
    owner: {
      name: "GameCollector",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332014e?w=400"
    },
    price: 1.8,
    currency: "ETH",
    category: "Gaming",
    tags: ["pixel", "gaming", "retro", "character"],
    likes: 156,
    views: 987,
    isListed: true,
    royalty: 5,
    license: "Standard",
    createdAt: "2024-09-10",
    history: [
      { event: "Minted", to: "PixelMaster", date: "2024-09-10" },
      { event: "Sold", from: "PixelMaster", to: "GameCollector", price: 1.2, date: "2024-09-12" },
      { event: "Listed", price: 1.8, date: "2024-09-20" }
    ]
  },
  {
    id: "3",
    title: "Cyberpunk City",
    description: "A futuristic cityscape that captures the essence of cyberpunk aesthetics. Neon lights, towering buildings, and digital rain create an immersive experience.",
    image: "https://images.unsplash.com/photo-1553628223-5a98a5cf8e81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBmdXR1cmlzdGljJTIwYXJ0fGVufDF8fHx8MTc1OTMxNjE2MHww&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "FutureVision",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      verified: false
    },
    owner: {
      name: "FutureVision",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    price: 3.2,
    currency: "ETH",
    category: "Digital Art",
    tags: ["cyberpunk", "city", "futuristic", "neon"],
    likes: 445,
    views: 2341,
    isListed: true,
    royalty: 15,
    license: "Exclusive",
    createdAt: "2024-09-08",
    history: [
      { event: "Minted", to: "FutureVision", date: "2024-09-08" },
      { event: "Listed", price: 3.2, date: "2024-09-08" }
    ]
  },
  {
    id: "4",
    title: "Geometric Harmony",
    description: "A stunning 3D rendered piece exploring geometric forms and their relationships. The interplay of light and shadow creates a mesmerizing visual experience.",
    image: "https://images.unsplash.com/photo-1665663414346-54ddd03af9b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMHJlbmRlciUyMGdlb21ldHJpYyUyMGFic3RyYWN0fGVufDF8fHx8MTc1OTMxNjE2MHww&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "GeomArt",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      verified: true
    },
    owner: {
      name: "GeomArt",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    },
    price: 1.5,
    currency: "ETH",
    category: "3D Art",
    tags: ["geometric", "3d", "abstract", "minimalist"],
    likes: 178,
    views: 1234,
    isListed: true,
    royalty: 8,
    license: "Standard",
    createdAt: "2024-09-12",
    history: [
      { event: "Minted", to: "GeomArt", date: "2024-09-12" },
      { event: "Listed", price: 1.5, date: "2024-09-12" }
    ]
  },
  {
    id: "5",
    title: "Modern Sculpture",
    description: "A contemporary digital sculpture that blends traditional art forms with cutting-edge technology. This piece challenges perceptions of digital vs physical art.",
    image: "https://images.unsplash.com/photo-1707578087102-92520fda8f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBzY3VscHR1cmV8ZW58MXx8fHwxNzU5MjU4MjEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "SculptorDAO",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400",
      verified: true
    },
    owner: {
      name: "ArtCollector99",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
    },
    price: 4.1,
    currency: "ETH",
    category: "Sculpture",
    tags: ["sculpture", "modern", "contemporary", "digital"],
    likes: 289,
    views: 1567,
    isListed: false,
    royalty: 12,
    license: "Exclusive",
    createdAt: "2024-09-05",
    history: [
      { event: "Minted", to: "SculptorDAO", date: "2024-09-05" },
      { event: "Sold", from: "SculptorDAO", to: "ArtCollector99", price: 4.1, date: "2024-09-18" }
    ]
  },
  {
    id: "6",
    title: "Colorful Dreams",
    description: "A vibrant digital illustration that captures the essence of dreams and imagination. Bright colors and flowing forms create a sense of movement and energy.",
    image: "https://images.unsplash.com/photo-1726629597667-45538148be5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaWxsdXN0cmF0aW9uJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU5MzAyMDYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "DreamWeaver",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      verified: false
    },
    owner: {
      name: "DreamWeaver",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
    },
    price: 0.8,
    currency: "ETH",
    category: "Illustration",
    tags: ["colorful", "illustration", "dreams", "vibrant"],
    likes: 92,
    views: 567,
    isListed: true,
    royalty: 5,
    license: "Creative Commons",
    createdAt: "2024-09-20",
    history: [
      { event: "Minted", to: "DreamWeaver", date: "2024-09-20" },
      { event: "Listed", price: 0.8, date: "2024-09-20" }
    ]
  },
  {
    id: "7",
    title: "Abstract Patterns",
    description: "An exploration of mathematical patterns and their visual representation. This piece combines algorithmic generation with artistic vision.",
    image: "https://images.unsplash.com/photo-1709314189694-c709d3e3ac7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhdHRlcm4lMjBkZXNpZ258ZW58MXx8fHwxNzU5MjA4OTUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "PatternLab",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400",
      verified: true
    },
    owner: {
      name: "PatternLab",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400"
    },
    price: 2.2,
    currency: "ETH",
    category: "Generative Art",
    tags: ["patterns", "abstract", "mathematical", "generative"],
    likes: 167,
    views: 891,
    isListed: true,
    royalty: 10,
    license: "Standard",
    createdAt: "2024-09-14",
    history: [
      { event: "Minted", to: "PatternLab", date: "2024-09-14" },
      { event: "Listed", price: 2.2, date: "2024-09-14" }
    ]
  },
  {
    id: "8",
    title: "Blockchain Art",
    description: "A meta-artistic piece that represents the very technology that enables NFTs. This work explores the visual representation of blockchain concepts.",
    image: "https://images.unsplash.com/photo-1644151015485-f9b2197352f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG8lMjBhcnQlMjBibG9ja2NoYWlufGVufDF8fHx8MTc1OTMxNjE2NHww&ixlib=rb-4.1.0&q=80&w=1080",
    creator: {
      name: "CryptoVisionary",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      verified: true
    },
    owner: {
      name: "CryptoVisionary",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    },
    price: 5.0,
    currency: "ETH",
    category: "Conceptual Art",
    tags: ["blockchain", "crypto", "technology", "conceptual"],
    likes: 512,
    views: 3456,
    isListed: true,
    royalty: 20,
    license: "Exclusive",
    createdAt: "2024-09-01",
    history: [
      { event: "Minted", to: "CryptoVisionary", date: "2024-09-01" },
      { event: "Listed", price: 5.0, date: "2024-09-01" }
    ]
  }
];

export const mockCollections = [
  {
    id: "1",
    name: "Neon Dreams Collection",
    description: "A curated collection of neon-inspired digital artworks",
    creator: "CyberArtist",
    itemCount: 25,
    floorPrice: 1.5,
    totalVolume: 45.6
  },
  {
    id: "2",
    name: "Pixel Legends",
    description: "Retro gaming characters reimagined as NFTs",
    creator: "PixelMaster",
    itemCount: 100,
    floorPrice: 0.8,
    totalVolume: 234.5
  }
];

export const categories = [
  "All",
  "Digital Art",
  "Gaming",
  "3D Art",
  "Sculpture",
  "Illustration",
  "Generative Art",
  "Conceptual Art",
  "Photography",
  "Music"
];

export const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "most_liked", label: "Most Liked" },
  { value: "trending", label: "Trending" }
];