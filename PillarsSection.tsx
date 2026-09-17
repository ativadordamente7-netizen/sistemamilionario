import React from 'react';
import { Cpu, TrendingUp, Compass, Award, Zap, Sparkles } from 'lucide-react';

export const PillarsSection: React.FC = () => {
  const pillars = [
    {
      title: 'AUTOMAÇÃO',
      subtitle: 'Execução Contínua 24/7',
      desc: 'O ecossistema opera nos bastidores, integrando fluxos de inteligência artificial e geração de ativos mesmo quando você está offline.',
      icon: Cpu,
    },
    {
      title: 'ESCALA',
      subtitle: 'Multiplicação de Ativos',
      desc: 'Método estruturado para expandir sua esteira de produtos digitais com previsibilidade, velocidade e altas margens de lucro.',
      icon: TrendingUp,
    },
    {
      title: 'LIBERDADE',
      subtitle: 'Operação Remota',
      desc: 'Sem amarras ou estruturas físicas complexas. Você gerencia todo o seu império digital diretamente do seu computador ou smartphone.',
      icon: Compass,
    },
    {
      title: 'DIREÇÃO',
      subtitle: 'IA Como Orientador',
      desc: 'Elimine a dúvida sobre o que fazer a seguir. A inteligência artificial aponta a próxima ação exata para você executar sem travar.',
      icon: Award,
    },
    {
      title: 'PODER',
      subtitle: 'Controle Estratégico',
      desc: 'Domine a tecnologia mais poderosa do mundo moderno e coloque a inteligência artificial para trabalhar exclusivamente para você.',
      icon: Zap,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 my-6 text-slate-100">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          OS 5 PILARES DE SUSTENTAÇÃO
        </div>
        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
          COMO O <span className="gold-gradient-text">INFINITY MILLION</span> ESTRUTURA SUA OPERAÇÃO
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl mx-auto font-normal">
          Infinito em possibilidades. Visão, inteligência artificial e execução estratégica integrados em uma única plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl p-5 text-center flex flex-col items-center justify-between bg-slate-950/80 border border-amber-500/25 hover:border-amber-400 transition-all duration-300 group hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform mb-3">
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <h4 className="font-extrabold text-white text-base tracking-wider uppercase mb-1">
                  {p.title}
                </h4>
                <p className="text-xs font-bold text-amber-400 mb-2 font-mono">{p.subtitle}</p>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {p.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 w-full flex items-center justify-center">
                <span className="text-[10px] font-mono text-amber-400/80 font-bold uppercase tracking-widest">
                  PILAR 0{idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
