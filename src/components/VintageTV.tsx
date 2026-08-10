import React, { useState, useEffect, useRef } from 'react';
import { CRTScreen } from './CRTScreen';
import { RotaryKnob, ToggleSwitch } from './Controls';
import { YouTubePlayer } from './YouTubePlayer';

const CHANNELS = [
  "4yN-xTnLQec", // 0
  "88EN8oQTweE", // 1
  "aBp_0TsIHvU", // 2
  "C9yE5VsdsrY", // 3
  "cPFJZNWyHkY", // 4
  "DBo1QBjeeIM", // 5
  "dOWoT5gwHkY", // 6
  "eYJLMxlExpA", // 7
  "K3EqIVUyfIU", // 8
  "kxDVDM8R3vE", // 9
  "LOPNr56YzdE", // 10
  "tgW1WUdbgJ4", // 11
];

export const VintageTV = () => {
  const [channel, setChannel] = useState(3);
  const [power, setPower] = useState(false);
  const [volume, setVolume] = useState(50);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isReadyRef = useRef(false);
  const [playerState, setPlayerState] = useState<number>(-1);
  const playerRef = useRef<any>(null);

  const [channelBlink, setChannelBlink] = useState(false);
  const [volumeBlink, setVolumeBlink] = useState(false);
  const [internetBlink, setInternetBlink] = useState(false);

  useEffect(() => {
    if (!power) return;
    setChannelBlink(true);
    const t = setTimeout(() => setChannelBlink(false), 200);
    return () => clearTimeout(t);
  }, [channel, power]);

  useEffect(() => {
    if (!power) return;
    setVolumeBlink(true);
    const t = setTimeout(() => setVolumeBlink(false), 200);
    return () => clearTimeout(t);
  }, [volume, power]);

  useEffect(() => {
    if (!power) {
      setInternetBlink(false);
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    const loop = () => {
      setInternetBlink(prev => !prev);
      timeout = setTimeout(loop, Math.random() * 300 + 50);
    };
    loop();
    return () => clearTimeout(timeout);
  }, [power]);

  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  useEffect(() => {
    setIsReady(false);
    setHasError(false);
    setPlayerState(-1);
    
    // Timeout fallback if video fails to load or start playing
    const timeout = setTimeout(() => {
      if (!isReadyRef.current) setHasError(true);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [channel]);

  const hasSignal = !hasError && isReady;

  useEffect(() => {
    if (isReady) {
      setHasError(false); // clear any timeout error if we are ready
    }
  }, [isReady]);

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

      <div className="relative w-[1040px] h-[640px] bg-[#4a3221] rounded-[60px] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),inset_0_4px_10px_rgba(255,255,255,0.1)] border-b-[12px] border-[#2d1e14] border-t-[2px] border-[#5d4037]">
        
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
                <YouTubePlayer
                  videoId={CHANNELS[channel]}
                  playing={power}
                  volume={volume}
                  muted={!power || volume === 0}
                  onReady={(player: any) => { 
                    playerRef.current = player;
                    setIsReady(true); 
                    setHasError(false); 
                  }}
                  onStateChange={(state: number) => {
                    setPlayerState(state);
                    // 1 = PLAYING, 3 = BUFFERING, 5 = CUED
                    if (state === 1 || state === 3 || state === 5) {
                      setIsReady(true);
                    }
                  }}
                  onError={(e: any) => {
                    setHasError(true);
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
            
            <div className="flex flex-col gap-4 items-center w-full">
              <div className="flex flex-col items-center gap-3 z-10 w-full group">
                <RotaryKnob steps={12} value={channel} onChange={setChannel} type="clicky" />
                <div className="w-full text-center font-mono text-[10px] text-[#8b6b55] uppercase tracking-widest">Channel</div>
              </div>

              <div className="flex flex-col items-center gap-3 z-10 w-full group">
                <RotaryKnob steps={100} value={volume} onChange={setVolume} type="smooth" />
                <div className="w-full text-center font-mono text-[10px] text-[#8b6b55] uppercase tracking-widest">Volume</div>
              </div>
            </div>

            <div className="w-full px-6 flex flex-col gap-4">
              <div className="h-[80px] w-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #1a110a 0px, #1a110a 2px, transparent 2px, transparent 6px)' }} />
              
              <div className="flex justify-between items-center px-2 mt-2">
                <ToggleSwitch checked={power} onChange={(val) => {
                  setPower(val);
                  if (playerRef.current) {
                    if (val) {
                      playerRef.current.unMute();
                      playerRef.current.playVideo();
                    } else {
                      playerRef.current.mute();
                      playerRef.current.pauseVideo();
                    }
                  }
                }} />
                <div className="flex gap-1.5 flex-wrap justify-end w-12">
                   {/* Power LED */}
                   <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${power ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[#111]'}`} />
                   {/* Internet/Frequency LED */}
                   <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-75 ${internetBlink ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-[#111]'}`} />
                   {/* Channel LED */}
                   <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-100 ${channelBlink ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-[#111]'}`} />
                   {/* Volume LED */}
                   <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-100 ${volumeBlink ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-[#111]'}`} />
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
