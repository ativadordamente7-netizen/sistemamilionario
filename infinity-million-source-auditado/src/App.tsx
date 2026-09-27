/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CosmicBackground } from './components/CosmicBackground';
import { InfinityLogo } from './components/InfinityLogo';
import { HeadlineSection } from './components/HeadlineSection';
import { VslPlayer } from './components/VslPlayer';
import { UnlockCountdown } from './components/UnlockCountdown';
import { SocialNotifications } from './components/SocialNotifications';
import { VslPlaybackState } from './types';
import { VIDEO_DURATION_SECONDS, LAST_MINUTES_WINDOW_SECONDS, UNLOCK_TIME } from './config';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [playbackState, setPlaybackState] = useState<VslPlaybackState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number>(VIDEO_DURATION_SECONDS);
  // O desbloqueio nunca é lembrado entre visitas/atualizações: cada carregamento da página
  // começa sempre travado, exigindo assistir o vídeo (ou usar o botão de suporte) de novo.
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const unlockCTA = () => {
    setIsUnlocked(true);
  };

  const checkAndUnlock = (currentSec: number, totalDuration: number) => {
    const threshold = totalDuration > LAST_MINUTES_WINDOW_SECONDS
      ? totalDuration - LAST_MINUTES_WINDOW_SECONDS
      : 0;

    if (
      (currentSec >= threshold && threshold > 0) ||
      (totalDuration > 0 && (totalDuration - currentSec) <= LAST_MINUTES_WINDOW_SECONDS)
    ) {
      unlockCTA();
    }
  };

  // Synchronized session timer kicks off exclusively when user clicks PLAY and is actively playing
  useEffect(() => {
    if (!hasStarted || playbackState !== 'playing') return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        checkAndUnlock(next, videoDuration);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, playbackState, videoDuration]);

  // Se o estado do vídeo mudar para 'ended', desbloqueia imediatamente
  useEffect(() => {
    if (playbackState === 'ended') {
      unlockCTA();
    }
  }, [playbackState]);

  const handlePlayStarted = () => {
    setHasStarted(true);
    setPlaybackState('playing');
  };

  const handleTimeUpdate = (currentTime: number, duration?: number) => {
    const dur = (duration && duration > 0) ? Math.floor(duration) : videoDuration;
    if (duration && duration > 0 && duration !== videoDuration) {
      setVideoDuration(dur);
    }
    if (currentTime > 0) {
      const cur = Math.floor(currentTime);
      setElapsedSeconds(cur);
      checkAndUnlock(cur, dur);
    }
  };

  const handleVideoEnded = () => {
    unlockCTA();
  };

  const handleFastForward = () => {
    const target = Math.max(0, videoDuration - LAST_MINUTES_WINDOW_SECONDS);
    setElapsedSeconds(target);
    unlockCTA();
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-between text-[#1F1D19] overflow-x-hidden">
      {/* Dynamic Cosmic Pearl & Gold Background with 3D Dimensional Particles */}
      <CosmicBackground />

      {/* Main Single-View Experience Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center flex-1 px-4 z-10">
        {/* Top Infinity Emblem and Brand matching reference image */}
        <InfinityLogo />

        {/* High-Contrast Impact Headline */}
        <HeadlineSection />

        {/* 9:16 Vertical High-Conversion VSL Player */}
        <VslPlayer
          onPlayStarted={handlePlayStarted}
          playbackState={playbackState}
          setPlaybackState={setPlaybackState}
          hasStarted={hasStarted}
          elapsedSeconds={elapsedSeconds}
          onTimeUpdate={handleTimeUpdate}
          onVideoEnded={handleVideoEnded}
        />

        {/* Synchronized Countdown and Unlocked CTA */}
        <UnlockCountdown
          hasStarted={hasStarted}
          isPlaying={playbackState === 'playing'}
          playbackState={playbackState}
          elapsedSeconds={elapsedSeconds}
          videoDuration={videoDuration}
          isUnlocked={isUnlocked}
          onFastForward={handleFastForward}
          onUnlockedStateChange={(unlocked) => {
            if (unlocked) {
              unlockCTA();
            }
          }}
        />
      </div>

      {/* Discrete Social Proof Notifications during VSL playback */}
      <SocialNotifications isVslPlaying={hasStarted && playbackState === 'playing'} />

      {/* Minimalist discreet footer note to ground the legal/copyright context */}
      <footer className="w-full py-4 text-center z-10 select-none">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#A69E8F] font-['Outfit']">
          © {new Date().getFullYear()} Infinity Million • Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
}
