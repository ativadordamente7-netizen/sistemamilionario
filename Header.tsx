import React, { useState } from 'react';
import { Eye, Sparkles, Settings, Star } from 'lucide-react';

interface HeaderProps {
  liveViewersCount: number;
  showDevButton?: boolean;
  onToggleDevPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  liveViewersCount,
  showDevButton = false,
  onToggleDevPanel,
}) => {
  const [clickCount, setClickCount] = useState(0);

  // Triple click logo trigger for producer to open dev mode
  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      setClickCount(0);
      if (onToggleDevPanel) {
        onToggleDevPanel();
      }
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-sky-400/20 text-white shadow-md">
      {/* Main Compact Celestial Header */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2">
        {/* Infinity Million Brand Logo */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer select-none group"
          title="INFINITY MILLION"
        >
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900/90 border border-sky-300/40 shadow-[0_0_15px_rgba(186,230,253,0.25)] group-hover:border-sky-300 transition-all">
            <svg viewBox="0 0 100 50" className="w-4 h-4 sm:w-5 sm:h-5 text-sky-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
              <path
                d="M 25,25 C 10,10 5,40 25,25 C 45,10 55,40 75,25 C 95,10 90,40 75,25 C 55,10 45,40 25,25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Star className="w-2 h-2 text-amber-200 absolute -top-0.5 -right-0.5 animate-pulse" />
          </div>

          <div className="text-left">
            <span className="font-black text-xs sm:text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-amber-200 leading-none flex items-center gap-1">
              INFINITY MILLION
            </span>
            <span className="text-[8px] sm:text-[9px] text-sky-200/80 font-mono tracking-wider uppercase block leading-none mt-0.5">
              INTELIGÊNCIA & EXECUÇÃO
            </span>
          </div>
        </div>

        {/* Right Section: Live HUD Indicator & Producer Controls */}
        <div className="flex items-center gap-2">
          {/* Live Viewers Indicator */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-sky-400/30 rounded-full px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] text-slate-200 shadow-sm">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-sky-400" />
            </span>
            <Eye className="w-3 h-3 text-sky-300" />
            <span className="font-mono font-bold text-sky-200">{liveViewersCount.toLocaleString()}</span>
            <span className="text-slate-400 hidden xs:inline text-[9px] sm:text-[10px]">ao vivo</span>
          </div>

          {/* Configuration Gear for Producer Mode */}
          {showDevButton && (
            <button
              onClick={onToggleDevPanel}
              className="bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-200 p-1.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center"
              title="Painel de Produtor (Ctrl + Shift + D)"
            >
              <Settings className="w-4 h-4 text-sky-300 animate-spin-slow" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
