export interface SocialNotification {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  city?: string;
}

export type VslPlaybackState = 'idle' | 'playing' | 'paused' | 'ended';

export interface AppConfig {
  videoUrl: string;
  videoId: string;
  ctaUrl: string;
  totalExperienceSeconds: number;
  unlockThresholdSeconds: number;
  notificationIntervalSeconds: number;
}
