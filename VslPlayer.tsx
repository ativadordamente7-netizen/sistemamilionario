import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, CheckCircle, Eye, ShieldCheck } from 'lucide-react';
import { VslState, VslLifecycleStage } from '../types';
import { parseAndSanitizeVideoUrl } from '../utils/videoUtils';
import { DynamicVideoTimer } from './DynamicVideoTimer';
import { VslSynchronizedTimer } from './VslSynchronizedTimer';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface VslPlayerProps {
  vslState: VslState;
  setVslState: React.Dispatch<React.SetStateAction<VslState>>;
  customEmbedUrl?: string;
  videoFormat?: 'reels' | 'widescreen';
  showDevTestButton?: boolean;
  liveViewersCount?: number;
  delayBeforeEndSeconds?: number;
  onButtonReveal?: () => void;
  onCheckoutClick?: () => void;
}

const DEFAULT_OFFICIAL_VSL = 'https://youtu.be/mlNRsqImVLs';

const VslPlayerComponent: React.FC<VslPlayerProps> = ({
  vslState,
  setVslState,
  customEmbedUrl = DEFAULT_OFFICIAL_VSL,
  videoFormat = 'widescreen',
  liveViewersCount = 1482,
  delayBeforeEndSeconds = 180,
  onButtonReveal,
  onCheckoutClick,
}) => {
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
  const [useFallbackIframe, setUseFallbackIframe] = useState(false);
  const [isAudioActivating, setIsAudioActivating] = useState(false);
  
  const ytPlayerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const fallbackIframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasRevealedRef = useRef<boolean>(Boolean(vslState.buttonRevealed));
  const onButtonRevealRef = useRef(onButtonReveal);

  const videoUrlToUse = customEmbedUrl || DEFAULT_OFFICIAL_VSL;
  const { embedUrl, isDirectVideo, videoType, youtubeId, fallbackEmbedUrl } = parseAndSanitizeVideoUrl(videoUrlToUse);

  useEffect(() => {
    onButtonRevealRef.current = onButtonReveal;
  }, [onButtonReveal]);

  useEffect(() => {
    if (vslState.buttonRevealed) {
      hasRevealedRef.current = true;
    }
  }, [vslState.buttonRevealed]);

  const triggerReveal = useCallback(() => {
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;

    setVslState((prev) => {
      if (prev.buttonRevealed && prev.lifecycleStage === 'PAGE_UNLOCKED') return prev;
      return {
        ...prev,
        buttonRevealed: true,
        isEnded: true,
        lifecycleStage: 'PAGE_UNLOCKED',
      };
    });

    if (onButtonRevealRef.current) {
      onButtonRevealRef.current();
    }
  }, [setVslState]);

  // Handle high-frequency progress sync and 5-state lifecycle calculation
  const updateProgressSync = useCallback((currentTime: number, duration: number) => {
    if (typeof currentTime !== 'number' || isNaN(currentTime) || currentTime < 0) return;

    const dur = (typeof duration === 'number' && duration > 0) ? duration : (vslState.duration || 900);
    const remaining = Math.max(0, dur - currentTime);

    let nextStage: VslLifecycleStage = 'VIDEO_PLAYING';
    let shouldUnlock = false;

    if (remaining <= 0 || currentTime >= dur - 0.5) {
      nextStage = 'PAGE_UNLOCKED';
      shouldUnlock = true;
    } else if (remaining <= delayBeforeEndSeconds) {
      nextStage = 'FINAL_3_MINUTES';
      shouldUnlock = true;
    } else {
      nextStage = 'VIDEO_PLAYING';
    }

    setVslState((prev) => {
      const roundedCur = Math.floor(currentTime);
      const roundedDur = Math.round(dur);
      const roundedRem = Math.floor(remaining);

      // Avoid unnecessary re-renders if values have not changed
      if (
        prev.currentTime === roundedCur &&
        prev.duration === roundedDur &&
        prev.remainingSeconds === roundedRem &&
        prev.lifecycleStage === nextStage &&
        prev.buttonRevealed === (prev.buttonRevealed || shouldUnlock)
      ) {
        return prev;
      }

      return {
        ...prev,
        currentTime: roundedCur,
        duration: roundedDur,
        remainingSeconds: roundedRem,
        lifecycleStage: prev.buttonRevealed ? 'PAGE_UNLOCKED' : nextStage,
        buttonRevealed: prev.buttonRevealed || shouldUnlock,
        isEnded: prev.isEnded || shouldUnlock,
      };
    });

    if (shouldUnlock) {
      triggerReveal();
    }
  }, [triggerReveal, setVslState, vslState.duration, delayBeforeEndSeconds]);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (videoType !== 'youtube' || !youtubeId) return;

    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const onYouTubeReady = () => {
      setIsApiReady(true);
    };

    // Listen for global callback if not yet ready
    window.onYouTubeIframeAPIReady = onYouTubeReady;

    const existingScript = document.getElementById('youtube-iframe-api-script');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(tag, firstScript);
    }

    // Safety fallback timer if API script is blocked
    const fallbackTimer = setTimeout(() => {
      if (!window.YT) {
        setUseFallbackIframe(true);
      }
    }, 4000);

    return () => clearTimeout(fallbackTimer);
  }, [videoType, youtubeId]);

  // Initialize YouTube Player once API is ready
  useEffect(() => {
    if (!isApiReady || videoType !== 'youtube' || !youtubeId || useFallbackIframe) return;

    let isMounted = true;
    const playerId = 'youtube-vsl-player-node';

    const playerContainer = document.getElementById(playerId);
    if (!playerContainer) return;

    // Destroy existing player instance if re-initializing
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch {}
      ytPlayerRef.current = null;
    }

    try {
      // Create YouTube Player instance with clean parameters
      ytPlayerRef.current = new window.YT.Player(playerId, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 0,
          mute: 1, // Fica mudo até o clique real do usuário iniciar o vídeo
          playsinline: 1,
          enablejsapi: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          fs: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            if (!isMounted) return;
            setIsPlayerInitialized(true);
            try {
              const dur = event.target.getDuration();
              if (dur && dur > 0) {
                setVslState((prev) => ({
                  ...prev,
                  duration: Math.round(dur),
                }));
              }
            } catch {}
          },
          onStateChange: (event: any) => {
            if (!isMounted) return;
            const state = event.data;

            // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
            if (state === 1) {
              setVslState((prev) => ({
                ...prev,
                isPlaying: true,
                hasStarted: true,
              }));
              try {
                const cur = event.target.getCurrentTime();
                const dur = event.target.getDuration();
                updateProgressSync(cur, dur);
              } catch {}
            } else if (state === 2) {
              setVslState((prev) => ({
                ...prev,
                isPlaying: false,
              }));
              try {
                const cur = event.target.getCurrentTime();
                const dur = event.target.getDuration();
                updateProgressSync(cur, dur);
              } catch {}
            } else if (state === 0) {
              // Video ended
              triggerReveal();
              setVslState((prev) => ({
                ...prev,
                isPlaying: false,
                isEnded: true,
                buttonRevealed: true,
                lifecycleStage: 'PAGE_UNLOCKED',
              }));
            }
          },
          onError: () => {
            if (isMounted) {
              setUseFallbackIframe(true);
            }
          },
        },
      });
    } catch {
      if (isMounted) {
        setUseFallbackIframe(true);
      }
    }

    return () => {
      isMounted = false;
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
      }
    };
  }, [isApiReady, youtubeId, videoType, useFallbackIframe, updateProgressSync, triggerReveal, setVslState]);

  // High-precision sync ticker (runs when YouTube player is active)
  useEffect(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    if (videoType === 'youtube' && !useFallbackIframe) {
      syncIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
          try {
            const playerState = ytPlayerRef.current.getPlayerState();
            const cur = ytPlayerRef.current.getCurrentTime();
            const dur = ytPlayerRef.current.getDuration();

            if (typeof cur === 'number' && !isNaN(cur)) {
              updateProgressSync(cur, dur);
            }

            // Sync playing state if out of sync
            if (playerState === 1 && !vslState.isPlaying) {
              setVslState((prev) => ({ ...prev, isPlaying: true }));
            } else if (playerState === 2 && vslState.isPlaying) {
              setVslState((prev) => ({ ...prev, isPlaying: false }));
            }
          } catch {}
        }
      }, 350);
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [videoType, useFallbackIframe, vslState.isPlaying, updateProgressSync, setVslState]);

  // Fallback YouTube postMessage listener (if API is not used)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      let data = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      const reportedTime =
        typeof data.data?.seconds === 'number'
          ? data.data.seconds
          : typeof data.info?.currentTime === 'number'
          ? data.info.currentTime
          : typeof data.currentTime === 'number'
          ? data.currentTime
          : null;

      const dur =
        typeof data.data?.duration === 'number'
          ? data.data.duration
          : typeof data.info?.duration === 'number'
          ? data.info.duration
          : typeof data.duration === 'number'
          ? data.duration
          : null;

      if (reportedTime !== null && reportedTime >= 0) {
        updateProgressSync(reportedTime, dur || vslState.duration || 900);
      }

      if (data.event === 'finish' || data.event === 'ended') {
        triggerReveal();
        setVslState((prev) => ({
          ...prev,
          isPlaying: false,
          isEnded: true,
          buttonRevealed: true,
          lifecycleStage: 'PAGE_UNLOCKED',
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [updateProgressSync, triggerReveal, setVslState, vslState.duration]);

  // Direct HTML5 Video Event Listeners (if MP4 is provided)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isDirectVideo) return;

    const handleTime = () => {
      updateProgressSync(video.currentTime, video.duration);
    };

    const handleEnded = () => {
      triggerReveal();
      setVslState((prev) => ({
        ...prev,
        isPlaying: false,
        isEnded: true,
        buttonRevealed: true,
        lifecycleStage: 'PAGE_UNLOCKED',
      }));
    };

    const handlePlay = () => setVslState((prev) => ({ ...prev, isPlaying: true }));
    const handlePause = () => setVslState((prev) => ({ ...prev, isPlaying: false }));

    video.addEventListener('timeupdate', handleTime);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTime);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isDirectVideo, updateProgressSync, triggerReveal, setVslState]);

  // Unmute & Audio Activation Trigger
  const handleUnmuteAudio = useCallback(() => {
    setIsAudioActivating(true);

    if (ytPlayerRef.current && typeof ytPlayerRef.current.unMute === 'function') {
      try {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(100);
        ytPlayerRef.current.playVideo();
      } catch {}
    }

    if (fallbackIframeRef.current?.contentWindow) {
      try {
        const win = fallbackIframeRef.current.contentWindow;
        win.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
        win.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
        win.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
      } catch {}
    }

    if (videoRef.current) {
      try {
        videoRef.current.muted = false;
        videoRef.current.volume = 1;
        videoRef.current.play().catch(() => {});
      } catch {}
    }

    setVslState((prev) => ({
      ...prev,
      isMuted: false,
      isPlaying: true,
      hasStarted: true,
    }));

    setTimeout(() => {
      setIsAudioActivating(false);
    }, 250);
  }, [setVslState]);

  // Toggle Mute
  const toggleMute = () => {
    const nextMuted = !vslState.isMuted;
    if (ytPlayerRef.current) {
      try {
        if (nextMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(100);
        }
      } catch {}
    }

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }

    setVslState((prev) => ({ ...prev, isMuted: nextMuted }));
  };

  // Exclusively 9:16 Vertical Format (Reels / VSL Mobile)
  // 'native' = fonte já é 9:16 (preenche 100% sem cortar e sem tarja) — padrão, pois o vídeo atual já é vertical
  // 'immersive' = fonte horizontal 16:9 com zoom/corte para preencher o quadro vertical
  // 'ambient' = fonte horizontal 16:9 exibida inteira, com tarja decorativa nas bordas
  const [verticalMode, setVerticalMode] = useState<'native' | 'immersive' | 'ambient'>('native');

  const containerWidthClass = 'w-full max-w-[340px] xs:max-w-[370px] sm:max-w-[400px] md:max-w-[420px] lg:max-w-[430px] mx-auto my-1 sm:my-2 px-2 sm:px-0';

  const aspectClass = 'aspect-[9/16] max-h-[75vh] xs:max-h-[78vh] sm:max-h-[82vh] md:max-h-[86vh]';

  const isUnlocked = vslState.buttonRevealed || vslState.isEnded || vslState.lifecycleStage === 'PAGE_UNLOCKED';

  return (
    <div className={`${containerWidthClass} box-border overflow-x-hidden flex flex-col items-center animate-portal-vsl`}>
      
      {/* VSL Outer Celestial Card Frame - Exclusively 9:16 Vertical */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-sky-400/40 shadow-[0_0_40px_rgba(56,189,248,0.25),0_0_80px_rgba(2,132,199,0.15)] ring-1 ring-white/10 select-none">
        
        {/* Top HUD Status Bar - Strictly 9:16 */}
        <div className="bg-slate-950/95 border-b border-sky-400/30 px-3 py-1.5 sm:py-2 flex items-center justify-between text-[10px] sm:text-xs font-mono text-slate-300 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
              AO VIVO • 9:16 VERTICAL
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVerticalMode((prev) =>
                  prev === 'native' ? 'immersive' : prev === 'immersive' ? 'ambient' : 'native'
                );
              }}
              className="px-2 py-0.5 rounded-full bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 hover:text-white text-[9px] font-mono font-bold uppercase tracking-wider border border-sky-400/40 transition-all cursor-pointer shadow-sm"
              title="Alternar entre 9:16 Nativo, Preenchido e Ajustado"
            >
              {verticalMode === 'native' ? '9:16 Nativo' : verticalMode === 'immersive' ? '9:16 Preenchido' : '9:16 Ajustado'}
            </button>
            <div className="flex items-center gap-1 text-sky-200 font-semibold text-[10px]">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>INFINITY MILLION</span>
            </div>
          </div>
        </div>

        {/* Video Screen Container - Strictly 9:16 Aspect Ratio */}
        <div
          ref={playerContainerRef}
          className={`relative ${aspectClass} w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden`}
        >
          {/* Ambient Background Aura / Reflection Canvas for 9:16 */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#071329] via-[#020617] to-[#0a1930] opacity-95" />
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-sky-400/15 via-sky-500/5 to-transparent blur-xl" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-sky-400/15 via-sky-500/5 to-transparent blur-xl" />
            {/* Dynamic Cyber Equalizer Waveform bars top & bottom when in ambient fit mode */}
            {verticalMode === 'ambient' && (
              <>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-60">
                  <span className="w-1 bg-sky-400 rounded-full animate-audio-wave-1" />
                  <span className="w-1 bg-sky-300 rounded-full animate-audio-wave-2" />
                  <span className="w-1 bg-sky-200 rounded-full animate-audio-wave-3" />
                  <span className="w-1 bg-sky-400 rounded-full animate-audio-wave-4" />
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-60">
                  <span className="w-1 bg-amber-400 rounded-full animate-audio-wave-2" />
                  <span className="w-1 bg-amber-300 rounded-full animate-audio-wave-4" />
                  <span className="w-1 bg-amber-200 rounded-full animate-audio-wave-1" />
                  <span className="w-1 bg-amber-400 rounded-full animate-audio-wave-3" />
                </div>
              </>
            )}
          </div>

          {/* YouTube Player Target - Exclusively 9:16 Vertical */}
          {videoType === 'youtube' ? (
            <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
              <iframe
                id="youtube-vsl-player-node"
                ref={fallbackIframeRef}
                src={embedUrl}
                loading="eager"
                className="w-full h-full border-0 pointer-events-auto"
                style={
                  verticalMode === 'native'
                    ? {
                        width: '100%',
                        height: '100%',
                      }
                    : verticalMode === 'immersive'
                    ? {
                        width: '316.05%',
                        height: '100%',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: 'none',
                      }
                    : {
                        width: '100%',
                        height: 'auto',
                        aspectRatio: '16/9',
                      }
                }
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Infinity Million VSL (9:16)"
              />
            </div>
          ) : isDirectVideo ? (
            <video
              ref={videoRef}
              src={embedUrl}
              muted={vslState.isMuted}
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              preload="auto"
              className={`bg-black select-none pointer-events-auto ${
                verticalMode === 'ambient'
                  ? 'w-full aspect-video object-contain'
                  : 'w-full h-full object-cover'
              }`}
            />
          ) : (
            <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
              <iframe
                ref={fallbackIframeRef}
                src={useFallbackIframe && fallbackEmbedUrl ? fallbackEmbedUrl : embedUrl}
                loading="eager"
                className="border-0 pointer-events-auto"
                style={
                  verticalMode === 'native'
                    ? {
                        width: '100%',
                        height: '100%',
                      }
                    : verticalMode === 'immersive'
                    ? {
                        width: '316.05%',
                        height: '100%',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: 'none',
                      }
                    : {
                        width: '100%',
                        height: 'auto',
                        aspectRatio: '16/9',
                      }
                }
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Infinity Million VSL (9:16)"
              />
            </div>
          )}

          {/* Quick Floating Unmute/Sound Pill (Available directly in video) */}
          {vslState.hasStarted && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (vslState.isMuted) {
                  handleUnmuteAudio();
                } else {
                  toggleMute();
                }
              }}
              className="absolute bottom-3 right-3 z-30 px-3 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-amber-400/60 text-amber-200 text-[11px] font-mono font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all active:scale-95 cursor-pointer"
              title={vslState.isMuted ? 'Ativar Áudio' : 'Desativar Áudio'}
            >
              {vslState.isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-amber-300">CLIQUE PARA LIGAR O SOM</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">ÁUDIO ATIVADO</span>
                </>
              )}
            </button>
          )}

          {/* Tela de Início: cobre o vídeo até o clique real do usuário — só então o vídeo toca, com som, e o cronômetro começa */}
          {!vslState.hasStarted && (
            <div
              onClick={handleUnmuteAudio}
              className={`absolute inset-0 bg-slate-950/70 hover:bg-slate-950/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-opacity duration-200 ${
                isAudioActivating ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_35px_rgba(255,215,0,0.6)] flex items-center justify-center mb-4 hover:scale-110 transition-transform active:scale-95">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-9 sm:h-9 text-slate-950 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-950/90 border-2 border-amber-300/80 shadow-[0_0_25px_rgba(255,215,0,0.5)] flex items-center gap-2.5 text-amber-200">
                <Volume2 className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider block text-white">
                    TOQUE PARA COMEÇAR
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono block">
                    Apresentação oficial com áudio de alta definição
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Live Viewers Indicator Footer Bar */}
        <div className="bg-slate-950 border-t border-sky-400/20 py-2 px-3 flex items-center justify-center text-xs text-slate-300">
          <div className="w-full flex items-center justify-center py-1 px-3 bg-slate-900/90 rounded-full border border-sky-400/20 text-[10px] sm:text-[11px] text-slate-300 whitespace-nowrap shadow-inner">
            <span className="relative flex h-2 w-2 shrink-0 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Eye className="w-3 h-3 text-sky-300 shrink-0 mr-1" />
            <span className="font-mono font-bold text-sky-200 mr-1">{liveViewersCount.toLocaleString()}</span>
            <span className="text-slate-300 truncate">usuários assistindo ao vivo agora</span>
          </div>
        </div>

      </div>

      {/* CRONÔMETRO SINTONIZADO COM A VSL */}
      <VslSynchronizedTimer
        vslState={vslState}
        onUnlockOffer={triggerReveal}
      />

      {/* REVEAL OFFER BUTTON: Appears immediately when video reaches the end (PAGE_UNLOCKED) */}
      {isUnlocked && (
        <div
          id="unlocked-vsl-banner"
          className="w-full mt-5 text-center animate-vortex-reveal max-w-lg mx-auto space-y-3.5 px-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>APRESENTAÇÃO CONCLUÍDA • ACESSO E BÔNUS LIBERADOS</span>
          </div>

          {/* Dynamic Synchronized Urgency Countdown Timer for Offer */}
          <DynamicVideoTimer
            isRevealed={true}
            initialMinutes={15}
            spotsRemaining={7}
          />

          {/* Primary High-Impact CTA Button */}
          <button
            id="vsl-primary-cta-button"
            onClick={() => {
              if (onCheckoutClick) {
                onCheckoutClick();
              } else {
                const offerElem = document.getElementById('checkout-offer');
                if (offerElem) {
                  offerElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }
            }}
            className="w-full py-4 sm:py-4.5 px-5 rounded-2xl gold-button-bg text-slate-950 font-black text-base sm:text-lg uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-[0_0_35px_rgba(255,215,0,0.6)] flex items-center justify-center gap-2.5 cursor-pointer border-2 border-amber-200"
          >
            <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950 shrink-0" />
            <span>ATIVAR MEU ACESSO COM DESCONTO AGORA</span>
          </button>
          
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Ambiente 100% Criptografado • Acesso Imediato • Garantia de 7 Dias</span>
          </p>
        </div>
      )}

    </div>
  );
};

export const VslPlayer = memo(VslPlayerComponent);
