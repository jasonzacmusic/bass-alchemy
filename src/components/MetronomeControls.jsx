import { Music } from 'lucide-react';

export default function MetronomeControls({ metronomeOn, bpm, pianoLoaded, onToggle, onBpmChange }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color:'#bea066' }}>Tempo</span>
        <input type="range" min="50" max="180" step="1" value={bpm}
          onChange={e => onBpmChange(parseInt(e.target.value))}
          className="w-28 accent-amber-400" />
        <span className="text-[11px] tabular-nums"
          style={{ color:'#fde68a', letterSpacing:'0.05em', minWidth:'55px' }}>
          {bpm} BPM
        </span>
      </div>

      <button onClick={onToggle} disabled={!pianoLoaded}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] transition-all disabled:opacity-40"
        style={{
          background: metronomeOn ? 'rgba(245,184,65,0.2)' : 'rgba(16,11,7,0.7)',
          border: metronomeOn ? '1px solid rgba(245,184,65,0.5)' : '1px solid rgba(255,255,255,0.15)',
          color: metronomeOn ? '#fde68a' : '#d2bb85',
          letterSpacing:'0.05em',
        }}>
        <Music size={11} />
        {metronomeOn ? 'Metro on' : 'Metro off'}
      </button>
    </>
  );
}
