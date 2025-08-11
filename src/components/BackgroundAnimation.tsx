import React, { useEffect, useRef } from 'react';

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const scaleFactor = dpr > 1 ? 1.5 : 1;
      canvas.width = Math.floor(rect.width * scaleFactor);
      canvas.height = Math.floor(rect.height * scaleFactor);
      
      ctx.scale(scaleFactor, scaleFactor);
    };
    
    resizeCanvas();

    const chars = '. / ; &$';
    const fontSize = window.innerWidth < 768 ? 10 : 12;
    const columnSpacing = window.innerWidth < 768 ? 2 : 1.5;
    const columns = Math.floor(canvas.width / (fontSize * columnSpacing));
    const drops: number[] = Array(columns).fill(0);

    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }

    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const draw = (timestamp: number) => {
      if (timestamp - lastTime < frameInterval) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      
      lastTime = timestamp;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = `${fontSize}px monospace`;

      const updateRatio = window.innerWidth < 768 ? 0.3 : 0.5;
      const columnsToUpdate = Math.floor(columns * updateRatio);
      const startColumn = Math.floor(Math.random() * (columns - columnsToUpdate));
      
      for (let i = startColumn; i < startColumn + columnsToUpdate; i++) {
        if (i >= columns) break;
        
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        ctx.fillText(text, i * fontSize * columnSpacing, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        for (let i = 0; i < drops.length; i++) {
          drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
        }
      }, 200);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
      style={{ 
        opacity: 0.5,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
        willChange: 'transform',
      }}
    />
  );
};

export default BackgroundAnimation;