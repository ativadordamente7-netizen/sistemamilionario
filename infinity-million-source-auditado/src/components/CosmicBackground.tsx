import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse parallax for dimensional depth
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.05;
      targetMouseY = (e.clientY - height / 2) * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Dimensional Particle System with Z-Depth & Luminous Star-Dust Physics
    const FOV = 420;
    const PARTICLE_COUNT = Math.min(Math.floor(width / 12), 125);

    interface Particle3D {
      x: number;
      y: number;
      z: number;
      size: number;
      colorType: 'gold' | 'pearl' | 'champagne';
      angle: number;
      radius: number;
      orbitalSpeed: number;
      zSpeed: number;
      baseOpacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
      radialBlurScale: number; // Factor for soft optical radial blur expansion
      isNebulaMote: boolean; // Ultra-diffuse star-dust cloudlet
      hasSparkle: boolean;
      waveOffset: number;
    }

    const particles: Particle3D[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Swirling spiral distribution to emulate the galaxy nebula in the reference image
      const radius = Math.random() * (Math.max(width, height) * 0.68) + 25;
      const angle = Math.random() * Math.PI * 2;
      const z = Math.random() * 850 - 220; // -220 (close) to 630 (deep)

      const colorRand = Math.random();
      const colorType = colorRand < 0.48 ? 'gold' : colorRand < 0.82 ? 'champagne' : 'pearl';
      const isNebulaMote = Math.random() < 0.22; // 22% are soft ethereal cloudlets

      particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * (radius * 0.42),
        z,
        // Nebula motes are larger and more diffuse; stardust grains are finer
        size: isNebulaMote ? Math.random() * 3.5 + 2.0 : Math.random() * 2.2 + 0.7,
        colorType,
        angle,
        radius,
        orbitalSpeed: (0.0006 + Math.random() * 0.0014) * (Math.random() > 0.08 ? 1 : -1),
        zSpeed: (Math.random() - 0.5) * 0.35,
        baseOpacity: isNebulaMote ? Math.random() * 0.35 + 0.12 : Math.random() * 0.55 + 0.25,
        twinkleSpeed: Math.random() * 0.028 + 0.012,
        twinklePhase: Math.random() * Math.PI * 2,
        radialBlurScale: isNebulaMote ? Math.random() * 3.0 + 4.5 : Math.random() * 2.5 + 3.2,
        isNebulaMote,
        hasSparkle: !isNebulaMote && Math.random() < 0.3,
        waveOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.012;

      // Smooth mouse easing for gentle spatial parallax
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.48 + mouseX;
      const centerY = height * 0.42 + mouseY;

      // Sort particles by Z for authentic depth and volumetric layering (back-to-front)
      particles.sort((a, b) => b.z - a.z);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fluid organic movement - dynamic orbital drift & floating cosmic wind
        p.angle += p.orbitalSpeed;
        p.z += p.zSpeed;
        p.twinklePhase += p.twinkleSpeed;

        // Loop boundaries in 3D seamlessly
        if (p.z < -220) p.z = 630;
        if (p.z > 630) p.z = -220;

        // Micro-undulations in space (prevents any static point feeling)
        const organicRadius = p.radius + Math.sin(time * 0.8 + p.waveOffset) * 12;
        const rawX = Math.cos(p.angle) * organicRadius + Math.sin(p.angle * 2 + time) * 8;
        const rawY = Math.sin(p.angle) * (organicRadius * 0.38) + Math.cos(p.angle * 2.5 + time * 1.1) * 16;

        // 3D Perspective Projection
        const depth = p.z + FOV;
        if (depth <= 0) continue;

        const scale = FOV / depth;
        const projX = centerX + rawX * scale;
        const projY = centerY + rawY * scale;

        // Viewport boundaries cull check with generous margin for radial glow halos
        if (projX < -70 || projX > width + 70 || projY < -70 || projY > height + 70) continue;

        const projSize = Math.max(p.size * scale, 0.45);
        const depthFactor = Math.max(0.12, Math.min(1, 1 - p.z / 780));
        
        // Continuous, multi-harmonic opacity variation
        const breathingWave = Math.sin(p.twinklePhase + time * 1.4) * 0.35 + Math.cos(p.angle * 1.5 + time * 0.7) * 0.15;
        const currentOpacity = Math.min(
          Math.max(p.baseOpacity * depthFactor * (0.65 + breathingWave), 0.03),
          0.92
        );

        // Radial blur glow radius: expansive optical falloff simulating floating luminous stardust
        const glowRadius = Math.max(projSize * p.radialBlurScale, 2.5);

        // Multistage optical radial gradient creating true luminous star-dust blur
        const radialGradient = ctx.createRadialGradient(
          projX, projY, 0,
          projX, projY, glowRadius
        );

        if (p.colorType === 'gold') {
          // Radiant 24K Liquid Gold
          radialGradient.addColorStop(0, `rgba(255, 252, 235, ${Math.min(currentOpacity * 1.25, 1)})`);
          radialGradient.addColorStop(0.18, `rgba(240, 205, 115, ${currentOpacity * 0.9})`);
          radialGradient.addColorStop(0.48, `rgba(200, 164, 93, ${currentOpacity * 0.42})`);
          radialGradient.addColorStop(0.8, `rgba(168, 121, 36, ${currentOpacity * 0.12})`);
          radialGradient.addColorStop(1, 'rgba(168, 121, 36, 0)');
        } else if (p.colorType === 'champagne') {
          // Golden Champagne Starlight
          radialGradient.addColorStop(0, `rgba(255, 255, 250, ${Math.min(currentOpacity * 1.2, 1)})`);
          radialGradient.addColorStop(0.22, `rgba(247, 237, 212, ${currentOpacity * 0.85})`);
          radialGradient.addColorStop(0.52, `rgba(226, 210, 175, ${currentOpacity * 0.38})`);
          radialGradient.addColorStop(0.82, `rgba(200, 185, 150, ${currentOpacity * 0.1})`);
          radialGradient.addColorStop(1, 'rgba(200, 185, 150, 0)');
        } else {
          // Celestial Pearl Diamond White
          radialGradient.addColorStop(0, `rgba(255, 255, 255, ${Math.min(currentOpacity * 1.3, 1)})`);
          radialGradient.addColorStop(0.25, `rgba(253, 250, 242, ${currentOpacity * 0.9})`);
          radialGradient.addColorStop(0.55, `rgba(238, 232, 220, ${currentOpacity * 0.35})`);
          radialGradient.addColorStop(0.85, `rgba(220, 212, 198, ${currentOpacity * 0.08})`);
          radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.beginPath();
        ctx.arc(projX, projY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = radialGradient;
        ctx.fill();

        // Elegant cross-glimmer for prominent stardust motes close to camera
        if (p.hasSparkle && currentOpacity > 0.4 && projSize > 1.6) {
          const glintLength = projSize * (2.8 + Math.sin(time * 2.5 + p.waveOffset) * 0.8);
          ctx.beginPath();
          ctx.moveTo(projX - glintLength, projY);
          ctx.lineTo(projX + glintLength, projY);
          ctx.moveTo(projX, projY - glintLength);
          ctx.lineTo(projX, projY + glintLength);
          ctx.strokeStyle = `rgba(255, 252, 240, ${currentOpacity * 0.4})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#FDFBF7]">
      {/* 1. Base Celestial Light Atmosphere */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 120% 100% at 50% 30%, #FFFFFF 15%, #FBF8F1 45%, #EFE9DC 80%, #E2DAC8 100%)'
        }}
      />

      {/* 2. The Galactic Swirl / Luminous Nebula Vortex (Matching the reference image) */}
      <div 
        className="absolute top-[12%] sm:top-[16%] left-1/2 -translate-x-1/2 w-[750px] sm:w-[1100px] md:w-[1300px] h-[450px] sm:h-[650px] rounded-[100%] opacity-85 blur-[45px] animate-pulse-glow"
        style={{
          background: 'radial-gradient(ellipse at 46% 48%, rgba(255,255,255,1) 0%, rgba(255,248,230,0.85) 25%, rgba(235,215,168,0.45) 50%, rgba(200,164,93,0.18) 70%, transparent 85%)',
          transform: 'translate(-50%, -20%) rotate(-12deg)'
        }}
      />

      {/* 3. Spiral Galaxy Dust Bands (SVG vector rings matching reference spiral) */}
      <svg 
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] h-[550px] sm:h-[800px] opacity-40 pointer-events-none" 
        viewBox="0 0 1000 600" 
        fill="none"
        style={{ transform: 'translateX(-50%) rotate(-10deg)' }}
      >
        <defs>
          <linearGradient id="spiralGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#C8A45D" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#EAD8AE" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="nebulaCoreGleam" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFF4D4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C8A45D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central Brilliant Galactic Eye */}
        <ellipse cx="480" cy="270" rx="140" ry="55" fill="url(#nebulaCoreGleam)" filter="blur(20px)" />

        {/* Swirling Spiral Arm Outer Arcs */}
        <path d="M480,270 C600,240 760,280 840,360 C900,420 860,490 730,520 C550,560 300,510 200,430 C120,360 140,270 240,210 C360,140 580,140 720,180" stroke="url(#spiralGold)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 12" filter="blur(1px)" />
        <path d="M480,270 C400,285 310,260 260,210 C210,160 260,110 380,90 C540,70 760,120 840,190 C920,260 900,340 780,410" stroke="url(#spiralGold)" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
        <path d="M480,270 C540,260 620,280 670,320 C710,360 680,410 600,430 C490,460 360,430 300,380 C260,340 280,290 340,260" stroke="url(#spiralGold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      </svg>

      {/* 4. Floating Celestial Spheres / Planets (Direct reference elements) */}
      {/* Upper Right Moon / Celestial Orb */}
      <div 
        className="absolute top-[8%] right-[8%] sm:right-[15%] w-20 h-20 sm:w-32 sm:h-32 rounded-full pointer-events-none opacity-75 sm:opacity-85"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #E8E2D2 45%, #C2B79E 80%, #8A7E64 100%)',
          boxShadow: '0 0 35px rgba(255, 255, 255, 0.9), inset -8px -8px 20px rgba(70, 60, 40, 0.4), 0 10px 30px rgba(180, 150, 90, 0.25)'
        }}
      >
        {/* Soft Golden Ring around planet */}
        <div className="absolute -inset-2.5 rounded-full border border-[#C8A45D]/30 blur-[0.5px]" />
      </div>

      {/* Small floating sphere midground left */}
      <div 
        className="absolute top-[38%] left-[6%] sm:left-[12%] w-7 h-7 sm:w-11 sm:h-11 rounded-full pointer-events-none opacity-65"
        style={{
          background: 'radial-gradient(circle at 30% 25%, #FFFFFF 0%, #E6DEC9 50%, #A39678 100%)',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.7), inset -3px -3px 8px rgba(0, 0, 0, 0.25)'
        }}
      />

      {/* Small floating sphere far background right */}
      <div 
        className="absolute top-[28%] right-[4%] sm:right-[7%] w-5 h-5 sm:w-8 sm:h-8 rounded-full pointer-events-none opacity-55"
        style={{
          background: 'radial-gradient(circle at 30% 25%, #FFFFFF 0%, #D4CABB 60%, #94886E 100%)',
          boxShadow: '0 0 12px rgba(255, 255, 255, 0.6)'
        }}
      />

      {/* 5. Architectural White Steps and Podium at Base (Reference image aesthetic) */}
      <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-64 pointer-events-none overflow-hidden opacity-85">
        <svg className="w-full h-full" viewBox="0 0 1440 260" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="stepGrad1" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#F6F2EA" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#E3DC Flora" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="stepGoldLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C8A45D" stopOpacity="0" />
              <stop offset="25%" stopColor="#C8A45D" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#F2E0B5" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#C8A45D" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C8A45D" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Curved podium platforms */}
          <path d="M0,260 L0,200 Q720,130 1440,200 L1440,260 Z" fill="#F8F5EE" opacity="0.6" />
          <path d="M0,200 Q720,130 1440,200" stroke="url(#stepGoldLine)" strokeWidth="1" />

          <path d="M120,260 L120,220 Q720,165 1320,220 L1320,260 Z" fill="#FFFFFF" opacity="0.75" />
          <path d="M120,220 Q720,165 1320,220" stroke="url(#stepGoldLine)" strokeWidth="1.2" />

          <path d="M300,260 L300,240 Q720,195 1140,240 L1140,260 Z" fill="#FFFFFF" opacity="0.9" />
          <path d="M300,240 Q720,195 1140,240" stroke="url(#stepGoldLine)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 6. Futuristic Telemetry & Circuit Lines (Identical to reference image) */}
      {/* Top Left Telemetry: FREQUÊNCIA */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-10 hidden sm:flex items-center space-x-2 text-[10px] tracking-[0.25em] text-[#917B4F] uppercase font-mono select-none opacity-70">
        <span className="w-2 h-2 rounded-full border border-[#C8A45D] flex items-center justify-center">
          <span className="w-1 h-1 rounded-full bg-[#A87924]" />
        </span>
        <span>FREQUÊNCIA</span>
        <span className="w-12 h-[1px] bg-gradient-to-r from-[#C8A45D]/60 to-transparent inline-block" />
      </div>

      {/* Bottom Left Telemetry: SISTEMAS HOJE. LIBERDADE SEMPRE. */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 hidden sm:flex items-center space-x-2 text-[10px] tracking-[0.25em] text-[#917B4F] uppercase font-mono select-none opacity-60">
        <span>SISTEMAS HOJE. LIBERDADE SEMPRE.</span>
        <span className="w-8 h-[1px] bg-[#C8A45D]/40" />
      </div>

      {/* Bottom Right Telemetry */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 hidden sm:flex items-center space-x-2 text-[10px] tracking-[0.25em] text-[#917B4F] uppercase font-mono select-none opacity-60">
        <span className="w-8 h-[1px] bg-[#C8A45D]/40" />
        <span>SISTEMAS HOJE. LIBERDADE SEMPRE.</span>
      </div>

      {/* Right Arch Ring Telemetry: MENTALIDADE • FREQUÊNCIA • LIBERDADE */}
      <div className="absolute top-16 right-4 sm:top-24 sm:right-8 hidden md:flex flex-col items-end space-y-1 text-[9px] tracking-[0.3em] text-[#9E875B] uppercase font-mono select-none opacity-60">
        <span>MENTALIDADE</span>
        <span>FREQUÊNCIA</span>
        <span>LIBERDADE</span>
        <div className="w-16 h-[1px] bg-gradient-to-l from-[#C8A45D]/60 to-transparent mt-1" />
      </div>

      {/* 7. Canvas with Interactive 3D Perspective Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full opacity-90" />
    </div>
  );
};
