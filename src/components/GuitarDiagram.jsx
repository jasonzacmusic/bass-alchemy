// SVG guitar chord diagram. frets = [s0..s5], -1 = muted, 0 = open.
export default function GuitarDiagram({ frets }) {
  if (!frets) return null;

  const nonMuted = frets.filter(f => f >= 0);
  if (!nonMuted.length) return null;

  const maxF     = Math.max(...nonMuted);
  const nonOpen  = frets.filter(f => f > 0);
  const minNonOpen = nonOpen.length ? Math.min(...nonOpen) : 0;

  let startFret, showNut;
  if (maxF <= 4) {
    startFret = 1;
    showNut   = true;
  } else {
    startFret = minNonOpen || 1;
    showNut   = startFret === 1;
  }

  // SVG layout
  const W = 76, H = 90;
  const TOP = 15, L = 10, R = 66, BOT = 82;
  const STR_SP = (R - L) / 5;
  const FRT_SP = (BOT - TOP) / 4;

  const sx = i => L + i * STR_SP;
  const fy = j => TOP + j * FRT_SP;

  // Barre: consecutive frets at startFret (if > 0 and >= 2 strings)
  const barreIdxs = frets.reduce((acc, f, i) => {
    if (f === startFret && startFret > 0) acc.push(i);
    return acc;
  }, []);
  const hasBarre = barreIdxs.length >= 2;

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Strings */}
      {[0,1,2,3,4,5].map(i => (
        <line key={i}
          x1={sx(i)} y1={TOP}
          x2={sx(i)} y2={BOT}
          stroke="rgba(255,255,255,0.25)" strokeWidth="1"
        />
      ))}

      {/* Fret lines (5 lines = 4 rows) */}
      {[0,1,2,3,4].map(j => (
        <line key={j}
          x1={L} y1={fy(j)}
          x2={R} y2={fy(j)}
          stroke={j === 0 && showNut ? '#d4b054' : 'rgba(255,255,255,0.18)'}
          strokeWidth={j === 0 && showNut ? 3 : 1}
        />
      ))}

      {/* Fret number label when not starting at open position */}
      {!showNut && (
        <text
          x={L - 5} y={fy(0) + FRT_SP / 2 + 3}
          textAnchor="end" fontSize="8" fill="#bea066"
        >
          {startFret}fr
        </text>
      )}

      {/* Barre bar */}
      {hasBarre && (
        <rect
          x={sx(barreIdxs[0]) - 3.5}
          y={fy(0) + 2}
          width={sx(barreIdxs[barreIdxs.length - 1]) - sx(barreIdxs[0]) + 7}
          height={FRT_SP - 4}
          rx={3.5}
          fill="rgba(245,184,65,0.65)"
        />
      )}

      {/* Per-string markers */}
      {frets.map((f, i) => {
        if (f < 0) {
          return (
            <text key={i} x={sx(i)} y={TOP - 4}
              textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)"
              fontFamily="ui-monospace,monospace">×</text>
          );
        }
        if (f === 0) {
          return (
            <circle key={i}
              cx={sx(i)} cy={TOP - 5} r={3}
              fill="none" stroke="#d4b054" strokeWidth="1.3"
            />
          );
        }
        const row = f - startFret;
        if (row < 0 || row > 3) return null;
        if (hasBarre && f === startFret) return null; // covered by barre
        return (
          <circle key={i}
            cx={sx(i)} cy={fy(row) + FRT_SP / 2}
            r={4.5} fill="#f5b841"
          />
        );
      })}
    </svg>
  );
}
