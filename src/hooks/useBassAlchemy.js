import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as Tone from 'tone';
import { VOICINGS, TONE_NAMES, DISPLAY, DEMO_STEPS, CATEGORY_META } from '../constants';
import { parseNote, transposeNote, normaliseOctave } from '../engine/notes';
import { analyseChord, categoriseChord } from '../engine/chords';
import { pickNextBass, generateMusicalSequence } from '../engine/sequences';
import { createPianoSynth, createBassSynth, createMetroSynth, createSampler, createGuitarSynths, createGuitarBassSynth } from '../engine/audio';
import { chordNameToFrets, fretsToNotes } from '../engine/guitarChords';

// ── Parse URL params once at module load ─────────────────────────────────
function _parseUrl() {
  try {
    const p    = new URLSearchParams(window.location.search);
    const vids = new Set(['major','minor','dim','aug','sus2','sus4','power',
                          'quartal','tritone','maj7shell','dom7shell']);
    const pids = new Set(['sustain','arp','pulse','comp','ballad']);
    const cl   = (n, a, b) => Math.max(a, Math.min(b, n));
    return {
      voicingId: vids.has(p.get('v')) ? p.get('v') : null,
      keyPc:     p.has('k')   ? cl(+p.get('k')  || 0,  0, 11)  : null,
      bassPc:    p.has('b')   ? cl(+p.get('b')  || 0,  0, 11)  : null,
      pattern:   pids.has(p.get('p')) ? p.get('p') : null,
      bpm:       p.has('bpm') ? cl(+p.get('bpm')|| 90, 40, 200) : null,
      sequence:  p.has('s')
        ? p.get('s').split(',').slice(0, 4)
            .map(x => x === '_' ? null : cl(+x || 0, 0, 11))
            .concat([null, null, null, null]).slice(0, 4)
        : null,
    };
  } catch { return {}; }
}
const _URL = _parseUrl();

