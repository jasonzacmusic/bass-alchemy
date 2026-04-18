import { DISPLAY } from '../constants';

// Standard guitar open string MIDI numbers: E2 A2 D3 G3 B3 E4
const OPEN_MIDI = [40, 45, 50, 55, 59, 64];
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// E-shape barre at fret F (root on low-E string)
function eShape(F, q) {
  switch (q) {
    case 'm':    return [F,   F+2, F+2, F,   F,   F  ];
    case '7':    return [F,   F+2, F,   F+1, F,   F  ];
    case 'maj7': return [F,   F+2, F+1, F+1, F,   F  ];
    case 'm7':   return [F,   F+2, F,   F,   F,   F  ];
    case 'sus4': return [F,   F+2, F+2, F+2, F,   F  ];
    case 'sus2': return [F,   F+2, F+4, F+4, F,   F  ];
    case '+':    return [F,   F+3, F+2, F+1, F+1, F  ];
    case '5':    return [F,   F+2, F+2, -1,  -1,  -1 ];
    default:     return [F,   F+2, F+2, F+1, F,   F  ]; // major
  }
}

// A-shape barre at fret F (root on A string)
function aShape(F, q) {
  switch (q) {
    case 'm':    return [-1, F,   F+2, F+2, F+1, F  ];
    case '7':    return [-1, F,   F+2, F,   F+2, F  ];
    case 'maj7': return [-1, F,   F+2, F+1, F+2, F  ];
    case 'm7':   return [-1, F,   F+2, F,   F+1, F  ];
    case 'sus4': return [-1, F,   F+2, F+2, F+3, F  ];
    case 'sus2': return [-1, F,   F+2, F+2, F,   F  ];
    case '+':    return [-1, F,   F+3, F+2, F+2, F  ];
    case '5':    return [-1, F,   F+2, -1,  -1,  -1 ];
    default:     return [-1, F,   F+2, F+2, F+2, F  ]; // major
  }
}

function dimShape(rootPc) {
  const F = (rootPc - 9 + 12) % 12;
  return [-1, F, F+1, F+2, F+1, -1];
}

export function getGuitarFrets(rootPc, quality) {
  let q = quality;
  if (q === '°' || q === '°7' || q === 'ø7') return dimShape(rootPc);
  if (q === 'maj7sus4' || q === '7sus4') q = 'sus4';
  if (q === 'add9') q = '';

  // E-shape for E(4) F(5) F#(6) G(7) Ab(8) — frets 0–4
  if ([4, 5, 6, 7, 8].includes(rootPc)) {
    return eShape((rootPc - 4 + 12) % 12, q);
  }
  // A-shape for all others — frets 0–6
  return aShape((rootPc - 9 + 12) % 12, q);
}

export function chordNameToFrets(name) {
  if (!name) return null;
  const base = name.split('/')[0];
  // Sort by root length desc to avoid "D" matching "D♭"
  const sorted = DISPLAY.map((r, pc) => ({ pc, r })).sort((a, b) => b.r.length - a.r.length);
  for (const { pc, r } of sorted) {
    if (base.startsWith(r)) {
      return getGuitarFrets(pc, base.slice(r.length));
    }
  }
  return null;
}

export function fretsToNotes(frets) {
  return frets.map((f, i) => {
    if (f < 0) return null;
    const midi = OPEN_MIDI[i] + f;
    const pc   = midi % 12;
    const oct  = Math.floor(midi / 12) - 1;
    return `${NOTE_NAMES[pc]}${oct}`;
  }).filter(Boolean);
}
