import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { FaqItem } from '../types';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      id: '1',
      question: 'O que exatamente é o Infinity Million?',
      answer: 'O Infinity Million é um ecossistema operacional de inteligência artificial e estratégias de negócios digitais. Ele combina os módulos Mente Infinita (clareza e mentalidade executiva), Fábrica de Infoprodutos (construção de ofertas, páginas e criativos com IA) e IA Como Guia de Execução (orientação prática diária para você não travar).',
    },
    {
      id: '2',
      question: 'Preciso ter experiência prévia com Inteligência Artificial?',
      answer: 'Não. O sistema foi desenvolvido para ser intuitivo e direto ao ponto. Todo o processo é guiado passo a passo, ensinando como utilizar ferramentas de IA de ponta para produzir resultados práticos sem jargões complexos.',
    },
    {
      id: '3',
      question: 'Como funciona a ativação e entrega do meu acesso?',
      answer: 'A ativação é 100% instantânea após a aprovação do pagamento. Você receberá um e-mail com as credenciais de acesso à plataforma exclusiva, além de instruções para iniciar o primeiro módulo imediatamente.',
    },
    {
      id: '4',
      question: 'Por que o sistema é focado em execução e não apenas em teoria?',
      answer: 'Porque o excesso de informação sem ação paralisa a maioria dos profissionais. O Infinity Million foi arquitetado para transformar inteligência em passos práticos e objetivos, reduzindo o tempo entre a ideia e o produto no ar.',
    },
    {
      id: '5',
      question: 'Qual é a garantia caso eu decida que não é para mim?',
      answer: 'Você conta com 7 dias de Garantia Blindada. Teste o sistema, acesse as ferramentas e os bônus. Se sentir que não faz sentido para o seu momento, basta solicitar o reembolso integral com um único e-mail.',
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 my-6 text-slate-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase mb-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>CENTRAL DE DÚVIDAS & TIRA-DÚVIDAS</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          PERGUNTAS FREQUENTES SOBRE O <span className="gold-gradient-text">INFINITY MILLION</span>
        </h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.id}
              className="bg-slate-950/80 border border-amber-500/25 rounded-2xl overflow-hidden shadow-lg transition-all backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-white text-sm sm:text-base hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                <span className="pr-2">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-300' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
