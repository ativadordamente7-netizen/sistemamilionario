import React, { memo } from 'react';
import { Flame, Clock, Zap, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { useSynchronizedCountdown } from '../utils/timerUtils';

interface DynamicVideoTimerProps {
  isRevealed: boolean;
  initialMinutes?: number;
  spotsRemaining?: number;
  className?: string;
  onExpire?: () => void;
}

const DynamicVideoTimerComponent: React.FC<DynamicVideoTimerProps> = ({
  isRevealed,
  initialMinutes = 15,
  spotsRemaining = 7,
  className = '',
}) => {
  const {
    totalSeconds,
    minutes,
    seconds,
    centis,
    progressPercent,
    isExpired,
  } = useSynchronizedCountdown(isRevealed, initialMinutes);

  if (!isRevealed) {
    return null;
  }

  const isUrgent = totalSeconds > 0 && totalSeconds <= 180; // under 3 minutes

  const renderDigitBox = (value: number, label: string, isDeci = false) => {
    const formatted = value.toString().padStart(2, '0');

    return (
      <div className="flex flex-col items-center">
        <div className="relative group">
          {/* Subtle Ambient Glow */}
          <div
            className={`absolute -inset-0.5 rounded-xl blur-xs transition-opacity ${
              isUrgent
                ? 'bg-gradient-to-b from-red-500/50 to-amber-500/30 opacity-90'
                : 'bg-gradient-to-b from-amber-500/30 to-amber-300/10 opacity-70 group-hover:opacity-100'
            }`}
          />

          <div
            className={`relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border ${
              isUrgent ? 'border-red-400/90 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'border-amber-400/80 shadow-[inset_0_2px_6px_rgba(255,215,0,0.15),0_4px_12px_rgba(0,0,0,0.6)]'
            } rounded-xl px-2.5 sm:px-4 py-2 sm:py-2.5 min-w-[54px] sm:min-w-[72px] flex items-center justify-center overflow-hidden`}
          >
            {/* Gloss highlight */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-950/90 border-b border-amber-500/20 z-10 pointer-events-none" />

            <span
              className={`font-mono font-black ${
                isDeci
                  ? 'text-amber-400 text-lg sm:text-2xl'
                  : isUrgent
                  ? 'text-red-400 text-2xl sm:text-3xl animate-pulse'
                  : 'gold-gradient-text text-2xl sm:text-3xl'
              } tracking-tight leading-none`}
            >
              {formatted}
            </span>
          </div>
        </div>

        <span
          className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest mt-1.5 text-center ${
            isUrgent ? 'text-red-300' : 'text-slate-300'
          }`}
        >
          {label}
        </span>
      </div>
    );
  };

  const renderSeparator = () => (
    <div className="flex flex-col items-center justify-center gap-1.5 pb-4 px-0.5 sm:px-1">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isUrgent
            ? 'bg-red-400 animate-ping shadow-[0_0_8px_rgba(239,68,68,0.9)]'
            : 'bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(255,215,0,0.8)]'
        }`}
      />
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isUrgent
            ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.9)]'
            : 'bg-amber-400 shadow-[0_0_6px_rgba(255,215,0,0.8)]'
        }`}
      />
    </div>
  );

  return (
    <div
      className={`w-full max-w-lg mx-auto select-none transition-all duration-500 animate-vortex-reveal ${className}`}
      id="dynamic-offer-timer"
    >
      <div
        className={`relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 ${
          isUrgent
            ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.35)]'
            : 'border-amber-400/90 shadow-[0_0_35px_rgba(212,175,55,0.25)]'
        } p-4 sm:p-5 overflow-hidden text-center`}
      >
        {/* Background radial flare */}
        <div
          className={`absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full blur-2xl pointer-events-none ${
            isUrgent ? 'bg-red-500/20' : 'bg-amber-500/15'
          }`}
        />

        {/* Top Urgency Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider mb-2.5 shadow-md border ${
            isUrgent
              ? 'bg-red-500/20 border-red-400/60 text-red-300 animate-bounce'
              : 'bg-amber-500/15 border-amber-400/40 text-amber-300'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isUrgent ? 'bg-red-400 animate-ping' : 'bg-amber-400 animate-pulse'
            }`}
          />
          <Flame className={`w-3.5 h-3.5 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`} />
          <span>
            {isExpired
              ? 'OPORTUNIDADE EXPIRADA'
              : isUrgent
              ? 'ÚLTIMOS MINUTOS DA CONDIÇÃO ESPECIAL'
              : 'OFERTA LIBERADA POR TEMPO LIMITADO'}
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-[11px] sm:text-xs text-slate-200 font-medium max-w-sm mx-auto mb-3 leading-relaxed">
          {isExpired ? (
            <span className="text-red-400 font-bold">
              O tempo promocional foi encerrado. O valor foi restaurado para o preço oficial.
            </span>
          ) : (
            <>
              O desconto especial de <strong className="text-amber-300 font-bold">R$ 1.570,00</strong> e os bônus
              exclusivos expiram quando o cronômetro zerar:
            </>
          )}
        </p>

        {/* Countdown Digits */}
        {!isExpired ? (
          <div className="flex items-center justify-center gap-1 sm:gap-2 my-2">
            {renderDigitBox(minutes, 'Minutos')}
            {renderSeparator()}
            {renderDigitBox(seconds, 'Segundos')}
            {renderSeparator()}
            {renderDigitBox(centis, 'Décimos', true)}
          </div>
        ) : (
          <div className="py-3 px-4 bg-red-950/40 border border-red-500/50 rounded-xl my-2 flex items-center justify-center gap-2 text-red-300 font-mono text-xs">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Contagem regressiva finalizada.</span>
          </div>
        )}

        {/* Dynamic Urgency Progress Bar */}
        {!isExpired && (
          <div className="mt-3 max-w-sm mx-auto">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mb-1 px-1">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Janela de Ativação</span>
              </span>
              <span className={`font-bold ${isUrgent ? 'text-red-400' : 'text-slate-200'}`}>
                {Math.round(progressPercent)}% restante
              </span>
            </div>

            <div className="w-full h-2 bg-slate-950 rounded-full border border-amber-500/30 overflow-hidden p-0.5 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isUrgent
                    ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                    : 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(255,215,0,0.8)]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Micro-urgency Badges */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px] text-slate-300">
          <div className="flex items-center gap-1 text-amber-300 font-bold font-mono">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Restam apenas {spotsRemaining} vagas com este desconto</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 font-mono">
            <ShieldAlert className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Valor garantido apenas nesta contagem</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DynamicVideoTimer = memo(DynamicVideoTimerComponent);
