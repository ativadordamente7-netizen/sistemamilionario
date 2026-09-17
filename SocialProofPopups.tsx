import React, { useState, useEffect, useRef, memo } from 'react';
import { CheckCircle2, ShoppingBag, X, Zap } from 'lucide-react';
import { SocialProofNotification } from '../types';

interface SocialProofPopupsProps {
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
}

const NOTIFICATIONS: SocialProofNotification[] = [
  {
    id: '1',
    name: 'Matheus R.',
    city: 'São Paulo - SP',
    timeAgo: 'há poucos instantes',
    amount: 'R$ 337,00',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
  },
  {
    id: '2',
    name: 'Juliana M.',
    city: 'Rio de Janeiro - RJ',
    timeAgo: 'há 1 minuto',
    amount: 'R$ 337,00',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
  },
  {
    id: '3',
    name: 'Carlos E.',
    city: 'Brasília - DF',
    timeAgo: 'agora mesmo',
    amount: 'R$ 337,00',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
  },
  {
    id: '4',
    name: 'Fernanda S.',
    city: 'Salvador - BA',
    timeAgo: 'há 2 minutos',
    amount: 'R$ 337,00',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
  },
  {
    id: '5',
    name: 'Lucas B.',
    city: 'Curitiba - PR',
    timeAgo: 'há poucos instantes',
    amount: 'R$ 337,00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
  },
  {
    id: '6',
    name: 'Ana Paula V.',
    city: 'Belo Horizonte - MG',
    timeAgo: 'agora mesmo',
    amount: 'R$ 337,00',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
  },
  {
    id: '7',
    name: 'Rodrigo T.',
    city: 'Porto Alegre - RS',
    timeAgo: 'há 1 minuto',
    amount: 'R$ 337,00',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
  },
  {
    id: '8',
    name: 'Camila F.',
    city: 'Florianópolis - SC',
    timeAgo: 'agora mesmo',
    amount: 'R$ 337,00',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=75&w=100&h=100&fm=webp',
  },
];

/**
 * Popup sintonizado com o vídeo:
 * Fase normal: a partir de 2:00 de vídeo, dispara a cada 2 minutos (120s), fica visível 12s.
 * Fase de urgência: nos últimos 5 minutos de vídeo, dispara a cada 30s, fica visível 8s.
 */
const SocialProofPopupsComponent: React.FC<SocialProofPopupsProps> = ({
  currentTime = 0,
  duration = 900,
  isPlaying = true,
}) => {
  const [currentNotification, setCurrentNotification] = useState<SocialProofNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  const lastTriggeredKeyRef = useRef<string | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fase normal: intervalo de 2 minutos (120s), visível por 12s
  const NORMAL_CYCLE_SECONDS = 120;
  const NORMAL_DISPLAY_SECONDS = 12;

  // Fase de urgência (últimos 5 minutos): intervalo de 30s, visível por 8s
  const URGENT_WINDOW_SECONDS = 300;
  const URGENT_CYCLE_SECONDS = 30;
  const URGENT_DISPLAY_SECONDS = 8;

  const remaining = Math.max(0, duration - currentTime);
  const isUrgentPhase = remaining > 0 && remaining <= URGENT_WINDOW_SECONDS;

  const cycleSeconds = isUrgentPhase ? URGENT_CYCLE_SECONDS : NORMAL_CYCLE_SECONDS;
  const displaySeconds = isUrgentPhase ? URGENT_DISPLAY_SECONDS : NORMAL_DISPLAY_SECONDS;

  const currentCycleIndex = Math.floor(currentTime / cycleSeconds);
  const secondsIntoCycle = currentTime % cycleSeconds;
  // Chave única por fase + ciclo, para não misturar contagens entre a fase normal e a de urgência
  const currentCycleKey = `${isUrgentPhase ? 'urgent' : 'normal'}-${currentCycleIndex}`;

  useEffect(() => {
    // Fase normal só dispara a partir do primeiro ciclo de 2 minutos (2:00 de vídeo)
    if (!isUrgentPhase && currentTime < NORMAL_CYCLE_SECONDS) {
      if (isVisible) {
        setIsVisible(false);
      }
      return;
    }

    // Verifica se estamos dentro da janela ativa deste ciclo
    const isWithinActiveWindow = secondsIntoCycle < displaySeconds;

    if (isWithinActiveWindow) {
      // Se não foi fechado manualmente pelo usuário neste ciclo e ainda não foi mostrado
      if (dismissedKey !== currentCycleKey) {
        if (lastTriggeredKeyRef.current !== currentCycleKey) {
          lastTriggeredKeyRef.current = currentCycleKey;

          // Seleciona a notificação baseada no índice do ciclo
          const notifIndex = Math.abs(currentCycleIndex + (isUrgentPhase ? 4 : -1)) % NOTIFICATIONS.length;
          setCurrentNotification(NOTIFICATIONS[notifIndex]);
          setIsVisible(true);

          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          const remainingDisplayTime = Math.max(1, (displaySeconds - secondsIntoCycle) * 1000);
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, remainingDisplayTime);
        }
      }
    } else {
      // Fora da janela ativa: fecha o popup
      if (isVisible) {
        setIsVisible(false);
      }
    }

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [currentTime, currentCycleIndex, secondsIntoCycle, dismissedKey, isVisible, isUrgentPhase, currentCycleKey, displaySeconds]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissedKey(currentCycleKey);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  if (!isVisible || !currentNotification) return null;

  return (
    <div
      id="social-proof-popup-container"
      className="fixed bottom-4 left-4 z-50 max-w-[320px] sm:max-w-sm select-none transition-all duration-500 animate-slide-up"
      role="status"
      aria-live="polite"
    >
      <div className="relative bg-slate-950/95 border-2 border-sky-400/80 rounded-2xl p-3 sm:p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.3)] text-white flex items-start gap-3 backdrop-blur-xl">
        
        {/* Buyer Avatar with Verification Badge */}
        <div className="relative shrink-0 mt-0.5">
          <img
            src={currentNotification.avatar}
            alt={currentNotification.name}
            width={42}
            height={42}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-sky-400/90 shadow-md"
          />
          <span
            className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-slate-950 shadow-sm"
            title="Compra Verificada ao Vivo"
          >
            <CheckCircle2 className="w-3 h-3 text-white" />
          </span>
        </div>

        {/* Notification Text Content */}
        <div className="text-xs flex-1 pr-3">
          <div className="flex items-center gap-1 text-sky-300 font-bold leading-tight">
            <ShoppingBag className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{currentNotification.name}</span>
            <span className="text-slate-400 font-normal truncate">• {currentNotification.city}</span>
          </div>

          <p className="text-slate-100 font-semibold text-[11px] sm:text-xs mt-1 leading-snug">
            Acabou de ativar o Sistema Milionário!
          </p>

          <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {currentNotification.timeAgo} • Aprovado
            </span>
            <span className="text-amber-300 font-bold">{currentNotification.amount}</span>
          </div>
        </div>

        {/* Discreet Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          title="Fechar notificação"
          aria-label="Fechar notificação"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const SocialProofPopups = memo(SocialProofPopupsComponent);
