import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward } from 'lucide-react';

interface MusicPlayerProps {
  autoplayEnabled?: boolean;
  externalMuted?: boolean;
  onMuteChange?: (muted: boolean) => void;
  onBeatDetected?: (hasBeat: boolean) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  autoplayEnabled = false, 
  onBeatDetected,
  canvasRef
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [audioContextInitialized, setAudioContextInitialized] = useState(false);
  const [lastBeatTime, setLastBeatTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const beatDetectionRef = useRef<number[]>([]);

  const tracks = [
    { name: 'fixyou.mp3', title: '#FIXYOUU - prkr blu, 1crusafix' },
    { name: 'zombies.mp3', title: 'i hate zombys :pp - *67' }
  ];

  const getAudioPath = () => `/${tracks[currentTrack].name}`;

  const initializeAudioContext = () => {
    if (!audioRef.current || audioContextInitialized) return;

    try {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 512;
        analyserRef.current.smoothingTimeConstant = 0.95;
      }

      sourceRef.current = audioContext.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContext.destination);

      setAudioContextInitialized(true);

      if (isPlaying) {
        startVisualization();
      }
    } catch (err) {
      console.error("Audio context setup failed:", err);
      setError("Audio visualization not available");
    }
  };

  useEffect(() => {
    if (!autoplayEnabled || autoplayAttempted) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    initializeAudioContext();

    const playPromise = audio.play();
    setAutoplayAttempted(true);
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
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
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoplayAttempted) return;
    
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

  useEffect(() => {
    if (isPlaying) {
      startVisualization();
    } else {
      stopVisualization();
    }
  }, [isPlaying]);

  const detectBeat = (dataArray: Uint8Array) => {
    const bufferLength = dataArray.length;
    const lowFreqSum = dataArray.slice(0, Math.floor(bufferLength * 0.1)).reduce((a, b) => a + b, 0);
    const lowFreqAvg = lowFreqSum / Math.floor(bufferLength * 0.1);
    
    beatDetectionRef.current.push(lowFreqAvg);
    if (beatDetectionRef.current.length > 20) {
      beatDetectionRef.current.shift();
    }
    
    if (beatDetectionRef.current.length < 10) return false;
    
    const historicalAvg = beatDetectionRef.current.slice(0, -10).reduce((a, b) => a + b, 0) / (beatDetectionRef.current.length - 10);
    
    const beatThreshold = historicalAvg * 1.3;
    const currentTime = Date.now();
    
    if (lowFreqAvg > beatThreshold && (currentTime - lastBeatTime) > 200) {
      setLastBeatTime(currentTime);
      return true;
    }
    
    return false;
  };

  const startVisualization = () => {
    if (!analyserRef.current || !canvasRef?.current) return;
    
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    let volumeHistory: number[] = [];
    const maxHistoryLength = 10;
    
    let glowFade = 1.0;
    const fadeSpeed = 0.015;

    const draw = () => {
      if (!ctx || !analyser) return;

      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      const hasBeat = detectBeat(dataArray);
      if (onBeatDetected) {
        onBeatDetected(hasBeat);
      }
      
      const totalVolume = dataArray.reduce((sum, value) => sum + value, 0);
      const averageVolume = totalVolume / dataArray.length;
      const normalizedVolume = averageVolume / 255;
      
      volumeHistory.push(normalizedVolume);
      if (volumeHistory.length > maxHistoryLength) {
        volumeHistory.shift();
      }
      const smoothedVolume = volumeHistory.reduce((sum, vol) => sum + vol, 0) / volumeHistory.length;
      
      if (smoothedVolume > 0.05) {
        glowFade = Math.min(1.0, glowFade + fadeSpeed);
      } else {
        glowFade = Math.max(0.0, glowFade - fadeSpeed);
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        if (glowFade > 0.01) {
        const baseIntensity = Math.pow(smoothedVolume, 0.3) * 1.2;
        const pulseIntensity = baseIntensity * glowFade;
        const pulseRadius = smoothedVolume * Math.max(canvas.width, canvas.height) * 1.5 * glowFade;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${pulseIntensity * 0.8})`);
        gradient.addColorStop(0.1, `rgba(255, 255, 255, ${pulseIntensity * 0.6})`);
        gradient.addColorStop(0.3, `rgba(255, 255, 255, ${pulseIntensity * 0.4})`);
        gradient.addColorStop(0.6, `rgba(255, 255, 255, ${pulseIntensity * 0.2})`);
        gradient.addColorStop(0.8, `rgba(255, 255, 255, ${pulseIntensity * 0.1})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const barCount = 228;
      const barWidth = canvas.width / barCount;
      const spacing = 6;
      const actualBarWidth = barWidth - spacing;
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        
        const rawIntensity = dataArray[dataIndex] / 255;
        const dampenedIntensity = Math.pow(rawIntensity, 0.4) * 0.3;
        
        const barHeight = dampenedIntensity * canvas.height * 0.6;
        
        if (barHeight > 2) {
          const x = i * barWidth;
          const intensity = Math.min(rawIntensity * 0.6, 0.5);
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
          ctx.fillRect(x, canvas.height - barHeight, actualBarWidth, barHeight);
        }
      }
    };

    draw();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (canvasRef?.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      setError(null);
      
      if (!audioContextInitialized) {
        initializeAudioContext();
      }
      
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
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
    setError(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={getAudioPath()}
        preload="metadata"
        muted={isMuted}
      />
      
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black bg-opacity-20 border border-white/20 rounded-lg p-2 backdrop-blur-sm hover:border-white/40 transition-all duration-300">
        <button
          onClick={togglePlay}
          className="text-white hover:text-gray-300 transition-all duration-200 hover:scale-110 p-1"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <button
          onClick={nextTrack}
          className="text-white hover:text-gray-300 transition-all duration-200 hover:scale-110 p-1"
          title="Next Track"
        >
          <SkipForward size={14} />
        </button>
        
        <button
          onClick={toggleMute}
          className="text-white hover:text-gray-300 transition-all duration-200 hover:scale-110 p-1"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        
        <div className="text-white text-xs px-2 py-1 bg-white/10 rounded">
          {currentTrack + 1}/{tracks.length}
        </div>
      </div>
      
      <div className="fixed bottom-4 left-4 z-50 bg-black bg-opacity-20 border border-white/20 rounded-lg p-2 backdrop-blur-sm max-w-xs hover:border-white/40 transition-all duration-300">
        <div className="text-white text-xs font-mono truncate">
          {tracks[currentTrack].title}
        </div>
        <div className="text-gray-400 text-xs">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>
    </>
  );
};

export default MusicPlayer;