import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

interface CelestialPortalIntroProps {
  onActivated: () => void;
}

interface QuantumParticle {
  t: number; // position parameter along the curve [0, 2*PI]
  speed: number;
  size: number;
  color: string;
  alpha: number;
  twinkle: number;
  layer: number; // 0 = inner core, 1 = mid plasma, 2 = outer halo
  offsetDist: number;
  offsetAngle: number;
}

interface CelestialBurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  twinklePhase: number;
  twinkleSpeed: number;
  hasGlint: boolean;
  glintSize: number;
  glintAngle: number;
  glintRotSpeed: number;
  alpha: number;
  maxAlpha: number;
  birthTime: number;
  lifespan: number;
}

/**
 * Portal Infinity Million - O SÍMBOLO INTEGRADO QUE SE TRANSFORMA NO PORTAL E CAI PARA A VSL
 * 
 * 1. O Símbolo do Infinito não é mais uma foto/vídeo isolado: é sintetizado e renderizado
 *    diretamente no Canvas em 60fps com curvas paramétricas de Bernoulli, partículas quânticas
 *    luminosas e plasma em azul celeste e branco diamantino.
 * 2. Transformação Orgânica do Símbolo em Portal:
 *    - 0.0s - 2.4s: Símbolo do infinito vivo, com partículas percorrendo o laço contínuo.
 *    - 2.4s - 3.8s: Aceleração quântica. O centro do símbolo se abre, os dois lobos do infinito
 *      se expandem, giram e se fundem morfologicamente no anel circular do portal dimensional.
 *    - 3.8s - 4.1s: FLASH DE LUZ AZUL CELESTE quando o símbolo completa a transmutação em portal circular.
 * 3. O Portal Cai para a VSL:
 *    - 4.1s - 4.8s: O portal entra em mergulho vertical gravitacional ("caindo para a VSL"),
 *      deslocando todo o vórtice e horizonte de eventos para baixo em direção ao player da VSL,
 *      revelando a página com a apresentação oficial.
 */
