import { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
}

interface Ripple {
  x: number;
  y: number;
  age: number;
  life: number;
  maxR: number;
  alpha: number;
}

interface FloorSeg {
  x: number;
  len: number;
  alpha: number;
}

const FLOOR_FRAC = 0.88;
const PIXEL = 4;

export default function Rain() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const windRef    = useRef(0);
  const stateRef   = useRef<{
    drops: Drop[];
    ripples: Ripple[];
    floor: FloorSeg[];
    w: number;
    h: number;
    floorY: number;
  }>({ drops: [], ripples: [], floor: [], w: 0, h: 0, floorY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    let raf: number;

    function setup() {
      const w      = window.innerWidth;
      const h      = window.innerHeight;
      const floorY = Math.floor(h * FLOOR_FRAC);
      canvas.width  = Math.floor(w / PIXEL);
      canvas.height = Math.floor(h / PIXEL);

      const count = Math.floor(w / 7);
      const drops: Drop[] = Array.from({ length: count }, () => ({
        x:     Math.random() * w,
        y:     Math.random() * h,
        len:   18 + Math.random() * 55,
        speed: 10 + Math.random() * 14,
        alpha: 0.045 + Math.random() * 0.085,
      }));

      const floor: FloorSeg[] = [];
      let fx = 0;
      while (fx < w) {
        const len = 4 + Math.floor(Math.random() * 18);
        floor.push({ x: fx, len, alpha: 0.04 + Math.random() * 0.13 });
        fx += len + Math.floor(Math.random() * 4);
      }

      stateRef.current = { drops, ripples: [], floor, w, h, floorY };
    }

    const onMouse = (e: MouseEvent) => {
      windRef.current = (e.clientX / window.innerWidth - 0.5) * 7;
    };

    function tick() {
      raf = requestAnimationFrame(tick);
      const { drops, ripples, floor, w, h, floorY } = stateRef.current;
      ctx.setTransform(1/PIXEL, 0, 0, 1/PIXEL, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const wind = windRef.current;

      for (const d of drops) {
        const x = Math.floor(d.x);
        const y = Math.floor(d.y);
        const grad = ctx.createLinearGradient(x, y, x, y + d.len);
        grad.addColorStop(0,    'rgba(255,255,255,0)');
        grad.addColorStop(0.55, `rgba(255,255,255,${(d.alpha * 0.35).toFixed(3)})`);
        grad.addColorStop(1,    `rgba(255,255,255,${d.alpha.toFixed(3)})`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, PIXEL, d.len);

        d.y += d.speed;
        d.x += wind * (d.speed / 13);

        if (d.y + d.len > floorY) {
          if (ripples.length < 200) {
            ripples.push({
              x: d.x, y: floorY,
              age: 0,
              life:  30 + Math.floor(Math.random() * 25),
              maxR:  10 + Math.random() * 22,
              alpha: Math.min(d.alpha * 2.8, 0.4),
            });
          }
          d.y = -(d.len + Math.random() * h * 0.5);
          d.x = Math.random() * w;
        }
        if (d.x < -20)    d.x = w + 20;
        if (d.x > w + 20) d.x = -20;
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.055)';
      ctx.lineWidth   = PIXEL;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();
      for (const seg of floor) {
        ctx.strokeStyle = `rgba(255,255,255,${seg.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(seg.x, floorY);
        ctx.lineTo(seg.x + seg.len, floorY);
        ctx.stroke();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const t     = r.age / r.life;
        const eased = 1 - (1 - t) * (1 - t);
        const fade  = (1 - t) * (1 - t);
        const alpha = r.alpha * fade;

        if (alpha > 0.003) {
          const rx = r.maxR * eased;
          const ry = rx * 0.28;

          ctx.lineWidth = PIXEL * 0.8;

          ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, rx, ry, 0, 0, Math.PI, true);
          ctx.stroke();

          ctx.strokeStyle = `rgba(255,255,255,${(alpha * 0.38).toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, rx, ry, 0, 0, Math.PI, false);
          ctx.stroke();
        }

        r.age++;
        if (r.age >= r.life) ripples.splice(i, 1);
      }
    }

    setup();
    addEventListener('resize', setup);
    addEventListener('mousemove', onMouse);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', setup);
      removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        imageRendering: 'pixelated',
      }}
    />
  );
}
