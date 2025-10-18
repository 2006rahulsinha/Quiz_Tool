'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  color?: 'cyan' | 'magenta' | 'yellow' | 'green';
  className?: string;
}

export default function NeonCard({
  children,
  color = 'cyan',
  className = ''
}: NeonCardProps) {
  const colorClasses = {
    cyan: 'border-[#00FFFF] shadow-[0_0_15px_#00FFFF,inset_0_0_15px_rgba(0,255,255,0.1)]',
    magenta: 'border-[#FF00FF] shadow-[0_0_15px_#FF00FF,inset_0_0_15px_rgba(255,0,255,0.1)]',
    yellow: 'border-[#FFFF00] shadow-[0_0_15px_#FFFF00,inset_0_0_15px_rgba(255,255,0,0.1)]',
    green: 'border-[#00FF00] shadow-[0_0_15px_#00FF00,inset_0_0_15px_rgba(0,255,0,0.1)]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        border-4 p-6 bg-black/50 backdrop-blur-sm
        ${colorClasses[color]}
        ${className}
      `}
      style={{
        imageRendering: 'pixelated',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
      }}
    >
      {children}
    </motion.div>
  );
}
