'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { TarotCard } from '@/lib/tarot/cards';

interface CardFaceProps {
  card: TarotCard;
  isReversed: boolean;
  isRevealed: boolean;
  onClick?: () => void;
  className?: string;
  glowIntensity?: number;
  compact?: boolean;
}

const elementColor: Record<TarotCard['element'], string> = {
  fire: 'rgba(238,145,91,0.28)',
  water: 'rgba(118,177,224,0.26)',
  air: 'rgba(213,221,235,0.22)',
  earth: 'rgba(170,190,132,0.26)',
  spirit: 'rgba(197,172,235,0.26)',
};

function CardBack({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[10px] border border-white/[0.12]"
      style={{
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        background:
          'radial-gradient(circle at 50% 42%, rgba(185,204,255,0.15), transparent 34%), linear-gradient(145deg, #111731 0%, #050815 54%, #151b37 100%)',
      }}
    >
      <div className="absolute inset-2 rounded-md border border-white/[0.08]" />
      <div className="absolute inset-4 rounded-sm border border-white/[0.04]" />
      <div className="absolute h-[140%] w-8 rotate-45 bg-white/[0.025]" />
      <div className="absolute h-[140%] w-8 -rotate-45 bg-white/[0.018]" />
      <svg viewBox="0 0 72 112" className={compact ? 'h-16 w-11' : 'h-24 w-16'}>
        <path d="M36 8 L43 38 L36 33 L29 38 Z" fill="rgba(236,240,255,0.26)" />
        <path d="M36 104 L43 74 L36 79 L29 74 Z" fill="rgba(236,240,255,0.20)" />
        <path d="M8 56 L29 48 L25 56 L29 64 Z" fill="rgba(236,240,255,0.20)" />
        <path d="M64 56 L43 48 L47 56 L43 64 Z" fill="rgba(236,240,255,0.20)" />
        <circle cx="36" cy="56" r="20" fill="none" stroke="rgba(236,240,255,0.18)" strokeWidth="1" />
        <circle cx="36" cy="56" r="7" fill="none" stroke="rgba(236,240,255,0.22)" strokeWidth="1" />
        <circle cx="36" cy="56" r="2.5" fill="rgba(236,240,255,0.4)" />
      </svg>
    </div>
  );
}

export default function CardFace({
  card,
  isReversed,
  isRevealed,
  onClick,
  className = '',
  glowIntensity = 0,
  compact = false,
}: CardFaceProps) {
  const [isHovered, setIsHovered] = useState(false);
  const width = compact ? 'w-[98px] md:w-[116px]' : 'w-[154px] md:w-[182px]';
  const glow = elementColor[card.element];

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ perspective: '900px' }}
      animate={{
        scale: isHovered && onClick ? 1.035 : 1,
        filter: isHovered
          ? `drop-shadow(0 0 ${12 + glowIntensity * 18}px ${glow})`
          : `drop-shadow(0 0 ${4 + glowIntensity * 8}px rgba(80,110,180,0.08))`,
      }}
      transition={{ scale: { duration: 0.35 } }}
    >
      <motion.div
        className={`relative ${width} aspect-[7/12] rounded-[10px]`}
        animate={{ rotateY: isRevealed ? 0 : 180 }}
        transition={{ rotateY: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <CardBack compact={compact} />

        <div
          className="absolute inset-0 overflow-hidden rounded-[10px] bg-[#efe3cf] shadow-[0_12px_34px_rgba(0,0,0,0.32)]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <div className={`relative h-full w-full bg-[#f6eddc] ${isReversed ? 'rotate-180' : ''}`}>
            <Image
              src={`/tarot/cards/${card.id}.jpg`}
              alt={`${card.name} ${card.nameEn}`}
              fill
              sizes={compact ? '116px' : '182px'}
              className="object-fill"
              priority={isRevealed}
              unoptimized
            />
          </div>
        </div>
      </motion.div>

      {isRevealed && (
        <div className="mt-2 text-center">
          <p className="text-[10px] tracking-[0.14em] text-white/38">
            {isReversed ? '逆位' : '正位'}
          </p>
          <p className="mt-1 text-[11px] tracking-[0.12em] text-white/56">
            {card.name}
          </p>
        </div>
      )}
    </motion.div>
  );
}
