import { parseNote } from '../engine/notes';

const TONE_NAMES_LOCAL = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

const WHITE = ['C','D','E','F','G','A','B'];
const BLACK = [
  { note:'C#', afterWhite:'C' }, { note:'D#', afterWhite:'D' },
  { note:'F#', afterWhite:'F' }, { note:'G#', afterWhite:'G' },
  { note:'A#', afterWhite:'A' },
];
const KEY_W = 28, KEY_H = 138, BLACK_W = 18, BLACK_H = 86;

export default function Piano({ rhNotes, bassNote, octaveStart = 2 }) {
  const OCTAVES = [octaveStart, octaveStart+1, octaveStart+2, octaveStart+3];

  const whites = [];
  OCTAVES.forEach(o => WHITE.forEach(n => whites.push({ note: n, octave: o })));

  const rhParsed   = rhNotes.map(parseNote).filter(Boolean);
  const bassParsed = parseNote(bassNote);

  const isRH   = (note, oct) => rhParsed.some(p => p.pc === TONE_NAMES_LOCAL.indexOf(note) && p.oct === oct);
  const isBass = (note, oct) => bassParsed && TONE_NAMES_LOCAL.indexOf(note) === bassParsed.pc && oct === bassParsed.oct;
  const totalW = whites.length * KEY_W;

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <svg viewBox={`0 0 ${totalW} ${KEY_H+4}`} className="w-full block" preserveAspectRatio="xMidYMid meet">
        {whites.map((k, i) => {
          const rh   = isRH(k.note, k.octave);
          const bass = isBass(k.note, k.octave);
          const fill = rh ? '#f5b841' : bass ? '#6366f1' : '#f8f5ef';
          return (
            <g key={`w-${i}`}>
              <rect x={i*KEY_W+1} y={0} width={KEY_W-2} height={KEY_H}
                fill={fill} stroke="#2a2a2a" strokeWidth={0.75} rx={3}
                style={{ transition:'fill 400ms cubic-bezier(.2,.8,.2,1)' }} />
              {(rh || bass) && (
                <rect x={i*KEY_W+1} y={0} width={KEY_W-2} height={KEY_H}
                  fill="none" stroke={rh ? '#fde68a' : '#a5b4fc'} strokeWidth={1.5} rx={3} opacity={0.9} />
              )}
            </g>
          );
        })}
        {OCTAVES.map((oct, oi) => {
          const start = oi * 7 * KEY_W;
          return BLACK.map(({ note, afterWhite }) => {
            const wi   = WHITE.indexOf(afterWhite);
            const x    = start + (wi+1)*KEY_W - BLACK_W/2;
            const rh   = isRH(note, oct);
            const bass = isBass(note, oct);
            const fill = rh ? '#f5b841' : bass ? '#6366f1' : '#121212';
            return (
              <rect key={`b-${oct}-${note}`} x={x} y={0} width={BLACK_W} height={BLACK_H}
                fill={fill} stroke={rh || bass ? '#ffffff' : '#000000'}
                strokeWidth={rh || bass ? 1.5 : 0.75} rx={2}
                style={{ transition:'fill 400ms cubic-bezier(.2,.8,.2,1)' }} />
            );
          });
        })}
      </svg>
    </div>
  );
}
