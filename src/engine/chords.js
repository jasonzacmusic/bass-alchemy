import { DISPLAY } from '../constants';

// DO NOT CHANGE — logic verified against Jason's handwritten notebook
export function analyseChord(bassPc, rhPcs) {
  const I = new Set([0]);
  rhPcs.forEach(pc => I.add(((pc - bassPc) % 12 + 12) % 12));
  const h = n => I.has(n);
  const M3 = h(4), m3 = h(3);
  const P5 = h(7), b5 = h(6), S5 = h(8);
  const M7 = h(11), b7 = h(10);
  const M6 = h(9);
  const N9 = h(2);
  const P4 = h(5);
  const b9 = h(1);

  const root = DISPLAY[bassPc];
  const ts = [];
  const addT = t => { if (!ts.includes(t)) ts.push(t); };
  const done = (base, fam = 'safe') => ({
    name: root + base + (ts.length ? `(${ts.join(',')})` : ''),
    family: fam,
  });

  if (rhPcs.length === 3) {
    const uniq = [...new Set(rhPcs)];
    if (uniq.length === 3) {
      for (const r of uniq) {
        const ints = new Set(uniq.map(pc => ((pc - r) % 12 + 12) % 12));
        // Augmented excluded: symmetric chord — all three notes are equally valid
        // roots, so slash notation creates ambiguity. Main logic names it better.
        let q = null;
        if (ints.has(0) && ints.has(4) && ints.has(7)) q = '';
        else if (ints.has(0) && ints.has(3) && ints.has(7)) q = 'm';
        else if (ints.has(0) && ints.has(3) && ints.has(6)) q = '°';
        if (q !== null && r !== bassPc) {
          const bi = ((bassPc - r) % 12 + 12) % 12;
          // Only allow bass notes that are actually IN the chord:
          const validBass =
            (q === ''  && (bi === 4 || bi === 7)) ||  // major:  3rd (1st inv) or 5th (2nd inv)
            (q === 'm' && (bi === 3 || bi === 7)) ||  // minor:  b3 (1st inv) or 5th (2nd inv)
            (q === '°' && (bi === 3 || bi === 6));    // dim:    b3 (1st inv) or b5 (2nd inv)
          if (validBass) {
            return { name: `${DISPLAY[r]}${q}/${DISPLAY[bassPc]}`, family: 'safe' };
          }
        }
      }
    }
  }

  if (!M3 && !m3 && !N9 && !P4 && !M6 && !b7 && !M7 && !b9 && !b5 && !S5) {
    return P5 ? done('5') : { name: root, family: 'safe' };
  }
  if (m3 && b5 && !P5 && !M3) {
    if (M6 && !b7 && !M7) return done('°7');
    if (b7)  return done(N9 ? 'ø9' : 'ø7');
    if (M7)  return done('°(maj7)', 'spicy');
    return done('°');
  }
  if (M3 && S5 && !P5 && !m3) {
    let base;
    if (M7)      base = N9 ? 'maj9♯5' : 'maj7♯5';
    else if (b7) base = N9 ? '9♯5'    : '7♯5';
    else         base = '+';
    if (b9) addT('♭9');
    return done(base, 'spicy');
  }
  if (M3) {
    let base;
    if (M7) {
      if (M6) base = 'maj13';
      else if (N9) base = 'maj9';
      else base = 'maj7';
    } else if (b7) {
      if (M6) base = '13';
      else if (N9 && P4) base = '11';
      else if (N9) base = '9';
      else base = '7';
    } else {
      if (M6 && N9) base = '6/9';
      else if (M6) base = '6';
      else if (N9) base = 'add9';
      else if (P4) base = 'add4';
      else base = '';
    }
    if (!P5 && b5 && !S5) addT('♭5');
    if (!P5 && S5 && !b5) addT('♯5');
    if (P5 && b5) addT('♯11');
    if (P5 && S5) addT('♭13');
    if (b9) addT('♭9');
    if (m3) addT('♯9');
    let fam = 'safe';
    if (ts.length >= 2) fam = 'spicy';
    if (ts.some(t => ['♯5','♯11','♭13','♯9'].includes(t)) && fam === 'safe') fam = 'spicy';
    if (b9 && !b7) fam = 'avoid';
    return done(base, fam);
  }
  if (m3 && !M3) {
    let base;
    if (M7) {
      if (M6) base = 'm(maj13)';
      else if (N9) base = 'm(maj9)';
      else base = 'm(maj7)';
    } else if (b7) {
      if (M6) base = 'm13';
      else if (P4) base = 'm11';
      else if (N9) base = 'm9';
      else base = 'm7';
    } else {
      if (M6 && N9) base = 'm6/9';
      else if (M6) base = 'm6';
      else if (N9) base = 'm(add9)';
      else if (P4) base = 'm(add4)';
      else base = 'm';
    }
    if (!P5 && b5 && !b7) addT('♭5');
    if (!P5 && S5) addT('♯5');
    if (P5 && b5)  addT('♯11');
    if (P5 && S5)  addT('♭13');
    if (b9) addT('♭9');
    let fam = 'safe';
    if (ts.length >= 2) fam = 'spicy';
    if (ts.some(t => ['♯5','♭13','♭9'].includes(t)) && fam === 'safe') fam = 'spicy';
    if (b9 && !b7) fam = 'avoid';
    return done(base, fam);
  }
  if (!M3 && !m3 && (P4 || N9)) {
    let base;
    const sus = P4 ? 'sus4' : 'sus2';
    if (M7) base = 'maj7' + sus;
    else if (b7) {
      if (P4 && M6)      base = '13sus4';
      else if (P4 && N9) base = '11';
      else if (P4)       base = '7sus4';
      else if (N9)       base = '9sus';
      else               base = '7' + sus;
    } else {
      if (M6 && P4) base = '6sus4';
      else if (M6)  base = '6sus2';
      else if (N9 && P4) base = 'sus4(add9)';
      else base = sus;
    }
    if (!P5 && b5) addT('♭5');
    if (!P5 && S5) addT('♯5');
    if (P5 && b5)  addT('♯11');
    if (P5 && S5)  addT('♭13');
    if (b9) addT('♭9');
    let fam = ts.length ? 'spicy' : 'safe';
    if (b9 && !b7) fam = 'avoid';
    return done(base, fam);
  }
  if (P5) {
    if (M7) return done('maj7(no3)', 'spicy');
    if (b7) return done('7(no3)', 'spicy');
    if (M6) return done('6(no3)', 'spicy');
    return done('5');
  }
  return { name: root + '∗', family: 'avoid' };
}

// DO NOT CHANGE — six-bucket classification, colour-coded in CATEGORY_META
export function categoriseChord(info) {
  const { name, family } = info;
  if (family === 'avoid') return 6;

  const altsStr = (name.match(/\([^)]*\)/g) || []).join('');
  const altCount = (altsStr.match(/[♭♯]/g) || []).length;
  const core = name.replace(/\([^)]*\)/g, '');

  if (altCount >= 2) return 6;
  if (/maj7♯5|9♯5|7♯5|°\(maj7\)|∗/.test(name)) return 6;

  if (/13|11|9|add|6\/9/.test(core)) return 5;
  if (altCount === 1) return 5;

  if (/maj7|ø|°7|7sus|7/.test(name)) return 4;  // use full name — catches e.g. "Bm(maj7)"
  if (/6/.test(core)) return 4;

  if (/^[A-G][♭♯]?5$/.test(core.trim())) return 3;

  if (/sus/.test(core)) return 2;

  return 1;
}
