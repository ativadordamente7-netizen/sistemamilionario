import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CTA_URL, CTA_BUTTON_TEXT, VIDEO_DURATION_SECONDS, LAST_MINUTES_WINDOW_SECONDS } from '../config';
import { VslPlaybackState } from '../types';

interface UnlockCountdownProps {
  hasStarted: boolean;
  isPlaying: boolean;
  elapsedSeconds: number;
  videoDuration?: number;
  playbackState?: VslPlaybackState;
  isUnlocked?: boolean;
  onFastForward?: () => void;
  onUnlockedStateChange?: (unlocked: boolean) => void;
}

export const UnlockCountdown: React.FC<UnlockCountdownProps> = ({
  hasStarted,
  elapsedSeconds,
  videoDuration = VIDEO_DURATION_SECONDS,
  playbackState,
  isUnlocked = false,
  onFastForward,
  onUnlockedStateChange,
}) => {
  // O botão de compra é liberado estritamente nos últimos 3 minutos de vídeo (180 segundos antes do final)
  // ou caso o vídeo já tenha chegado ao final.
  const effectiveDuration = videoDuration > 0 ? videoDuration : VIDEO_DURATION_SECONDS;
  const unlockThreshold = effectiveDuration > LAST_MINUTES_WINDOW_SECONDS
    ? effectiveDuration - LAST_MINUTES_WINDOW_SECONDS
    : 0;

  const isButtonReleased =
    isUnlocked ||
    playbackState === 'ended' ||
    (hasStarted && (
      elapsedSeconds >= unlockThreshold ||
      (effectiveDuration > 0 && (effectiveDuration - elapsedSeconds) <= LAST_MINUTES_WINDOW_SECONDS)
    ));

  React.useEffect(() => {
    if (isButtonReleased && onUnlockedStateChange) {
      onUnlockedStateChange(true);
    }
  }, [isButtonReleased, onUnlockedStateChange]);

  if (!isButtonReleased) {
    return (
      <div className="w-full flex justify-center py-3">
        {hasStarted && onFastForward && (
          <button
            onClick={onFastForward}
            className="text-[9px] text-[#C8A45D]/30 hover:text-[#C8A45D] transition-colors tracking-widest uppercase cursor-pointer"
            title="Avançar tempo para os últimos 3 minutos (Modo Suporte Técnico)"
          >
            [Testar Desbloqueio - Suporte]
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 mt-6 sm:mt-8 mb-12 flex flex-col items-center justify-center text-center select-none animate-in fade-in zoom-in-95 duration-500">
      {/* Container com Efeito de Borda Brilhante Animada (Glow) */}
      <div className="relative group/glow flex items-center justify-center w-full sm:w-auto">
        {/* 1. Aura suave pulsante de alta luminosidade dourada (Ambient Glow) */}
        <div 
          className="absolute -inset-2.5 sm:-inset-3.5 rounded-full animate-aura-glow pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245, 229, 190, 0.85) 0%, rgba(200, 164, 93, 0.65) 45%, rgba(168, 121, 36, 0.25) 75%, transparent 100%)',
          }}
        />

        {/* 2. Borda Dinâmica com feixe de luz rotativo (Glow Beam Border) */}
        <div className="absolute -inset-[3px] rounded-full overflow-hidden pointer-events-none">
          <div 
            className="absolute -inset-[150%] animate-border-glow"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg 40deg, #F5E5BE 90deg, #FFFFFF 140deg, #DDB86C 190deg, #BF923B 240deg, transparent 310deg 360deg)'
            }}
          />
        </div>

        {/* 3. Botão Oficial de Compra e Ativação Exclusivo */}
        <a
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          id="btn-ative-o-sistema-agora"
          className="group relative z-10 w-full sm:w-auto min-w-[300px] sm:min-w-[390px] px-8 py-4 sm:py-5 rounded-full overflow-hidden text-center transition-all duration-300 transform animate-cta-pop-loop hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_20px_45px_rgba(200,164,93,0.55)] active:scale-[0.99] cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #F5E5BE 0%, #DFBA6F 35%, #C2963F 70%, #9B701F 100%)',
            boxShadow: '0 8px 28px rgba(200, 164, 93, 0.38), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Reflexo de luz dinâmico (Shimmer) varrendo o botão */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] animate-shimmer pointer-events-none" />

          {/* Borda interna brilhante */}
          <div className="absolute inset-[1px] rounded-full border border-white/60 pointer-events-none" />

          {/* Conteúdo textual de alta conversão */}
          <div className="relative z-10 flex items-center justify-center space-x-3 text-[#221B0B] group-hover:text-[#110D05]">
            <span className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.16em] sm:tracking-[0.22em] font-['Cinzel'] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              {CTA_BUTTON_TEXT}
            </span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1.5 text-[#3A2C0D]" />
          </div>
        </a>
      </div>
    </div>
  );
};
