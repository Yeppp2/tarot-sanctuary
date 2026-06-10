'use client';

import { motion } from 'framer-motion';

export default function MoonPhase() {
  return (
    <motion.div
      className="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 pointer-events-none select-none"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 0.1, ease: 'easeOut' }}
    >
      {/* Crescent moon */}
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 65% 35%, rgba(220,230,255,0.35) 0%, rgba(180,200,240,0.1) 40%, transparent 70%)',
            boxShadow: '0 0 40px rgba(160,190,255,0.15), 0 0 80px rgba(140,170,240,0.06)',
          }}
          animate={{
            boxShadow: [
              '0 0 40px rgba(160,190,255,0.15), 0 0 80px rgba(140,170,240,0.06)',
              '0 0 55px rgba(160,190,255,0.2), 0 0 100px rgba(140,170,240,0.1)',
              '0 0 40px rgba(160,190,255,0.15), 0 0 80px rgba(140,170,240,0.06)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Crescent mask to create crescent shape */}
        <motion.div
          className="absolute w-[90%] h-[90%] rounded-full top-[5%]"
          style={{
            background: '#080c18',
            left: '18%',
          }}
          animate={{ left: ['18%', '15%', '18%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
