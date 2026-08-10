import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const tabs = ['Overview', 'Interactions', 'Layout', 'Performance'];

export function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab ? 'text-black' : 'text-white/60 hover:text-white'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="bubble"
                className="absolute inset-0 bg-white rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-8 relative w-full h-20 flex items-center justify-center overflow-hidden text-center text-white/50 text-sm">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            Content for {activeTab} section goes here.
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
