import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { CRTScreen } from './CRTScreen';
import { RotaryKnob, ToggleSwitch } from './Controls';

const Player = ReactPlayer as any;

const CHANNELS = [
  "https://archive.org/download/superman_the_mechanical_monsters/superman_the_mechanical_monsters_512kb.mp4",
  "https://archive.org/download/popeye_the_sailor_ancient_fantasy/popeye_the_sailor_ancient_fantasy_512kb.mp4",
  "https://archive.org/download/woody_woodpecker_pantry_panic/woody_woodpecker_pantry_panic_512kb.mp4",
  "https://archive.org/download/bb_minnie_the_moocher/bb_minnie_the_moocher_512kb.mp4",
  "https://archive.org/download/FLIP_FROG-FIDDLESTICKS/FLIP_FROG-FIDDLESTICKS_256k.mp4",
  "https://archive.org/download/bb_snow_white/bb_snow_white_512kb.mp4",
  "https://archive.org/download/mighty_mouse_wolf_wolf/mighty_mouse_wolf_wolf_512kb.mp4",
  "https://archive.org/download/superman_electric_earthquake/superman_electric_earthquake_512kb.mp4",
  "https://archive.org/download/noveltoon_casper_tfg_theres_good_boos_tonight/noveltoon_casper_tfg_theres_good_boos_tonight_512kb.mp4",
  "https://archive.org/download/felix_the_cat_the_goos_that_laid_the_golden_egg/felix_the_cat_the_goos_that_laid_the_golden_egg_512kb.mp4",
  "https://archive.org/download/gabby_alls_well/gabby_alls_well_512kb.mp4",
  "https://archive.org/download/JackFrost_/JackFrost_512kb.mp4",
];

export const VintageTV = () => {
  const [channel, setChannel] = useState(3);
  const [power, setPower] = useState(false);
  const [volume, setVolume] = useState(50);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    setHasError(false);
  }, [channel]);

  const hasSignal = !hasError && isReady;

  const getGlowColor = () => {
    if (!power) return 'transparent';
    const colors = [
      'rgba(255, 255, 255, 0.15)',
      'rgba(100, 150, 255, 0.15)',
      'rgba(255, 200, 100, 0.15)',
      'rgba(150, 255, 150, 0.15)'
    ];
    return colors[channel % colors.length];
  };

  return (
    <div className="relative z-10 flex items-center justify-center">
      <div 
        className="absolute inset-0 rounded-full blur-[100px] transition-all duration-1000 pointer-events-none scale-150"
        style={{ 
          backgroundColor: getGlowColor(),
          transform: `scale(${power ? 1.5 : 0.8})` 
        }} 
      />

      <div className="relative w-[880px] h-[640px] bg-[#4a3221] rounded-[60px] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),inset_0_4px_10px_rgba(255,255,255,0.1)] border-b-[12px] border-[#2d1e14] border-t-[2px] border-[#5d4037]">
        
        <div 
          className="absolute inset-0 rounded-[60px]" 
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 2%, transparent 5%, transparent 95%, rgba(255,255,255,0.05) 98%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />

        <div className="flex h-full gap-8 relative z-10">
          
          <div className="relative flex-grow h-full bg-[#111] rounded-[80px] border-[24px] border-[#222] shadow-[inset_0_0_60px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
            <div className="w-full h-full relative">
              
              {/* Video Background */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-[30px] flex items-center justify-center bg-black">
                <Player
                  url={CHANNELS[channel]}
                  playing={power}
                  volume={volume / 100}
                  muted={!power || volume === 0}
                  width="130%"
                  height="130%"
                  loop={true}
                  onReady={() => { 
                    console.log(`Video ready for channel ${channel}`);
                    setIsReady(true); 
                    setHasError(false); 
                  }}
                  onError={(e: any) => {
                    console.error(`Video error for channel ${channel}:`, e);
                    setHasError(true);
                  }}
                  config={{
                    file: {
                      attributes: {
                        crossOrigin: 'anonymous',
                        style: { objectFit: 'cover', width: '100%', height: '100%' }
                      }
                    }
                  }}
                />
              </div>

              <div className="absolute inset-0 z-10 pointer-events-none">
                <CRTScreen channel={channel} power={power} volume={volume / 100} hasSignal={hasSignal} />
              </div>
              
              <div className="absolute inset-0 pointer-events-none z-20" style={{
                background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.1) 50%), linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.01), rgba(0,0,255,0.03))',
                backgroundSize: '100% 4px, 3px 100%'
              }} />
              <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.8)] pointer-events-none" />
              <div className="absolute top-10 left-20 w-[400px] h-[300px] bg-white/10 blur-[100px] -rotate-12 rounded-full pointer-events-none" />
            </div>
          </div>

          <div className="w-[220px] h-full flex flex-col items-center justify-between py-6 bg-[#2d1e14]/30 rounded-[30px] border border-white/5">
            
            <div className="flex flex-col gap-12 items-center w-full mt-4">
              <div className="flex flex-col items-center gap-4 z-10 w-full relative group">
                <RotaryKnob steps={12} value={channel} onChange={setChannel} type="clicky" />
                <div className="absolute -bottom-6 w-full text-center font-mono text-[10px] text-[#8b6b55] uppercase tracking-widest">Channel</div>
              </div>

              <div className="flex flex-col items-center gap-4 z-10 w-full relative group mt-4">
                <RotaryKnob steps={100} value={volume} onChange={setVolume} type="smooth" />
                <div className="absolute -bottom-6 w-full text-center font-mono text-[10px] text-[#8b6b55] uppercase tracking-widest">Volume</div>
              </div>
            </div>

            <div className="w-full px-6 flex flex-col gap-4">
              <div className="h-[100px] w-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #1a110a 0px, #1a110a 2px, transparent 2px, transparent 6px)' }} />
              
              <div className="flex justify-between items-center px-2 mt-4">
                <ToggleSwitch checked={power} onChange={setPower} />
                <div className="flex gap-1.5 flex-wrap justify-end w-12">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute -bottom-16 left-20 w-16 h-16 bg-[#2d1e14] rounded-t-lg shadow-2xl" />
        <div className="absolute -bottom-16 right-20 w-16 h-16 bg-[#2d1e14] rounded-t-lg shadow-2xl" />

      </div>
    </div>
  );
};
