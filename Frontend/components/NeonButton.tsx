'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes } from 'react';

interface NeonButtonProps {
  text: string;
  color?: 'cyan' | 'magenta' | 'yellow' | 'green';
  variant?: 'default' | 'outline';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function NeonButton({
  text,
  color = 'cyan',
  variant = 'default',
  className = '',
  onClick,
  disabled,
  type = 'button',
}: NeonButtonProps) {
  const colorClasses = {
    cyan: 'bg-[#00FFFF] text-black shadow-[0_0_10px_#00FFFF,0_0_20px_#00FFFF,0_0_30px_#00FFFF]',
    magenta: 'bg-[#FF00FF] text-black shadow-[0_0_10px_#FF00FF,0_0_20px_#FF00FF,0_0_30px_#FF00FF]',
    yellow: 'bg-[#FFFF00] text-black shadow-[0_0_10px_#FFFF00,0_0_20px_#FFFF00,0_0_30px_#FFFF00]',
    green: 'bg-[#00FF00] text-black shadow-[0_0_10px_#00FF00,0_0_20px_#00FF00,0_0_30px_#00FF00]'
  };

  const outlineClasses = {
    cyan: 'border-2 border-[#00FFFF] text-[#00FFFF] shadow-[0_0_10px_#00FFFF,inset_0_0_10px_#00FFFF]',
    magenta: 'border-2 border-[#FF00FF] text-[#FF00FF] shadow-[0_0_10px_#FF00FF,inset_0_0_10px_#FF00FF]',
    yellow: 'border-2 border-[#FFFF00] text-[#FFFF00] shadow-[0_0_10px_#FFFF00,inset_0_0_10px_#FFFF00]',
    green: 'border-2 border-[#00FF00] text-[#00FF00] shadow-[0_0_10px_#00FF00,inset_0_0_10px_#00FF00]'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        px-6 py-3 font-bold uppercase tracking-wider
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'default' ? colorClasses[color] : outlineClasses[color]}
        ${className}
      `}
      style={{
        imageRendering: 'pixelated',
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
      }}
    >
      {text}
    </motion.button>
  );
}
