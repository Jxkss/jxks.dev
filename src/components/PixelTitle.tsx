import { useEffect, useRef } from 'react';

const SCALE = 4;

interface Props {
  text: string;
  minPx?: number;
  vwFactor?: number;
  maxPx?: number;
}

export default function PixelTitle({ text, minPx = 20.8, vwFactor = 0.04, maxPx = 41.6 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    function draw() {
      const vw    = window.innerWidth;
      const dispPx = Math.round(Math.min(Math.max(vw * vwFactor, minPx), maxPx));
      const logPx  = Math.max(2, Math.round(dispPx / SCALE));

      ctx.font = `${logPx}px 'Press Start 2P', monospace`;
      const tw  = Math.ceil(ctx.measureText(text).width) + 1;
      const pad = Math.max(1, Math.ceil(logPx * 0.2)); // top breathing room for ascenders
      const th  = Math.ceil(logPx * 1.4) + pad;

      canvas.width        = tw;
      canvas.height       = th;
      canvas.style.width  = `${tw * SCALE}px`;
      canvas.style.height = `${th * SCALE}px`;

      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle    = '#fff';
      ctx.font         = `${logPx}px 'Press Start 2P', monospace`;
      ctx.textBaseline = 'top';
      ctx.fillText(text, 0, pad);
    }

    document.fonts.ready.then(() => {
      draw();
      window.addEventListener('resize', draw);
    });

    return () => window.removeEventListener('resize', draw);
  }, [text, minPx, vwFactor, maxPx]);

  return (
    <canvas
      ref={canvasRef}
      style={{ imageRendering: 'pixelated', display: 'inline-block' }}
    />
  );
}
