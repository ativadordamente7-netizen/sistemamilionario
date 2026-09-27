import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { VIDEO_ID } from '../config';
import { VslPlaybackState } from '../types';

interface VslPlayerProps {
  onPlayStarted: () => void;
  playbackState: VslPlaybackState;
  setPlaybackState: (state: VslPlaybackState) => void;
  hasStarted: boolean;
  elapsedSeconds?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVideoEnded?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VslPlayer: React.FC<VslPlayerProps> = ({
  onPlayStarted,
  playbackState,
  setPlaybackState,
  hasStarted,
  onTimeUpdate,
  onVideoEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const playerRef = useRef<any>(null);
  const lastWatchedTimeRef = useRef<number>(0);

  // Load YouTube Iframe API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      setIsApiReady(true);
    };
  }, []);

  const handleStartPlay = () => {
    setIsPlaying(true);
    setPlaybackState('playing');
    onPlayStarted();
  };

  // When playback starts and YouTube API is ready, attach API listener to track video states
  useEffect(() => {
    if (!hasStarted || !isApiReady || !window.YT) return;

    try {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player('vsl-youtube-player-iframe', {
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event: any) => {
              try {
                event.target.playVideo();
                lastWatchedTimeRef.current = 0;
                const dur = event.target.getDuration?.();
                if (dur && dur > 0) {
                  onTimeUpdate?.(0, dur);
                }
              } catch {
                // Autoplay bloqueado pelo navegador é esperado; sem ação necessária.
              }
            },
            onStateChange: (event: any) => {
              // 1 = playing, 2 = paused, 0 = ended
              if (event.data === 1) {
                setPlaybackState('playing');
                setIsPlaying(true);
                const curr = event.target.getCurrentTime?.() || 0;
                const dur = event.target.getDuration?.() || 1419;
                onTimeUpdate?.(curr, dur);
              } else if (event.data === 2) {
                setPlaybackState('paused');
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Vídeo finalizado completamente
                setPlaybackState('ended');
                setIsPlaying(false);
                const dur = event.target.getDuration?.() || 1419;
                onTimeUpdate?.(dur, dur);
                onVideoEnded?.();
              }
            },
          },
        });
      }
    } catch {
      // Falha ao inicializar o wrapper do player; sem ação necessária.
    }
  }, [hasStarted, isApiReady, setPlaybackState]);

  // Strict anti-seek enforcement: prevents user from jumping forward or backward
  useEffect(() => {
    if (!hasStarted) return;

    const interval = setInterval(() => {
      try {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration?.() || 1419;
          onTimeUpdate?.(currentTime, duration);

          const state = playerRef.current.getPlayerState?.();

          // While video is actively playing (state === 1)
          if (state === 1) {
            const delta = currentTime - lastWatchedTimeRef.current;
            // Block advancing (> 1.5s leap) and block rewinding (< -1.0s backwards)
            if (delta > 1.5 || delta < -1.0) {
              playerRef.current.seekTo(lastWatchedTimeRef.current, true);
            } else {
              lastWatchedTimeRef.current = currentTime;
            }
          }
        }
      } catch (e) {
        // Silently handle any iframe cross-origin timing quirks
      }
    }, 250);

    return () => clearInterval(interval);
  }, [hasStarted, onTimeUpdate]);

  // Safe Play/Pause toggle on screen tap without exposing any scrubber or seek
  const handleTogglePlayPause = () => {
    if (!playerRef.current) return;
    try {
      const state = playerRef.current.getPlayerState?.();
      if (state === 1) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        setPlaybackState('paused');
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
        setPlaybackState('playing');
      }
    } catch {
      // Falha ao alternar play/pause via API; sem ação necessária.
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 select-none">
      {/* Glow aura surrounding the device frame */}
      <div className="relative group flex justify-center">
        <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-b from-[#E7CF9B]/30 via-[#FFFFFF]/50 to-[#C8A45D]/25 blur-2xl rounded-[36px] opacity-75 pointer-events-none" />

        {/* Premium Device Frame Container (9:16 Vertical Ratio) */}
        <div 
          className="vsl-device-frame relative w-[280px] min-[380px]:w-[310px] sm:w-[340px] md:w-[350px] aspect-[9/16] overflow-hidden flex items-center justify-center transition-all duration-500"
          style={{
            maxWidth: '100vw',
            maxHeight: 'calc(78vh - 80px)',
          }}
        >
          {/* Subtle metallic reflection streak across the frame glass */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none z-20" />

          {/* Player Container */}
          <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-[#111317]">
            {/* If video hasn't started yet, display custom high-craft thumbnail & PLAY trigger */}
            {!hasStarted ? (
              <div 
                className="relative w-full h-full cursor-pointer overflow-hidden flex flex-col items-center justify-center"
                onClick={handleStartPlay}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStartPlay();
                  }
                }}
                aria-label="Iniciar VSL do Infinity Million com áudio"
              >
                {/* Background Poster Image with elegant system overlay */}
                <img 
                  src={`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`}
                  alt="Infinity Million VSL Preview"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.82] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Ethereal Pearl Sheen Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#161410]/85 via-black/30 to-black/50" />

                {/* Subtle cosmic grid & golden rings inside pre-play */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-44 h-44 rounded-full border border-[#C8A45D]/30 animate-pulse" />
                  <div className="absolute w-60 h-60 rounded-full border border-white/20" />
                </div>

                {/* Central Play Button */}
                <div className="relative z-10 flex flex-col items-center justify-center group/btn">
                  {/* Glowing pulsing outer halo */}
                  <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#C8A45D]/25 blur-xl animate-pulse" />

                  {/* Translucent Glass Circle with Gold Rim */}
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white/25 backdrop-blur-md border border-[#F4E3B8] shadow-[0_0_30px_rgba(200,164,93,0.4)] flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white/40">
                    {/* Inner glowing core */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#F1E8D2] flex items-center justify-center shadow-inner">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 text-[#916B1E] fill-[#916B1E] translate-x-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                    </div>
                  </div>

                  {/* Micro label below play button */}
                  <span className="mt-4 text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#F3EEE3] uppercase font-['Outfit'] drop-shadow">
                    CLIQUE PARA ASSISTIR
                  </span>
                </div>
              </div>
            ) : (
              /* When playing, the YouTube iframe is active with blocked timeline */
              <div className="w-full h-full relative">
                {/* Transparent Security Shield: prevents scrubbing, timeline touches and double-tap skips */}
                <div 
                  className="absolute inset-0 z-30 cursor-pointer flex items-center justify-center"
                  onClick={handleTogglePlayPause}
                  aria-label={isPlaying ? "Pausar vídeo" : "Continuar vídeo"}
                >
                  {/* Floating badge when video is paused */}
                  {!isPlaying && (
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-[#C8A45D]/60 text-white shadow-2xl animate-in fade-in zoom-in-95">
                      <Play className="w-4 h-4 text-[#F3E2B8] fill-[#F3E2B8]" />
                      <span className="text-xs font-semibold uppercase tracking-wider font-['Outfit'] text-[#F3E2B8]">
                        Clique para continuar
                      </span>
                    </div>
                  )}
                </div>

                <iframe 
                  id="vsl-youtube-player-iframe"
                  className="w-full h-full border-0 pointer-events-none"
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&enablejsapi=1`}
                  title="Infinity Million VSL"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


