import { useState, useEffect, useCallback } from 'react';

export const OFFER_REVEAL_KEY = 'infinity_million_offer_reveal_time';

/**
 * Records the exact timestamp when the offer button/section is revealed.
 * Idempotent: does not overwrite if already recorded in this session.
 */
export function recordOfferRevealTimestamp(): number {
  try {
    const existing = sessionStorage.getItem(OFFER_REVEAL_KEY);
    if (existing) {
      const parsed = parseInt(existing, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    const now = Date.now();
    sessionStorage.setItem(OFFER_REVEAL_KEY, now.toString());
    return now;
  } catch {
    return Date.now();
  }
}

/**
 * Resets the recorded reveal timestamp (useful for testing & dev panel resets).
 */
export function resetOfferRevealTimestamp(): void {
  try {
    sessionStorage.removeItem(OFFER_REVEAL_KEY);
    sessionStorage.removeItem('infinity_million_offer_deadline');
  } catch {}
}

/**
 * Computes the remaining seconds based on the recorded reveal timestamp.
 */
export function getRemainingOfferSeconds(initialMinutes: number = 15): number {
  try {
    const stored = sessionStorage.getItem(OFFER_REVEAL_KEY);
    if (!stored) {
      return initialMinutes * 60;
    }
    const revealedAt = parseInt(stored, 10);
    if (isNaN(revealedAt)) {
      return initialMinutes * 60;
    }
    const elapsedSeconds = Math.floor((Date.now() - revealedAt) / 1000);
    const totalDurationSeconds = initialMinutes * 60;
    return Math.max(0, totalDurationSeconds - elapsedSeconds);
  } catch {
    return initialMinutes * 60;
  }
}

/**
 * Hook to synchronize the countdown timer precisely with the moment the offer is revealed.
 */
export function useSynchronizedCountdown(isRevealed: boolean, initialMinutes: number = 15) {
  const [totalSeconds, setTotalSeconds] = useState<number>(() => {
    if (!isRevealed) {
      return initialMinutes * 60;
    }
    return getRemainingOfferSeconds(initialMinutes);
  });

  const [centis, setCentis] = useState<number>(9);

  // Sync state whenever isRevealed changes
  useEffect(() => {
    if (isRevealed) {
      recordOfferRevealTimestamp();
      setTotalSeconds(getRemainingOfferSeconds(initialMinutes));
    }
  }, [isRevealed, initialMinutes]);

  // Main 1-second interval
  useEffect(() => {
    if (!isRevealed || totalSeconds <= 0) return;

    const interval = setInterval(() => {
      setTotalSeconds(() => {
        const remaining = getRemainingOfferSeconds(initialMinutes);
        if (remaining <= 0) {
          clearInterval(interval);
          return 0;
        }
        return remaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRevealed, totalSeconds, initialMinutes]);

  // Fast decisecond ticking for urgency (100ms interval)
  useEffect(() => {
    if (!isRevealed || totalSeconds <= 0) {
      setCentis(0);
      return;
    }

    const msInterval = setInterval(() => {
      setCentis((prev) => (prev <= 0 ? 9 : prev - 1));
    }, 100);

    return () => clearInterval(msInterval);
  }, [isRevealed, totalSeconds]);

  const resetTimer = useCallback(() => {
    resetOfferRevealTimestamp();
    setTotalSeconds(initialMinutes * 60);
    setCentis(9);
  }, [initialMinutes]);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const maxSeconds = initialMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, (totalSeconds / maxSeconds) * 100));

  return {
    totalSeconds,
    hours,
    minutes,
    seconds,
    centis,
    progressPercent,
    isExpired: totalSeconds <= 0,
    resetTimer,
  };
}
