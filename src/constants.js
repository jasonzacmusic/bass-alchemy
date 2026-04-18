export const TONE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const DISPLAY    = ['C','D♭','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];

export const VOICINGS = [
  { id: 'major',     name: 'Major Triad',      subtitle: '1 – 3 – 5',     refNotes: ['C4','E4','G4'],
    description: 'The chord every pianist learns first. Watch one bass note rewrite its meaning entirely.' },
  { id: 'minor',     name: 'Minor Triad',      subtitle: '1 – ♭3 – 5',    refNotes: ['C4','D#4','G4'],
    description: 'Minor colour recoloured by twelve different basses — from bright Lydian to half-diminished blues.' },
  { id: 'dim',       name: 'Diminished Triad', subtitle: '1 – ♭3 – ♭5',   refNotes: ['C4','D#4','F#4'],
    description: 'Two stacked minor thirds — an inherently unstable sound that begs for resolution.' },
  { id: 'aug',       name: 'Augmented Triad',  subtitle: '1 – 3 – ♯5',    refNotes: ['C4','E4','G#4'],
    description: 'Two stacked major thirds — symmetric, floating, the engine of whole-tone harmony.' },
  { id: 'sus2',      name: 'Suspended 2',      subtitle: '1 – 2 – 5',     refNotes: ['C4','D4','G4'],
    description: 'An open, airy voicing with no defined third — infinitely malleable.' },
  { id: 'sus4',      name: 'Suspended 4',      subtitle: '1 – 4 – 5',     refNotes: ['C4','F4','G4'],
    description: 'The archetypal unresolved sound — folk, rock, gospel all live here.' },
  { id: 'power',     name: 'Open Fifth',       subtitle: '1 – 5',          refNotes: ['C4','G4'],
    description: 'The neutral two-note power chord, waiting to be given a mood from below.' },
  { id: 'quartal',   name: 'Quartal',          subtitle: 'stacked 4ths',  refNotes: ['G4','C5','F5'],
    description: 'Stacked perfect fourths — the sound of McCoy Tyner, Herbie Hancock, and modern neo-soul.' },
  { id: 'tritone',   name: 'Tritone Cluster',  subtitle: '♯4 – 1 – 4',    refNotes: ['G#4','D5','G5'],
    description: 'A tritone stacked with a fourth — the engine of altered dominants and 7♯9 chords.' },
  { id: 'maj7shell', name: 'Maj7 Shell',       subtitle: '3 – 7',          refNotes: ['E4','B4'],
    description: 'A two-note jazz shell — just the 3rd and 7th of a major-7.' },
  { id: 'dom7shell', name: 'Dom7 Shell',       subtitle: '3 – ♭7',         refNotes: ['E4','A#4'],
    description: 'The classic dominant shell — the most common left-hand voicing in jazz piano.' },
];

export const PATTERNS = [
  { id: 'sustain', name: 'Sustain',           hint: 'chord held for a measure' },
  { id: 'arp',     name: 'Arpeggio (up)',     hint: 'one note per beat' },
  { id: 'pulse',   name: 'Pulse (quarters)',  hint: 'four stabs on the beat' },
  { id: 'comp',    name: 'Comp (syncopated)', hint: 'gospel-style 1 · &2 · 3 · &4' },
  { id: 'ballad',  name: 'Ballad (rolled)',   hint: 'bass first, chord rolls in on beat 2' },
];

export const DEMO_STEPS = [
  { voicingId:'quartal', keyPc:0, bassPc:0, pattern:'sustain', autoOn:false,
    caption:'Quartal voicing in C. Bass = C → Csus4.', hold:3400 },
  { bassPc:2,
    caption:'Move the bass to D. Same three notes → Dm11.', hold:3000 },
  { bassPc:5,
    caption:'Bass = F → Fmaj9. One voicing, a new colour.', hold:3000 },
  { voicingId:'major', bassPc:0,
    caption:'Switch to a Major Triad in C.', hold:2800 },
  { bassPc:4,
    caption:'Bass = E → first inversion, C/E.', hold:2800 },
  { bassPc:9,
    caption:'Bass = A → becomes Am7.', hold:2800 },
  { voicingId:'quartal', keyPc:7, bassPc:7, pattern:'comp',
    caption:'Transpose to G. Switch to a comping pattern.', hold:3500 },
  { autoOn:true,
    caption:'Random Tour walks twelve bass notes in tempo.', hold:10000 },
  { autoOn:false, pattern:'sustain',
    caption:'That\u2019s Bass Alchemy. Pick a voicing and explore.', hold:3500 },
];

export const CAT_WEIGHTS = { 1: 6, 2: 5, 3: 3, 4: 4, 5: 2, 6: 0 };

export const CATEGORY_META = {
  1: { color: '#22c55e', label: 'Triad',   short: 'triad'  },
  2: { color: '#06b6d4', label: 'Sus',     short: 'sus'    },
  3: { color: '#94a3b8', label: 'Power',   short: 'power'  },
  4: { color: '#f59e0b', label: '4-Note',  short: '4-note' },
  5: { color: '#a855f7', label: 'Jazz',    short: 'jazz'   },
  6: { color: '#ef4444', label: 'Rare',    short: 'rare'   },
};

