'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CosmicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function CosmicButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
}: CosmicButtonProps) {
  const baseClasses =
    'relative px-8 py-3 text-sm tracking-[0.2em] rounded-full transition-all duration-500 select-none';
  const primaryClasses =
    'bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.07]';
  const secondaryClasses =
    'bg-transparent border border-white/[0.06] text-white/50 hover:text-white/70 hover:border-white/15';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variant === 'primary' ? primaryClasses : secondaryClasses} ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Subtle glow on hover */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(140,170,255,0.1) 0%, transparent 70%)',
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