export const CelestialPortalIntro: React.FC<CelestialPortalIntroProps> = ({ onActivated }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDiving, setIsDiving] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [statusText, setStatusText] = useState('SINTONIZANDO SÍMBOLO INFINITY...');
  const [progressPercent, setProgressPercent] = useState(0);

  const hasActivatedRef = useRef(false);
  const isDissolvingRef = useRef(false);
  const onActivatedRef = useRef(onActivated);
  const startTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasTriggeredCelestialAudioRef = useRef(false);
  const hasTriggeredDiveAudioRef = useRef(false);

  const TOTAL_DURATION_SECONDS = 4.8;
  const MORPH_START_TIMESTAMP = 2.4;
  const UNLOCK_TIMESTAMP = 3.8;
  const DIVE_TIMESTAMP = 4.1;

  useEffect(() => {
    onActivatedRef.current = onActivated;
  }, [onActivated]);

  // Efeito sonoro cósmico nativo sintetizado via Web Audio API
  const playPortalSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(115, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 2.4);
      osc.frequency.exponentialRampToValueAtTime(460, ctx.currentTime + 3.8);
      osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 4.1);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 4.8); // Mergulho para baixo

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(500, ctx.currentTime + 2.4);
      filter.frequency.exponentialRampToValueAtTime(4800, ctx.currentTime + 3.8);
      filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 4.8);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.8);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.4);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.78);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 4.8);
    } catch {
      // Autoplay fallback
    }
  }, []);

  // Chime celestial do flash
  const playCelestialFlashChime = useCallback(() => {
    if (hasTriggeredCelestialAudioRef.current) return;
    hasTriggeredCelestialAudioRef.current = true;

    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const celestialFreqs = [1046.50, 1318.51, 1567.98, 2093.00];
      celestialFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = idx * 0.035;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, ctx.currentTime + delay + 0.55);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.7);
      });
    } catch {
      // Ignora erro
    }
  }, []);

  // Som grave e expansivo do mergulho/queda para a VSL
  const playDiveSound = useCallback(() => {
    if (hasTriggeredDiveAudioRef.current) return;
    hasTriggeredDiveAudioRef.current = true;

    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.6);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {
      // Ignora
    }
  }, []);

  useEffect(() => {
    playPortalSound();
  }, [playPortalSound]);

  // Dispara a travessia antecipada ao clicar
  const triggerPortalCrossing = useCallback(() => {
    if (hasActivatedRef.current) return;
    hasActivatedRef.current = true;
    setIsUnlocked(true);
    setIsDiving(true);
    setStatusText('CAINDO PARA A VSL • ENTRANDO...');
    setProgressPercent(100);
    playCelestialFlashChime();
    playDiveSound();

    setTimeout(() => {
      isDissolvingRef.current = true;
      setIsDissolving(true);
    }, 420);

    setTimeout(() => {
      onActivatedRef.current?.();
    }, 680);
  }, [playCelestialFlashChime, playDiveSound]);

  // Motor Gráfico Canvas: Renderização Integrada do Símbolo, Morfologia em Portal e Mergulho Vertical
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    startTimeRef.current = performance.now();

    // 1. Campo Estelar de Fundo (Warp Tunnel)
    const numStars = 120;
    const stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * width * 1.8,
      y: (Math.random() - 0.5) * height * 1.8,
      z: Math.random() * 900 + 100,
      baseRadius: Math.random() * 1.6 + 0.4,
      twinkle: Math.random() * Math.PI * 2,
    }));

    // 2. Partículas Quânticas do Símbolo do Infinito
    // Estas partículas percorrem a curva do lemniscato de Bernoulli e se adaptam à morfologia
    const numQuantumParticles = 160;
    const quantumPalette = ['#FFFFFF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#00F0FF', '#0284C7'];
    const quantumParticles: QuantumParticle[] = Array.from({ length: numQuantumParticles }, (_, i) => ({
      t: (i / numQuantumParticles) * Math.PI * 2,
      speed: (Math.random() * 0.4 + 0.8),
      size: Math.random() * 2.8 + 1.2,
      color: quantumPalette[Math.floor(Math.random() * quantumPalette.length)],
      alpha: Math.random() * 0.4 + 0.6,
      twinkle: Math.random() * Math.PI * 2,
      layer: i % 3,
      offsetDist: (Math.random() - 0.5) * 8,
      offsetAngle: Math.random() * Math.PI * 2,
    }));

    // 3. Partículas do Flash de Luz Azul Celeste
    const burstParticles: CelestialBurstParticle[] = [];
    let burstSpawned = false;

    const spawnBurst = (cx: number, cy: number) => {
      if (burstSpawned) return;
      burstSpawned = true;
      setIsUnlocked(true);
      playCelestialFlashChime();

      for (let i = 0; i < 140; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5.0 + 1.5;
        const color = quantumPalette[Math.floor(Math.random() * quantumPalette.length)];

        burstParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.2 + 1.2,
          color,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 12.0 + 6.0,
          hasGlint: Math.random() > 0.35,
          glintSize: Math.random() * 8.0 + 4.0,
          glintAngle: Math.random() * Math.PI,
          glintRotSpeed: (Math.random() - 0.5) * 0.12,
          alpha: 0,
          maxAlpha: Math.random() * 0.4 + 0.6,
          birthTime: performance.now(),
          lifespan: Math.random() * 1.1 + 0.8,
        });
      }
    };

    // 4. Ondas de Choque
    const shockwaves = [
      { delay: 3.8, speed: 2.2 },
      { delay: 4.0, speed: 2.6 },
      { delay: 4.2, speed: 3.0 },
    ];

    /**
     * Função Matemática que interpola continuamente o Símbolo do Infinito (Lemniscato)
     * para o Círculo Dimensional do Portal:
     * 
     * @param theta Ângulo do parâmetro [0, 2*PI]
     * @param morphProg Progresso da morfologia [0.0 = Infinito puro, 1.0 = Círculo do Portal]
     * @param a Escala horizontal do infinito
     * @param r Raio final do portal circular
     * @param rotAngle Rotação do sistema
     */
    const getMorphedPoint = (
      theta: number,
      morphProg: number,
      a: number,
      r: number,
      rotAngle: number
    ) => {
      // 1. Ponto do Lemniscato de Bernoulli (Símbolo do Infinito)
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);
      const denom = 1 + sinT * sinT;

      // Escala e formato característico do 8
      const xInf = (a * cosT) / denom;
      const yInf = (a * sinT * cosT) / denom;

      // 2. Ponto do Círculo do Portal (Raio R)
      // Mapeamos theta para o perímetro circular
      const xCircle = r * Math.cos(theta);
      const yCircle = r * Math.sin(theta);

      // 3. Interpolação Orgânica Não-Linear
      // Durante o morph, o centro do infinito se abre (smoothstep)
      const easeMorph = morphProg * morphProg * (3 - 2 * morphProg);
      const xInterp = (1 - easeMorph) * xInf + easeMorph * xCircle;
      const yInterp = (1 - easeMorph) * yInf + easeMorph * yCircle;

      // 4. Aplica Rotação Contínua
      const cosR = Math.cos(rotAngle);
      const sinR = Math.sin(rotAngle);
      return {
        x: xInterp * cosR - yInterp * sinR,
        y: xInterp * sinR + yInterp * cosR,
      };
    };

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;

      // Parâmetros do centro da tela
      const baseX = width / 2;
      const baseY = height / 2;

      // -----------------------------------------------------------------
      // "E CAIR PARA A VSL": DIVE / MERGULHO VERTICAL GRAVITACIONAL
      // -----------------------------------------------------------------
      let diveOffset = 0;
      let diveScale = 1.0;

      if (elapsed >= DIVE_TIMESTAMP) {
        if (!hasTriggeredDiveAudioRef.current) {
          playDiveSound();
          setIsDiving(true);
        }
        const diveProg = Math.min(1.0, (elapsed - DIVE_TIMESTAMP) / (TOTAL_DURATION_SECONDS - DIVE_TIMESTAMP));
        // Aceleração da gravidade puxando o portal para baixo em direção à VSL
        const easeDive = Math.pow(diveProg, 2.6);
        diveOffset = easeDive * (height * 0.75); // Queda vertical acentuada
        diveScale = 1.0 + easeDive * 0.85; // Expansão imersiva ao se aproximar
      }

      const cx = baseX;
      const cy = baseY + diveOffset;

      // Dispara o Flash de Luz Azul Celeste
      if (elapsed >= UNLOCK_TIMESTAMP && !burstSpawned) {
        spawnBurst(cx, cy);
      }

      // Progresso percentual
      const currentProgress = Math.min(100, Math.round((elapsed / TOTAL_DURATION_SECONDS) * 100));
      setProgressPercent(currentProgress);

      // Atualização dos textos de status
      if (elapsed < 1.6) {
        setStatusText('SINTONIZANDO SÍMBOLO INFINITY...');
      } else if (elapsed < 2.4) {
        setStatusText('ENERGIA QUÂNTICA SINTONIZADA...');
      } else if (elapsed < 3.8) {
        setStatusText('TRANSMUTANDO SÍMBOLO EM PORTAL...');
      } else if (elapsed < 4.1) {
        setStatusText('FLASH DE LUZ AZUL CELESTE ATIVADO!');
      } else {
        setStatusText('CAINDO PARA A VSL...');
      }

      // Cálculo do progresso de morfologia (0 = infinito, 1 = portal circular)
      let morphProg = 0;
      let rotAngle = 0;
      let speedMultiplier = 1.0;

      if (elapsed >= MORPH_START_TIMESTAMP) {
        morphProg = Math.min(1.0, (elapsed - MORPH_START_TIMESTAMP) / (UNLOCK_TIMESTAMP - MORPH_START_TIMESTAMP));
        // Aceleração da rotação conforme o símbolo se transforma no portal
        const tMorph = elapsed - MORPH_START_TIMESTAMP;
        rotAngle = Math.pow(tMorph, 2.2) * 1.6;
        speedMultiplier = 1.0 + Math.pow(morphProg, 1.8) * 3.5;
      }

      // Escalas de renderização adaptadas à tela
      const baseScale = Math.min(width, height) * 0.32;
      const infinityA = baseScale * 1.55;
      const portalRadius = baseScale * 0.95;

      // Limpa Canvas
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#010206';
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 1. TÚNEL WARP DE ESTRELAS
      // -------------------------------------------------------------
      ctx.save();
      const fov = 340;
      const warpSpeed = 1.5 + (morphProg > 0 ? morphProg * 25.0 : 0) + (diveOffset > 0 ? 15.0 : 0);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= warpSpeed;
        if (star.z <= 10) {
          star.z = 900;
          star.x = (Math.random() - 0.5) * width * 1.8;
          star.y = (Math.random() - 0.5) * height * 1.8;
        }

        const k = fov / star.z;
        const sx = star.x * k + cx;
        const sy = star.y * k + cy;

        if (sx >= -50 && sx <= width + 50 && sy >= -50 && sy <= height + 50) {
          const starRadius = Math.max(0.6, star.baseRadius * k);
          const alpha = Math.min(1.0, (900 - star.z) / 450);

          if (warpSpeed > 6.0) {
            // Rastro estelar em direção ao mergulho
            const trailLen = (warpSpeed * 1.5) * k;
            const angle = Math.atan2(sy - cy, sx - cx);
            const ex = sx + Math.cos(angle) * trailLen;
            const ey = sy + Math.sin(angle) * trailLen + (diveOffset > 0 ? 8 : 0);

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.85})`;
            ctx.lineWidth = Math.max(1.0, starRadius * 0.8);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(sx, sy, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.8})`;
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 2. AURA E RESSONÂNCIA VOLUMÉTRICA CENTRAL
      // -------------------------------------------------------------
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const auraRadius = (portalRadius * (0.8 + morphProg * 0.6)) * diveScale;
      const auraGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraRadius * 1.8);
      auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      auraGrad.addColorStop(0.2, 'rgba(125, 211, 252, 0.85)');
      auraGrad.addColorStop(0.45, 'rgba(56, 189, 248, 0.65)');
      auraGrad.addColorStop(0.7, 'rgba(2, 132, 199, 0.35)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, auraRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // -------------------------------------------------------------
      // 3. CURVAS DO SÍMBOLO DO INFINITO QUE SE TRANSFORMAM NO PORTAL
      // -------------------------------------------------------------
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      const numSteps = 220;
      const curvePoints: { x: number; y: number }[] = [];

      for (let s = 0; s <= numSteps; s++) {
        const theta = (s / numSteps) * Math.PI * 2;
        const pt = getMorphedPoint(theta, morphProg, infinityA, portalRadius, rotAngle);
        curvePoints.push({
          x: cx + pt.x * diveScale,
          y: cy + pt.y * diveScale,
        });
      }

      // A. Halo Externo Lápis-Lazúli e Safira da Curva
      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
      for (let i = 1; i < curvePoints.length; i++) {
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.45)';
      ctx.lineWidth = (16 + morphProg * 14) * diveScale;
      ctx.shadowColor = '#0284C7';
      ctx.shadowBlur = 35;
      ctx.stroke();

      // B. Corpo Principal em Luz Azul Celeste Incandescente
      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
      for (let i = 1; i < curvePoints.length; i++) {
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.lineWidth = (6 + morphProg * 8) * diveScale;
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 24;
      ctx.stroke();

      // C. Núcleo Branco Cristalino de Pura Luz Quântica
      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
      for (let i = 1; i < curvePoints.length; i++) {
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.lineWidth = (2.5 + morphProg * 3.5) * diveScale;
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 15;
      ctx.stroke();

      // -------------------------------------------------------------
      // 4. PARTÍCULAS QUÂNTICAS PERCORRENDO A CURVA EM TEMPO REAL
      // -------------------------------------------------------------
      const dt = 0.016 * speedMultiplier;
      for (let i = 0; i < quantumParticles.length; i++) {
        const p = quantumParticles[i];
        p.t = (p.t + p.speed * dt) % (Math.PI * 2);

        // Pega ponto na curva com leve dispersão quântica
        const basePt = getMorphedPoint(p.t, morphProg, infinityA, portalRadius, rotAngle);
        const px = cx + (basePt.x + Math.cos(p.offsetAngle) * p.offsetDist * (1 - morphProg * 0.5)) * diveScale;
        const py = cy + (basePt.y + Math.sin(p.offsetAngle) * p.offsetDist * (1 - morphProg * 0.5)) * diveScale;

        // Pulso de cintilação
        const twinkle = Math.sin(p.twinkle + elapsed * 6);
        const pAlpha = p.alpha * (0.7 + 0.3 * twinkle);

        ctx.beginPath();
        ctx.arc(px, py, p.size * diveScale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pAlpha;
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      ctx.restore();

      // -------------------------------------------------------------
      // 5. FEIXE DE LUZ ANAMÓRFICO HORIZONTAL (LENS FLARE)
      // -------------------------------------------------------------
      if (morphProg > 0.4) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const flareProg = (morphProg - 0.4) / 0.6;
        const flareWidth = width * (0.6 + flareProg * 0.4) * diveScale;
        const flareHeight = (4 + flareProg * 18) * diveScale;

        const flareGrad = ctx.createLinearGradient(cx - flareWidth / 2, cy, cx + flareWidth / 2, cy);
        flareGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        flareGrad.addColorStop(0.2, 'rgba(56, 189, 248, 0.5)');
        flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
        flareGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.5)');
        flareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, flareWidth / 2, flareHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 6. ONDAS DE CHOQUE CONCÊNTRICAS
      // -------------------------------------------------------------
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      shockwaves.forEach((sw) => {
        if (elapsed >= sw.delay) {
          const swProg = (elapsed - sw.delay) * sw.speed;
          if (swProg >= 0 && swProg <= 1.4) {
            const r = portalRadius * (0.8 + swProg * 1.8) * diveScale;
            const swAlpha = Math.max(0, 1.0 - swProg / 1.4);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56, 189, 248, ${swAlpha * 0.9})`;
            ctx.lineWidth = Math.max(1.5, 4 * (1 - swProg / 1.4));
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 25;
            ctx.stroke();
          }
        }
      });
      ctx.restore();

      // -------------------------------------------------------------
      // 7. PARTÍCULAS DO FLASH DE LUZ AZUL CELESTE
      // -------------------------------------------------------------
      if (burstParticles.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const curTime = performance.now();

        for (let i = 0; i < burstParticles.length; i++) {
          const p = burstParticles[i];
          const age = (curTime - p.birthTime) / 1000;
          const lifeProgress = age / p.lifespan;

          if (lifeProgress >= 1.0) continue;

          p.x += p.vx;
          p.y += p.vy + (diveOffset > 0 ? 3.0 : 0); // arrastado pelo mergulho
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.glintAngle += p.glintRotSpeed;

          const twinkle = Math.sin(p.twinklePhase + age * p.twinkleSpeed);
          const fadeIn = Math.min(1.0, age / 0.12);
          const fadeOut = Math.max(0, 1.0 - Math.pow(lifeProgress, 1.4));
          p.alpha = p.maxAlpha * fadeIn * fadeOut * (0.7 + 0.3 * twinkle);

          if (p.alpha <= 0.01) continue;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * diveScale, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 14;
          ctx.fill();

          if (p.hasGlint && p.alpha > 0.25) {
            const gSize = p.glintSize * diveScale;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.glintAngle);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = p.alpha * 0.95;
            ctx.shadowColor = '#7DD3FC';
            ctx.shadowBlur = 15;

            ctx.beginPath();
            ctx.moveTo(-gSize, 0);
            ctx.lineTo(gSize, 0);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, -gSize);
            ctx.lineTo(0, gSize);
            ctx.stroke();

            ctx.restore();
          }
        }
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 8. O FLASH DE LUZ AZUL CELESTE NA TRANSIÇÃO FINAL
      // -------------------------------------------------------------
      if (elapsed >= 4.45) {
        const washProg = Math.min(1.0, (elapsed - 4.45) / 0.35);

        ctx.save();
        const washGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.95);
        washGrad.addColorStop(0, `rgba(255, 255, 255, ${washProg * 1.0})`);
        washGrad.addColorStop(0.25, `rgba(224, 242, 254, ${washProg * 0.98})`);
        washGrad.addColorStop(0.5, `rgba(56, 189, 248, ${washProg * 0.95})`);
        washGrad.addColorStop(0.75, `rgba(14, 165, 233, ${washProg * 0.85})`);
        washGrad.addColorStop(1, `rgba(2, 132, 199, ${washProg * 0.4})`);

        ctx.fillStyle = washGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        if (elapsed >= 4.65 && !isDissolvingRef.current) {
          isDissolvingRef.current = true;
          setIsDissolving(true);
          setTimeout(() => {
            onActivatedRef.current?.();
          }, 180);
        }
      }

      // Gatilho final
      if (elapsed >= TOTAL_DURATION_SECONDS && !hasActivatedRef.current && !isDissolvingRef.current) {
        triggerPortalCrossing();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [triggerPortalCrossing, playCelestialFlashChime, playDiveSound]);

  return (
    <div
      onClick={triggerPortalCrossing}
      className={`fixed inset-0 z-[99999] bg-black text-slate-100 flex flex-col items-center justify-between select-none overflow-hidden font-sans transition-all duration-700 ease-out cursor-pointer ${
        isDissolving
          ? 'opacity-0 scale-125 blur-xl pointer-events-none translate-y-[40vh]'
          : isDiving
          ? 'opacity-90 scale-110 blur-[2px]'
          : 'opacity-100 scale-100 blur-0'
      }`}
      title="Toque em qualquer lugar para avançar diretamente"
    >
      {/* Camada Canvas: O Símbolo que se Transforma no Portal e Cai para a VSL */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Topo: HUD com indicador quântico e botão de entrada direta */}
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping shadow-[0_0_8px_#38BDF8]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">
            {isDiving
              ? 'MERGULHO VERTICAL • CAINDO PARA A VSL'
              : isUnlocked
              ? 'PORTAL AZUL CELESTE ATIVADO'
              : 'SÍMBOLO INFINITY • FUSÃO DIMENSIONAL'}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasActivatedRef.current) return;
            hasActivatedRef.current = true;
            setIsDissolving(true);
            setTimeout(() => {
              onActivatedRef.current?.();
            }, 120);
          }}
          aria-label="Entrar direto na landing page"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-sky-500/20 text-slate-300 hover:text-white border border-white/10 hover:border-sky-400/50 text-[11px] font-mono uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
        >
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>Entrar Direto</span>
          <ArrowRight className="w-3 h-3 text-sky-300" />
        </button>
      </div>

      {/* Centro: Espaço cósmico limpo, sem caixas nem fotos isoladas */}
      <div className="relative flex-1 w-full flex items-center justify-center pointer-events-none overflow-visible">
        {/* Flash de Luz Azul Celeste e Mergulho no desbloqueio */}
        {isDiving && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-500">
            <div className="w-[140vw] h-[140vw] max-w-[1600px] max-h-[1600px] rounded-full bg-radial from-white via-sky-300 via-sky-400 to-transparent blur-3xl animate-ping" />
            <div className="absolute inset-0 bg-sky-400/50 mix-blend-screen backdrop-blur-sm transition-opacity duration-500" />
          </div>
        )}
      </div>

      {/* Rodapé: HUD com Barra de Energia, Status e Botão Interativo */}
      <div className="w-full max-w-md mx-auto p-4 sm:pb-8 flex flex-col items-center gap-3 z-20 pointer-events-auto">
        <p
          className={`text-xs sm:text-sm font-medium tracking-[0.25em] uppercase text-center transition-all duration-500 ${
            isDiving
              ? 'text-white drop-shadow-[0_0_18px_rgba(56,189,248,1)]'
              : isUnlocked
              ? 'text-sky-200 drop-shadow-[0_0_16px_rgba(56,189,248,1)]'
              : 'text-sky-300/90 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]'
          }`}
        >
          {statusText}
        </p>

        {/* Barra de Energia Quântica em Azul Celeste */}
        <div className="w-48 sm:w-60 h-[3px] bg-slate-900 rounded-full overflow-hidden border border-sky-400/20">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-cyan-300 to-white transition-all duration-150 ease-out shadow-[0_0_12px_#38BDF8]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Botão de Travessia com Estilo Azul Celeste */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerPortalCrossing();
          }}
          className="mt-1 group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-sky-400/50 hover:border-sky-300 bg-gradient-to-r from-sky-500/25 via-cyan-500/25 to-sky-600/25 hover:from-sky-500/40 hover:to-cyan-500/40 text-sky-100 hover:text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-sky-300 group-hover:rotate-45 transition-transform duration-300" />
          <span className="font-semibold">Atravessar Portal</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-300 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <p className="text-[10px] font-mono text-slate-400 tracking-wider">
          Toque em qualquer lugar para avançar
        </p>
      </div>
    </div>
  );
};
