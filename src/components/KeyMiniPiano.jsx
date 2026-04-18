const WHITE_KEYS = [
  { name:'C', pc:0 }, { name:'D', pc:2 }, { name:'E', pc:4 },
  { name:'F', pc:5 }, { name:'G', pc:7 }, { name:'A', pc:9 },
  { name:'B', pc:11 },
];
const BLACK_KEYS = [
  { name:'C♯', pc:1, afterIdx:0 }, { name:'D♯', pc:3, afterIdx:1 },
  { name:'F♯', pc:6, afterIdx:3 }, { name:'G♯', pc:8, afterIdx:4 },
  { name:'A♯', pc:10, afterIdx:5 },
];
const KW = 56, KH = 120, BW = 34, BH = 76;

export default function KeyMiniPiano({ keyPc, onSelect }) {
  const totalW = WHITE_KEYS.length * KW;
  return (
    <div className="w-full max-w-md mx-auto">
      <svg viewBox={`0 0 ${totalW} ${KH+6}`} className="w-full block"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter:'drop-shadow(0 10px 24px rgba(0,0,0,0.55))' }}>
        {WHITE_KEYS.map((k, i) => {
          const sel = k.pc === keyPc;
          return (
            <g key={`w-${i}`} onClick={() => onSelect(k.pc)} style={{ cursor:'pointer' }}>
              <rect x={i*KW+1} y={0} width={KW-2} height={KH}
                fill={sel ? '#f5b841' : '#f8f5ef'}
                stroke="#2a2a2a" strokeWidth={0.75} rx={4}
                style={{ transition:'fill 280ms ease' }} />
              {sel && (
                <rect x={i*KW+1} y={0} width={KW-2} height={KH}
                  fill="none" stroke="#fde68a" strokeWidth={2} rx={4} opacity={0.95} />
              )}
              <text x={i*KW + KW/2} y={KH - 14} textAnchor="middle"
                fontFamily="'Fraunces', serif" fontSize={15} fontWeight={500}
                fill={sel ? '#3d2a0b' : '#4a4238'}
                style={{ pointerEvents:'none', userSelect:'none' }}>
                {k.name}
              </text>
            </g>
          );
        })}
        {BLACK_KEYS.map((k, i) => {
          const sel = k.pc === keyPc;
          const x   = (k.afterIdx + 1) * KW - BW/2;
          return (
            <g key={`b-${i}`} onClick={() => onSelect(k.pc)} style={{ cursor:'pointer' }}>
              <rect x={x} y={0} width={BW} height={BH}
                fill={sel ? '#f5b841' : '#1a1410'}
                stroke={sel ? '#fde68a' : '#000'} strokeWidth={sel ? 1.5 : 0.75}
                rx={3} style={{ transition:'fill 280ms ease' }} />
              <text x={x + BW/2} y={BH - 10} textAnchor="middle"
                fontFamily="'Fraunces', serif" fontSize={11} fontWeight={500}
                fill={sel ? '#3d2a0b' : '#d2bb85'}
                style={{ pointerEvents:'none', userSelect:'none' }}>
                {k.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
