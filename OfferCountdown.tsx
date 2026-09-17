import React, { useState, useEffect, memo } from 'react';
import { Clock, Flame, Zap, Sparkles, ShieldAlert } from 'lucide-react';
import { getRemainingOfferSeconds } from '../utils/timerUtils';

interface OfferCountdownProps {
  initialMinutes?: number;
  spotsRemaining?: number;
  variant?: 'prominent' | 'card' | 'compact' | 'bar';
  title?: string;
  subtitle?: string;
  className?: string;
}

const OfferCountdownComponent: React.FC<OfferCountdownProps> = ({
  initialMinutes = 15,
  spotsRemaining = 7,
  variant = 'prominent',
  title = 'CONDIÇÃO ESPECIAL POR TEMPO LIMITADO',
  subtitle = 'O desconto promocional e os 2 bônus exclusivos expiram quando o cronômetro zerar:',
  className = '',
}) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(() => {
    return getRemainingOfferSeconds(initialMinutes);
  });

  const [centis, setCentis] = useState<number>(9);

  // Optimized 1-second interval for countdown timer synchronized with reveal
  useEffect(() => {
    if (totalSeconds <= 0) return;
    const interval = setInterval(() => {
      setTotalSeconds(() => {
        const remaining = getRemainingOfferSeconds(initialMinutes);
        if (remaining <= 0) {
          clearInterval(interval);
          return 0;
        }
        return remaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds, initialMinutes]);

  // Smooth, lightweight decisecond animation (updates every 100ms instead of 30ms to prevent CPU lag)
  useEffect(() => {
    if (totalSeconds <= 0) {
      setCentis(0);
      return;
    }
    const msInterval = setInterval(() => {
      setCentis((prev) => (prev <= 0 ? 9 : prev - 1));
    }, 100);

    return () => clearInterval(msInterval);
  }, [totalSeconds]);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const maxSeconds = initialMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, (totalSeconds / maxSeconds) * 100));

  const renderDigitBox = (value: number, label: string, isSmall = false) => {
    const formatted = value.toString().padStart(2, '0');

    return (
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-amber-500/30 to-amber-300/10 rounded-xl blur-xs opacity-70 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-400/80 rounded-lg sm:rounded-xl px-2 sm:px-3.5 py-1.5 sm:py-2.5 min-w-[48px] sm:min-w-[70px] md:min-w-[78px] shadow-[inset_0_2px_6px_rgba(255,215,0,0.15),0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-950/80 border-b border-amber-500/30 z-10 pointer-events-none" />

            <span className={`font-mono font-black ${isSmall ? 'text-amber-400 text-lg sm:text-2xl md:text-3xl' : 'gold-gradient-text text-xl sm:text-3xl md:text-4xl'} tracking-tight leading-none`}>
              {formatted}
            </span>
          </div>
        </div>

        <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest mt-1.5 text-center">
          {label}
        </span>
      </div>
    );
  };

  const renderSeparator = () => (
    <div className="flex flex-col items-center justify-center gap-1.5 pb-3.5 px-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(255,215,0,0.8)]" />
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(255,215,0,0.8)]" />
    </div>
  );

  if (variant === 'bar') {
    return (
      <div className={`w-full bg-slate-950 border border-amber-400/50 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_25px_rgba(212,175,55,0.2)] ${className}`}>
        <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wide">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
          <span>Oferta expira em breve:</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-black text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-400/40 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-amber-400 mr-1" />
          <span className="text-amber-300">{minutes.toString().padStart(2, '0')}</span>
          <span className="text-amber-500">:</span>
          <span className="text-amber-300">{seconds.toString().padStart(2, '0')}</span>
          <span className="text-amber-500">.</span>
          <span className="text-amber-400 text-xs">{centis}</span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative rounded-2xl bg-slate-950/90 border border-amber-400/60 p-4 shadow-[0_0_30px_rgba(212,175,55,0.25)] text-center ${className}`}>
        <div className="inline-flex items-center gap-1.5 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Flame className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
          <span>TEMPO RESTANTE DA OPORTUNIDADE</span>
        </div>

        <div className="flex items-center justify-center gap-1 sm:gap-2 my-2">
          {hours > 0 && (
            <>
              {renderDigitBox(hours, 'Horas')}
              {renderSeparator()}
            </>
          )}
          {renderDigitBox(minutes, 'Minutos')}
          {renderSeparator()}
          {renderDigitBox(seconds, 'Segundos')}
        </div>

        <p className="text-[11px] text-slate-300 font-mono mt-2">
          ⚡ Desconto exclusivo bloqueado enquanto o cronômetro estiver ativo.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative max-w-2xl mx-auto w-full my-6 select-none ${className}`}>
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-400/90 p-5 sm:p-7 shadow-[0_0_45px_rgba(212,175,55,0.3)] overflow-hidden text-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/10 blur-2xl pointer-events-none rounded-full" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-400/40 text-red-300 text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider mb-3 shadow-md">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <Flame className="w-3.5 h-3.5 text-red-400" />
          <span>{title}</span>
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-md mx-auto mb-5 leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="flex items-center justify-center gap-1 sm:gap-2.5 my-2">
          {hours > 0 && (
            <>
              {renderDigitBox(hours, 'Horas')}
              {renderSeparator()}
            </>
          )}
          {renderDigitBox(minutes, 'Minutos')}
          {renderSeparator()}
          {renderDigitBox(seconds, 'Segundos')}
        </div>

        <div className="mt-5 max-w-md mx-auto">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-300 mb-1 px-1">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Janela de Ativação Promocional</span>
            </span>
            <span className="font-bold text-slate-200">
              {Math.round(progressPercent)}% restante
            </span>
          </div>
          
          <div className="w-full h-2.5 bg-slate-950 rounded-full border border-amber-500/30 overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-300 shadow-[0_0_10px_rgba(255,215,0,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] sm:text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Restam apenas {spotsRemaining} licenças com valor promocional</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Valor garantido apenas durante esta contagem</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export const OfferCountdown = memo(OfferCountdownComponent);
