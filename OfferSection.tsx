import React from 'react';
import { ShieldCheck, Zap, Sparkles, CheckCircle, ArrowRight, Lock, Clock, Gift, Award, Cpu, Bot } from 'lucide-react';
import { SalesPageConfig } from '../types';
import { TrustBar } from './TrustBar';
import { OfferCountdown } from './OfferCountdown';
import { getRemainingOfferSeconds } from '../utils/timerUtils';

interface OfferSectionProps {
  config: SalesPageConfig;
  onCheckoutClick?: () => void;
}

export const OfferSection: React.FC<OfferSectionProps> = ({ config, onCheckoutClick }) => {

  const [timeLeft, setTimeLeft] = React.useState<number>(() => getRemainingOfferSeconds(15));

  React.useEffect(() => {
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

  const bonuses = [
    {
      title: 'BÔNUS 01: Livro Digital "O Código da Identidade"',
      desc: 'Manual prático para ativar uma mentalidade de prosperidade inabalável e acelerar sua independência financeira.',
      value: 'R$ 297,00',
    },
    {
      title: 'BÔNUS 02: Templates Prontos da Fábrica de Infoprodutos',
      desc: 'Estruturas prontas de páginas, roteiros de alta conversão e prompts avançados para geração de criativos.',
      value: 'R$ 497,00',
    },
  ];

  return (
    <section id="checkout-offer" className="max-w-4xl mx-auto px-4 py-8 animate-fade-in my-8 text-slate-100">
      {/* Outer Cyber-Luxury Offer Card */}
      <div className="relative rounded-3xl bg-slate-950 border-2 border-amber-400/80 shadow-[0_0_60px_rgba(212,175,55,0.3)] overflow-hidden">
        
        {/* Top Urgency Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950 font-black text-center py-2.5 px-4 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md flex-wrap">
          <Clock className="w-4 h-4 animate-spin shrink-0 text-slate-950" />
          <span>SESSÃO DE ATIVAÇÃO EXPIRA EM:</span>
          <span className="font-mono text-xs sm:text-sm bg-slate-950 text-amber-300 font-bold px-2.5 py-0.5 rounded border border-amber-400/50 shadow-inner">
            {formatCountdown(timeLeft)}
          </span>
          <span className="hidden sm:inline">• APENAS {config.spotsRemaining} LICENÇAS DISPONÍVEIS</span>
        </div>

        <div className="p-6 sm:p-10 text-center">
          
          {/* Main Offer Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>LICENÇA OFICIAL + ECOSSISTEMA COMPLETO</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-none mb-3">
            INFINITY <span className="gold-gradient-text">MILLION</span>
          </h3>
          
          <p className="text-xs sm:text-base text-slate-300 font-medium max-w-xl mx-auto mb-8 leading-relaxed">
            Ative agora o ecossistema que coloca inteligência artificial e processos de alta conversão a serviço da sua liberdade financeira.
          </p>

          {/* Included Deliverables List */}
          <div className="text-left bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 mb-8 shadow-inner">
            <h4 className="font-extrabold text-white text-sm sm:text-base uppercase mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <span>O QUE ESTÁ INCLUÍDO NA SUA ATIVAÇÃO HOJE:</span>
            </h4>

            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Acesso Integral ao Infinity Million OS</strong> (Plataforma, Módulos 🧠 Mente Infinita, 🏭 Fábrica de Infoprodutos e 🤖 IA Guia de Execução).
                </div>
              </li>

              {bonuses.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">{b.title}</span> — <span className="text-slate-300 font-normal">{b.desc}</span>{' '}
                    <span className="line-through text-slate-500 text-[11px]">({b.value})</span> <span className="text-emerald-400 font-mono font-bold text-xs">GRÁTIS HOJE</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing & Comparison Breakdown Chart */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-amber-500/30 shadow-md bg-slate-900/80">
            <div className="bg-slate-950 text-amber-300 font-mono font-bold text-xs uppercase px-4 py-2.5 text-center tracking-wider border-b border-amber-500/30">
              📊 RESUMO FINANCEIRO DA LICENÇA
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 text-slate-400 font-mono uppercase text-[10px] sm:text-xs tracking-wider border-b border-slate-800">
                    <th className="p-3 border-r border-slate-800">Módulo / Item</th>
                    <th className="p-3 text-center border-r border-slate-800">Valor Individual</th>
                    <th className="p-3 text-right">Com Desconto Hoje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 border-r border-slate-800 font-bold text-white flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Licença do Infinity Million OS</span>
                    </td>
                    <td className="p-3 text-center border-r border-slate-800 line-through text-slate-500">R$ 1.610,00</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">INCLUÍDO</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 border-r border-slate-800 font-bold text-white flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Bônus: O Código da Identidade</span>
                    </td>
                    <td className="p-3 text-center border-r border-slate-800 line-through text-slate-500">R$ 297,00</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">GRÁTIS HOJE</td>
                  </tr>
                  <tr className="bg-slate-950 text-white font-black">
                    <td className="p-3 border-r border-slate-800 uppercase font-mono font-bold text-amber-300">VALOR TOTAL:</td>
                    <td className="p-3 text-center border-r border-slate-800 line-through text-red-400 font-bold font-mono">{config.priceOriginal}</td>
                    <td className="p-3 text-right text-amber-300 font-mono font-black">
                      {config.installmentsCount}X DE {config.installmentPrice}
                      <span className="text-[10px] text-slate-400 font-sans block">(ou {config.priceCurrent} à vista)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cyber Countdown Timer directly adjacent to the pricing box */}
          <OfferCountdown
            initialMinutes={15}
            spotsRemaining={config.spotsRemaining}
            variant="prominent"
            title="SESSÃO DE ATIVAÇÃO COM VALOR PROMOCIONAL"
            subtitle="O valor com desconto exclusivo de R$ 1.570,00 e os bônus serão encerrados ao término da contagem:"
            className="mb-8"
          />

          {/* Pricing Box */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-amber-400/50 shadow-2xl mb-8 relative">

            
            <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase mb-4 shadow-sm">
              <Clock className="w-4 h-4 text-red-400 animate-pulse" />
              <span>DESCONTO DE ATIVAÇÃO EXPIRA EM:</span>
              <span className="font-mono text-sm font-black text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-amber-400/30">
                {formatCountdown(timeLeft)}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-widest mb-1 font-mono">
              De <span className="line-through text-red-400 font-bold">{config.priceOriginal}</span> por apenas:
            </p>

            <div className="my-3">
              <div className="text-xs sm:text-sm text-amber-300 font-semibold uppercase tracking-wider mb-1 font-mono">
                {config.installmentsCount}X DE
              </div>
              <div className="text-4xl sm:text-6xl font-black gold-gradient-text tracking-tight font-mono">
                {config.installmentPrice}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                ou apenas <strong className="text-white font-bold">{config.priceCurrent}</strong> à vista no PIX ou Cartão
              </p>
            </div>

            <p className="text-[11px] text-emerald-400 font-mono font-semibold uppercase tracking-wider bg-emerald-950/60 inline-block px-3 py-1 rounded-full border border-emerald-500/30">
              ⚡ ECONOMIA EXCLUSIVA DE R$ 1.570,00 HOJE
            </p>
          </div>

          {/* Pulsing Glowing Buy Button */}
          <button
            onClick={handleCheckoutClick}
            className="w-full sm:w-auto px-8 py-5 rounded-2xl gold-button-bg text-slate-950 font-black text-base sm:text-xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(255,215,0,0.6)] animate-pulse-glow flex items-center justify-center gap-3 cursor-pointer mx-auto border-2 border-amber-200"
          >
            <span>ATIVAR MEU ACESSO AO INFINITY MILLION</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>

          {/* TrustBar Component */}
          <TrustBar variant="dark" />

          <p className="text-xs text-slate-400 font-medium mt-3 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transação 100% Criptografada • Acesso Enviado Imediatamente por E-mail</span>
          </p>

          {/* Payment Badges */}
          <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Formas de Pagamento:</span>
            <div className="flex items-center gap-2 text-slate-300 font-bold text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span>💳 Cartão de Crédito</span>
              <span>⚡ PIX Instantâneo</span>
              <span>📄 Boleto</span>
            </div>
          </div>

        </div>

        {/* 7 Days Guarantee Banner */}
        <div className="bg-slate-900/90 border-t border-amber-500/30 p-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
            <Award className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <h5 className="font-extrabold text-white text-base uppercase">
              7 DIAS DE GARANTIA BLINDADA DE SATISFAÇÃO
            </h5>
            <p className="text-xs text-slate-300 max-w-xl font-normal mt-0.5 leading-relaxed">
              Explore o Infinity Million por 7 dias completos. Se você sentir que o sistema não entregou a clareza e as ferramentas que você buscava, basta solicitar o reembolso com 1 clique e devolveremos 100% do seu valor.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
