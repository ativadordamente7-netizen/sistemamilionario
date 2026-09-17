import React from 'react';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-amber-500/20 py-10 px-4 mt-16 text-xs">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-400/50 flex items-center justify-center text-amber-400">
            <svg viewBox="0 0 100 50" className="w-5 h-5">
              <path
                d="M 25,25 C 10,10 5,40 25,25 C 45,10 55,40 75,25 C 95,10 90,40 75,25 C 55,10 45,40 25,25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
            </svg>
          </div>
          <span className="font-extrabold text-sm gold-gradient-text tracking-widest uppercase">
            INFINITY MILLION — SISTEMA MILIONÁRIO
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-300">
          <a href="#terms" className="hover:text-amber-400 transition-colors">Termos de Uso</a>
          <span>•</span>
          <a href="#privacy" className="hover:text-amber-400 transition-colors">Políticas de Privacidade</a>
          <span>•</span>
          <a href="#disclaimer" className="hover:text-amber-400 transition-colors">Aviso Legal</a>
          <span>•</span>
          <a href="#support" className="hover:text-amber-400 transition-colors">Suporte ao Cliente</a>
        </div>

        {/* Disclaimer Notice */}
        <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
          <strong>Aviso Legal:</strong> "Este site não faz parte do Google nem do Meta (Facebook). Além disso, este site NÃO é endossado por nenhuma dessas empresas. Os resultados apresentados refletem os ganhos de alunos que aplicaram integralmente o método. Seus resultados podem variar de acordo com sua dedicação e aplicação."
        </p>

        {/* Copyright */}
        <div className="pt-4 border-t border-slate-900 text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 INFINITY MILLION. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2 text-amber-400/80">
            <ShieldCheck className="w-4 h-4" />
            <span>Ambiente Seguro com Criptografia SSL 256-bit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
