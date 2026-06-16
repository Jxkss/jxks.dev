import { useEffect, useRef } from 'react';

const JP   = 'あなたが何をしたか　知っていたなら　　　';
const SCALE = 4;

export default function JpBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    let raf: number;
    let lw = 0, lh = 0, fontSize = 0, tw = 0, offset = 0;

    function setup() {
      const stripPx = window.innerHeight * 0.12;
      lw       = Math.ceil(window.innerWidth / SCALE);
      lh       = Math.ceil(stripPx / SCALE);
      canvas.width  = lw;
      canvas.height = lh;
      fontSize = Math.floor(lh * 0.78);
      ctx.font = `${fontSize}px 'Press Start 2P', monospace`;
      tw       = ctx.measureText(JP).width + 2;
    }

    function tick() {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, lw, lh);
      ctx.fillStyle  = 'rgba(255,255,255,0.85)';
      ctx.font       = `${fontSize}px 'Press Start 2P', monospace`;
      ctx.textBaseline = 'top';

      const y = Math.floor((lh - fontSize) / 2);
      let x   = (offset % tw) - tw;
      while (x < lw) {
        ctx.fillText(JP, x, y);
        x += tw;
      }

      offset -= 0.35;
    }

    document.fonts.ready.then(() => {
      setup();
      addEventListener('resize', setup);
      tick();
    });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', setup);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        bottom: '1.5vh',
        left: 0,
        width: '100%',
        height: '12%',
        pointerEvents: 'none',
        zIndex: 8,
        imageRendering: 'pixelated',
      }}
    />
  );
}
