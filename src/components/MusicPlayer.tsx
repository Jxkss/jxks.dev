import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward } from 'lucide-react';

interface MusicPlayerProps {
  autoplayEnabled?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoplayEnabled = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5); // Increased default volume
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [audioContextInitialized, setAudioContextInitialized] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const tracks = [
    { name: 'ARCOM.mp3', title: 'ARCOM - Luther, sanperseus' },
    { name: 'KARMA.mp3', title: 'KARMA ه҈ - Ptite Soeur, neophron, Rosaliedu38'},
    { name: 'MOJIBAKE.mp3', title: 'MOJIBAKE & ⠀⠀⃞⛘⛠⳯⠀TAMAT - Ptite Soeur' },
  ];

  // In Vite, assets in the public folder are served at the root path
  const getAudioPath = () => `/${tracks[currentTrack].name}`;

  // Initialize audio context and analyzer when audio is ready
  const initializeAudioContext = () => {
    if (!audioRef.current || audioContextInitialized) return;

    try {
      // Create audio context only once
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;
      
      // Clean up previous connections
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      // Create analyzer
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 128; // Power of 2, controls detail level
        analyserRef.current.smoothingTimeConstant = 0.8; // Smoothing (0-1)
      }

      // Connect audio element to analyzer
      sourceRef.current = audioContext.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContext.destination);

      setAudioContextInitialized(true);
      console.log("Audio context initialized successfully");

      // Start visualization if playing
      if (isPlaying) {
        startVisualization();
      }
    } catch (err) {
      console.error("Audio context setup failed:", err);
      setError("Audio visualization not available");
    }
  };

  // Attempt autoplay when autoplayEnabled changes to true
  useEffect(() => {
    if (!autoplayEnabled || autoplayAttempted) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    // Initialize audio context on user interaction
    initializeAudioContext();

    // Attempt to autoplay
    const playPromise = audio.play();
    setAutoplayAttempted(true);
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          console.log("Autoplay successful");
          startVisualization();
        })
        .catch(err => {
          console.warn("Autoplay prevented:", err);
          setError("Autoplay blocked by browser. Click play to start.");
          setIsPlaying(false);
        });
    }
  }, [autoplayEnabled, autoplayAttempted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setError(`Failed to load audio. Check console for details.`);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setError(null);
      console.log("Audio can play now");
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Set initial volume and muted state
    audio.volume = volume;
    audio.muted = isMuted;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', nextTrack);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentTrack, volume, isMuted]);

  // Autoplay when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoplayAttempted) return;
    
    // Only attempt to play if we've already tried autoplay once
    // (this prevents multiple autoplay attempts on initial load)
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setError(null);
          startVisualization();
        })
        .catch(err => {
          console.error("Play failed after track change:", err);
          setError(`Playback failed: ${err.message}`);
          setIsPlaying(false);
        });
    }
  }, [currentTrack, autoplayAttempted]);

  // Start or stop visualization based on playing state
  useEffect(() => {
    if (isPlaying) {
      startVisualization();
    } else {
      stopVisualization();
    }
  }, [isPlaying]);

  const startVisualization = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions properly
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!ctx || !analyser) return;

      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw visualization
      const barWidth = (canvas.width / bufferLength) * 2.5; // Make sure bars span full width
      const thinBarWidth = 1; // Thinner bars
      let x = 0;

      // Draw circular wave effect at the top of the canvas with fixed position
      const centerX = canvas.width / 2;
      // Fixed position at the top with 15px margin
      const centerY = 15; 
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.2;
      
      // Draw circular waves based on audio data
      for (let i = 0; i < 3; i++) {
        const waveIndex = Math.floor(bufferLength / 4) * i;
        const waveValue = dataArray[waveIndex] / 255;
        const radius = maxRadius * (0.3 + waveValue * 0.7) * (i * 0.3 + 0.1);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 - i * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw connecting lines from center to ALL bars with significant amplitude
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > 30) { // Lower threshold to show more lines
          const barX = x + thinBarWidth/2;
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
          const barY = canvas.height - barHeight;
          
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(barX, barY);
          ctx.strokeStyle = `rgba(255, 255, 255, ${dataArray[i] / 255 * 0.6})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        x += barWidth;
      }
      ctx.globalAlpha = 1;
      
      // Reset x for drawing bars
      x = 0;
      
      // Draw thin bars
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, thinBarWidth, barHeight);
        
        // Draw a dot at the top of each bar if it has significant amplitude
        if (dataArray[i] > 30) {
          const dotSize = dataArray[i] / 255 * 2.5;
          ctx.beginPath();
          ctx.arc(x + thinBarWidth/2, canvas.height - barHeight - dotSize/2, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        }
        
        x += barWidth;
      }
      
      // Draw center dot last so it's on top
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
    };

    draw();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Reset canvas to show a static state
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw static center circle at the top with fixed position
        const centerX = canvas.width / 2;
        // Fixed position at the top with 15px margin
        const centerY = 15;
        
        // Draw static rings first (behind bars)
        for (let i = 0; i < 3; i++) {
          const radius = Math.min(canvas.width, canvas.height) * 0.1 * (i + 1);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - i * 0.05})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Draw static bars
        const bufferLength = 64;
        const barWidth = (canvas.width / bufferLength) * 2.5;
        const thinBarWidth = 1;
        let x = 0;
        
        // Draw some static connecting lines
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < bufferLength; i += 4) {
          const barHeight = 2 + Math.sin(i * 0.2) * 3;
          const barY = canvas.height - barHeight;
          
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x + thinBarWidth/2, barY);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          x += barWidth;
        }
        ctx.globalAlpha = 1;
        
        // Reset x for drawing bars
        x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          // Static height when not playing
          const barHeight = 2 + Math.sin(i * 0.2) * 3;
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(x, canvas.height - barHeight, thinBarWidth, barHeight);
          
          // Add small static dots
          if (i % 4 === 0) {
            ctx.beginPath();
            ctx.arc(x + thinBarWidth/2, canvas.height - barHeight - 1, 1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
          }
          
          x += barWidth;
        }
        
        // Draw center dot last so it's on top
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Reset error state when trying to play
      setError(null);
      
      // Initialize audio context on first play
      if (!audioContextInitialized) {
        initializeAudioContext();
      }
      
      // Resume audio context if it was suspended
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Use the play() Promise API properly
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log("Play successful");
          })
          .catch(err => {
            console.error("Play failed:", err);
            setError(`Playback failed: ${err.message}`);
            setIsPlaying(false);
          });
      }
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    // We don't need to explicitly call play here as the useEffect will handle it
    setError(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    if (!isNaN(newTime)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="bg-black border bg-opacity-40 p-4 font-mono hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-white/20 group">
      <audio
        ref={audioRef}
        src={getAudioPath()}
        preload="metadata"
        muted={isMuted}
      />
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-bold flex items-center gap-2">
          <span className="animate-pulse">♫</span> AUDIO.SYS
        </h3>
        <div className="text-white text-xs font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Audio Visualizer */}
      <div className="mb-4 border-b border-gray-800 pb-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-24 rounded-md"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        />
      </div>

      <div className="text-gray-300 text-xs mb-3 truncate group-hover:text-white transition-colors">
        {tracks[currentTrack].title}
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={togglePlay}
          className="text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button
          onClick={nextTrack}
          className="text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
        >
          <SkipForward size={16} />
        </button>
        
        <button
          onClick={toggleMute}
          className="text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #FFFFFF 0%, #FFFFFF ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
          }}
        />
      </div>

      <div 
        onClick={handleProgressClick}
        className="w-full bg-gray-800 rounded-full h-1 cursor-pointer"
      >
        <div
          className="bg-white h-1 rounded-full transition-all duration-500 shadow-sm shadow-white/50"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-gray-500 text-xs">
          {isPlaying ? (
            <span className="text-white">● Playing</span>
          ) : (
            <span className="text-white">● Paused</span>
          )}
        </div>
        <div className="text-gray-500 text-xs">
          Track {currentTrack + 1}/{tracks.length}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;