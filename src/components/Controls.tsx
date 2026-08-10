import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { playSwitch } from '../utils/audio';
import { useRotaryClick } from '../hooks/useRotaryClick';

interface RotaryKnobProps {
  steps: number;
  value: number;
  onChange: (val: number) => void;
  type: 'clicky' | 'smooth';
}

export const RotaryKnob = ({ steps, value, onChange, type }: RotaryKnobProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [internalRot, setInternalRot] = useState(() => type === 'clicky' ? (value * (360 / steps)) : (value / 100 * 270) - 135);
  const accumulatedRotation = useRef(internalRot);
  const previousAngle = useRef(0);
  const lastEmittedValue = useRef(value);
  
  // Use rotary click hook
  const { playClick: playRotaryClick, initAudio } = useRotaryClick(type === 'clicky' ? (360 / steps) : 10);

  // Sync with external value if not dragging
  React.useEffect(() => {
    if (!isDragging) {
      const targetRot = type === 'clicky' ? (value * (360 / steps)) : (value / 100 * 270) - 135;
      setInternalRot(targetRot);
      accumulatedRotation.current = targetRot;
      lastEmittedValue.current = value;
    }
  }, [value, isDragging, type, steps]);

  const updateRotation = (x: number, y: number, isInitial = false) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    angle = angle + 90;
    if (angle < 0) angle += 360;

    if (isInitial) {
      previousAngle.current = angle;
    } else {
      let delta = angle - previousAngle.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      
      let newRotation = accumulatedRotation.current + delta;
      
      if (type === 'smooth') {
         if (newRotation < -135) newRotation = -135;
         if (newRotation > 135) newRotation = 135;
      }
      
      accumulatedRotation.current = newRotation;
      previousAngle.current = angle;
      
      if (type === 'clicky') {
         const stepAngle = 360 / steps;
         const snappedRot = Math.round(newRotation / stepAngle) * stepAngle;
         setInternalRot(snappedRot);
         
         let step = Math.round(newRotation / stepAngle);
         step = ((step % steps) + steps) % steps;
         
         if (step !== lastEmittedValue.current) {
            lastEmittedValue.current = step;
            onChange(step);
         }
         playRotaryClick(accumulatedRotation.current);
      } else {
         setInternalRot(newRotation);
         const newValue = ((newRotation + 135) / 270) * 100;
         if (Math.abs(newValue - lastEmittedValue.current) > 0.5) {
           lastEmittedValue.current = newValue;
           onChange(newValue);
         }
         // Optionally add click sound to smooth knob as well, or just omit
         playRotaryClick(accumulatedRotation.current);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
    initAudio();
    e.currentTarget.setPointerCapture(e.pointerId);
    updateRotation(e.clientX, e.clientY, true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateRotation(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    document.body.style.cursor = '';
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center cursor-pointer touch-none group"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        background: 'linear-gradient(145deg, #181818, #333333)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.15)'
      }}
    >
       {/* Outer Ridges for grip */}
       <div 
         className="absolute inset-1 rounded-full opacity-70"
         style={{ background: 'repeating-conic-gradient(rgba(0,0,0,0.6) 0deg, rgba(255,255,255,0.1) 4deg, rgba(0,0,0,0.6) 8deg)' }} 
       />
       {/* Inner metallic/plastic core */}
       <div 
         className="absolute inset-[6px] rounded-full border border-black/50"
         style={{
           background: 'radial-gradient(circle at 50% 30%, #e0e0e0 0%, #a3a3a3 40%, #555555 100%)',
           boxShadow: 'inset 0 -6px 12px rgba(0,0,0,0.6), inset 0 4px 10px rgba(255,255,255,0.9), 0 5px 15px rgba(0,0,0,0.7)'
         }}
       />
       {/* Small center indent detail */}
       <div className="absolute inset-[35%] rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.5),0_2px_4px_rgba(255,255,255,0.5)] border border-black/20"
            style={{ background: 'linear-gradient(145deg, #999, #d4d4d4)' }}
       />
       <motion.div
           className="w-full h-full absolute rounded-full flex justify-center items-center"
           animate={{ rotate: internalRot }}
           transition={{ type: type === 'clicky' ? 'spring' : 'tween', stiffness: type === 'clicky' ? 400 : 800, damping: 25, duration: 0.1 }}
       >
          {/* The indicator notch */}
          <div className="w-2.5 h-10 md:h-12 bg-[#222] rounded-full -translate-y-[34px] md:-translate-y-10 shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.6)] border border-black/40" />
       </motion.div>
    </div>
  )
}

export const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => {
   return (
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-full cursor-pointer touch-none relative flex items-center justify-center group"
        onPointerDown={(e) => {
            e.preventDefault();
            onChange(!checked);
            playSwitch();
        }}
        style={{
          background: 'linear-gradient(145deg, #111, #222)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.1)'
        }}
      >
        {/* Outer Ring */}
        <div className="absolute inset-1 rounded-full border border-black/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
             style={{ background: 'linear-gradient(to bottom, #1a1a1a, #2a2a2a)' }} />
        
        {/* The actual button */}
        <motion.div
          className="absolute inset-[6px] rounded-full border border-black/40"
          animate={{
             background: checked 
               ? 'radial-gradient(circle at 50% 30%, #ff5555 0%, #cc0000 70%, #880000 100%)' 
               : 'radial-gradient(circle at 50% 30%, #aa3333 0%, #770000 70%, #440000 100%)',
             boxShadow: checked 
               ? 'inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.5), 0 2px 15px rgba(255,60,60,0.4)' 
               : 'inset 0 -2px 6px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.2), 0 1px 3px rgba(0,0,0,0.6)',
             y: checked ? 2 : 0,
             scale: checked ? 0.96 : 1
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {/* Subtle reflection on the button */}
          <div className="absolute inset-1 rounded-full opacity-50"
               style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 40%)' }} />
        </motion.div>
      </div>
   )
}
