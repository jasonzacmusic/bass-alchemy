import { Dices, X, RotateCcw, Pause } from 'lucide-react';
import { DISPLAY, CATEGORY_META } from '../constants';

export default function ProgressionPanel({
  sequence, editSlot, loopOn, loopSlot, allChords,
  pianoLoaded, inDemo,
  onSlotClick, onMusicalRandom, onClear, onToggleLoop,
}) {
  return (
    <div className="rounded-xl p-5"
      style={{
        background:'linear-gradient(180deg, rgba(52,32,72,0.55), rgba(30,18,42,0.4))',
        border:'1px solid rgba(168,85,247,0.22)',
        boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>

      {/* 4 slots */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {sequence.map((pc, i) => {
          const isEditing = editSlot === i;
          const isPlaying = loopOn && loopSlot === i;
          const chord = pc !== null ? allChords[pc] : null;
          const cat   = chord ? CATEGORY_META[chord.category] : null;
          return (
            <button key={i} onClick={() => onSlotClick(i)}
              className="relative p-3 rounded-lg min-h-[96px] flex flex-col items-center justify-center transition-all"
              style={{
                background: isPlaying
                  ? 'linear-gradient(180deg, rgba(99,102,241,0.35), rgba(99,102,241,0.12))'
                  : 'rgba(16,11,7,0.6)',
                border: isEditing
                  ? '1.5px dashed rgba(245,184,65,0.75)'
                  : isPlaying
                  ? '1px solid rgba(129,140,248,0.75)'
                  : pc !== null
                  ? `1px solid ${cat.color}55`
                  : '1px dashed rgba(255,255,255,0.18)',
                boxShadow: isPlaying ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
                animation: isEditing ? 'seqPulse 1.3s ease-in-out infinite' : 'none',
              }}>
              <span className="absolute top-1.5 left-2 text-[9px] uppercase"
                style={{ color:'#a89968', letterSpacing:'0.18em' }}>
                {i + 1}
              </span>
              {pc !== null ? (
                <>
                  <div style={{
                    fontFamily:"'Fraunces', serif", fontWeight:500, fontSize:'1.35rem',
                    color: isPlaying ? '#c7d2fe' : '#fcf4dc', lineHeight:1,
                  }}>{DISPLAY[pc]}</div>
                  <div className="text-[10px] mt-1.5 truncate max-w-full px-1"
                    style={{ color:'#ecd7a2' }} title={chord.name}>
                    {chord.name}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="w-1 h-1 rounded-full" style={{ background:cat.color }} />
                    <span className="text-[8px] uppercase" style={{ color:cat.color, letterSpacing:'0.08em' }}>
                      {cat.short}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ color: isEditing ? '#fde68a' : '#5a5140', fontSize:'1.6rem', lineHeight:1 }}>
                  {isEditing ? '…' : '+'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={onMusicalRandom} disabled={!pianoLoaded || inDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all disabled:opacity-40 hover:-translate-y-[1px]"
          style={{
            background:'linear-gradient(180deg, rgba(168,85,247,0.28), rgba(168,85,247,0.08))',
            border:'1px solid rgba(192,132,252,0.5)',
            color:'#e9d5ff', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:500,
          }}>
          <Dices size={12} /> Musical random
        </button>

        <button onClick={onClear} disabled={!pianoLoaded}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all disabled:opacity-40"
          style={{
            background:'rgba(16,11,7,0.7)',
            border:'1px solid rgba(255,255,255,0.18)',
            color:'#d2bb85', letterSpacing:'0.1em', textTransform:'uppercase',
          }}>
          <X size={12} /> Clear
        </button>

        <button onClick={onToggleLoop} disabled={!pianoLoaded || inDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs transition-all disabled:opacity-40 hover:-translate-y-[1px]"
          style={{
            background: loopOn
              ? 'linear-gradient(180deg, rgba(99,102,241,0.35), rgba(99,102,241,0.12))'
              : 'linear-gradient(180deg, rgba(245,184,65,0.25), rgba(245,184,65,0.09))',
            border: loopOn ? '1px solid rgba(129,140,248,0.7)' : '1px solid rgba(245,184,65,0.5)',
            color: loopOn ? '#e0e7ff' : '#fde68a',
            letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500,
            boxShadow: loopOn ? '0 4px 18px -6px rgba(99,102,241,0.5)' : '0 4px 18px -6px rgba(245,184,65,0.4)',
          }}>
          {loopOn ? <Pause size={12} fill="currentColor" /> : <RotateCcw size={12} />}
          {loopOn ? 'Stop loop' : 'Loop'}
        </button>
      </div>

      {editSlot !== null && (
        <p className="text-xs text-center mt-4" style={{ color:'#fde68a', fontStyle:'italic' }}>
          Tap any bass note below to fill slot {editSlot + 1}
        </p>
      )}
    </div>
  );
}
