import { useState, useEffect, useRef } from 'react';
import MusicPlayer from './components/MusicPlayer';
import RequestGraph from './components/RequestGraph';
import SocialLinks from './components/SocialLinks';
import ProjectList from './components/ProjectList';
import SkillsMatrix from './components/SkillsMatrix';
import SystemMonitor from './components/SystemMonitor';
import TerminalOutput from './components/TerminalOutput';
import NetworkActivity from './components/NetworkActivity';
import TextParticles from './components/TextParticles';
import { useViewCounter } from './hooks/useViewCounter';
import './App.css';

function App() {
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1.1);
  const [contentOverflow, setContentOverflow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const { count: viewCount, loading: viewCountLoading } = useViewCounter();
  
  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      setIsMobile(width < 768);
      
      // Set base scale based on screen size - higher minimum values
      let initialScale = 1.05; // Minimum scale for small screens
      if (width > 1600) initialScale = 1.15;
      else if (width > 1200) initialScale = 1.12;
      else if (width > 768) initialScale = 1.08;
      
      setScale(initialScale);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Handle video playback when interaction is complete
  useEffect(() => {
    if (interactionComplete && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Video play failed:", err);
      });
    }
  }, [interactionComplete]);
  
  // Check if content overflows and adjust scale if needed
  useEffect(() => {
    if (!contentRef.current || !contentWrapperRef.current || windowSize.width === 0) return;
    
    const checkContentFit = () => {
      if (!contentRef.current || !contentWrapperRef.current) return;
      
      const wrapper = contentWrapperRef.current;
      const content = contentRef.current;
      
      // Reset transform to measure natural size
      content.style.transform = '';
      
      // Get the natural content dimensions
      const naturalContentRect = content.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      
      // Calculate how much we need to scale to fit height
      // Leave more margin (0.9) to avoid cutting off content
      const heightRatio = (wrapperRect.height * 0.9) / naturalContentRect.height;
      
      // Determine appropriate scale
      // Don't go below minimum scale based on screen width
      const minScale = windowSize.width < 768 ? 0.95 : 1.0;
      let newScale = Math.min(scale, heightRatio);
      
      // Ensure we don't scale down too much
      newScale = Math.max(newScale, minScale);
      
      // Apply the new scale
      content.style.transform = `scale(${newScale})`;
      
      // Check if content still overflows after scaling
      const scaledRect = content.getBoundingClientRect();
      const stillOverflowing = scaledRect.height > wrapperRect.height;
      
      setContentOverflow(stillOverflowing);
      setScale(newScale);
      
      // Adjust padding based on available space and ensure content is visible
      wrapper.style.paddingTop = '2rem'; // Add more top padding to prevent cutoff
      wrapper.style.paddingBottom = stillOverflowing ? '1rem' : '2rem';
    };
    
    // Run the check after a short delay to ensure DOM has updated
    const timeoutId = setTimeout(checkContentFit, 200);
    
    return () => clearTimeout(timeoutId);
  }, [windowSize, interactionComplete]);
  
  const handleInteraction = () => {
    setInteractionComplete(true);
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

  // Calculate dynamic container width based on screen size
  const getContainerMaxWidth = () => {
    if (windowSize.width > 1600) return 'max-w-7xl';
    if (windowSize.width > 1200) return 'max-w-6xl';
    if (windowSize.width > 992) return 'max-w-5xl';
    if (windowSize.width > 768) return 'max-w-4xl';
    return 'max-w-full px-2'; // Mobile gets full width with small padding
  };

  // Calculate dynamic gap size based on screen size and overflow status
  const getGapSize = () => {
    if (contentOverflow) return 'gap-2'; // Reduce gap if content overflows
    if (windowSize.width > 1200) return 'gap-4';
    if (windowSize.width > 768) return 'gap-3';
    return 'gap-2'; // Smaller gap on mobile
  };

  // Calculate spacing between components based on overflow
  const getSpacingClass = () => {
    if (contentOverflow) return 'space-y-2';
    return 'space-y-3';
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mono text-bloom">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        style={{ opacity: 0.5 }}
        muted
        loop
        playsInline
        poster="/placeholder-dark.jpg"
      >
        <source src="/videos/BACKGROUND.mp4" type="video/mp4" />
        <source src="/assets/BACKGROUND.mp4" type="video/mp4" />
        <source src="/BACKGROUND.mp4" type="video/mp4" />
        Your browser does not support video playback.
      </video>
      
      {/* Main Content */}
      <div 
        ref={contentWrapperRef}
        className={`relative z-10 py-8 px-2 min-h-screen flex items-start justify-center ${!interactionComplete ? 'blur-sm' : ''} retro-scrollbar`}
        style={{ 
          overflowY: contentOverflow ? 'auto' : 'hidden',
          height: '100vh',
          paddingTop: '2rem',
        }}
      >
        {/* Responsive container with dynamic width and scale */}
        <div 
          ref={contentRef}
          className={`${getContainerMaxWidth()} mx-auto mt-4`}
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center 0%',
            transition: 'transform 0.3s ease-out'
          }}
        >
          {/* ASCII Header with Particles */}
          <div className="w-full py-2 mb-2">
            <div className="text-center relative">
              {!isMobile ? (
                <div className="relative">
                  {/* Particle animation around ASCII art */}
                  {interactionComplete && <TextParticles containerClassName="z-0" />}
                  
                  <pre className="text-white text-xs md:text-sm leading-tight whitespace-pre font-mono drop-shadow-lg overflow-x-auto enhanced-text-glow relative z-10">
                    {asciiArt}
                  </pre>
                </div>
              ) : (
                <div className="relative">
                  {/* Particle animation around mobile header */}
                  {interactionComplete && <TextParticles containerClassName="z-0" />}
                  
                  <h1 className="text-3xl font-bold enhanced-text-glow relative z-10">JXKS.DEV</h1>
                </div>
              )}
              <div className="mt-2 text-white text-sm font-bold tracking-wider pulsing-glow">
                [ FULL-STACK DEVELOPER & LAZINESS SPECIALIST ]
              </div>
              <div className="text-white text-xs mt-1 animate-pulse">
                👁 {viewCountLoading ? '...' : viewCount} VIEWS || ⚐ FRANCE/INDONESIA
              </div>
              
              {/* Enhanced view counter */}
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="bg-black bg-opacity-25 border border-white px-3 py-1 rounded-sm flex items-center">
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
                <div className="border-l border-white h-4"></div>
                <div className="bg-black bg-opacity-25 border border-white px-3 py-1 rounded-sm">
                  <span className="text-white">⚐ FRANCE/INDONESIA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Grid Layout with dynamic gap */}
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-12'} ${getGapSize()}`}>
            {/* Left Column */}
            <div className={`${isMobile ? '' : 'col-span-4'} ${getSpacingClass()}`}>
              <MusicPlayer autoplayEnabled={interactionComplete} />
              <RequestGraph />
              <SystemMonitor />
            </div>

            {/* Center Column */}
            <div className={`${isMobile ? '' : 'col-span-4'} ${getSpacingClass()}`}>
              <ProjectList />
              <TerminalOutput />
            </div>

            {/* Right Column */}
            <div className={`${isMobile ? '' : 'col-span-4'} ${getSpacingClass()} mb-2`}>
              <SkillsMatrix />
              <SocialLinks />
              <NetworkActivity />
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Overlay */}
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

      {/* Occasional glitch effect */}
      <div className="glitch-overlay"></div>
    </div>
  );
}

export default App;