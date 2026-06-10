'use client';

import { motion } from 'framer-motion';
import { DrawnCard } from '@/lib/tarot/draw';
import ReadingCard from './ReadingCard';

interface CardRevealProps {
  cards: DrawnCard[];
}

export default function CardReveal({ cards }: CardRevealProps) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-7 md:gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {cards.map((dc, i) => (
        <ReadingCard
          key={i}
          drawnCard={dc}
          index={i}
          delay={i * 0.35}
        />
      ))}
    </motion.div>
  );
}
