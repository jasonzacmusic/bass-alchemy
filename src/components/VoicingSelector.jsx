import { VOICINGS } from '../constants';

export default function VoicingSelector({ voicingId, onSelect }) {
  return (
    <div className="rounded-xl p-5"
      style={{
        background:'linear-gradient(180deg, rgba(40,32,22,0.55), rgba(24,18,12,0.4))',
        border:'1px solid rgba(255,220,180,0.14)',
        boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {VOICINGS.map(v => {
          const sel = v.id === voicingId;
          return (
            <button key={v.id} onClick={() => onSelect(v.id)}
              className="text-left p-3 rounded-xl transition-all duration-300"
              style={{
                background: sel
                  ? 'linear-gradient(180deg, rgba(245,184,65,0.20), rgba(245,184,65,0.06))'
                  : 'rgba(16,11,7,0.55)',
                border: sel ? '1px solid rgba(245,184,65,0.5)' : '1px solid rgba(255,255,255,0.10)',
                boxShadow: sel ? '0 0 0 3px rgba(245,184,65,0.09)' : 'none',
              }}>
              <div style={{
                fontFamily:"'Fraunces', serif", fontWeight:500,
                color: sel ? '#fde68a' : '#fcf4dc', fontSize:'0.95rem',
                letterSpacing:'-0.01em', marginBottom:'2px',
              }}>{v.name}</div>
              <div className="text-[11px]" style={{ color:'#d2bb85', letterSpacing:'0.03em' }}>
                {v.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
