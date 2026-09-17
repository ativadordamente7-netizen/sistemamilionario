import React from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle2 } from 'lucide-react';

interface TrustBarProps {
  variant?: 'light' | 'dark';
}

export const TrustBar: React.FC<TrustBarProps> = ({ variant = 'dark' }) => {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Pagamento Seguro',
      desc: 'Ambiente 100% Protegido',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Lock,
      title: 'Dados Criptografados',
      desc: 'SSL de 256 bits',
      iconColor: 'text-amber-500',
    },
    {
      icon: CheckCircle2,
      title: 'Entrega Imediata',
      desc: 'Acesso via E-mail & WhatsApp',
      iconColor: 'text-blue-500',
    },
    {
      icon: CreditCard,
      title: 'Satisfação Garantida',
      desc: '7 Dias sem Risco',
      iconColor: 'text-purple-500',
    },
  ];

  const isDark = variant === 'dark';

  return (
    <div
      className={`w-full max-w-2xl mx-auto my-6 p-3 sm:p-4 rounded-2xl border transition-all ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 text-slate-200 shadow-inner'
          : 'bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2 rounded-xl transition-colors ${
                isDark ? 'hover:bg-slate-800/60' : 'hover:bg-white'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  isDark ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-xs'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </span>
                <span className={`text-[10px] leading-tight mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
