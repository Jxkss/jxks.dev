import React, { useEffect, useRef } from 'react';

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set display size (css pixels)
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Set actual size in memory (scaled to account for extra pixel density)
      // Use a lower scale factor for better performance
      const scaleFactor = dpr > 1 ? 1.5 : 1; // Reduce resolution on high DPI screens
      canvas.width = Math.floor(rect.width * scaleFactor);
      canvas.height = Math.floor(rect.height * scaleFactor);
      
      // Normalize coordinate system to use css pixels
      ctx.scale(scaleFactor, scaleFactor);
    };
    
    // Initial resize
    resizeCanvas();

    // Smaller character set for better performance
    const chars = '. / ; &$';
    // Adjust font size based on screen width for better performance on mobile
    const fontSize = window.innerWidth < 768 ? 10 : 12;
    // Reduce number of columns for better performance
    const columnSpacing = window.innerWidth < 768 ? 2 : 1.5;
    const columns = Math.floor(canvas.width / (fontSize * columnSpacing));
    const drops: number[] = Array(columns).fill(0);

    // Fill the initial screen with random starting positions
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }

    let lastTime = 0;
    const targetFPS = 30; // Target 30fps for better performance
    const frameInterval = 1000 / targetFPS;

    const draw = (timestamp: number) => {
      // Throttle frame rate for better performance
      if (timestamp - lastTime < frameInterval) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      
      lastTime = timestamp;

      // Create a fade effect with semi-transparent black
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text color to white with slight transparency
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = `${fontSize}px monospace`;

      // Only update a subset of columns each frame for better performance
      const updateRatio = window.innerWidth < 768 ? 0.3 : 0.5;
      const columnsToUpdate = Math.floor(columns * updateRatio);
      const startColumn = Math.floor(Math.random() * (columns - columnsToUpdate));
      
      for (let i = startColumn; i < startColumn + columnsToUpdate; i++) {
        if (i >= columns) break;
        
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw the character
        ctx.fillText(text, i * fontSize * columnSpacing, drops[i] * fontSize);

        // Randomly reset the drop position when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation using requestAnimationFrame for better performance
    animationRef.current = requestAnimationFrame(draw);

    // Handle window resize with debounce for better performance
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        // Reset drops after resize
        for (let i = 0; i < drops.length; i++) {
          drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
        }
      }, 200);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
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
        willChange: 'transform', // Hint to browser for optimization
      }}
    />
  );
};

export default BackgroundAnimation;