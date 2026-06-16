export default function PixelScene() {
  const rainLines = Array.from({ length: 40 }, (_, i) => ({
    x: (i * 137 + 23) % 300,
    y: (i * 53 + 7) % 120,
    len: 6 + (i % 3) * 4,
    opacity: 0.06 + (i % 4) * 0.025,
  }));

  return (
    <div className="px-scene" aria-hidden>
      <svg
        className="px-torii"
        viewBox="0 0 300 160"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* rain lines */}
        <g>
          {rainLines.map((r, i) => (
            <line
              key={i}
              x1={r.x} y1={r.y}
              x2={r.x - 2} y2={r.y + r.len}
              stroke="white" strokeWidth="1"
              opacity={r.opacity}
            />
          ))}
        </g>

        {/* moon */}
        <circle cx="252" cy="22" r="13" fill="none" stroke="white" strokeWidth="1" opacity="0.22" />
        <circle cx="258" cy="20" r="13" fill="black" opacity="0.22" />

        {/* tori gate — pixel-perfect rectangles */}
        {/* kasagi overhang ends */}
        <rect x="4"   y="28" width="14" height="8" fill="white" opacity="0.9" />
        <rect x="282" y="28" width="14" height="8" fill="white" opacity="0.9" />
        {/* kasagi (top beam) */}
        <rect x="10"  y="26" width="280" height="12" fill="white" opacity="0.9" />
        {/* shimaki (secondary beam under kasagi) */}
        <rect x="22"  y="38" width="256" height="7"  fill="white" opacity="0.9" />
        {/* nuki (middle crossbar) */}
        <rect x="36"  y="66" width="228" height="9"  fill="white" opacity="0.9" />
        {/* left pillar */}
        <rect x="44"  y="75" width="14"  height="85" fill="white" opacity="0.9" />
        {/* right pillar */}
        <rect x="242" y="75" width="14"  height="85" fill="white" opacity="0.9" />

        {/* ground line */}
        <line x1="0" y1="159" x2="300" y2="159" stroke="white" strokeWidth="1" opacity="0.25" />
        {/* ground shadow/reflection */}
        <line x1="44" y1="159" x2="44"  y2="163" stroke="white" strokeWidth="1" opacity="0.12" />
        <line x1="58" y1="159" x2="58"  y2="162" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="242" y1="159" x2="242" y2="163" stroke="white" strokeWidth="1" opacity="0.12" />
        <line x1="256" y1="159" x2="256" y2="162" stroke="white" strokeWidth="1" opacity="0.08" />
      </svg>

      {/* floating kanji */}
      <span className="px-kanji" style={{ left: '6%',  top: '20%' }}>雨</span>
      <span className="px-kanji" style={{ right: '6%', top: '15%' }}>夜</span>
      <span className="px-kanji" style={{ left: '14%', top: '65%', fontSize: '0.5rem' }}>静</span>
      <span className="px-kanji" style={{ right: '14%', top: '60%', fontSize: '0.5rem' }}>寂</span>
    </div>
  );
}
