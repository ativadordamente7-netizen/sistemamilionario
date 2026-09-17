import React from 'react';
import { Brain, Factory, Bot, Sparkles, ArrowRight, CheckCircle2, Cpu, Zap, Layers, Rocket, ShieldCheck } from 'lucide-react';

export const AiEcosystemSection: React.FC = () => {
  const modules = [
    {
      id: 'mente-infinita',
      number: '01',
      tag: 'NÚCLEO ESTRATÉGICO',
      title: 'MENTE INFINITA',
      icon: Brain,
      iconColor: 'from-amber-400 to-amber-600',
      accentColor: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
      headline: 'Desenvolvimento de Visão, Clareza e Direção Inabalável',
      description:
        'Antes de qualquer ferramenta técnica, o sistema reprograma seus modelos mentais para pensar como um arquiteto digital de alta performance. Sem dispersão, sem sobrecarga de informações: apenas foco cirúrgico no que realmente constrói riqueza e escala sustentável.',
      features: [
        'Desbloqueio de clareza estratégica e tomada de decisão rápida',
        'Alinhamento de metas com planos de ação diários automatizados',
        'Eliminação de bloqueios de execução e procrastinação técnica',
      ],
    },
    {
      id: 'fabrica-infoprodutos',
      number: '02',
      tag: 'MOTOR DE CRIAÇÃO',
      title: 'FÁBRICA DE INFOPRODUTOS',
      icon: Factory,
      iconColor: 'from-cyan-400 to-blue-600',
      accentColor: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-300',
      headline: 'Da Ideia Bruta ao Produto Pronto para Vender no Mercado',
      description:
        'Um sistema industrial guiado que estrutura infoprodutos completos do zero em tempo recorde. Você não precisa adivinhar o que vende: o Infinity Million desenha a estrutura do conteúdo, a oferta irresistível, as páginas de alta conversão e os criativos magnéticos.',
      features: [
        'Engenharia reversa de produtos validados de alta demanda',
        'Estruturação de ofertas de alto ticket e esteira completa de produtos',
        'Geração de páginas, scripts de vendas e anúncios magnéticos',
      ],
    },
    {
      id: 'ia-guia',
      number: '03',
      tag: 'ORIENTADOR AUTÔNOMO',
      title: 'IA COMO GUIA DE EXECUÇÃO',
      icon: Bot,
      iconColor: 'from-emerald-400 to-teal-600',
      accentColor: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
      headline: 'A IA não apenas responde: ela aponta o seu Próximo Passo Exato',
      description:
        'Chega de prompts confusos e respostas genéricas que não saem do papel. O Infinity Million opera como um co-piloto estratégico que analisa o seu momento atual e diz com clareza matemática: "Faça exatamente isso agora". Você executa com confiança absoluta.',
      features: [
        'Orientação passo a passo em tempo real para cada etapa do negócio',
        'Validação instantânea de títulos, ganchos e estratégias de tráfego',
        'Ajuste contínuo para você nunca mais travar diante da tecnologia',
      ],
    },
  ];

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-16 my-8 text-slate-100">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>ARQUITETURA DO SISTEMA</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
          O ECOSSISTEMA QUE TRANSFORMA <br className="hidden sm:inline" />
          <span className="gold-gradient-text">INTELIGÊNCIA ARTIFICIAL EM EXECUÇÃO</span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-normal">
          Você não precisa ser um programador ou especialista em inteligência artificial. 
          O <strong className="text-amber-300 font-bold">Infinity Million</strong> integra os 3 pilares essenciais que transformam qualquer pessoa em um executor de alto nível no mercado digital.
        </p>
      </div>

      {/* 3 Main Technological Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="relative rounded-3xl bg-slate-950/90 border-2 border-amber-500/30 hover:border-amber-400/80 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.25)] group backdrop-blur-xl"
            >
              {/* Top Card Tech Indicator */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.iconColor} text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">
                        MÓDULO {m.number}
                      </span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${m.accentColor}`}>
                        {m.tag}
                      </span>
                    </div>
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-800 group-hover:text-amber-400/40 transition-colors">
                    {m.number}
                  </span>
                </div>

                {/* Module Title */}
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-amber-300 transition-colors">
                  {m.title}
                </h3>

                {/* Headline */}
                <p className="text-xs sm:text-sm font-bold text-amber-400 mb-4 leading-snug">
                  {m.headline}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
                  {m.description}
                </p>
              </div>

              {/* Core Features List */}
              <div className="pt-5 border-t border-slate-800/80 space-y-3">
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  CAPACIDADES ATIVADAS:
                </span>
                {m.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Cybernetic Banner Highlight below modules */}
      <div className="mt-10 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-300">
            <Zap className="w-6 h-6 animate-pulse text-amber-400" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
              "EU NÃO PRECISO ENTENDER TUDO SOBRE TECNOLOGIA."
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              O Infinity Million foi projetado para ser o seu navegador de bordo. O sistema aponta a rota e entrega as peças — você apenas aciona a execução.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};
