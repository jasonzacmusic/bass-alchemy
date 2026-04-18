import { CAT_WEIGHTS } from '../constants';
import { categoriseChord } from './chords';

export function pickNextBass(currentPc, chords, recent) {
  const pool = [];
  chords.forEach((c, i) => {
    if (i === currentPc) return;
    if (recent.slice(-2).includes(i)) return;
    const cat = categoriseChord(c);
    const w = CAT_WEIGHTS[cat];
    for (let k = 0; k < w; k++) pool.push(i);
  });
  if (pool.length === 0) {
    for (let i = 0; i < 12; i++) {
      if (i !== currentPc && !recent.slice(-2).includes(i)) return i;
    }
    return (currentPc + 5) % 12;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function generateMusicalSequence(chords) {
  const slots = [];
  const used = new Set();
  while (slots.length < 4) {
    const pool = [];
    chords.forEach((c, i) => {
      if (used.has(i)) return;
      const w = CAT_WEIGHTS[c.category];
      for (let k = 0; k < w; k++) pool.push(i);
    });
    if (pool.length === 0) {
      const remaining = [...Array(12).keys()].filter(i => !used.has(i));
      if (remaining.length === 0) break;
      const pc = remaining[Math.floor(Math.random() * remaining.length)];
      slots.push(pc);
      used.add(pc);
    } else {
      const pc = pool[Math.floor(Math.random() * pool.length)];
      slots.push(pc);
      used.add(pc);
    }
  }
  return slots;
}
