import React from 'react';
import { motion } from 'motion/react';
import { MagneticButton } from '../ui-lib-components/MagneticButton';
import { SpotlightCard } from '../ui-lib-components/SpotlightCard';
import { AnimatedTabs } from '../ui-lib-components/AnimatedTabs';
import { LiquidBackground } from '../ui-lib-components/LiquidBackground';

export default function UiLib() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans">
      <LiquidBackground />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
        <header className="mb-32">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-6"
          >
            Interaction <span className="text-white/40">Lab</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/50 max-w-xl"
          >
            A showcase of handcrafted UI micro-interactions and animated components. 
            Built for precision, performance, and delight.
          </motion.p>
        </header>

        <section className="mb-32">
          <h2 className="text-sm font-medium uppercase tracking-widest text-white/40 mb-12">Interactive Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SpotlightCard className="h-80 flex flex-col items-center justify-center p-8 bg-[#0a0a0a] border border-white/5 rounded-3xl">
              <MagneticButton>Hover Me</MagneticButton>
              <p className="mt-8 text-sm text-white/40 text-center">Magnetic Button with physics-based spring constraints.</p>
            </SpotlightCard>
            
            <SpotlightCard className="h-80 flex flex-col items-center justify-center p-8 bg-[#0a0a0a] border border-white/5 rounded-3xl col-span-1 md:col-span-2">
              <AnimatedTabs />
              <p className="mt-12 text-sm text-white/40 text-center">Fluid layout animation with shared layout IDs.</p>
            </SpotlightCard>
          </div>
        </section>
        
        <footer className="pt-12 border-t border-white/10 flex justify-between items-center text-sm text-white/30">
          <span>Designed with precision.</span>
          <span>© 2026 Interaction Lab</span>
        </footer>
      </div>
    </div>
  );
}
