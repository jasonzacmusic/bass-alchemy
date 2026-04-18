import { ChevronDown } from 'lucide-react';
import { PATTERNS } from '../constants';

export default function PatternSelector({ pattern, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color:'#bea066' }}>Pattern</span>
      <div className="relative">
        <select value={pattern} onChange={e => onChange(e.target.value)}
          className="appearance-none pr-7 pl-3 py-1.5 rounded-full text-[11px] cursor-pointer"
          style={{
            background:'rgba(16,11,7,0.7)',
            border:'1px solid rgba(245,184,65,0.35)',
            color:'#fde68a', letterSpacing:'0.05em',
          }}>
          {PATTERNS.map(p => (
            <option key={p.id} value={p.id} style={{ background:'#1c1814' }}>{p.name}</option>
          ))}
        </select>
        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color:'#fde68a' }} />
      </div>
    </div>
  );
}
