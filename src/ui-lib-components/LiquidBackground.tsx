import React from 'react';
import { motion } from 'motion/react';

export function LiquidBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 -left-1/4 w-[100vw] h-[100vw] rounded-full bg-blue-900/10 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -70, 0],
          y: [0, 70, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -bottom-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-purple-900/10 blur-[120px]"
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-20" />
    </div>
  );
}
