import { CATEGORY_META } from '../constants';

export default function BassGrid({ allChords, bassPc, loopOn, autoOn, onBassClick }) {
  return (
    <div className="rounded-xl p-5"
      style={{
        background:'linear-gradient(180deg, rgba(30,34,72,0.55), rgba(22,25,50,0.4))',
        border:'1px solid rgba(99,102,241,0.22)',
        boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>

      {/* Category legend */}
      <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mb-4 text-[10px]"
        style={{ color:'#d2bb85', letterSpacing:'0.06em' }}>
        {Object.entries(CATEGORY_META).map(([num, meta]) => (
          <div key={num} className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background:meta.color }} />
            <span style={{ textTransform:'uppercase' }}>{meta.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
        {allChords.map((c, idx) => {
          const sel     = idx === bassPc;
          const catMeta = CATEGORY_META[c.category];
          const playing = sel && (loopOn || autoOn);
          return (
            <button key={idx} onClick={() => onBassClick(idx)}
              className="relative p-2.5 rounded-lg flex flex-col items-center justify-between min-h-[92px]"
              style={{
                background: sel
                  ? 'linear-gradient(180deg, rgba(99,102,241,0.32), rgba(99,102,241,0.10))'
                  : 'rgba(16,11,7,0.55)',
                border: sel ? '1px solid rgba(129,140,248,0.75)' : `1px solid ${catMeta.color}33`,
                boxShadow: playing
                  ? '0 0 0 3px rgba(99,102,241,0.22), 0 12px 32px -10px rgba(99,102,241,0.55)'
                  : sel
                  ? '0 0 0 3px rgba(99,102,241,0.14), 0 6px 18px -10px rgba(99,102,241,0.35)'
                  : 'none',
                transform: sel ? 'translateY(-2px)' : 'translateY(0)',
                transition:'background 280ms, border 280ms, box-shadow 280ms, transform 220ms cubic-bezier(.2,.8,.2,1)',
                animation: sel ? 'bassBeat 500ms cubic-bezier(.34,1.56,.64,1)' : 'none',
              }}>
              <div style={{
                fontFamily:"'Fraunces', serif", fontWeight:500, fontSize:'1.35rem',
                color: sel ? '#c7d2fe' : '#fcf4dc', lineHeight:1,
                transition:'color 280ms',
              }}>{c.label}</div>
              <div className="text-[10px] w-full text-center truncate px-0.5"
                style={{ color:'#ecd7a2', letterSpacing:'0.01em' }} title={c.name}>
                {c.name}
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{
                  background:catMeta.color,
                  boxShadow: playing ? `0 0 6px ${catMeta.color}` : 'none',
                }} />
                <span className="text-[8px] uppercase"
                  style={{ color:catMeta.color, letterSpacing:'0.08em', opacity:0.9 }}>
                  {catMeta.short}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
