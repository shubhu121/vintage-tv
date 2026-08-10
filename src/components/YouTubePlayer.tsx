import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  playing: boolean;
  volume: number;
  muted: boolean;
  onReady?: (player: any) => void;
  onError?: (error: any) => void;
  onStateChange?: (state: number) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  playing,
  volume,
  muted,
  onReady,
  onError,
  onStateChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [apiReady, setApiReady] = useState(false);

  // Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const scriptId = 'youtube-iframe-api';
    if (!document.getElementById(scriptId)) {
      const tag = document.createElement('script');
      tag.id = scriptId;
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
    } else {
      const checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          setApiReady(true);
          clearInterval(checkYT);
        }
      }, 100);
      return () => clearInterval(checkYT);
    }
  }, []);

  // Initialize Player
  useEffect(() => {
    if (!apiReady || !containerRef.current) return;

    if (playerRef.current) {
      return;
    }

    let origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (origin === 'null' || !origin.startsWith('http')) {
      origin = '';
    }

    const playerVars: any = {
      autoplay: 1, 
      controls: 0, 
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      playsinline: 1,
    };
    if (origin) {
      playerVars.origin = origin;
    }

    const el = document.createElement('div');
    el.style.width = '100%';
    el.style.height = '100%';
    containerRef.current.appendChild(el);

    playerRef.current = new window.YT.Player(el, {
      videoId: videoId,
      playerVars: playerVars,
      events: {
        onReady: (event: any) => {
          if (muted) {
            event.target.mute();
          } else {
            event.target.unMute();
            event.target.setVolume(volume);
          }
          if (playing) {
            event.target.playVideo();
          } else {
            event.target.pauseVideo();
          }
          if (onReady) onReady(event.target);
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            event.target.playVideo();
          }
          if (onStateChange) onStateChange(event.data);
        },
        onError: (event: any) => {
          if (onError) onError(event.data);
        },
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [apiReady]);

  // Handle videoId change
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      if (playing) {
        playerRef.current.loadVideoById(videoId);
      } else {
        playerRef.current.cueVideoById(videoId);
      }
    }
  }, [videoId]);

  // Handle playing state
  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      if (playing) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [playing]);

  // Handle volume and mute
  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      if (muted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    }
  }, [volume, muted]);

  return (
    <div className="w-[145%] max-w-none aspect-video pointer-events-none z-0 flex-shrink-0 bg-black">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
