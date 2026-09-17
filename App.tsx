import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Header } from './components/Header';
import { HeadlineSection } from './components/HeadlineSection';
import { VslPlayer } from './components/VslPlayer';
import { CelestialPortalIntro } from './components/CelestialPortalIntro';
import { AmbientCelestialBackground } from './components/AmbientCelestialBackground';
import { AiEcosystemSection } from './components/AiEcosystemSection';
import { Footer } from './components/Footer';
import { VortexSection } from './components/VortexSection';
import { PillarsSection } from './components/PillarsSection';
import { OfferSection } from './components/OfferSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PostTestimonialsCheckout } from './components/PostTestimonialsCheckout';
import { FaqSection } from './components/FaqSection';
import { SocialProofPopups } from './components/SocialProofPopups';
import { DevControlPanel } from './components/DevControlPanel';
import { SalesPageConfig, VslState } from './types';
import { recordOfferRevealTimestamp } from './utils/timerUtils';

export default function App() {
  const [hasActivated, setHasActivated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress with requestAnimationFrame throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Config state
  const [config, setConfig] = useState<SalesPageConfig>({
    headline: 'ATIVE O INFINITY MILLION.',
    subheadline: 'Copie e cole, ative o Sistema Milionário e faça 100 mil em 45 dias',
    totalDurationSeconds: 900, // 15 minutes total
    delayBeforeEndSeconds: 180, // 3 minutes before ending
    customEmbedUrl: 'https://youtu.be/mlNRsqImVLs',
    videoFormat: 'reels', // Formato estrito 9:16 Vertical (Reels / VSL Mobile)
    checkoutUrl: 'https://pay.kiwify.com.br/uE9kuTs',
    priceOriginal: 'R$ 1.907,00',
    priceCurrent: 'R$ 337,00',
    installmentPrice: 'R$ 33,70',
    installmentsCount: 12,
    spotsRemaining: 7,
    liveViewersCount: 1482,
    devModeEnabled: true,
  });

  // VSL Player State with 5-stage lifecycle
  const [vslState, setVslState] = useState<VslState>({
    isPlaying: false,
    isMuted: true,
    currentTime: 0,
    duration: 900, // 15 minutes
    remainingSeconds: 900,
    hasStarted: false,
    isEnded: false,
    buttonRevealed: false,
    delayTimeSeconds: 180, // faltando 3 minutos para acabar
    lifecycleStage: 'VIDEO_PLAYING',
  });

  const [showSoundNotice, setShowSoundNotice] = useState(true);
  const [showDevMode, setShowDevMode] = useState(false);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast notice after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Check URL parameters & keyboard shortcuts for Producer Dev Mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('admin') === 'true' ||
      params.get('dev') === 'true' ||
      window.location.hash === '#admin'
    ) {
      setShowDevMode(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key combination: Ctrl + Shift + D to toggle producer control panel
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setShowDevMode((prev) => !prev);
        setIsDevPanelOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer to hide the sound warning notice 30s after sound is unmuted/started
  useEffect(() => {
    if (vslState.hasStarted && !vslState.isMuted && showSoundNotice) {
      const timer = setTimeout(() => {
        setShowSoundNotice(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [vslState.hasStarted, vslState.isMuted, showSoundNotice]);

  // Smoothly scroll to offer section when button is newly revealed
  const wasButtonRevealedRef = useRef(vslState.buttonRevealed);
  useEffect(() => {
    if (vslState.buttonRevealed && !wasButtonRevealedRef.current) {
      wasButtonRevealedRef.current = true;
      recordOfferRevealTimestamp();
      const timer = setTimeout(() => {
        const timerElem = document.getElementById('dynamic-offer-timer') || document.getElementById('vsl-primary-cta-button');
        if (timerElem) {
          timerElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
    } else if (!vslState.buttonRevealed) {
      wasButtonRevealedRef.current = false;
    }
  }, [vslState.buttonRevealed]);

  // Function invoked when timer reaches delay threshold or forced in dev
  const handleButtonReveal = useCallback(() => {
    recordOfferRevealTimestamp();
    setVslState((prev) => {
      if (prev.buttonRevealed) return prev;
      return { ...prev, buttonRevealed: true };
    });
  }, []);

  const handleCheckoutRedirect = useCallback(() => {
    if (config.checkoutUrl && config.checkoutUrl.trim() !== '') {
      window.open(config.checkoutUrl, '_blank');
    } else {
      setToastMessage('⚠️ URL de checkout não configurada! Insira o link no Painel de Produtor (Ctrl + Shift + D).');
      const offerElem = document.getElementById('checkout-offer');
      if (offerElem) {
        offerElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [config.checkoutUrl]);

  const handlePortalActivated = useCallback(() => {
    setHasActivated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleActivateAudio = useCallback(() => {
    setVslState((prev) => ({
      ...prev,
      isMuted: false,
      isPlaying: true,
      hasStarted: true,
    }));
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(JSON.stringify({ method: 'setVolume', value: 1 }), '*');
        iframe.contentWindow.postMessage(JSON.stringify({ method: 'setMuted', value: false }), '*');
        iframe.contentWindow.postMessage(JSON.stringify({ method: 'play' }), '*');
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
      } catch {}
    }
    const videoEl = document.querySelector('video');
    if (videoEl) {
      try {
        videoEl.muted = false;
        videoEl.volume = 1;
        videoEl.play().catch(() => {});
      } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen cosmic-pearl-sky-bg text-slate-100 font-sans selection:bg-sky-300 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* High-Quality Ambient Celestial Video Loop & Star Dust Layer (includes its own floating particles & shooting stars) */}
      <AmbientCelestialBackground />

      {/* 1. Cinematic Celestial Portal Entrance Experience (Auto-playing without clicks) */}
      {!hasActivated && (
        <CelestialPortalIntro
          onActivated={handlePortalActivated}
        />
      )}

      {/* Top Fixed Gold Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-amber-500/20 z-[100] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 shadow-[0_0_10px_rgba(212,175,55,0.8)] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Dev & Tester Control Panel (Only active for producer when enabled) */}
      <DevControlPanel
        config={config}
        setConfig={setConfig}
        vslState={vslState}
        setVslState={setVslState}
        onForceReveal={handleButtonReveal}
        onReplayPortal={() => setHasActivated(false)}
        showDevButton={showDevMode}
        isOpen={isDevPanelOpen}
        setIsOpen={setIsDevPanelOpen}
      />

      {/* Top Header Bar */}
      <Header
        liveViewersCount={config.liveViewersCount}
        showDevButton={showDevMode}
        onToggleDevPanel={() => {
          setShowDevMode(true);
          setIsDevPanelOpen((prev) => !prev);
        }}
      />

      {/* Main Landing Page Experience - Second Stage: Vertical 9:16 Flow */}
      <main className="relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-start pt-1 sm:pt-3 pb-8 px-2 sm:px-4 animate-portal-stage">
        <HeadlineSection
          headline={config.headline}
          subheadline={config.subheadline}
          showSoundNotice={showSoundNotice}
          isMuted={vslState.isMuted}
          onActivateAudio={handleActivateAudio}
        />

        {/* VSL Video Area - Core Experience (Protagonist 9:16) */}
        <VslPlayer
          vslState={vslState}
          setVslState={setVslState}
          customEmbedUrl={config.customEmbedUrl}
          videoFormat={config.videoFormat || 'reels'}
          showDevTestButton={config.devModeEnabled}
          liveViewersCount={config.liveViewersCount}
          delayBeforeEndSeconds={config.delayBeforeEndSeconds}
          onButtonReveal={handleButtonReveal}
          onCheckoutClick={handleCheckoutRedirect}
        />

        {/* Rest of the Page: Revealed strictly on reaching the delay timestamp or video completion */}
        {vslState.buttonRevealed || vslState.isEnded || vslState.lifecycleStage === 'PAGE_UNLOCKED' ? (
          <div id="unlocked-content" className="animate-vortex-reveal space-y-6 pt-2">
            {/* 3 Core Pillars of the Infinity Million Ecosystem */}
            <AiEcosystemSection />

            {/* Futuristic Infinity Vortex Portal */}
            <VortexSection />

            {/* 5 Pillars of Strategic Execution */}
            <PillarsSection />

            {/* Main Cyber-Luxury Offer Section */}
            <OfferSection config={config} onCheckoutClick={handleCheckoutRedirect} />

            {/* Real Case Testimonials */}
            <TestimonialsSection />

            {/* Post-Testimonials Quick Checkout Action */}
            <PostTestimonialsCheckout config={config} onCheckoutClick={handleCheckoutRedirect} />

            {/* Frequently Asked Questions */}
            <FaqSection />
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto my-6 px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-sky-400/25 text-slate-400 text-[11px] font-mono shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Apresentação oficial em andamento • Assista para liberar o acesso</span>
            </div>
          </div>
        )}
      </main>

      {/* Floating System Warning Toast Notice */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] max-w-lg w-[92%] sm:w-auto animate-fade-in pointer-events-auto">
          <div className="bg-slate-950/95 border-2 border-amber-400/90 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-300">
                <AlertCircle className="w-5 h-5 animate-pulse text-amber-400" />
              </div>
              <div>
                <span className="font-mono font-extrabold text-amber-300 block text-[11px] uppercase tracking-wider">Aviso de Configuração</span>
                <span className="text-slate-200 text-xs font-medium">{toastMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 border border-slate-800"
              title="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Real-time Buyer Popups - Activated 2:00-2:10 (10s) and during the last 5 minutes */}
      <SocialProofPopups
        currentTime={vslState.currentTime}
        duration={vslState.duration}
        isPlaying={vslState.isPlaying}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
