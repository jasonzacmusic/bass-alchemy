import { useBassAlchemy } from '../hooks/useBassAlchemy';
import { DISPLAY } from '../constants';
import Header from './Header';
import ChordDisplay from './ChordDisplay';
import TransportBar from './TransportBar';
import ProgressionPanel from './ProgressionPanel';
import BassGrid from './BassGrid';
import KeyMiniPiano from './KeyMiniPiano';
import VoicingSelector from './VoicingSelector';
import StudentGuide from './StudentGuide';

function SectionHeading({ children, subtitle, subtitleColor = '#bea066' }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.3em] mb-3 flex items-center gap-2"
      style={{ color:'#ecd7a2' }}>
      <span className="inline-block w-6 h-px" style={{ background:'rgba(236,215,162,0.4)' }} />
      {children}
      {subtitle && (
        <span className="normal-case tracking-normal ml-1" style={{ color: subtitleColor }}>
          {subtitle}
        </span>
      )}
    </h2>
  );
}

export default function BassAlchemy() {
  const s = useBassAlchemy();

  return (
    <div
      className="ba-root min-h-screen relative overflow-hidden"
      style={{
        background:'radial-gradient(ellipse at top, #1c1814 0%, #0c0a08 45%, #050403 100%)',
        fontFamily:"'Inter', ui-sans-serif, system-ui, sans-serif",
        color:'#fcf4dc',
      }}
    >
      {/* Grain overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage:"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }}
      />
      {/* Gold glow */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.08]"
        style={{ background:'radial-gradient(circle, #f5b841 0%, transparent 60%)' }}
      />

      <Header
        muted={s.muted}
        onMuteToggle={() => s.setMuted(m => !m)}
        onGuideOpen={() => s.setShowGuide(true)}
      />

      <main className="relative max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">

        <ChordDisplay
          voicingName={s.voicing.name}
          keyPc={s.keyPc}
          selected={s.selected}
          pulseKey={s.pulseKey}
        />

        {/* Piano + Transport */}
        <section className="mb-10 md:mb-12">
          <TransportBar
            rhNotes={s.rhNotes}
            bassNote={s.bassNote}
            octaveStart={2 + s.octaveShift}
            octaveShift={s.octaveShift}
            pianoLoaded={s.pianoLoaded}
            loopOn={s.loopOn}
            autoOn={s.autoOn}
            inDemo={s.inDemo}
            onOctaveDown={() => s.setOctaveShift(v => Math.max(-1, v - 1))}
            onOctaveUp={() => s.setOctaveShift(v => Math.min(2, v + 1))}
            onPlay={s.play}
            onStop={s.stopAll}
            onToggleAuto={s.toggleAuto}
            onRunDemo={s.runDemo}
            pattern={s.pattern}
            onPatternChange={s.setPattern}
            bpm={s.bpm}
            onBpmChange={s.setBpm}
            metronomeOn={s.metronomeOn}
            onMetronomeToggle={() => s.setMetronomeOn(m => !m)}
          />
        </section>

        {/* Progression */}
        <section className="mb-9">
          <SectionHeading subtitle="— build a 4-chord loop · right hand stays fixed · bass cycles">
            Progression
          </SectionHeading>
          <ProgressionPanel
            sequence={s.sequence}
            editSlot={s.editSlot}
            loopOn={s.loopOn}
            loopSlot={s.loopSlot}
            allChords={s.allChords}
            pianoLoaded={s.pianoLoaded}
            inDemo={s.inDemo}
            onSlotClick={s.handleSlotClick}
            onMusicalRandom={s.fillMusicalRandom}
            onClear={s.clearSequence}
            onToggleLoop={s.toggleLoop}
          />
        </section>

        {/* Bass Note */}
        <section className="mb-10">
          <SectionHeading
            subtitle={
              (s.loopOn || s.autoOn)
                ? '— watch the active bass move in tempo'
                : '— colour = resulting chord category'
            }>
            Bass Note
          </SectionHeading>
          <BassGrid
            allChords={s.allChords}
            bassPc={s.bassPc}
            loopOn={s.loopOn}
            autoOn={s.autoOn}
            onBassClick={s.handleBassClick}
          />
        </section>

        {/* Key of the Right Hand */}
        <section className="mb-9">
          <SectionHeading subtitle="— transposes the voicing only">
            Key of the Right Hand
          </SectionHeading>
          <div className="rounded-xl p-5 md:p-6"
            style={{
              background:'linear-gradient(180deg, rgba(48,35,18,0.55), rgba(32,22,12,0.4))',
              border:'1px solid rgba(245,184,65,0.22)',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
            <KeyMiniPiano keyPc={s.keyPc} onSelect={s.setKeyPc} />
            <div className="mt-3 text-center text-[11px]"
              style={{ color:'#d2bb85', letterSpacing:'0.1em' }}>
              Current key ·{' '}
              <span style={{
                color:'#fde68a', fontFamily:"'Fraunces', serif",
                fontSize:'0.95rem', letterSpacing:'normal',
              }}>
                {DISPLAY[s.keyPc]}
              </span>
            </div>
          </div>
        </section>

        {/* Voicing */}
        <section className="mb-9">
          <SectionHeading>Right-Hand Voicing</SectionHeading>
          <VoicingSelector voicingId={s.voicingId} onSelect={s.setVoicingId} />
        </section>

        {/* Description */}
        <section className="max-w-2xl mx-auto">
          <div className="rounded-2xl px-6 py-5 text-center"
            style={{
              background:'linear-gradient(180deg, rgba(32,24,16,0.5), rgba(18,13,8,0.35))',
              border:'1px solid rgba(255,255,255,0.09)',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
            <p className="text-base mb-3"
              style={{
                fontFamily:"'Fraunces', serif", fontStyle:'italic', fontWeight:400,
                letterSpacing:'-0.005em', color:'#f8eab6',
                textShadow:'0 1px 3px rgba(0,0,0,0.6)',
              }}>
              {s.voicing.description}
            </p>
            <p className="text-xs" style={{ color:'#d2bb85', letterSpacing:'0.08em' }}>
              Build a <span style={{ color:'#e9d5ff' }}>4-chord loop</span> above ·
              hit <span style={{ color:'#fde68a' }}>Play</span> for a single voicing ·
              <span style={{ color:'#a5b4fc' }}> Random tour</span> for twelve basses in tempo ·
              <span style={{ color:'#fde68a' }}> Musical random</span> one-taps a progression
            </p>
          </div>
        </section>
      </main>

      <footer className="relative mt-8 border-t border-white/[0.10] py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-center text-[10px]"
          style={{ color:'#bea066' }}>
          <div style={{ letterSpacing:'0.15em' }}>NATHANIEL SCHOOL OF MUSIC · TEACHING TOOL</div>
        </div>
      </footer>

      {/* Demo caption overlay */}
      {s.demoCaption && (
        <div
          key={s.demoCaption}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-lg px-6 py-3 rounded-full"
          style={{
            background:'rgba(5,4,3,0.9)',
            border:'1px solid rgba(245,184,65,0.4)',
            boxShadow:'0 20px 60px -20px rgba(0,0,0,0.8)',
            animation:'fadeInUp 400ms cubic-bezier(.2,.8,.2,1)',
            backdropFilter:'blur(10px)',
          }}>
          <span style={{
            fontFamily:"'Fraunces', serif", fontSize:'0.95rem',
            fontStyle:'italic', color:'#fde68a',
          }}>{s.demoCaption}</span>
        </div>
      )}

      {s.showGuide && <StudentGuide onClose={() => s.setShowGuide(false)} />}
    </div>
  );
}
