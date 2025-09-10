import { useState, useEffect, useRef } from 'react';
import SocialLinks from './components/SocialLinks';
import ProjectList from './components/ProjectList';
import SkillsMatrix from './components/SkillsMatrix';
import TextParticles from './components/TextParticles';
import MusicPlayer from './components/MusicPlayer';
import { useViewCounter } from './hooks/useViewCounter';
import './App.css';

function App() {
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1.1);
  const [contentOverflow, setContentOverflow] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasBeat, setHasBeat] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const { count: viewCount, loading: viewCountLoading } = useViewCounter();
  
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      setIsMobile(width < 768);
      
      let initialScale = 1.05;
      if (width > 1600) initialScale = 1.15;
      else if (width > 1200) initialScale = 1.12;
      else if (width > 768) initialScale = 1.08;
      
      setScale(initialScale);
    };
    
    checkScreenSize();
    
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  useEffect(() => {
    if (interactionComplete && videoRef.current) {
      // Play the video and unmute it after user interaction
      videoRef.current.play().then(() => {
        // Unmute the video after successful play
        videoRef.current!.muted = false;
        setIsMuted(false);
      }).catch(err => {
        console.error("Video play failed:", err);
      });
    }
  }, [interactionComplete]);
  
  useEffect(() => {
    if (!contentRef.current || !contentWrapperRef.current || windowSize.width === 0) return;
    
    const checkContentFit = () => {
      if (!contentRef.current || !contentWrapperRef.current) return;
      
      const wrapper = contentWrapperRef.current;
      const content = contentRef.current;
      
      content.style.transform = '';
      
      const naturalContentRect = content.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      
      const heightRatio = (wrapperRect.height * 0.9) / naturalContentRect.height;
      
      const minScale = windowSize.width < 768 ? 0.95 : 1.0;
      let newScale = Math.min(scale, heightRatio);
      
      newScale = Math.max(newScale, minScale);
      
      content.style.transform = `scale(${newScale})`;
      
      const scaledRect = content.getBoundingClientRect();
      const stillOverflowing = scaledRect.height > wrapperRect.height;
      
      setContentOverflow(stillOverflowing);
      setScale(newScale);
      
      // Adjust padding based on device type
      if (isMobile) {
        wrapper.style.paddingTop = '1rem';
        wrapper.style.paddingBottom = '1rem';
      } else {
        wrapper.style.paddingTop = '2rem';
        wrapper.style.paddingBottom = stillOverflowing ? '1rem' : '2rem';
      }
      
      // Ensure scroll position is at the top for mobile devices
      if (isMobile && interactionComplete) {
        setTimeout(() => {
          wrapper.scrollTop = 0;
        }, 100);
      }
    };
    
    const timeoutId = setTimeout(checkContentFit, 200);
    
    return () => clearTimeout(timeoutId);
  }, [windowSize, interactionComplete, isMobile, scale]);
  
  const handleInteraction = () => {
    setInteractionComplete(true);
  };


  const handleBeatDetected = (beat: boolean) => {
    setHasBeat(beat);
  };

  const asciiArt = `
   d8,             d8b                     d8b                 
  '8P              ?88                     88P                 
                    88b                   d88                  
  d88    8?88,  88P  888  d88' .d888b, d888888   d8888b ?88   d8P
  ?88     ''?8bd8P'  888bd8P'  ?8b,   d8P' ?88  d8b_,dP d88  d8P'
   88b    d8P?8b,  d88888b      ''?8b 88b  ,88b 88b     ?8b ,88' 
   '88b  d8P' ''?8bd88' '?88b,''?888P' ''?88P''88b'?888P' '?888P'  
    )88                                                        
   ,88P                                                        
''?888P                                                         
                                 
  `;

  const getContainerMaxWidth = () => {
    if (windowSize.width > 1600) return 'max-w-7xl';
    if (windowSize.width > 1200) return 'max-w-6xl';
    if (windowSize.width > 992) return 'max-w-5xl';
    if (windowSize.width > 768) return 'max-w-4xl';
    return 'max-w-full px-2';
  };

  return (
    <div className={`min-h-screen bg-black text-white relative font-mono text-bloom transition-all duration-200 ${hasBeat ? 'drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]' : ''}`}>
      {/* Background Visualizer Canvas - Behind everything except video */}
      <canvas 
        ref={visualizerCanvasRef} 
        className="fixed top-0 left-0 pointer-events-none"
        style={{ 
          background: 'transparent',
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          border: 'none',
          outline: 'none'
        }}
      />
      
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-full h-full object-cover"
        style={{ opacity: 0.5, zIndex: 2 }}
        muted={isMuted}
        loop
        playsInline
        poster="/placeholder-dark.jpg"
      >
        <source src="BACKGROUND.mp4" type="video/mp4" />
        Your browser does not support video playback.
      </video>
      
      
      <div 
        ref={contentWrapperRef}
        className={`relative z-10 py-8 px-2 min-h-screen ${!interactionComplete ? 'blur-sm' : ''} retro-scrollbar`}
        style={{ 
          overflowY: contentOverflow ? 'auto' : 'hidden',
          height: '100vh',
          paddingTop: isMobile ? '1rem' : '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-start' : 'center'
        }}
      >
        <div 
          ref={contentRef}
          className={`${getContainerMaxWidth()} mx-auto`}
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: isMobile ? 'top center' : 'center center',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="w-full py-2 mb-6">
            <div className="text-center relative">
              {!isMobile ? (
                <div className="relative">
                  {interactionComplete && <TextParticles containerClassName="z-0" />}
                  
                  <pre className="text-white text-xs md:text-sm leading-tight whitespace-pre font-mono drop-shadow-lg overflow-x-auto enhanced-text-glow relative z-10">
                    {asciiArt}
                  </pre>
                </div>
              ) : (
                <div className="relative">
                  {interactionComplete && <TextParticles containerClassName="z-0" />}
                  
                  <h1 className="text-3xl font-bold enhanced-text-glow relative z-10">JXKS.DEV</h1>
                </div>
              )}
              <div className="mt-2 text-white text-sm font-bold tracking-wider pulsing-glow">
                [ FULL-STACK DEVELOPER & LAZINESS SPECIALIST ]
              </div>
              
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="bg-black bg-opacity-20 border border-white/20 px-3 py-1 rounded-lg flex items-center hover:border-white/40 transition-all duration-300">
                  <span className="text-white mr-2 animate-pulse">👁</span>
                  <span className="text-white font-bold">
                    {viewCountLoading ? (
                      <span className="animate-pulse">LOADING...</span>
                    ) : (
                      <span className="enhanced-text-glow">{viewCount.toLocaleString()}</span>
                    )}
                  </span>
                  <span className="ml-1 text-gray-400 text-xs">VIEWS</span>
                </div>
                <div className="border-l border-white/20 h-4"></div>
                <div className="bg-black bg-opacity-20 border border-white/20 px-3 py-1 rounded-lg hover:border-white/40 transition-all duration-300">
                  <span className="text-white">⚐ FRANCE/INDONESIA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-side layout */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-3 gap-6'}`}>
            <div className="bg-black bg-opacity-20 border border-white/20 rounded-lg p-6 transition-all duration-300 hover:shadow-white/20 h-full backdrop-blur-sm hover:border-white/40">
              <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                <span className="animate-pulse">~$</span> SKILLS
              </h3>
              <SkillsMatrix />
            </div>
            
            <div className="bg-black bg-opacity-20 border border-white/20 rounded-lg p-6 transition-all duration-300 hover:shadow-white/20 h-full backdrop-blur-sm hover:border-white/40">
              <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                <span className="animate-pulse">~$</span> PROJECTS
              </h3>
              <ProjectList />
            </div>
            
            <div className="bg-black bg-opacity-20 border border-white/20 rounded-lg p-6 transition-all duration-300 hover:shadow-white/20 h-full flex flex-col backdrop-blur-sm hover:border-white/40">
              <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                <span className="animate-pulse">~$</span> CONNECT
              </h3>
              <div className="flex-grow">
                <SocialLinks vertical={true} />
              </div>
            </div>
          </div>

          {/* Music Player is now positioned as fixed elements */}
          <MusicPlayer 
            autoplayEnabled={interactionComplete}
            externalMuted={isMuted}
            onMuteChange={setIsMuted}
            onBeatDetected={handleBeatDetected}
            canvasRef={visualizerCanvasRef}
          />
        </div>
      </div>

      {!interactionComplete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center cursor-pointer"
          onClick={handleInteraction}
        >
          <div className="text-center px-4 transform scale-110">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-wider enhanced-text-glow">JXKS.DEV</h1>
            <div className="border border-white p-4 rounded-lg">
              <p className="text-white text-lg pulsing-glow">[ CLICK ANYWHERE TO INITIALIZE ]</p>
            </div>
            <p className="text-gray-400 mt-4 text-sm">The Website will open after interaction.</p>
          </div>
        </div>
      )}

      <div className="glitch-overlay"></div>
      
      {/* Beat Glow Overlay */}
      {hasBeat && (
        <div className="fixed inset-0 pointer-events-none z-40 animate-pulse">
          <div className="w-full h-full bg-gradient-radial from-white/10 via-transparent to-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default App;