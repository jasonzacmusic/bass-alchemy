import * as Tone from 'tone';

export function createPianoSynth() {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.006, decay: 0.35, sustain: 0.18, release: 1.7 },
  }).toDestination();
  synth.volume.value = -7;
  return synth;
}

export function createBassSynth() {
  const bass = new Tone.MonoSynth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.006, decay: 0.4, sustain: 0.55, release: 1.3 },
    filter: { type: 'lowpass', Q: 2.2, rolloff: -24 },
    filterEnvelope: {
      attack: 0.004, decay: 0.28, sustain: 0.2, release: 0.9,
      baseFrequency: 180, octaves: 2.8, exponent: 2,
    },
  }).toDestination();
  bass.volume.value = -1;
  return bass;
}

export function createMetroSynth() {
  const metro = new Tone.MembraneSynth({
    pitchDecay: 0.008, octaves: 4,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.12 },
  }).toDestination();
  metro.volume.value = -14;
  return metro;
}

// pianoRef  — React ref whose .current will be swapped to the sampler on load
// synthPiano — the PolySynth to fade out after the sampler is ready
// isDisposed — callback that returns true if the effect has already cleaned up
export function createSampler(pianoRef, synthPiano, isDisposed) {
  const sampler = new Tone.Sampler({
    urls: {
      'A1':'A1.mp3','C2':'C2.mp3','D#2':'Ds2.mp3','F#2':'Fs2.mp3',
      'A2':'A2.mp3','C3':'C3.mp3','D#3':'Ds3.mp3','F#3':'Fs3.mp3',
      'A3':'A3.mp3','C4':'C4.mp3','D#4':'Ds4.mp3','F#4':'Fs4.mp3',
      'A4':'A4.mp3','C5':'C5.mp3','D#5':'Ds5.mp3','F#5':'Fs5.mp3',
      'A5':'A5.mp3','C6':'C6.mp3',
    },
    release: 1.5,
    baseUrl: '/samples/piano/',
    onload: () => {
      if (isDisposed()) return;
      sampler.toDestination();
      sampler.volume.value = -3;
      pianoRef.current = sampler;
      // Fade the synth out over 0.5s so currently-ringing notes decay naturally
      try { synthPiano.volume.rampTo(-60, 0.5); } catch (e) {}
    },
  });
  return sampler;
}
