import { useRef } from 'react';

export function useRotaryClick(thresholdDegrees = 15) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastClickAngleRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playClick = (currentAngle: number) => {
    initAudio();
    const now = performance.now();
    
    // Rate limit: max 1 click per 30ms to prevent audio spam
    if (now - lastClickTimeRef.current < 30) return; 

    // Find shortest distance between current angle and last clicked angle
    let diff = Math.abs(currentAngle - lastClickAngleRef.current);
    if (diff > 180) {
      diff = 360 - diff;
    }

    if (diff >= thresholdDegrees) {
      lastClickAngleRef.current = currentAngle;
      lastClickTimeRef.current = now;
      
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Low frequency thud/click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.03);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {
        // Ignore audio errors
      }
    }
  };

  return { playClick, initAudio };
}
