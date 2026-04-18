import { Play, Pause, Shuffle, PlayCircle, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import Piano from './Piano';
import PatternSelector from './PatternSelector';
import MetronomeControls from './MetronomeControls';

export default function TransportBar({
  rhNotes, bassNote, octaveStart, octaveShift,
  pianoLoaded, loopOn, autoOn, inDemo,
  onOctaveDown, onOctaveUp,
  onPlay, onStop, onToggleAuto, onRunDemo,
  pattern, onPatternChange,
  bpm, onBpmChange,
  metronomeOn, onMetronomeToggle,
}) {
  const activeMode = loopOn || autoOn || inDemo;

  return (
    <div className="rounded-xl p-5 md:p-7 relative overflow-hidden"
      style={{
        background:'linear-gradient(180deg, rgba(32,24,16,0.55), rgba(18,13,8,0.4))',
        border:'1px solid rgba(255,255,255,0.12)',
        boxShadow:'0 30px 80px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>

      {/* Piano + octave arrows */}
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={onOctaveDown} disabled={octaveShift <= -1}
          className="flex-shrink-0 rounded-full p-2 transition-all disabled:opacity-30 hover:-translate-x-[1px]"
          style={{
            background:'rgba(16,11,7,0.7)',
            border:'1px solid rgba(255,220,180,0.25)',
            color:'#fde68a',
          }}
          title="Shift down one octave">
          <ChevronLeft size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <Piano rhNotes={rhNotes} bassNote={bassNote} octaveStart={octaveStart} />
        </div>

        <button onClick={onOctaveUp} disabled={octaveShift >= 2}
          className="flex-shrink-0 rounded-full p-2 transition-all disabled:opacity-30 hover:translate-x-[1px]"
          style={{
            background:'rgba(16,11,7,0.7)',
            border:'1px solid rgba(255,220,180,0.25)',
            color:'#fde68a',
          }}
          title="Shift up one octave">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background:'#f5b841' }} />
          <span style={{ color:'#f3dead' }}>Right hand · <span style={{ color:'#bea066' }}>piano · fixed</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background:'#6366f1' }} />
          <span style={{ color:'#f3dead' }}>Bass · <span style={{ color:'#bea066' }}>variable</span></span>
        </div>
      </div>

      {/* Transport buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button onClick={onPlay} disabled={!pianoLoaded || inDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs transition-all disabled:opacity-40 hover:-translate-y-[1px]"
          style={{
            background:'linear-gradient(180deg, rgba(245,184,65,0.28), rgba(245,184,65,0.12))',
            border:'1px solid rgba(245,184,65,0.5)',
            color:'#fff4d0', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500,
            boxShadow:'0 4px 18px -6px rgba(245,184,65,0.4)',
          }}>
          {pianoLoaded ? <Play size={12} fill="currentColor" /> : <Play size={12} className="animate-pulse" />}
          Play
        </button>

        <button onClick={onStop} disabled={!pianoLoaded}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs transition-all disabled:opacity-40 hover:-translate-y-[1px]"
          style={{
            background: activeMode
              ? 'linear-gradient(180deg, rgba(239,68,68,0.32), rgba(239,68,68,0.12))'
              : 'rgba(16,11,7,0.55)',
            border: activeMode ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.18)',
            color: activeMode ? '#fecaca' : '#bea066',
            letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500,
            boxShadow: activeMode ? '0 4px 18px -6px rgba(239,68,68,0.5)' : 'none',
          }}>
          <Square size={11} fill="currentColor" />
          Stop
        </button>

        <button onClick={onToggleAuto} disabled={!pianoLoaded || inDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs transition-all disabled:opacity-40 hover:-translate-y-[1px]"
          style={{
            background: autoOn
              ? 'linear-gradient(180deg, rgba(99,102,241,0.35), rgba(99,102,241,0.12))'
              : 'rgba(16,11,7,0.55)',
            border: autoOn ? '1px solid rgba(129,140,248,0.7)' : '1px solid rgba(255,255,255,0.18)',
            color: autoOn ? '#e0e7ff' : '#f3dead',
            letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500,
            boxShadow: autoOn ? '0 4px 18px -6px rgba(99,102,241,0.5)' : 'none',
          }}>
          {autoOn ? <Pause size={12} fill="currentColor" /> : <Shuffle size={12} />}
          {autoOn ? 'Stop tour' : 'Random tour'}
        </button>

        <button onClick={onRunDemo} disabled={!pianoLoaded}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs transition-all disabled:opacity-40 hover:-translate-y-[1px]"
          style={{
            background: inDemo
              ? 'linear-gradient(180deg, rgba(168,85,247,0.35), rgba(168,85,247,0.12))'
              : 'rgba(16,11,7,0.55)',
            border: inDemo ? '1px solid rgba(192,132,252,0.6)' : '1px solid rgba(255,255,255,0.18)',
            color: inDemo ? '#e9d5ff' : '#f3dead',
            letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500,
          }}>
          {inDemo ? <Pause size={12} fill="currentColor" /> : <PlayCircle size={12} />}
          {inDemo ? 'Stop demo' : 'Watch demo'}
        </button>
      </div>

      {/* Pattern / Tempo / Metro */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
        <PatternSelector pattern={pattern} onChange={onPatternChange} />
        <MetronomeControls
          metronomeOn={metronomeOn} bpm={bpm}
          pianoLoaded={pianoLoaded}
          onToggle={onMetronomeToggle}
          onBpmChange={onBpmChange}
        />
      </div>
    </div>
  );
}
