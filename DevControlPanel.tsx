import React, { useState } from 'react';
import { Settings, Sliders, Play, Unlock, Link, X, Check, Eye, Sparkles } from 'lucide-react';
import { SalesPageConfig, VslState } from '../types';
import { resetOfferRevealTimestamp, recordOfferRevealTimestamp } from '../utils/timerUtils';

interface DevControlPanelProps {
  config: SalesPageConfig;
  setConfig: React.Dispatch<React.SetStateAction<SalesPageConfig>>;
  vslState: VslState;
  setVslState: React.Dispatch<React.SetStateAction<VslState>>;
  onForceReveal: () => void;
  onReplayPortal?: () => void;
  showDevButton?: boolean;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DevControlPanel: React.FC<DevControlPanelProps> = ({
  config,
  setConfig,
  vslState,
  setVslState,
  onForceReveal,
  onReplayPortal,
  showDevButton = false,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const toggleOpen = () => {
    if (externalSetIsOpen) {
      externalSetIsOpen(!isOpen);
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <>
      {/* Floating Toggle Button - ONLY VISIBLE WHEN PRODUCER DEV MODE IS ENABLED */}
      {showDevButton && (
        <button
          onClick={toggleOpen}
          className="fixed top-20 right-4 z-50 bg-slate-900 border-2 border-amber-400 text-amber-300 rounded-full p-2.5 shadow-2xl hover:scale-110 transition-transform cursor-pointer flex items-center gap-2 text-xs font-bold"
          title="Painel de Controle e Testes do Produtor"
        >
          <Settings className={`w-5 h-5 ${isOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
          <span className="hidden sm:inline">PAINEL VSL</span>
        </button>
      )}

      {/* Control Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-950 border-l border-amber-500/40 text-white p-6 shadow-2xl overflow-y-auto backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-6">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase">
              <Sliders className="w-5 h-5" />
              <span>PAINEL DE TESTES DA VSL</span>
            </div>
            <button
              onClick={() => (externalSetIsOpen ? externalSetIsOpen(false) : setInternalIsOpen(false))}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 text-xs">
            {/* Quick Actions */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 space-y-3">
              <h5 className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px]">
                ⚡ AÇÕES RÁPIDAS DE TESTE
              </h5>

              <button
                onClick={() => {
                  if (vslState.buttonRevealed) {
                    resetOfferRevealTimestamp();
                    setVslState((prev) => ({
                      ...prev,
                      buttonRevealed: false,
                      isEnded: false,
                      lifecycleStage: 'VIDEO_PLAYING',
                    }));
                  } else {
                    recordOfferRevealTimestamp();
                    setVslState((prev) => ({
                      ...prev,
                      buttonRevealed: true,
                      isEnded: true,
                      lifecycleStage: 'PAGE_UNLOCKED',
                    }));
                  }
                }}
                className={`w-full py-2.5 px-3 rounded-lg font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  vslState.buttonRevealed
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
                }`}
              >
                <Unlock className="w-4 h-4" />
                <span>
                  {vslState.buttonRevealed ? 'Conteúdo Liberado (Ocultar e Bloquear)' : 'Liberar Conteúdo Completo Agora'}
                </span>
              </button>

              <button
                onClick={() => {
                  // Jump to remaining 175s (inside the final 3 minutes window)
                  const targetTime = Math.max(0, (vslState.duration || 900) - 175);
                  setVslState((prev) => ({
                    ...prev,
                    currentTime: targetTime,
                    remainingSeconds: 175,
                    hasStarted: true,
                    isPlaying: true,
                    buttonRevealed: false,
                    isEnded: false,
                    lifecycleStage: 'FINAL_3_MINUTES',
                  }));
                }}
                className="w-full py-2 px-3 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/50 font-semibold hover:bg-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>⏳ Pular para Últimos 3 Minutos (Ativar Cronômetro 02:55)</span>
              </button>

              <button
                onClick={() => {
                  const endTimestamp = Math.max(0, (vslState.duration || 900) - 1);
                  recordOfferRevealTimestamp();
                  setVslState((prev) => ({
                    ...prev,
                    currentTime: endTimestamp,
                    remainingSeconds: 0,
                    hasStarted: true,
                    isPlaying: false,
                    buttonRevealed: true,
                    isEnded: true,
                    lifecycleStage: 'PAGE_UNLOCKED',
                  }));
                  onForceReveal();
                }}
                className="w-full py-2 px-3 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-semibold hover:bg-emerald-900/80 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>🎉 Pular para o Final (Liberar Página com Transição)</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setVslState((prev) => ({
                      ...prev,
                      hasStarted: true,
                      isPlaying: true,
                      currentTime: 118, // 2s before 2:00
                    }));
                  }}
                  className="py-1.5 px-2 rounded-lg bg-slate-850 text-slate-200 border border-slate-700 hover:border-amber-400/60 text-[11px] font-mono flex items-center justify-center gap-1 cursor-pointer"
                  title="Testar Pop-up que inicia aos 2:00 e dura 10 segundos"
                >
                  <span>⏱️ Pular para 01:58 (Pop-up 2 min)</span>
                </button>

                <button
                  onClick={() => {
                    const fiveMinThreshold = Math.max(130, vslState.duration - 300); // 10:00 (600s)
                    setVslState((prev) => ({
                      ...prev,
                      hasStarted: true,
                      isPlaying: true,
                      currentTime: fiveMinThreshold - 2,
                    }));
                  }}
                  className="py-1.5 px-2 rounded-lg bg-slate-850 text-slate-200 border border-slate-700 hover:border-amber-400/60 text-[11px] font-mono flex items-center justify-center gap-1 cursor-pointer"
                  title="Testar Pop-up que retorna nos últimos 5 minutos de vídeo"
                >
                  <span>🚀 Pular para 09:58 (Pop-up 5 min finais)</span>
                </button>
              </div>

              {onReplayPortal && (
                <button
                  onClick={() => {
                    onReplayPortal();
                    if (externalSetIsOpen) {
                      externalSetIsOpen(false);
                    }
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-sky-950 to-indigo-950 text-sky-200 border border-sky-400/40 font-semibold hover:border-sky-300 hover:text-white flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  <span>🌌 Rever Experiência do Portal (Intro)</span>
                </button>
              )}
            </div>

            {/* Config inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Formato do Vídeo VSL:
                </label>
                <div className="w-full py-2.5 px-3 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/50 text-center font-bold text-xs flex items-center justify-center gap-2">
                  <span>📱 Exclusivo 9:16 Vertical (Reels / VSL Mobile)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  URL Customizada do Vídeo VSL (Iframe / Embed / Vimeo):
                </label>
                <input
                  type="text"
                  placeholder="https://vimeo.com/1058273612 ou https://player.vimeo.com/video/..."
                  value={config.customEmbedUrl}
                  onChange={(e) => setConfig({ ...config, customEmbedUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-amber-400 outline-none font-mono text-[11px]"
                />
                <span className="text-[10px] text-amber-300/90 mt-1 block leading-relaxed">
                  ✨ <strong>Auto-Sanitização Vimeo:</strong> Cole qualquer link do Vimeo (ex: <code className="text-amber-200 bg-slate-900 px-1 py-0.5 rounded">vimeo.com/1058273612</code>) ou código de iframe. O sistema converte automaticamente para o formato embed seguro do Vimeo (<code className="text-amber-200 bg-slate-900 px-1 py-0.5 rounded">player.vimeo.com</code>) para evitar o erro de conexão recusada.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Link de Checkout (Destino do Botão):
                </label>
                <input
                  type="text"
                  placeholder="https://seu-checkout.com/pay"
                  value={config.checkoutUrl}
                  onChange={(e) => setConfig({ ...config, checkoutUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Duração Total do Vídeo (Segundos):
                </label>
                <input
                  type="number"
                  value={vslState.duration}
                  onChange={(e) => {
                    const dur = Number(e.target.value) || 900;
                    setVslState((prev) => ({ ...prev, duration: dur }));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Delay para Aparição do Botão (Segundos antes do final):
                </label>
                <input
                  type="number"
                  value={vslState.delayTimeSeconds}
                  onChange={(e) => {
                    const delay = Number(e.target.value) || 180; // default 180s = 3 mins
                    setVslState((prev) => ({ ...prev, delayTimeSeconds: delay }));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-amber-400 outline-none"
                />
                <span className="text-[10px] text-amber-300 mt-1 block">
                  Configurado para 180s (faltando exatamente 3 minutos para o fim do vídeo).
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              💡 As alterações do painel são aplicadas em tempo real nesta página.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
