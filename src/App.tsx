import { useState, useRef } from 'react';
import MusicPlayer from './components/MusicPlayer';
import Rain from './components/Rain';
import JpBanner from './components/JpBanner';
import PixelTitle from './components/PixelTitle';
import PixelRose from './components/PixelRose';
import LogoPanel from './components/LogoPanel';
import { useViewCounter } from './hooks/useViewCounter';
import './App.css';

const PANELS = 3;

export default function App() {
  const [started, setStarted]           = useState(false);
  const [panel, setPanel]               = useState(0);
  const [displayPanel, setDisplayPanel] = useState(0);
  const [animClass, setAnimClass]       = useState('');
  const [busy, setBusy]                 = useState(false);
  const vizRef   = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { count: viewCount, loading } = useViewCounter();

  if (!started) {
    return (
      <div className="splash" onClick={() => setStarted(true)}>
        <PixelRose />
      </div>
    );
  }

  const navigateTo = (target: number, dir: 'next' | 'prev') => {
    if (busy || target === panel) return;
    setBusy(true);
    setPanel(target);
    setAnimClass(`exit-${dir}`);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDisplayPanel(target);
      setAnimClass(`enter-${dir}`);
      timerRef.current = setTimeout(() => {
        setAnimClass('');
        setBusy(false);
      }, 360);
    }, 200);
  };

  const prev = () => navigateTo((panel - 1 + PANELS) % PANELS, 'prev');
  const next = () => navigateTo((panel + 1) % PANELS, 'next');

  return (
    <div className="site">
      <Rain />
      <canvas ref={vizRef} className="viz-canvas" />
      <JpBanner />

      <button className="nav-arrow nav-arrow-l" onClick={prev} aria-label="previous">{'<'}</button>
      <button className="nav-arrow nav-arrow-r" onClick={next} aria-label="next">{'>'}</button>

      <div className="panel-dots">
        {Array.from({ length: PANELS }).map((_, i) => (
          <div key={i} className={`panel-dot${i === panel ? ' active' : ''}`} onClick={() => navigateTo(i, i > panel ? 'next' : 'prev')} />
        ))}
      </div>

      <div className="panel-view">
        <div className={`panel-anim${animClass ? ' ' + animClass : ''}`}>
          {displayPanel === 0 ? (
            <div className="carousel-panel panel-home">
              <div className="float-home">
                <div className="hdr">
                  <div className="hdr-name"><PixelTitle text="JXKS.DEV" /></div>
                  <p className="hdr-jp">全スタック開発者 &amp; 怠惰スペシャリスト</p>
                  <p className="hdr-en">[ FULL-STACK DEVELOPER &amp; LAZINESS SPECIALIST ]</p>
                  <div className="hdr-badges">
                    <span className="chip">⊕ フランス / インドネシア</span>
                    <span className="chip">{loading ? '···' : `${viewCount.toLocaleString()} 訪問`}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : displayPanel === 1 ? (
            <div className="carousel-panel panel-blocks">
              <LogoPanel />
            </div>
          ) : (
            <div className="carousel-panel panel-home">
              <div className="float-home" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.4rem' }}>
                <PixelTitle text="Je t'aime Samuel." minPx={13} vwFactor={0.028} maxPx={28} />
                <PixelTitle text="Pour Toujours. <3" minPx={13} vwFactor={0.028} maxPx={28} />
              </div>
            </div>
          )}
        </div>
      </div>

      <MusicPlayer autoplayEnabled={started} canvasRef={vizRef} />
    </div>
  );
}
