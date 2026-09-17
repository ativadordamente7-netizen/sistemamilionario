export type VslLifecycleStage =
  | 'VIDEO_LOADING'
  | 'VIDEO_PLAYING'
  | 'FINAL_3_MINUTES'
  | 'COUNTDOWN_ACTIVE'
  | 'PAGE_UNLOCKED';

export interface VslState {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number; // in seconds
  duration: number; // default total length in seconds (e.g. 15:00 = 900s)
  remainingSeconds?: number; // remaining duration - currentTime
  hasStarted: boolean;
  isEnded: boolean;
  buttonRevealed: boolean;
  delayTimeSeconds: number; // 180s for final 3 minutes
  lifecycleStage?: VslLifecycleStage;
}

export interface SalesPageConfig {
  headline: string;
  subheadline: string;
  totalDurationSeconds: number;
  delayBeforeEndSeconds: number; // user specified 4 minutes (240s) before video ends
  customEmbedUrl: string; // optional custom VSL iframe/embed or video link
  videoFormat?: 'reels' | 'widescreen'; // reels = 9:16 vertical, widescreen = 16:9
  bannerImageUrl?: string; // optional custom hero banner image URL
  checkoutUrl: string;
  priceOriginal: string;
  priceCurrent: string;
  installmentPrice: string;
  installmentsCount: number;
  spotsRemaining: number;
  liveViewersCount: number;
  devModeEnabled: boolean;
}

export interface SocialProofNotification {
  id: string;
  name: string;
  city: string;
  timeAgo: string;
  amount: string;
  avatar: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  result: string;
  story: string;
  timeframe: string;
  avatar: string;
  verified: boolean;
}
