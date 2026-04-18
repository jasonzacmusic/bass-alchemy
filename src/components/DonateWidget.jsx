import { useState, useRef, useEffect } from 'react';
import { Heart, Copy, Check } from 'lucide-react';

const PAYPAL_URL = 'https://paypal.me/jasonzac';
const UPI_ID    = 'jasonzac-1@okhdfcbank';
const UPI_LINK  = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=Nathaniel+School+of+Music&tn=Support+Bass+Alchemy&cu=INR`;

const isAndroid = /Android/i.test(navigator.userAgent);

export default function DonateWidget() {
  const [open, setOpen]         = useState(false);
  const [copied, setCopied]     = useState(false);
  const containerRef            = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    const esc = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none',
          border: 'none',
          padding: '2px 0',
          cursor: 'pointer',
          color: open ? '#fde68a' : '#bea066',
          fontSize: '10px',
          letterSpacing: '0.15em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          opacity: open ? 1 : 0.65,
          transition: 'opacity 200ms, color 200ms',
          minHeight: 0,
          minWidth: 0,
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.opacity = '0.65'; }}
      >
        <Heart size={9} />
        SUPPORT
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 14px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '272px',
            background: 'linear-gradient(180deg, rgba(34,26,17,0.99), rgba(18,13,8,0.98))',
            border: '1px solid rgba(245,184,65,0.32)',
            borderRadius: '18px',
            boxShadow: '0 24px 64px -12px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)',
            padding: '18px',
            zIndex: 200,
            animation: 'fadeInUp 220ms cubic-bezier(.2,.8,.2,1)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', color: '#fde68a', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>
              Support this tool
            </div>
            <div style={{ fontSize: '10px', color: '#9a7840', marginTop: '4px', letterSpacing: '0.06em' }}>
              Free forever · kept alive by students like you
            </div>
          </div>

          {/* PayPal */}
          <a
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '9px',
              padding: '10px 14px',
              marginBottom: '10px',
              borderRadius: '11px',
              background: 'rgba(0,68,153,0.18)',
              border: '1px solid rgba(0,120,212,0.38)',
              color: '#93c5fd',
              textDecoration: 'none',
              fontSize: '12px',
              letterSpacing: '0.06em',
              transition: 'background 180ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,68,153,0.32)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,68,153,0.18)'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
            </svg>
            Donate via PayPal
          </a>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '9px', color: '#7a5c30', letterSpacing: '0.15em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* UPI */}
          <div style={{
            padding: '12px',
            borderRadius: '11px',
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.25)',
          }}>
            <div style={{ fontSize: '9px', color: '#6ee7b7', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '10px' }}>
              UPI · Google Pay · India
            </div>

            {/* QR code */}
            <img
              src="/upi-qr.png"
              alt="Scan to pay via UPI"
              style={{ width: '108px', height: '108px', display: 'block', margin: '0 auto 10px', borderRadius: '8px' }}
            />

            {/* UPI ID + copy */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#d1d5db', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.02em' }}>
                {UPI_ID}
              </span>
              <button
                onClick={copyUpi}
                title={copied ? 'Copied!' : 'Copy UPI ID'}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '2px', color: copied ? '#6ee7b7' : '#9ca3af',
                  display: 'flex', alignItems: 'center',
                  transition: 'color 150ms',
                  minHeight: 0, minWidth: 0,
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>

            {/* Android deep-link button */}
            {isAndroid && (
              <a
                href={UPI_LINK}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '10px',
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'rgba(34,197,94,0.18)',
                  border: '1px solid rgba(34,197,94,0.40)',
                  color: '#6ee7b7',
                  textDecoration: 'none',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                }}
              >
                Open in UPI App
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
