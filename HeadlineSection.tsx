import React, { memo } from 'react';

interface HeadlineSectionProps {
  headline?: string;
  subheadline?: string;
  showSoundNotice?: boolean;
  isMuted?: boolean;
  onActivateAudio?: () => void;
}

const HeadlineSectionComponent: React.FC<HeadlineSectionProps> = ({
  headline = 'ATIVE O INFINITY MILLION.',
  subheadline = 'Copie e cole, ative o Sistema Milionário e faça 100 mil em 45 dias',
}) => {
  return (
    <section className="w-full max-w-3xl mx-auto px-3 sm:px-4 pt-1 sm:pt-3 pb-1 sm:pb-2 text-center text-slate-100 flex flex-col items-center justify-center select-none">
      {/* 1. Primary HEADLINE */}
      <h1 className="w-full text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase leading-snug sm:leading-tight text-white animate-portal-headline drop-shadow-md">
        <span className="headline-gold-stroke block">
          {headline || 'ATIVE O INFINITY MILLION.'}
        </span>
      </h1>

      {/* 2. SUB-HEADLINE: Copie e cole, ative o Sistema Milionário e faça 100 mil em 45 dias */}
      <p className="w-full max-w-xl text-xs sm:text-sm md:text-base text-sky-100/90 font-medium leading-relaxed mt-1 sm:mt-1.5 px-2 animate-portal-subheadline">
        {subheadline || 'Copie e cole, ative o Sistema Milionário e faça 100 mil em 45 dias'}
      </p>
    </section>
  );
};

export const HeadlineSection = memo(HeadlineSectionComponent);
