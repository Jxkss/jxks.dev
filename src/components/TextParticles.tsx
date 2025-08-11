import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  opacity: number;
  speed: number;
  size: number;
}

interface TextParticlesProps {
  containerClassName?: string;
}

const TextParticles: React.FC<TextParticlesProps> = ({ containerClassName = '' }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const particleChars = ['0', '1', '.', '*', '+', ':', '·', '°', '×'];
  
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      char: particleChars[Math.floor(Math.random() * particleChars.length)],
      opacity: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.5 + 0.1,
      size: Math.random() * 0.5 + 0.5,
    }));
    
    setParticles(initialParticles);
    
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newY = particle.y - particle.speed;
          let newX = particle.x + (Math.random() - 0.5) * 0.5;
          
          if (newY < -5) {
            newY = 105;
            newX = Math.random() * 100;
            return {
              ...particle,
              x: newX,
              y: newY,
              char: particleChars[Math.floor(Math.random() * particleChars.length)],
              opacity: Math.random() * 0.7 + 0.1,
              speed: Math.random() * 0.5 + 0.1,
            };
          }
          
          newX = Math.max(0, Math.min(100, newX));
          
          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${containerClassName}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-white opacity-0 transition-opacity duration-1000"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            fontSize: `${particle.size}rem`,
            transform: 'translate(-50%, -50%)',
            textShadow: '0 0 3px rgba(255, 255, 255, 0.7)',
          }}
        >
          {particle.char}
        </div>
      ))}
    </div>
  );
};

export default TextParticles;