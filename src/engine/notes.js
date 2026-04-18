import { TONE_NAMES } from '../constants';

export function parseNote(s) {
  const m = s.match(/^([A-G])(#|b)?(-?\d+)$/);
  if (!m) return null;
  let name = m[1] + (m[2] || '');
  const flatMap = { 'Cb':'B','Db':'C#','Eb':'D#','Fb':'E','Gb':'F#','Ab':'G#','Bb':'A#' };
  if (name in flatMap) name = flatMap[name];
  return { pc: TONE_NAMES.indexOf(name), oct: parseInt(m[3]) };
}

export function noteToMidi(s) {
  const p = parseNote(s);
  return p ? (p.oct + 1) * 12 + p.pc : 60;
}

export function midiToNote(midi) {
  return TONE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
}

export function transposeNote(s, st) {
  return midiToNote(noteToMidi(s) + st);
}

export function normaliseOctave(noteStrs) {
  const midis = noteStrs.map(noteToMidi);
  const lo = Math.min(...midis), hi = Math.max(...midis);
  let shift = 0;
  while (hi + shift > 79) shift -= 12;
  while (lo + shift < 55) shift += 12;
  return noteStrs.map(s => transposeNote(s, shift));
}
