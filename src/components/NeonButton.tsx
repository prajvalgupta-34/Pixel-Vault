import { motion } from 'motion/react';
import { useState } from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NeonButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: NeonButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick?.();
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'from-purple-500 to-pink-500 shadow-purple-500/50',
    secondary: 'from-cyan-500 to-blue-500 shadow-cyan-500/50'
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-lg font-semibold text-white
        bg-gradient-to-r ${variantClasses[variant]}
        shadow-lg ${sizeClasses[size]}
        transition-all duration-300
        ${className}
      `}
      whileHover={{ 
        scale: 1.05,
        boxShadow: variant === 'primary' 
          ? '0 0 30px rgba(168, 85, 247, 0.8)' 
          : '0 0 30px rgba(6, 182, 212, 0.8)'
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      {/* Animated Border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Flowing Border Animation */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${variant === 'primary' ? '#8b5cf6' : '#06b6d4'}, transparent)`,
          padding: '2px',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div className={`w-full h-full rounded-lg bg-gradient-to-r ${variantClasses[variant]}`} />
      </motion.div>

      {/* Ripple Effect */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-white/30"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Glow Effect */}
      <div className={`
        absolute inset-0 rounded-lg blur-xl opacity-50
        bg-gradient-to-r ${variantClasses[variant]}
      `} />
    </motion.button>
  );
}