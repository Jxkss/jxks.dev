import { useEffect, useRef } from 'react';

const LOG_W     = 64;
const SCALE     = 4;
const CONTRAST  = 3.4;
const GAMMA     = 0.55;

function toHighContrastGray(r: number, g: number, b: number): number {
  let lum = 0.299 * r + 0.587 * g + 0.114 * b;
  lum = Math.max(0, Math.min(255, ((lum / 255 - 0.5) * CONTRAST + 0.5) * 255));
  lum = Math.pow(lum / 255, GAMMA) * 255;
  return Math.max(0, Math.min(255, lum));
}

function scheduleJitter(el: HTMLElement, onDone: () => void) {
  const bursts = 2 + Math.floor(Math.random() * 2);
  let i = 0;

  const tick = () => {
    if (i >= bursts) {
      el.style.transform = '';
      onDone();
      return;
    }
    const x = (Math.random() > 0.5 ? 1 : -1) * SCALE;
    const y = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.6 ? SCALE : 0);
    el.style.transform = `translate(${x}px, ${y}px)`;
    i++;
    setTimeout(tick, 35 + Math.random() * 45);
  };

  tick();
}

export default function PixelRose() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    const img = new Image();

    img.onload = () => {
      const logH = Math.round(LOG_W * (img.height / img.width));

      canvas.width  = LOG_W;
      canvas.height = logH;
      canvas.style.width  = `${LOG_W * SCALE}px`;
      canvas.style.height = `${logH * SCALE}px`;

      ctx.clearRect(0, 0, LOG_W, logH);
      ctx.drawImage(img, 0, 0, LOG_W, logH);

      const image = ctx.getImageData(0, 0, LOG_W, logH);
      const { data } = image;

      for (let i = 0; i < data.length; i += 4) {
        const gray = toHighContrastGray(data[i], data[i + 1], data[i + 2]);
        data[i]     = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }

      ctx.putImageData(image, 0, 0);
    };

    img.src = '/rose.png';
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const loop = () => {
      if (cancelled) return;
      timeout = setTimeout(() => {
        if (cancelled) return;
        scheduleJitter(el, loop);
      }, 3500 + Math.random() * 5500);
    };

    loop();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      el.style.transform = '';
    };
  }, []);

  return (
    <div ref={wrapRef} className="pixel-rose-wrap">
      <canvas
        ref={canvasRef}
        className="pixel-rose"
        style={{ imageRendering: 'pixelated', display: 'block' }}
      />
    </div>
  );
}
