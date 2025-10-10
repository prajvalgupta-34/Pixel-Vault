import { motion } from 'framer-motion';
import { Flame, Gem, Zap } from 'lucide-react';

const trendingTags = [
  { name: '🔥 Top Poem NFTs', icon: <Flame className="h-4 w-4" /> },
  { name: '💎 Iconic Comics', icon: <Gem className="h-4 w-4" /> },
  { name: '⚡ Trending Stories', icon: <Zap className="h-4 w-4" /> },
];

export const TrendingTags = () => {
  return (
    <div className="flex items-center space-x-4">
      {trendingTags.map((tag, index) => (
        <motion.div
          key={tag.name}
          className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800 border border-cyan-400/50 text-cyan-400 text-sm font-medium cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}
        >
          {tag.icon}
          <span>{tag.name}</span>
        </motion.div>
      ))}
    </div>
  );
};