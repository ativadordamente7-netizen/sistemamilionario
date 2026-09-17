import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, ShieldCheck, CheckCircle2, Sparkles, CreditCard, Zap, Award, Clock } from 'lucide-react';
import { SalesPageConfig } from '../types';
import { TrustBar } from './TrustBar';
import { OfferCountdown } from './OfferCountdown';
import { getRemainingOfferSeconds } from '../utils/timerUtils';

interface PostTestimonialsCheckoutProps {
  config: SalesPageConfig;
  onCheckoutClick?: () => void;
}

export const PostTestimonialsCheckout: React.FC<PostTestimonialsCheckoutProps> = ({ config, onCheckoutClick }) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => getRemainingOfferSeconds(15));

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(getRemainingOfferSeconds(15));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckoutClick = () => {
    if (onCheckoutClick) {
      onCheckoutClick();
    } else if (config.checkoutUrl && config.checkoutUrl.trim() !== '') {
      window.open(config.checkoutUrl, '_blank');
    }
  };

  const checkoutPrice = config.priceCurrent || 'R$ 337,00';
  const installmentPrice = config.installmentPrice || 'R$ 33,70';

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 my-8 text-slate-100">
      {/* Outer Card with High Conversion Styling */}
      <div className="relative rounded-3xl bg-slate-950 border-2 border-amber-400/80 shadow-[0_0_60px_rgba(212,175,55,0.35)] overflow-hidden text-white">
        
        {/* Top Metallic Banner with Timer */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-center py-2.5 px-4 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 flex-wrap">
          <Clock className="w-4 h-4 text-slate-950 animate-spin shrink-0" />
          <span>SESSÃO DE ATIVAÇÃO EXPIRA EM:</span>
          <span className="font-mono text-xs sm:text-sm bg-slate-950 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/50">
            {formatCountdown(timeLeft)}
          </span>
          <span className="hidden sm:inline">• GARANTA SUA LICENÇA COM DESCONTO</span>
        </div>

        <div className="p-6 sm:p-10 text-center">
          
          <h3 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight mb-2">
            COMECE SUA JORNADA <span className="gold-gradient-text">HOJE MESMO</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6">
            Não adie o seu domínio sobre o mercado digital. Ative o Infinity Million agora com preço promocional e comece a executar imediatamente.
          </p>

          {/* Pricing Highlight Pill */}
          <div className="inline-block bg-slate-900 border border-amber-400/40 rounded-2xl p-4 sm:p-6 mb-6 shadow-inner">
            <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1 font-mono">Por apenas:</span>
            <div className="text-3xl sm:text-5xl font-black gold-gradient-text tracking-tight font-mono">
              {config.installmentsCount}X DE {installmentPrice}
            </div>
            <span className="text-xs text-slate-300 block mt-1">
              ou <strong className="text-white">{checkoutPrice}</strong> à vista
            </span>
          </div>

          {/* Countdown Clock Display */}
          <div className="max-w-md mx-auto mb-6">
            <OfferCountdown
              initialMinutes={15}
              spotsRemaining={config.spotsRemaining}
              variant="compact"
            />
          </div>

          {/* Main Action Button */}

          <div className="max-w-md mx-auto mb-4">
            <button
              onClick={handleCheckoutClick}
              className="w-full py-5 px-6 rounded-2xl gold-button-bg text-slate-950 font-black text-base sm:text-xl uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_35px_rgba(255,215,0,0.6)] flex items-center justify-center gap-3 cursor-pointer border-2 border-amber-200 animate-pulse-glow"
            >
              <span>ATIVAR MINHA LICENÇA AGORA</span>
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Security details */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Checkout 100% Blindado</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Acesso Imediato</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Garantia de 7 Dias</span>
            </div>
          </div>

          {/* TrustBar inside container */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <TrustBar variant="dark" />
          </div>

        </div>
      </div>
    </section>
  );
};
