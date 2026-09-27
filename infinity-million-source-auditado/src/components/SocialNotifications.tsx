import React, { useState, useEffect, useRef } from 'react';
import { DEMO_NOTIFICATIONS, NOTIFICATION_INTERVAL } from '../config';
import { SocialNotification } from '../types';

interface SocialNotificationsProps {
  isVslPlaying: boolean;
}

export const SocialNotifications: React.FC<SocialNotificationsProps> = ({
  isVslPlaying,
}) => {
  const [currentNotification, setCurrentNotification] = useState<SocialNotification | null>(DEMO_NOTIFICATIONS[0]);
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const currentIndexRef = useRef(0);
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor scroll position relative to the hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero-section');
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        // Visible after user has scrolled past the hero section (bottom of hero near/past top of viewport)
        setHasScrolledPastHero(rect.bottom < 100);
      } else {
        setHasScrolledPastHero(window.scrollY > 150);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Only schedule notifications if the video has started or user scrolled past hero
    const canRun = isVslPlaying || hasScrolledPastHero;
    if (!canRun) {
      setIsVisible(false);
      return;
    }

    const showNextNotification = () => {
      const notif = DEMO_NOTIFICATIONS[currentIndexRef.current % DEMO_NOTIFICATIONS.length];
      currentIndexRef.current += 1;
      setCurrentNotification(notif);
      setIsVisible(true);

      // Remains visible calmly for 6.5 seconds so user can comfortably read it
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
      dismissTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 6500);
    };

    // First notification appears comfortably 12 seconds after trigger (not abruptly)
    const initialDelay = setTimeout(() => {
      showNextNotification();
    }, 12000);

    // Subsequent notifications appear calmly at spaced intervals
    const interval = setInterval(() => {
      showNextNotification();
    }, NOTIFICATION_INTERVAL * 1000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, [isVslPlaying, hasScrolledPastHero]);

  if (!currentNotification) return null;

  // Strict requirement: only becomes visible after the user has begun scrolling past the initial hero section
  const shouldShow = isVisible && hasScrolledPastHero;

  return (
    <div 
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 transition-all duration-700 ease-out transform ${
        shouldShow 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
      }`}
      aria-live="polite"
    >
      <div className="pearl-card max-w-[310px] sm:max-w-xs py-3 px-4 rounded-xl border border-[#C8A45D]/30 shadow-[0_10px_25px_rgba(200,164,93,0.12)] flex items-center space-x-3 backdrop-blur-md">
        {/* Micro Golden Infinity Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FFF] to-[#F5ECE0] border border-[#C8A45D]/40 flex items-center justify-center shadow-inner">
          <svg className="w-4 h-2.5" viewBox="0 0 100 50" fill="none">
            <path 
              d="M28 10 C16 10 7 17 7 25 C7 33 16 40 28 40 C42 40 50 25 50 25 C50 25 58 40 72 40 C84 40 93 33 93 25 C93 17 84 10 72 10 C58 10 50 25 50 25 C50 25 42 10 28 10 Z" 
              stroke="#A87924" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#29241B] truncate font-['Outfit']">
            {currentNotification.message}
          </p>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="text-[10px] text-[#8C7A54] uppercase tracking-wider font-['Outfit']">
              {currentNotification.city ? `${currentNotification.city} • ` : ''}{currentNotification.timestamp}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3FB950]" />
          </div>
        </div>
      </div>
    </div>
  );
};
