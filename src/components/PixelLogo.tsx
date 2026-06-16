import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

const SIZE  = 16;
const SCALE = 4;

interface Props {
  src: string;
  label: string;
  href?: string;
  onClick?: () => void;
  highlight?: boolean;
  wrapClassName?: string;
  wrapStyle?: CSSProperties;
}

export default function PixelLogo({ src, label, href, onClick, highlight, wrapClassName, wrapStyle }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.globalCompositeOperation = 'source-over';
    };

    img.onerror = () => {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(2, 2, SIZE - 4, SIZE - 4);
    };

    img.src = src;
  }, [src]);

  const wrapCls = `pixel-logo-wrap${wrapClassName ? ' ' + wrapClassName : ''}`;

  const inner = (
    <div className={`pixel-logo${highlight ? ' pixel-logo--highlight' : ''}`}>
      <canvas
        ref={canvasRef}
        style={{
          width:          SIZE * SCALE,
          height:         SIZE * SCALE,
          imageRendering: 'pixelated',
          display:        'block',
        }}
      />
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={wrapCls} style={wrapStyle}>
        {inner}
      </a>
    );
  }

  return (
    <button className={wrapCls} style={wrapStyle} onClick={onClick}>
      {inner}
    </button>
  );
}