export function useBassAlchemy() {
  const [keyPc, setKeyPc]             = useState(_URL.keyPc    ?? 0);
  const [voicingId, setVoicingId]     = useState(_URL.voicingId ?? 'quartal');
  const [bassPc, setBassPc]           = useState(_URL.bassPc   ?? 0);
  const [pattern, setPattern]         = useState(_URL.pattern  ?? 'sustain');
  const [autoOn, setAutoOn]           = useState(false);
  const [bpm, setBpm]                 = useState(_URL.bpm      ?? 90);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [muted, setMuted]             = useState(false);
  const [inDemo, setInDemo]           = useState(false);
  const [demoCaption, setDemoCaption] = useState('');
  const [showGuide, setShowGuide]     = useState(false);

  const [sequence, setSequence] = useState(_URL.sequence ?? [null, null, null, null]);
  const [editSlot, setEditSlot] = useState(null);
  const [loopOn, setLoopOn]     = useState(false);
  const [loopSlot, setLoopSlot] = useState(0);

  const [pianoLoaded, setPianoLoaded]   = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [pulseKey, setPulseKey]         = useState(0);
  const [octaveShift, setOctaveShift]   = useState(0);
  const [instrument, setInstrument]     = useState('piano');

  const pianoRef        = useRef(null);
  const bassRef         = useRef(null);
  const metroRef        = useRef(null);
  const guitarRef       = useRef(null);
  const guitarBassRef   = useRef(null);
  const recentRef       = useRef([]);
  const lastTimeRef     = useRef(0);
  const metroEventRef   = useRef(null);
  const tourEventRef    = useRef(null);
  const loopEventRef    = useRef(null);
  const demoRunningRef  = useRef(false);
  const sequenceRef     = useRef(sequence);
  const bpmRef          = useRef(90);
  const patternRef      = useRef('sustain');
  const rhNotesRef      = useRef([]);
  const bassPcRef       = useRef(0);
  const modeRef         = useRef('idle');
  const octaveShiftRef  = useRef(0);
  const audioEnabledRef = useRef(false);
  const instrumentRef   = useRef('piano');

  const voicing = VOICINGS.find(v => v.id === voicingId);

  const rhNotes = useMemo(() => {
    const base = normaliseOctave(voicing.refNotes.map(n => transposeNote(n, keyPc)));
    if (octaveShift === 0) return base;
    return base.map(n => {
      const p = parseNote(n);
      return p ? `${TONE_NAMES[p.pc]}${p.oct + octaveShift}` : n;
    });
  }, [voicing, keyPc, octaveShift]);

  const rhPcs = useMemo(() => rhNotes.map(n => parseNote(n).pc), [rhNotes]);

  const allChords = useMemo(
    () => Array.from({ length: 12 }, (_, pc) => {
      const info = analyseChord(pc, rhPcs);
      return { pc, label: DISPLAY[pc], ...info, category: categoriseChord(info) };
    }),
    [rhPcs]
  );
  const chordsRef = useRef(allChords);
  chordsRef.current = allChords;

  const selected      = allChords[bassPc];
  const bassNote      = useMemo(() => `${TONE_NAMES[bassPc]}${2 + octaveShift}`, [bassPc, octaveShift]);
  const categoryMeta  = CATEGORY_META[selected.category];
  const guitarFrets   = useMemo(() => chordNameToFrets(selected.name), [selected.name]);

  // ── Keep refs in sync so Transport callbacks see latest values ──
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { patternRef.current = pattern; }, [pattern]);
  useEffect(() => { rhNotesRef.current = rhNotes; }, [rhNotes]);
  useEffect(() => { bassPcRef.current = bassPc; }, [bassPc]);
  useEffect(() => { sequenceRef.current = sequence; }, [sequence]);
  useEffect(() => { octaveShiftRef.current = octaveShift; }, [octaveShift]);
  useEffect(() => {
    modeRef.current = loopOn ? 'loop' : autoOn ? 'tour' : 'idle';
  }, [loopOn, autoOn]);
  // audioEnabled via ref so the main-playback effect does NOT fire when audio
  // is first enabled (that would cause a double-play on the first Play click).
  useEffect(() => { audioEnabledRef.current = audioEnabled; }, [audioEnabled]);
  useEffect(() => { instrumentRef.current = instrument; }, [instrument]);

  // ── Sync shareable state to URL (replaceState — no history spam) ──────────
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      params.set('v', voicingId);
      params.set('k', keyPc);
      params.set('b', bassPc);
      params.set('p', pattern);
      if (bpm !== 90) params.set('bpm', bpm);
      const seqStr = sequence.map(s => s === null ? '_' : s).join(',');
      if (seqStr !== '_,_,_,_') params.set('s', seqStr);
      window.history.replaceState(null, '', `?${params}`);
    } catch (e) {}
  }, [voicingId, keyPc, bassPc, pattern, bpm, sequence]);

  // ── Share ─────────────────────────────────────────────────────────────────
  const [shareCopied, setShareCopied] = useState(false);
  const share = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Bass Alchemy', text: 'Try this chord voicing', url });
        return;
      }
    } catch (e) {}
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2200);
    } catch (e) {}
  }, []);

  // ── Fonts ──
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch (e) {} };
  }, []);

  // ── Audio engine ──
  useEffect(() => {
    let disposed = false;

    const synthPiano = createPianoSynth();
    pianoRef.current = synthPiano;
    setPianoLoaded(true);

    const bass = createBassSynth();
    bassRef.current = bass;

    const metro = createMetroSynth();
    metroRef.current = metro;

    let samplerPiano = null;
    try {
      samplerPiano = createSampler(pianoRef, synthPiano, () => disposed);
    } catch (e) { /* synth stays as primary */ }

    let gSynths = null, gBass = null;
    try {
      gSynths = createGuitarSynths();
      guitarRef.current = gSynths;
      gBass = createGuitarBassSynth();
      guitarBassRef.current = gBass;
    } catch (e) {}

    return () => {
      disposed = true;
      try { Tone.Transport.stop(); Tone.Transport.cancel(); } catch (e) {}
      try { synthPiano.dispose(); } catch (e) {}
      try { bass.dispose(); } catch (e) {}
      try { metro.dispose(); } catch (e) {}
      try { if (samplerPiano) samplerPiano.dispose(); } catch (e) {}
      try { if (gSynths) gSynths.forEach(s => s.dispose()); } catch (e) {}
      try { if (gBass) gBass.dispose(); } catch (e) {}
    };
  }, []);

  // ── Mute / unmute ──
  useEffect(() => {
    Tone.getDestination().mute = muted;
  }, [muted]);

  // ── BPM → Transport ──
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  // ── Pattern playback ──
  // time — if provided, schedules at that exact Transport time (loop/tour).
  //        If null, computes a monotonic near-future time for manual triggers.
  const playChord = useCallback((bassN, rh, pat, currentBpm, time = null) => {
    let t0;
    if (time !== null && time !== undefined) {
      t0 = time;
    } else {
      const now = Tone.now();
      const last = lastTimeRef.current;
      const safeLast = last - now > 1.0 ? 0 : last;
      t0 = Math.max(now + 0.04, safeLast + 0.03);
    }

    const bd = 60 / currentBpm;
    const md = bd * 4;

    if (instrumentRef.current === 'guitar') {
      const gSynths = guitarRef.current;
      const gbSynth = guitarBassRef.current;
      if (!gSynths || !gbSynth) return;
      try {
        const chordName = chordsRef.current[bassPcRef.current]?.name;
        const frets = chordNameToFrets(chordName);
        const gNotes = frets ? fretsToNotes(frets) : rh;
        const strum = 0.022;
        gbSynth.triggerAttack(bassN, t0, 0.85);
        switch (pat) {
          case 'arp':
            gNotes.forEach((n, i) => {
              gSynths[i % gSynths.length].triggerAttack(n, t0 + i * (bd / Math.max(gNotes.length, 1)), 0.72);
            });
            break;
          case 'pulse':
            for (let beat = 0; beat < 4; beat++) {
              gNotes.forEach((n, i) => {
                gSynths[i % gSynths.length].triggerAttack(n, t0 + beat * bd + i * strum, 0.7);
              });
            }
            break;
          default:
            gNotes.forEach((n, i) => {
              gSynths[i % gSynths.length].triggerAttack(n, t0 + i * strum, 0.72);
            });
        }
        lastTimeRef.current = t0 + md;
      } catch (e) {
        lastTimeRef.current = 0;
      }
      setPulseKey(k => k + 1);
      return;
    }

    const p = pianoRef.current;
    const b = bassRef.current;
    if (!p || !b) return;

    try {
      p.releaseAll();
    } catch (e) {}

    try {
      switch (pat) {
        case 'sustain':
          b.triggerAttackRelease(bassN, md, t0, 0.9);
          p.triggerAttackRelease(rh, md, t0, 0.72);
          break;
        case 'arp':
          b.triggerAttackRelease(bassN, md, t0, 0.9);
          rh.forEach((n, i) => p.triggerAttackRelease(n, bd * 0.9, t0 + i * bd, 0.74));
          break;
        case 'pulse':
          b.triggerAttackRelease(bassN, md, t0, 0.92);
          for (let i = 0; i < 4; i++) {
            p.triggerAttackRelease(rh, bd * 0.85, t0 + i * bd, 0.72);
          }
          break;
        case 'comp':
          b.triggerAttackRelease(bassN, md, t0, 0.9);
          [0, 1.5, 2, 3.5].forEach(h => {
            p.triggerAttackRelease(rh, bd * 0.55, t0 + h * bd, 0.76);
          });
          break;
        case 'ballad':
          b.triggerAttackRelease(bassN, md, t0, 0.88);
          rh.forEach((n, i) => {
            p.triggerAttackRelease(n, bd * 3, t0 + bd + i * 0.06, 0.66);
          });
          break;
        default: break;
      }
      lastTimeRef.current = t0 + md;
    } catch (e) {
      console.warn('playChord: trigger failed, resetting scheduler', e);
      lastTimeRef.current = 0;
    }
    setPulseKey(k => k + 1);
  }, []);

  // Re-play whenever audible state changes — ONLY in idle mode.
  // Loop/Tour schedule their own playback via Transport; this effect must not
  // double-fire when bassPc/rhNotes change during auto modes.
  useEffect(() => {
    if (!audioEnabledRef.current || !pianoLoaded) return;
    if (modeRef.current !== 'idle') return;
    playChord(bassNote, rhNotes, pattern, bpm);
  }, [bassNote, rhNotes, pattern, bpm, pianoLoaded, playChord]);

  // Idempotent audio-unlock + Transport-start. Safe to call repeatedly.
  const ensureAudioRunning = useCallback(async () => {
    if (Tone.context.state !== 'running') {
      try { await Tone.start(); } catch (e) {}
    }
    if (!audioEnabledRef.current) {
      setAudioEnabled(true);
      audioEnabledRef.current = true;
    }
    if (Tone.Transport.state !== 'started') {
      try { Tone.Transport.start(); } catch (e) {}
    }
  }, []);

  const play = useCallback(async () => {
    if (!pianoLoaded) return;
    // No-op during auto modes — they schedule their own playback via Transport.
    // Firing here would call releaseAll() and cut the current note.
    if (loopOn || autoOn || inDemo) return;
    await ensureAudioRunning();
    const bassN = bassNote, rh = rhNotes, pat = pattern, tempo = bpm;

    if (metronomeOn) {
      try {
        const bd = 60 / tempo;
        const curSec = Tone.Transport.seconds;
        const nextBeatSec = Math.ceil((curSec + 0.01) / bd) * bd;
        const lookahead = Math.max(0.03, nextBeatSec - curSec);
        playChord(bassN, rh, pat, tempo, Tone.now() + lookahead);
      } catch (e) {
        playChord(bassN, rh, pat, tempo);
      }
    } else {
      playChord(bassN, rh, pat, tempo);
    }
  }, [pianoLoaded, bassNote, rhNotes, pattern, bpm, playChord,
      metronomeOn, loopOn, autoOn, inDemo, ensureAudioRunning]);

  // Universal Stop — cancels every auto mode, kills in-flight notes.
  // Does NOT stop the metronome or Transport itself.
  const stopAll = useCallback(() => {
    setLoopOn(false);
    setAutoOn(false);
    demoRunningRef.current = false;
    setInDemo(false);
    setDemoCaption('');
    setEditSlot(null);
    try {
      const p = pianoRef.current;
      if (p) p.releaseAll();
    } catch (e) {}
    try {
      const b = bassRef.current;
      if (b) b.triggerRelease(Tone.now());
    } catch (e) {}
    lastTimeRef.current = 0;
  }, []);

  // ── Random Tour ──
  useEffect(() => {
    if (!autoOn) return;

    try {
      if (Tone.context.state !== 'running') Tone.start();
      if (Tone.Transport.state !== 'started') Tone.Transport.start();

      tourEventRef.current = Tone.Transport.scheduleRepeat((time) => {
        try {
          const chords = chordsRef.current;
          const recent = recentRef.current;
          const prev   = bassPcRef.current;
          const next   = pickNextBass(prev, chords, recent);
          recentRef.current = [...recent.slice(-4), next];
          bassPcRef.current = next;
          setBassPc(next);
          const bassN = `${TONE_NAMES[next]}${2 + octaveShiftRef.current}`;
          playChord(bassN, rhNotesRef.current, patternRef.current, bpmRef.current, time);
        } catch (e) {
          console.warn('tour tick error', e);
        }
      }, '1m', '@1m');
    } catch (e) {
      console.warn('tour start error', e);
      setAutoOn(false);
    }

    return () => {
      if (tourEventRef.current !== null) {
        try { Tone.Transport.clear(tourEventRef.current); } catch (e) {}
        tourEventRef.current = null;
      }
    };
  }, [autoOn, playChord]);

  const toggleAuto = useCallback(async () => {
    if (!pianoLoaded) return;
    if (!autoOn) {
      await ensureAudioRunning();
      recentRef.current = [];
      setLoopOn(false);
      setEditSlot(null);
    }
    setAutoOn(a => !a);
  }, [autoOn, pianoLoaded, ensureAudioRunning]);

  // ── Loop playback ──
  useEffect(() => {
    if (!loopOn) return;

    let cursor = 0;
    try {
      if (Tone.context.state !== 'running') Tone.start();
      if (Tone.Transport.state !== 'started') Tone.Transport.start();

      loopEventRef.current = Tone.Transport.scheduleRepeat((time) => {
        try {
          const seq   = sequenceRef.current;
          const valid = seq.map((pc, i) => ({ pc, i })).filter(x => x.pc !== null);
          if (valid.length === 0) return;
          const slot = valid[cursor % valid.length];
          cursor++;
          bassPcRef.current = slot.pc;
          setBassPc(slot.pc);
          setLoopSlot(slot.i);
          const bassN = `${TONE_NAMES[slot.pc]}${2 + octaveShiftRef.current}`;
          playChord(bassN, rhNotesRef.current, patternRef.current, bpmRef.current, time);
        } catch (e) {
          console.warn('loop tick error', e);
        }
      }, '1m', '@1m');
    } catch (e) {
      console.warn('loop start error', e);
      setLoopOn(false);
    }

    return () => {
      if (loopEventRef.current !== null) {
        try { Tone.Transport.clear(loopEventRef.current); } catch (e) {}
        loopEventRef.current = null;
      }
    };
  }, [loopOn, playChord]);

  // ── Sequencer handlers ──
  const handleSlotClick = useCallback((i) => {
    if (sequence[i] !== null) {
      setSequence(prev => {
        const next = [...prev];
        next[i] = null;
        return next;
      });
    }
    setEditSlot(i);
  }, [sequence]);

  const handleBassClick = useCallback((pc) => {
    if (editSlot !== null) {
      setSequence(prev => {
        const next = [...prev];
        next[editSlot] = pc;
        return next;
      });
      const projected = [...sequence];
      projected[editSlot] = pc;
      let nextEdit = null;
      for (let j = 1; j <= 4; j++) {
        const idx = (editSlot + j) % 4;
        if (projected[idx] === null) { nextEdit = idx; break; }
      }
      setEditSlot(nextEdit);
    }
    setBassPc(pc);
  }, [editSlot, sequence]);

  const clearSequence = useCallback(() => {
    setSequence([null, null, null, null]);
    setLoopOn(false);
    setEditSlot(null);
  }, []);

  const fillMusicalRandom = useCallback(async () => {
    if (!pianoLoaded) return;
    const fresh = generateMusicalSequence(chordsRef.current);
    setSequence(fresh);
    setEditSlot(null);
    await ensureAudioRunning();
    setAutoOn(false);
    setLoopOn(true);
  }, [pianoLoaded, ensureAudioRunning]);

  const toggleLoop = useCallback(async () => {
    if (!pianoLoaded) return;
    if (loopOn) { setLoopOn(false); return; }
    const filled = sequence.filter(pc => pc !== null).length;
    if (filled === 0) setSequence(generateMusicalSequence(chordsRef.current));
    await ensureAudioRunning();
    setAutoOn(false);
    setEditSlot(null);
    setLoopOn(true);
  }, [loopOn, pianoLoaded, sequence, ensureAudioRunning]);

  // ── Metronome ──
  useEffect(() => {
    if (metroEventRef.current !== null) {
      try { Tone.Transport.clear(metroEventRef.current); } catch (e) {}
      metroEventRef.current = null;
    }
    if (!metronomeOn) return;

    let beatCount = 0;
    metroEventRef.current = Tone.Transport.scheduleRepeat(time => {
      try {
        const m = metroRef.current;
        if (!m) return;
        const downbeat = beatCount % 4 === 0;
        m.triggerAttackRelease(downbeat ? 'C6' : 'A5', '32n', time, downbeat ? 0.9 : 0.55);
        beatCount++;
      } catch (e) {}
    }, '4n');
    try {
      if (Tone.context.state !== 'running') Tone.start();
      Tone.Transport.start();
    } catch (e) {}
    return () => {
      if (metroEventRef.current !== null) {
        try { Tone.Transport.clear(metroEventRef.current); } catch (e) {}
        metroEventRef.current = null;
      }
    };
  }, [metronomeOn]);

  // ── Demo Mode ──
  const runDemo = useCallback(async () => {
    if (inDemo) {
      demoRunningRef.current = false;
      setInDemo(false);
      setDemoCaption('');
      setAutoOn(false);
      return;
    }
    if (!pianoLoaded) return;
    await ensureAudioRunning();
    setInDemo(true);
    demoRunningRef.current = true;

    for (const step of DEMO_STEPS) {
      if (!demoRunningRef.current) break;
      if (step.voicingId)            setVoicingId(step.voicingId);
      if (step.keyPc !== undefined)  setKeyPc(step.keyPc);
      if (step.bassPc !== undefined) setBassPc(step.bassPc);
      if (step.pattern)              setPattern(step.pattern);
      if (step.autoOn !== undefined) setAutoOn(step.autoOn);
      setDemoCaption(step.caption);
      await new Promise(r => setTimeout(r, step.hold));
    }

    setAutoOn(false);
    setInDemo(false);
    setDemoCaption('');
    demoRunningRef.current = false;
  }, [inDemo, pianoLoaded]);

  return {
    // state
    keyPc, voicingId, bassPc, pattern, bpm, metronomeOn, muted,
    inDemo, demoCaption, showGuide, sequence, editSlot, loopOn, loopSlot,
    pianoLoaded, octaveShift, autoOn, pulseKey, instrument,
    // derived
    voicing, rhNotes, allChords, selected, bassNote, categoryMeta, guitarFrets,
    // setters
    setVoicingId, setKeyPc, setPattern, setBpm,
    setMuted, setShowGuide, setOctaveShift, setMetronomeOn, setInstrument,
    // actions
    play, stopAll, toggleAuto, toggleLoop,
    runDemo, handleSlotClick, handleBassClick,
    clearSequence, fillMusicalRandom,
    share, shareCopied,
  };
}
