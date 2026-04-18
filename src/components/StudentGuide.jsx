import { X } from 'lucide-react';

export default function StudentGuide({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto"
      style={{
        background:'rgba(5,4,3,0.82)',
        backdropFilter:'blur(10px)',
        animation:'fadeIn 220ms ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl w-full max-w-2xl my-auto overflow-hidden"
        style={{
          background:'linear-gradient(180deg, rgba(32,24,16,0.98), rgba(18,13,8,0.96))',
          border:'1px solid rgba(245,184,65,0.35)',
          boxShadow:'0 40px 100px -20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)',
          animation:'guideRise 340ms cubic-bezier(.2,.8,.2,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all hover:rotate-90"
          style={{
            background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.2)',
            color:'#fcf4dc',
            transition:'transform 280ms cubic-bezier(.2,.8,.2,1), background 220ms',
          }}
          title="Close">
          <X size={14} />
        </button>

        <div className="p-7 md:p-10">
          <div className="mb-6 pb-5" style={{ borderBottom:'1px solid rgba(245,184,65,0.15)' }}>
            <h1 style={{
              fontFamily:"'Fraunces', serif", fontWeight:500,
              fontSize:'1.75rem', color:'#fde68a', letterSpacing:'-0.01em', lineHeight:1.1,
            }}>
              Bass Alchemy
            </h1>
            <p className="mt-1.5 text-[11px] uppercase"
              style={{ color:'#bea066', letterSpacing:'0.2em' }}>
              Student Quick Start · Nathaniel School of Music
            </p>
          </div>

          <div className="mb-7">
            <h2 className="text-[10px] uppercase mb-2" style={{ color:'#ecd7a2', letterSpacing:'0.25em' }}>
              What it does
            </h2>
            <p style={{ fontFamily:"'Fraunces', serif", fontSize:'1rem', fontStyle:'italic', color:'#f8eab6', lineHeight:1.5 }}>
              Fix your right-hand shape. Move your left-hand bass. Watch the chord change.
            </p>
            <p className="mt-3 text-sm" style={{ color:'#d2bb85', lineHeight:1.65 }}>
              One three-note voicing like <span style={{ color:'#fde68a', fontFamily:"'Fraunces', serif" }}>C – F – A♯</span> becomes
              twelve different chords depending on the bass beneath it — Csus4, Dm11, E♭6/9, F7sus2, G11, A♭maj13, B♭9, and more.
              One shape. Twelve chords.
            </p>
          </div>

          <div className="mb-7">
            <h2 className="text-[10px] uppercase mb-3" style={{ color:'#ecd7a2', letterSpacing:'0.25em' }}>
              Your first 60 seconds
            </h2>
            <ol className="space-y-2 text-sm" style={{ color:'#ecd7a2', lineHeight:1.6 }}>
              <li>
                <span style={{ color:'#e9d5ff', fontWeight:500 }}>1.</span>{' '}
                Click <span style={{ color:'#e9d5ff' }}>Musical random</span> in the purple Progression panel.
                A four-chord loop plays immediately.
              </li>
              <li>
                <span style={{ color:'#e9d5ff', fontWeight:500 }}>2.</span>{' '}
                Tap different <span style={{ color:'#fde68a' }}>Voicings</span> while it plays — same progression, different clothes.
              </li>
              <li>
                <span style={{ color:'#e9d5ff', fontWeight:500 }}>3.</span>{' '}
                Tap any <span style={{ color:'#a5b4fc' }}>Bass note</span>.
                The dot color tells you the chord family —{' '}
                <span style={{ color:'#22c55e' }}>green</span> triad ·{' '}
                <span style={{ color:'#06b6d4' }}>cyan</span> sus ·{' '}
                <span style={{ color:'#f59e0b' }}>amber</span> 7th ·{' '}
                <span style={{ color:'#a855f7' }}>purple</span> jazz ·{' '}
                <span style={{ color:'#ef4444' }}>red</span> rare.
              </li>
            </ol>
          </div>

          <div className="mb-7">
            <h2 className="text-[10px] uppercase mb-3" style={{ color:'#ecd7a2', letterSpacing:'0.25em' }}>
              The panels
            </h2>
            <div className="space-y-2 text-sm" style={{ color:'#d2bb85', lineHeight:1.55 }}>
              <div><span style={{ color:'#fde68a', fontFamily:"'Fraunces', serif" }}>Piano</span>{' '}
                · Gold = right hand · Indigo = bass ·{' '}
                <span style={{ color:'#fde68a' }}>← →</span> arrows shift octaves</div>
              <div><span style={{ color:'#fde68a', fontFamily:"'Fraunces', serif" }}>Transport</span>{' '}
                · Play · Stop · Random tour · Tempo · Metronome · Demo</div>
              <div><span style={{ color:'#c084fc', fontFamily:"'Fraunces', serif" }}>Progression</span>{' '}
                · Build a 4-chord loop · or Musical random for an instant progression</div>
              <div><span style={{ color:'#a5b4fc', fontFamily:"'Fraunces', serif" }}>Bass Note</span>{' '}
                · All 12 basses · dot color = chord category</div>
              <div><span style={{ color:'#fde68a', fontFamily:"'Fraunces', serif" }}>Key</span>{' '}
                · Mini piano · transposes the right hand · bass stays absolute</div>
              <div><span style={{ color:'#fde68a', fontFamily:"'Fraunces', serif" }}>Voicing</span>{' '}
                · The 11 shapes from the notebook</div>
            </div>
          </div>

          <div className="mb-7">
            <h2 className="text-[10px] uppercase mb-3" style={{ color:'#ecd7a2', letterSpacing:'0.25em' }}>
              Three practice routines
            </h2>
            <div className="mb-4">
              <div className="text-xs uppercase mb-1.5" style={{ color:'#22c55e', letterSpacing:'0.18em' }}>
                Beginner · 10 min
              </div>
              <p className="text-sm" style={{ color:'#d2bb85', lineHeight:1.6 }}>
                Voicing = <span style={{ color:'#fde68a' }}>Open Quartal</span>, key = C. Cycle all 12 basses slowly.
                Say each chord name aloud. Feel how the same three notes keep changing identity.
              </p>
            </div>
            <div className="mb-4">
              <div className="text-xs uppercase mb-1.5" style={{ color:'#f59e0b', letterSpacing:'0.18em' }}>
                Intermediate · 15 min
              </div>
              <p className="text-sm" style={{ color:'#d2bb85', lineHeight:1.6 }}>
                Build <span style={{ color:'#fde68a' }}>I–vi–IV–V</span> in C (C, A, F, G).
                Swap voicings without stopping: <span style={{ color:'#fde68a' }}>Maj7 Shell</span> →
                Cmaj7, Am9, Fmaj9, G13. Then <span style={{ color:'#fde68a' }}>Minor Triad</span> →
                Cm, Am, Dm, Gm. Same roots. Three songs.
              </p>
            </div>
            <div>
              <div className="text-xs uppercase mb-1.5" style={{ color:'#a855f7', letterSpacing:'0.18em' }}>
                Advanced · 20 min
              </div>
              <p className="text-sm" style={{ color:'#d2bb85', lineHeight:1.6 }}>
                <span style={{ color:'#fde68a' }}>Dom7 Shell</span> at 80 BPM. Random tour.
                When a <span style={{ color:'#c084fc' }}>purple</span> chord hits, sing the top extension.
                Shift up a fourth with the Key piano. Re-read the new chord names. Theory, ear, reading — one tool.
              </p>
            </div>
          </div>

          <div className="pt-5" style={{ borderTop:'1px solid rgba(245,184,65,0.15)' }}>
            <h2 className="text-[10px] uppercase mb-3" style={{ color:'#ecd7a2', letterSpacing:'0.25em' }}>
              Tips
            </h2>
            <ul className="space-y-1.5 text-sm" style={{ color:'#d2bb85', lineHeight:1.55 }}>
              <li>· Metronome and Play are clock-synced — your chord always lands on the beat.</li>
              <li>· The red <span style={{ color:'#fecaca' }}>Stop</span> button kills Loop, Tour, and Demo all at once.</li>
              <li>· Use the <span style={{ color:'#fde68a' }}>← →</span> arrows beside the piano to shift into your singing range.</li>
              <li>· Watch the 35-second demo once — you won't need to read this again.</li>
            </ul>
          </div>

          <div className="mt-7 pt-4 text-center" style={{ borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={onClose}
              className="px-6 py-2 rounded-full text-xs transition-all hover:-translate-y-[1px]"
              style={{
                background:'linear-gradient(180deg, rgba(245,184,65,0.25), rgba(245,184,65,0.09))',
                border:'1px solid rgba(245,184,65,0.5)',
                color:'#fde68a',
                letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:500,
              }}>
              Start playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
