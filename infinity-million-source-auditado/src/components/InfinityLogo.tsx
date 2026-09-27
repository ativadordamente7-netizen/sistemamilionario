import React from 'react';

interface InfinityLogoProps {
  onClick?: () => void;
}

export const InfinityLogo: React.FC<InfinityLogoProps> = ({ onClick }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center select-none pt-4 sm:pt-8 pb-1 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      title={onClick ? 'Clique para reativar o Portal Dimensional' : undefined}
    >
      {/* 3D Double-Bevel Golden Infinity Emblem (Exact Match to Reference Image) */}
      <div className="relative flex items-center justify-center mb-2 group">
        {/* Soft atmospheric golden flare */}
        <div className="absolute inset-0 bg-[#C8A45D]/25 blur-xl rounded-full scale-150 animate-pulse-glow" />

        <svg 
          className="relative w-20 h-10 sm:w-24 sm:h-12 drop-shadow-[0_4px_16px_rgba(200,164,93,0.45)]" 
          viewBox="0 0 120 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 3D Metallic Gold Outer Bevel Gradient */}
            <linearGradient id="goldOuterRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="15%" stopColor="#F5DC9A" />
              <stop offset="40%" stopColor="#C8A45D" />
              <stop offset="70%" stopColor="#8A6016" />
              <stop offset="90%" stopColor="#E2C172" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Inner Metallic Shadow Gradient for Deep 3D Tube Effect */}
            <linearGradient id="goldInnerShadow" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5E3F0A" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#C8A45D" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
            </linearGradient>

            {/* Specular Core Flare */}
            <radialGradient id="goldCoreGleam" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="60%" stopColor="#F4D994" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A87924" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base 3D Shaded Silhouette */}
          <path 
            d="M34 12 C19 12 8 20 8 30 C8 40 19 48 34 48 C50 48 60 30 60 30 C60 30 70 48 86 48 C101 48 112 40 112 30 C112 20 101 12 86 12 C70 12 60 30 60 30 C60 30 50 12 34 12 Z" 
            stroke="url(#goldOuterRing)" 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* 3D Highlight Tube Layer */}
          <path 
            d="M34 12 C19 12 8 20 8 30 C8 40 19 48 34 48 C50 48 60 30 60 30 C60 30 70 48 86 48 C101 48 112 40 112 30 C112 20 101 12 86 12 C70 12 60 30 60 30 C60 30 50 12 34 12 Z" 
            stroke="url(#goldInnerShadow)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Specular Gleam Arcs */}
          <path 
            d="M28 14 C18 14 11 19 10 26" 
            stroke="#FFFFFF" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.9"
          />
          <path 
            d="M92 46 C102 46 109 41 110 34" 
            stroke="#FFFFFF" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Brand Typography matching the reference image */}
      <div className="flex flex-col items-center leading-none text-center">
        <h2 
          className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-metallic-gold tracking-[0.28em] sm:tracking-[0.34em] font-['Cinzel'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)] pl-2"
        >
          INFINITY
        </h2>
        <span 
          className="text-xs sm:text-sm tracking-[0.55em] sm:tracking-[0.65em] uppercase font-bold text-[#4D422E] pl-2 font-['Outfit'] mt-1"
        >
          M I L L I O N
        </span>
      </div>
    </div>
  );
};
