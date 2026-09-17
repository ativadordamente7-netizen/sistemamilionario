import React, { useEffect, useRef, memo } from 'react';

const AmbientCelestialBackgroundComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // High-performance ambient celestial canvas with floating stellar particles & subtle shooting stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Lightweight stellar particles
    const numParticles = 36;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(0.1 + Math.random() * 0.2),
      size: Math.random() * 1.6 + 0.5,
      baseAlpha: Math.random() * 0.45 + 0.15,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.015 + Math.random() * 0.015,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.006 + Math.random() * 0.01,
      colorType: Math.random() > 0.65 ? 'gold' : Math.random() > 0.35 ? 'pearl' : 'sky',
    }));

    // Micro shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      alpha: number;
      life: number;
      maxLife: number;
    }
    const shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = performance.now();

    const spawnShootingStar = () => {
      const startX = Math.random() * width * 0.8 + width * 0.1;
      const startY = Math.random() * height * 0.25;
      const speed = 7 + Math.random() * 3;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;

      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 50 + Math.random() * 30,
        alpha: 0,
        life: 0,
        maxLife: 40 + Math.random() * 20,
      });
    };

    const render = (time: number) => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Trigger subtle shooting star every 9-14 seconds
      if (time - lastShootingStarTime > 9000 + Math.random() * 5000) {
        spawnShootingStar();
        lastShootingStarTime = time;
      }

      // Draw floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.swayPhase += p.swaySpeed;
        p.twinklePhase += p.twinkleSpeed;

        p.x += p.vx + Math.sin(p.swayPhase) * 0.12;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.twinklePhase));

        let color = `rgba(255, 255, 255, ${alpha})`;
        if (p.colorType === 'sky') {
          color = `rgba(186, 230, 253, ${alpha * 0.9})`;
        } else if (p.colorType === 'gold') {
          color = `rgba(254, 240, 138, ${alpha * 0.85})`;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw subtle shooting stars
      for (let s = shootingStars.length - 1; s >= 0; s--) {
        const star = shootingStars[s];
        star.life++;
        star.x += star.vx;
        star.y += star.vy;

        if (star.life < 8) {
          star.alpha = (star.life / 8) * 0.65;
        } else {
          star.alpha = Math.max(0, 0.65 * (1 - (star.life - 8) / (star.maxLife - 8)));
        }

        if (star.alpha > 0.02) {
          const tailX = star.x - (star.vx / 8) * star.length;
          const tailY = star.y - (star.vy / 8) * star.length;

          const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
          grad.addColorStop(0.4, `rgba(186, 230, 253, ${star.alpha * 0.5})`);
          grad.addColorStop(1, 'rgba(186, 230, 253, 0)');

          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.3;
          ctx.lineCap = 'round';
          ctx.stroke();

          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

        if (star.life >= star.maxLife) {
          shootingStars.splice(s, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Base Dark Twilight Infinite Backdrop */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* 2. Multi-Stop Radial Light Orbs (Pearl, Sky Blue & Soft Gold) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(224,242,254,0.1)_0%,transparent_70%)] blur-2xl" />
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.06)_0%,transparent_70%)] blur-2xl" />
      <div className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(254,240,138,0.05)_0%,transparent_70%)] blur-2xl" />

      {/* 3. Ambient Celestial Floating Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70 mix-blend-screen"
      />

      {/* 4. Legibility Protection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/75 via-[#030712]/85 to-[#02040a]/95 pointer-events-none" />
    </div>
  );
};

export const AmbientCelestialBackground = memo(AmbientCelestialBackgroundComponent);
