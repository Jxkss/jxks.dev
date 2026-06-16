import React, { useState, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  autoplayEnabled?: boolean;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

const TRACK = { src: '/avant%20garde.mp3', title: 'AVANT GARDE' };
const RAIN_SRC = '/rain.mp3';
const RAIN_CROSSFADE = 3;

const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoplayEnabled = false, canvasRef }) => {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [volume, setVolume]         = useState(0.1);
  const [isMuted, setIsMuted]       = useState(false);
  const [duration, setDuration]     = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError]           = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [audioContextInitialized, setAudioContextInitialized] = useState(false);

  const audioRef      = useRef<HTMLAudioElement>(null);
  const rainARef      = useRef<HTMLAudioElement>(null);
  const rainBRef      = useRef<HTMLAudioElement>(null);
  const animationRef  = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef   = useRef<AnalyserNode | null>(null);
  const sourceRef     = useRef<MediaElementAudioSourceNode | null>(null);
  const rainMasterGainRef = useRef<GainNode | null>(null);
  const rainGainARef  = useRef<GainNode | null>(null);
  const rainGainBRef  = useRef<GainNode | null>(null);
  const rainReadyRef  = useRef(false);
  const rainCrossfadingRef = useRef(false);

  const initRain = (ac: AudioContext, vol: number) => {
    if (rainReadyRef.current) return;

    const rainA = rainARef.current;
    const rainB = rainBRef.current;
    if (!rainA || !rainB) return;

    const master = ac.createGain();
    master.gain.value = vol;
    master.connect(ac.destination);

    const connectRain = (el: HTMLAudioElement) => {
      const src = ac.createMediaElementSource(el);
      const gain = ac.createGain();
      src.connect(gain);
      gain.connect(master);
      return gain;
    };

    const gainA = connectRain(rainA);
    const gainB = connectRain(rainB);
    gainA.gain.value = 1;
    gainB.gain.value = 0;

    rainMasterGainRef.current = master;
    rainGainARef.current = gainA;
    rainGainBRef.current = gainB;
    rainReadyRef.current = true;

    const crossfade = (
      current: HTMLAudioElement,
      next: HTMLAudioElement,
      curGain: GainNode,
      nextGain: GainNode,
    ) => {
      if (rainCrossfadingRef.current) return;
      rainCrossfadingRef.current = true;

      next.currentTime = 0;
      next.play().catch(() => {});

      const t = ac.currentTime;
      curGain.gain.cancelScheduledValues(t);
      nextGain.gain.cancelScheduledValues(t);
      curGain.gain.setValueAtTime(curGain.gain.value, t);
      nextGain.gain.setValueAtTime(0, t);
      curGain.gain.linearRampToValueAtTime(0, t + RAIN_CROSSFADE);
      nextGain.gain.linearRampToValueAtTime(1, t + RAIN_CROSSFADE);

      window.setTimeout(() => {
        current.pause();
        current.currentTime = 0;
        curGain.gain.value = 0;
        rainCrossfadingRef.current = false;
      }, RAIN_CROSSFADE * 1000 + 50);
    };

    const watch = (
      current: HTMLAudioElement,
      next: HTMLAudioElement,
      curGain: GainNode,
      nextGain: GainNode,
    ) => {
      if (rainCrossfadingRef.current || current.paused || !current.duration) return;
      if (current.currentTime >= current.duration - RAIN_CROSSFADE) {
        crossfade(current, next, curGain, nextGain);
      }
    };

    rainA.addEventListener('timeupdate', () => watch(rainA, rainB, gainA, gainB));
    rainB.addEventListener('timeupdate', () => watch(rainB, rainA, gainB, gainA));

    const startRain = () => {
      rainA.currentTime = 0;
      rainA.play().catch(() => {});
    };

    if (rainA.readyState >= 1) startRain();
    else rainA.addEventListener('loadedmetadata', startRain, { once: true });
  };

  const initAudioContext = () => {
    if (!audioRef.current || audioContextInitialized) return;
    try {
      if (!audioContextRef.current) {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AC();
      }
      const ac = audioContextRef.current;
      if (!analyserRef.current) {
        analyserRef.current = ac.createAnalyser();
        analyserRef.current.fftSize = 512;
        analyserRef.current.smoothingTimeConstant = 0.75;
      }
      if (!sourceRef.current) {
        sourceRef.current = ac.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(ac.destination);
      }
      initRain(ac, isMuted ? 0 : volume);
      setAudioContextInitialized(true);
    } catch (err) {
      console.error('Audio context setup failed:', err);
    }
  };

  useEffect(() => {
    if (!autoplayEnabled || audioReady) return;
    const audio = audioRef.current;
    if (!audio) return;
    setAudioReady(true);
    initAudioContext();
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    audio.play()
      .then(() => { setIsPlaying(true); startVisualization(); })
      .catch(() => setError('Click ▶ to start.'));
  }, [autoplayEnabled, audioReady]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = isMuted ? 0 : volume;
    if (rainMasterGainRef.current) rainMasterGainRef.current.gain.value = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime     = () => setCurrentTime(audio.currentTime);
    const onMeta     = () => { if (!isNaN(audio.duration)) setDuration(audio.duration); };
    const onEnded    = () => { audio.currentTime = 0; audio.play(); };
    const onError    = () => { setError('Failed to load audio.'); setIsPlaying(false); };
    const onCanPlay  = () => setError(null);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('canplay', onCanPlay);
    audio.volume = volume;
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) startVisualization();
    else stopVisualization();
  }, [isPlaying]);

  const startVisualization = () => {
    if (!analyserRef.current || !canvasRef?.current) return;
    const analyser = analyserRef.current;
    const canvas   = canvasRef.current;
    const ctx      = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const PIXEL = 4;
    const resize = () => {
      canvas.width  = Math.floor(window.innerWidth  / PIXEL);
      canvas.height = Math.floor(window.innerHeight / PIXEL);
    };
    resize();
    window.addEventListener('resize', resize);

    const bufLen = analyser.frequencyBinCount;
    const data   = new Uint8Array(bufLen);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);

      const sw = canvas.width * PIXEL;
      const sh = canvas.height * PIXEL;
      ctx.setTransform(1/PIXEL, 0, 0, 1/PIXEL, 0, 0);
      ctx.clearRect(0, 0, sw, sh);

      const bars   = 228;
      const half   = Math.floor(bars / 2);
      const bw     = sw / bars;
      const floorY = sh * 0.88;
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      for (let i = 0; i < half; i++) {
        const idx  = Math.floor((i / half) * bufLen);
        const raw  = data[idx] / 255;
        const barH = Math.pow(raw, 0.2) * 0.65 * sh * 0.38;
        if (barH > 1) {
          ctx.fillRect(i * bw,               floorY - barH, Math.max(bw - PIXEL, 1), barH);
          ctx.fillRect((bars - 1 - i) * bw, floorY - barH, Math.max(bw - PIXEL, 1), barH);
        }
      }
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  };

  const stopVisualization = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (canvasRef?.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
      if (!audioContextInitialized) initAudioContext();
      if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => { setError(`Playback failed: ${err.message}`); setIsPlaying(false); });
    }
  };

  const toggleMute = () => setIsMuted(m => !m);

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (isMuted) setIsMuted(false);
  };

  const fmt = (t: number) => isNaN(t) ? '0:00'
    : `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  const progress    = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayVol  = isMuted ? 0 : volume;

  return (
    <>
      <audio ref={audioRef} src={TRACK.src} preload="metadata" />
      <audio ref={rainARef} src={RAIN_SRC} preload="auto" />
      <audio ref={rainBRef} src={RAIN_SRC} preload="auto" />

      <div className="player-info">
        <div className="player-track-name">♪  {TRACK.title}</div>
        <div className="player-progress">
          <div className="player-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="player-time">{fmt(currentTime)} / {fmt(duration)}</div>
      </div>

      <div className="player-controls">
        <button className="player-btn" onClick={togglePlay} title={isPlaying ? 'pause' : 'play'}>
          {isPlaying ? '▐▐' : '▶'}
        </button>
        <button className="player-btn" onClick={toggleMute} title={isMuted ? 'unmute' : 'mute'}>
          {isMuted ? '✕♪' : '♪'}
        </button>
        <div className="player-vol">
          <input
            type="range"
            className="vol-slider"
            min="0"
            max="1"
            step="0.01"
            value={displayVol}
            onChange={handleVolume}
            title="volume"
          />
          <span className="vol-pct">{Math.round(displayVol * 100)}%</span>
        </div>
      </div>

      {error && <div className="player-error">{error}</div>}
    </>
  );
};

export default MusicPlayer;
