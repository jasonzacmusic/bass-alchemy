import { DISPLAY, CATEGORY_META } from '../constants';
import GuitarDiagram from './GuitarDiagram';

export default function ChordDisplay({ voicingName, keyPc, selected, pulseKey, instrument, guitarFrets }) {
  const categoryMeta = CATEGORY_META[selected.category];
  return (
    <section className="text-center mb-10 md:mb-12">
      <div className="text-[11px] uppercase tracking-[0.3em] mb-5"
        style={{ color:'#fcd34d', textShadow:'0 1px 3px rgba(0,0,0,0.6)' }}>
        {voicingName}
        <span className="mx-3" style={{ color:'#d2bb85' }}>in</span>
        <span style={{ color:'#fcd34d' }}>{DISPLAY[keyPc]}</span>
        <span className="mx-3" style={{ color:'#d2bb85' }}>over</span>
        <span style={{ color:'#a5b4fc' }}>{selected.label}</span>
        <span className="mx-3" style={{ color:'#d2bb85' }}>=</span>
      </div>

      <div
        key={pulseKey}
        className="chord-display"
        style={{
          fontFamily:"'Fraunces', serif", fontWeight:400,
          fontSize:'clamp(3.25rem, 10.5vw, 8.5rem)',
          letterSpacing:'-0.03em', lineHeight:0.95,
          color: selected.family === 'avoid' ? '#fecdd3' : '#fdfcf8',
          textShadow: selected.family === 'avoid'
            ? '0 2px 20px rgba(251,113,133,0.25)'
            : '0 0 60px rgba(245,184,65,0.18), 0 2px 4px rgba(0,0,0,0.4)',
          animation:'chordFade 500ms cubic-bezier(.2,.8,.2,1)',
        }}
      >
        {selected.name}
      </div>

      {instrument === 'guitar' && guitarFrets && (
        <div className="mt-4 flex justify-center">
          <div className="inline-block rounded-lg px-3 py-2"
            style={{
              background:'rgba(22,16,10,0.55)',
              border:'1px solid rgba(245,184,65,0.18)',
            }}>
            <GuitarDiagram frets={guitarFrets} />
          </div>
        </div>
      )}

      <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full"
        style={{
          background:'rgba(22,16,10,0.55)',
          border:`1px solid ${categoryMeta.color}55`,
        }}>
        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background:categoryMeta.color }} />
        <span style={{
          letterSpacing:'0.14em', fontSize:'11px',
          textTransform:'uppercase', color:categoryMeta.color, fontWeight:500,
        }}>
          {categoryMeta.label}
        </span>
      </div>
    </section>
  );
}
