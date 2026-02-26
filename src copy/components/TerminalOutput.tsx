import React, { useState, useEffect, useRef } from 'react';

interface MatrixChar {
  id: number;
  char: string;
  x: number;
  y: number;
  opacity: number;
  speed: number;
}

const TerminalOutput: React.FC = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentTypingLine, setCurrentTypingLine] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [matrixChars, setMatrixChars] = useState<MatrixChar[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const terminalLines = [
    '$ whoami',
    'jxks@dev:~$',
    '$ cat /etc/about',
    "I'm Jxks and I'm from indonesia. Welcome to my website ",
    '$ ls -la /skills',
    'drwxr-xr-x ‎ python node.js   javascript',
    'drwxr-xr-x ‎ html   css       autohotkey',
    'drwxr-xr-x ‎ lua    electron  typescript',
    '$ ps aux | grep passion',
    'jxks  1337  99.9  coding  --passtime --innovation',
  ];

  const matrixCharPool = ['0', '1', '.', '*', '+', ':', '·', '°', '×', '$', '#', '@'];

  useEffect(() => {
    const initialChars: MatrixChar[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      char: matrixCharPool[Math.floor(Math.random() * matrixCharPool.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.2 + 0.05,
      speed: Math.random() * 0.5 + 0.1,
    }));
    
    setMatrixChars(initialChars);
    
    const animateMatrix = () => {
      setMatrixChars(prevChars => 
        prevChars.map(char => {
          let newY = char.y + char.speed;
          
          if (newY > 100) {
            return {
              ...char,
              y: -5,
              x: Math.random() * 100,
              char: matrixCharPool[Math.floor(Math.random() * matrixCharPool.length)],
              opacity: Math.random() * 0.2 + 0.05,
            };
          }
          
          return {
            ...char,
            y: newY,
          };
        })
      );
      
      animationFrameRef.current = requestAnimationFrame(animateMatrix);
    };
    
    animateMatrix();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentTypingLine >= terminalLines.length) {
      const resetTimer = setTimeout(() => {
        setCurrentTypingLine(0);
        setTypingIndex(0);
      }, 3000);
      
      return () => clearTimeout(resetTimer);
    }

    const currentLine = terminalLines[currentTypingLine];
    
    if (typingIndex < currentLine.length) {
      const typingTimer = setTimeout(() => {
        setTypingIndex(prev => prev + 1);
      }, 30 + Math.random() * 50);
      
      return () => clearTimeout(typingTimer);
    } else {
      const nextLineTimer = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev, currentLine];
          if (newLines.length > 8) {
            return newLines.slice(newLines.length - 8);
          }
          return newLines;
        });
        
        setCurrentTypingLine(prev => prev + 1);
        setTypingIndex(0);
      }, 500 + Math.random() * 300);
      
      return () => clearTimeout(nextLineTimer);
    }
  }, [currentTypingLine, typingIndex]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      
      const preventScroll = (e: WheelEvent) => {
        e.preventDefault();
        containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
      };
      
      const container = containerRef.current;
      container.addEventListener('wheel', preventScroll, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', preventScroll);
      };
    }
  }, [displayedLines, typingIndex]);

  const currentPartialLine = currentTypingLine < terminalLines.length 
    ? terminalLines[currentTypingLine].substring(0, typingIndex)
    : '';

  return (
    <div className="bg-black border bg-opacity-40 p-4 font-mono hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-white/20 relative">
      <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2 z-10 relative">
        <span className="animate-pulse">~$</span> TERMINAL.OUT
      </h3>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {matrixChars.map(char => (
          <div 
            key={`matrix-${char.id}`}
            className="absolute text-white transition-all duration-300"
            style={{
              left: `${char.x}%`,
              top: `${char.y}%`,
              opacity: char.opacity,
              fontSize: '0.75rem',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {char.char}
          </div>
        ))}
      </div>
      
      <div 
        ref={containerRef} 
        className="text-xs space-y-1 overflow-hidden relative z-10"
        style={{ 
          height: '9rem',
          maxHeight: '9rem',
          overflowY: 'hidden'
        }}
      >
        <div className="terminal-text-container">
          {displayedLines.map((line, index) => {
            const opacity = Math.min(1, (index / displayedLines.length) * 2 + 0.3);
            
            return (
              <div 
                key={`line-${index}`}
                className="text-gray-500 transition-all duration-300"
                style={{ opacity }}
              >
                {line}
              </div>
            );
          })}
          
          {currentTypingLine < terminalLines.length && (
            <div className="text-white">
              {currentPartialLine}
              {showCursor && <span className="text-white cursor-blink">█</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalOutput;