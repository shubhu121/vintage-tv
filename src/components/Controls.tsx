import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { playClick, playSwitch } from '../utils/audio';

interface RotaryKnobProps {
  steps: number;
  value: number;
  onChange: (val: number) => void;
  type: 'clicky' | 'smooth';
}

export const RotaryKnob = ({ steps, value, onChange, type }: RotaryKnobProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragRot, setDragRot] = useState(0);
  const startY = useRef(0);
  const startRot = useRef(0);

  // If we are dragging, show the fluid drag rotation, otherwise show the snapped value
  const currentRot = isDragging 
    ? dragRot 
    : (type === 'clicky' ? (value * (360 / steps)) : (value / 100 * 270));

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    
    const initialRot = type === 'clicky' ? (value * (360 / steps)) : (value / 100 * 270);
    startRot.current = initialRot;
    setDragRot(initialRot);
    
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = startY.current - e.clientY;
    let newRot = startRot.current + deltaY * 1.5; 

    if (type === 'clicky') {
       setDragRot(newRot);
       const stepAngle = 360 / steps;
       let step = Math.round(newRot / stepAngle);
       step = ((step % steps) + steps) % steps;
       if (step !== value) {
         onChange(step);
         playClick();
       }
    } else {
       newRot = Math.max(0, Math.min(newRot, 270));
       setDragRot(newRot);
       if (newRot !== currentRot) {
         onChange((newRot / 270) * 100);
       }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#dcdcdc] via-[#999] to-[#666] shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.8)] flex items-center justify-center p-1 cursor-pointer touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
       <div className="w-full h-full rounded-full border-2 border-black/10 flex items-center justify-center relative">
         <motion.div
           className="w-full h-full absolute rounded-full flex justify-center items-center"
           animate={{ rotate: currentRot }}
           transition={{ type: type === 'clicky' ? 'spring' : 'tween', stiffness: 400, damping: 25, duration: 0.1 }}
         >
            <div className="w-1.5 h-10 bg-[#333] rounded-full -translate-y-6 shadow-sm" />
         </motion.div>
       </div>
    </div>
  )
}

export const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => {
   return (
      <div
        className="w-10 h-10 rounded-full bg-gradient-to-b from-[#ff4444] to-[#cc0000] border-4 border-[#333] shadow-lg cursor-pointer touch-none relative flex items-center justify-center"
        onPointerDown={(e) => {
            e.preventDefault();
            onChange(!checked);
            playSwitch();
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-black/40"
          animate={{ opacity: checked ? 0 : 1 }}
          transition={{ duration: 0.1 }}
        />
      </div>
   )
}
