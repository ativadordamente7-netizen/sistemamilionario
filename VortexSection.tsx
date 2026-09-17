import React from 'react';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const VortexSection: React.FC = () => {
  return (
    <section className="relative my-12 py-16 overflow-hidden bg-slate-950 text-white border-y border-amber-500/30">
      {/* Minimalist Cosmic Vortex Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_75%)] pointer-events-none"></div>

      {/* SVG Animated Minimalist Vortex Tornado Lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <svg viewBox="0 0 800 400" className="w-full h-full max-w-4xl animate-spin-slow">
          <defs>
            <linearGradient id="vortexGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D061" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#AA771C" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Spiraling Vortex Rings */}
          <ellipse cx="400" cy="200" rx="350" ry="120" fill="none" stroke="url(#vortexGold)" strokeWidth="1.5" strokeDasharray="10 15" />
          <ellipse cx="400" cy="200" rx="280" ry="90" fill="none" stroke="url(#vortexGold)" strokeWidth="2" strokeDasharray="15 20" />
          <ellipse cx="400" cy="200" rx="200" ry="60" fill="none" stroke="url(#vortexGold)" strokeWidth="2.5" />
          <ellipse cx="400" cy="200" rx="120" ry="35" fill="none" stroke="url(#vortexGold)" strokeWidth="3" />
          <ellipse cx="400" cy="200" rx="50" ry="15" fill="none" stroke="#FFFDD0" strokeWidth="4" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        {/* Minimalist Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>PORTAL DE TRANSFORMAÇÃO FINANCEIRA</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-4">
          VOCÊ ENTROU NO <span className="gold-gradient-text">VÓRTICE DO SUCESSO</span>
        </h3>

        <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
          Neste exato momento, a decisão que você tomar aqui separa a rotina comum do controle absoluto sobre o seu futuro. O sistema já está configurado e pronto para operar.
        </p>

        {/* Minimalist Stats/Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-amber-500/20">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-sm">
            <span className="block text-2xl font-black text-amber-400">24/7</span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Automação Contínua</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-sm">
            <span className="block text-2xl font-black text-emerald-400">100%</span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Acesso Criptografado</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-sm">
            <span className="block text-2xl font-black text-amber-400">45 Dias</span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Meta de Escala</span>
          </div>
        </div>
      </div>
    </section>
  );
};
