import React from 'react';
import { Star, CheckCircle2, TrendingUp, Sparkles, Quote, Cpu } from 'lucide-react';
import { TestimonialItem } from '../types';

export const TestimonialsSection: React.FC = () => {
  const testimonials: TestimonialItem[] = [
    {
      id: '1',
      name: 'Gabriel Mendonça',
      location: 'São Paulo - SP',
      result: 'R$ 114.850,00 gerados',
      story: 'O que mais me impressionou no Infinity Million foi a precisão da IA como guia de execução. Em vez de ficar perdido em teoria, o sistema me deu o roteiro exato para criar meus produtos e validar as primeiras ofertas.',
      timeframe: '42 dias de execução',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
      verified: true,
    },
    {
      id: '2',
      name: 'Camila Alencar',
      location: 'Belo Horizonte - MG',
      result: 'R$ 102.300,00 faturados',
      story: 'A Fábrica de Infoprodutos acelerou tudo na minha rotina. O processo de criação de páginas e criativos com IA reduziu semanas de trabalho para algumas horas. É um sistema tecnológico de altíssimo nível.',
      timeframe: '38 dias de execução',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
      verified: true,
    },
    {
      id: '3',
      name: 'Rodrigo Silveira',
      location: 'Curitiba - PR',
      result: 'R$ 145.000,00 em escala',
      story: 'A Mente Infinita destravou minha tomada de decisão. Parei de procrastinar e comecei a executar com clareza absoluta. O ecossistema Infinity Million é um divisor de águas no mercado digital atual.',
      timeframe: '50 dias de execução',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
      verified: true,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 my-6 text-slate-100">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          CASOS DE EXECUÇÃO COMPROVADA
        </div>
        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
          RESULTADOS REAIS DE QUEM ATIVOU O <span className="gold-gradient-text">INFINITY MILLION</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto font-normal">
          Veja o impacto prático do ecossistema de inteligência artificial e execução estratégica na vida de quem colocou em prática.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-slate-950/80 border border-amber-500/25 rounded-2xl p-6 shadow-xl hover:border-amber-400/80 transition-all duration-300 relative flex flex-col justify-between backdrop-blur-md group"
          >
            <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />

            <div>
              {/* Rating stars */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Story */}
              <p className="text-xs sm:text-sm text-slate-200 italic font-normal leading-relaxed mb-4">
                "{t.story}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              {/* Result badge */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-950/60 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-emerald-500/30 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.result}</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-white text-sm flex items-center gap-1">
                    {t.name}
                    {t.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">{t.location} • {t.timeframe}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
