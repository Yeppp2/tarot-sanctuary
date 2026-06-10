'use client';

import { motion } from 'framer-motion';
import { DrawnCard } from '@/lib/tarot/draw';
import CardFace from '@/components/divine/CardFace';

interface ReadingCardProps {
  drawnCard: DrawnCard;
  index: number;
  delay: number;
}

export default function ReadingCard({ drawnCard, delay }: ReadingCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0, 0, 1],
      }}
    >
      <p className="text-white/[0.28] text-[10px] tracking-[0.2em]">
        {drawnCard.positionLabel}
      </p>
      <CardFace
        card={drawnCard.card}
        isReversed={drawnCard.isReversed}
        isRevealed
        glowIntensity={0.8}
      />
    </motion.div>
  );
}
