import { Sparkles, HelpCircle, Volume2, VolumeX, Share2, Check } from 'lucide-react';
import { PayPalButton, UpiButton } from './DonateWidget';

export default function Header({ muted, onMuteToggle, onGuideOpen, onShare, shareCopied }) {
  return (
    <header className="relative border-b border-white/[0.10] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-3">

        <div className="flex items-center gap-3 shrink-0">
          <img src="/nsm-logo.png" alt="Nathaniel School of Music"
            className="h-10 w-10 rounded-full object-cover ring-1 ring-white/25" />
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color:'#ecd7a2' }}>
              Nathaniel School of Music
            </div>
            <div className="text-lg"
              style={{ fontFamily:"'Fraunces', serif", fontWeight:500, letterSpacing:'-0.01em', color:'#fcf4dc' }}>
              Bass Alchemy
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-xs" style={{ color:'#ddc68f' }}>
            <Sparkles size={12} className="text-amber-400" />
            <span style={{ letterSpacing:'0.08em' }}>ONE VOICING · TWELVE BASSES · ANY KEY</span>
          </div>

          {/* Support pills — hidden on very small screens (footer covers mobile) */}
          <div className="hidden sm:flex items-center gap-1.5 ml-1">
            <PayPalButton placement="down" />
            <UpiButton placement="down" />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-3.5 mx-0.5" style={{ background:'rgba(236,215,162,0.2)' }} />

          {/* Utility icon buttons */}
          <button onClick={onShare} title={shareCopied ? 'Link copied!' : 'Share this configuration'}
            className="p-2 rounded-full transition-all hover:-translate-y-[1px]"
            style={{
              background: shareCopied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
              border: shareCopied ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(255,255,255,0.15)',
              color: shareCopied ? '#86efac' : '#fcf4dc',
            }}>
            {shareCopied ? <Check size={14} /> : <Share2 size={14} />}
          </button>
          <button onClick={onGuideOpen} title="Student guide"
            className="p-2 rounded-full transition-all hover:-translate-y-[1px]"
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', color:'#fcf4dc' }}>
            <HelpCircle size={14} />
          </button>
          <button onClick={onMuteToggle} title={muted ? 'Unmute' : 'Mute'}
            className="p-2 rounded-full transition-all"
            style={{
              background: muted ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
              border: muted ? '1px solid rgba(239,68,68,0.45)' : '1px solid rgba(255,255,255,0.15)',
              color: muted ? '#fca5a5' : '#fcf4dc',
            }}>
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </header>
  );
}
