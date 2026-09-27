import React from 'react';

export const HeadlineSection: React.FC = () => {
  return (
    <section id="hero-section" className="text-center px-4 max-w-3xl mx-auto mt-4 mb-6 sm:mb-8 select-none">
      {/* Primary Headline */}
      <h1 
        className="text-2xl sm:text-4xl md:text-[2.65rem] font-extrabold uppercase tracking-tight sm:tracking-normal text-[#1A1813] font-['Cinzel'] leading-tight sm:leading-tight drop-shadow-sm"
      >
        ATIVE O INFINITY MILLION
      </h1>

      {/* Subheadline with secondary golden highlight line */}
      <div className="mt-3 sm:mt-4 space-y-1 font-['Outfit']">
        <p className="text-xs sm:text-base md:text-lg font-medium tracking-[0.14em] sm:tracking-[0.2em] text-[#635E53] uppercase">
          COPIE E COLE. ATIVE O SISTEMA.
        </p>
        <p className="text-sm sm:text-lg md:text-xl font-bold tracking-[0.08em] sm:tracking-[0.14em] uppercase text-metallic-gold">
          E FATURE ATÉ 100 MIL EM 45 DIAS.
        </p>
      </div>
    </section>
  );
};
