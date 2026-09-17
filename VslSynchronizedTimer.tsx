import React, { memo } from 'react';
import { Clock, Sparkles, Play, Pause, ShieldCheck, Zap } from 'lucide-react';
import { VslState } from '../types';

interface VslSynchronizedTimerProps {
  vslState: VslState;
  onUnlockOffer?: () => void;
}

export const VslSynchronizedTimer: React.FC<VslSynchronizedTimerProps> = memo(({
  vslState,
}) => {
  const { currentTime = 0, duration = 900, isPlaying = true, buttonRevealed = false } = vslState;

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const s = Math.max(0, Math.floor(secs));
    const m = Math.floor(s / 60);
    const remainderSecs = s % 60;
    return `${String(m).padStart(2, '0')}:${String(remainderSecs).padStart(2, '0')}`;
  };

  const formattedCurrent = formatTime(currentTime);
  const formattedDuration = formatTime(duration);
  const remaining = Math.max(0, duration - currentTime);
  const formattedRemaining = formatTime(remaining);

  // Percentage of video elapsed
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <div
      id="vsl-synchronized-timer-card"
      className="w-full max-w-xl mx-auto my-3 px-2 sm:px-3 select-none"
    >
      <div className="relative rounded-2xl bg-slate-950/90 border-2 border-sky-400/40 hover:border-sky-400/60 shadow-[0_0_25px_rgba(56,189,248,0.25)] p-3 sm:p-4 backdrop-blur-xl text-center overflow-hidden transition-all duration-300">
        
        {/* Ambient celestial blue & gold glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-transparent to-amber-500/5 pointer-events-none" />

        {/* Top Header Row: Sincronização em tempo real & Status */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5">
            {isPlaying ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400 shadow-[0_0_8px_#38BDF8]" />
              </span>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            )}
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-sky-300">
              {isPlaying ? 'CRONÔMETRO SINTONIZADO AO VIVO' : 'CRONÔMETRO PAUSADO'}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-sky-400/30 text-[10px] font-mono text-slate-300">
            <Clock className="w-3 h-3 text-sky-400" />
            <span>{buttonRevealed ? 'OFERTA LIBERADA' : `RESTAM ${formattedRemaining}`}</span>
          </div>
        </div>

        {/* Big Dual Digital Counter Display */}
        <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3 my-2">
          {/* Box 1: Tempo da Apresentação */}
          <div className="rounded-xl bg-slate-900/95 border border-sky-400/30 p-2 sm:p-2.5 shadow-inner flex flex-col items-center justify-center">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
              <Play className="w-2.5 h-2.5 text-sky-400 fill-sky-400" />
              <span>TEMPO ATUAL</span>
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              {formattedCurrent}
            </span>
            <span className="text-[9px] font-mono text-slate-500">de {formattedDuration}</span>
          </div>

          {/* Box 2: Tempo Regressivo para Liberação */}
          <div className="rounded-xl bg-slate-900/95 border border-amber-400/40 p-2 sm:p-2.5 shadow-inner flex flex-col items-center justify-center">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-300/90 mb-0.5 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span>{buttonRevealed ? 'STATUS' : 'CONDIÇÃO ESPECIAL'}</span>
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">
              {buttonRevealed ? 'LIBERADO' : formattedRemaining}
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              {buttonRevealed ? 'Acesso 100% Ativo' : 'para liberar bônus'}
            </span>
          </div>
        </div>

        {/* Progress Bar Sintonizada com o Vídeo */}
        <div className="relative z-10 w-full mt-2 mb-1">
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_12px_#38BDF8]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1 px-1">
            <span>Início: 00:00</span>
            <span className="text-sky-300 font-semibold">{Math.round(progressPercent)}% Concluído</span>
            <span>Final: {formattedDuration}</span>
          </div>
        </div>

        {/* Legenda Dinâmica de Sincronia */}
        <p className="relative z-10 text-[10px] sm:text-[11px] text-slate-300 font-sans mt-2">
          {isPlaying ? (
            <span className="text-slate-300">
              ⚡ <strong className="text-white">Assista com atenção:</strong> Copie e cole, ative o Sistema Milionário e faça 100 mil em 45 dias.
            </span>
          ) : (
            <span className="text-amber-300 font-medium">
              ⚠️ Vídeo pausado: aperte play para o cronômetro continuar a liberação.
            </span>
          )}
        </p>

      </div>
    </div>
  );
});
