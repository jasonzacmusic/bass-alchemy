import { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const PAYPAL_URL = 'https://paypal.me/jasonzac';
const UPI_ID    = 'jasonzac-1@okhdfcbank';
const UPI_LINK  = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=Nathaniel+School+of+Music&tn=Support+Bass+Alchemy&cu=INR`;
const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

function useClickOutside(ref, open, setOpen) {
  useEffect(() => {
    if (!open) return;
    const down = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key  = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
}

const PAYPAL_SVG = (size = 10) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
  </svg>
);

const POPOVER_SHELL = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '236px',
  background: 'linear-gradient(180deg, rgba(34,26,17,0.99), rgba(18,13,8,0.98))',
  border: '1px solid rgba(245,184,65,0.32)',
  borderRadius: '16px',
  boxShadow: '0 24px 64px -12px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)',
  padding: '16px',
  zIndex: 200,
};

export function PayPalButton({ placement = 'up' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, open, setOpen);

  const posStyle = placement === 'up'
    ? { bottom: 'calc(100% + 12px)' }
    : { top: 'calc(100% + 10px)' };
  const anim = placement === 'up'
    ? 'fadeInUp 220ms cubic-bezier(.2,.8,.2,1)'
    : 'fadeInDown 220ms cubic-bezier(.2,.8,.2,1)';

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: open ? 'rgba(0,68,153,0.28)' : 'rgba(0,68,153,0.12)',
          border: `1px solid ${open ? 'rgba(0,120,212,0.65)' : 'rgba(0,120,212,0.32)'}`,
          borderRadius: '20px',
          padding: '4px 10px 4px 8px',
          cursor: 'pointer',
          color: '#93c5fd',
          fontSize: '10px',
          letterSpacing: '0.10em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          transition: 'all 180ms',
          minHeight: 0, minWidth: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {PAYPAL_SVG(10)}
        PayPal
      </button>

      {open && (
        <div style={{ ...POPOVER_SHELL, ...posStyle, animation: anim }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#fde68a', letterSpacing: '0.20em', textTransform: 'uppercase', fontWeight: 500 }}>
              Support via PayPal
            </div>
            <div style={{ fontSize: '9px', color: '#9a7840', marginTop: '3px' }}>
              Free forever · kept alive by students
            </div>
          </div>
          <a
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: '10px',
              background: 'rgba(0,68,153,0.18)', border: '1px solid rgba(0,120,212,0.38)',
              color: '#93c5fd', textDecoration: 'none', fontSize: '12px', letterSpacing: '0.06em',
              transition: 'background 180ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,68,153,0.32)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,68,153,0.18)'}
          >
            {PAYPAL_SVG(13)}
            Donate via PayPal
          </a>
        </div>
      )}
    </div>
  );
}

export function UpiButton({ placement = 'up' }) {
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, open, setOpen);

  const posStyle = placement === 'up'
    ? { bottom: 'calc(100% + 12px)' }
    : { top: 'calc(100% + 10px)' };
  const anim = placement === 'up'
    ? 'fadeInUp 220ms cubic-bezier(.2,.8,.2,1)'
    : 'fadeInDown 220ms cubic-bezier(.2,.8,.2,1)';

  const copyUpi = async () => {
    try { await navigator.clipboard.writeText(UPI_ID); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: open ? 'rgba(34,197,94,0.18)' : 'rgba(34,197,94,0.07)',
          border: `1px solid ${open ? 'rgba(34,197,94,0.58)' : 'rgba(34,197,94,0.28)'}`,
          borderRadius: '20px',
          padding: '4px 10px 4px 8px',
          cursor: 'pointer',
          color: '#6ee7b7',
          fontSize: '10px',
          letterSpacing: '0.10em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 180ms',
          minHeight: 0, minWidth: 0,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: '12px', lineHeight: 1, marginTop: '-1px' }}>₹</span>
        UPI
      </button>

      {open && (
        <div style={{ ...POPOVER_SHELL, ...posStyle, animation: anim }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#fde68a', letterSpacing: '0.20em', textTransform: 'uppercase', fontWeight: 500 }}>
              UPI · Google Pay
            </div>
            <div style={{ fontSize: '9px', color: '#9a7840', marginTop: '3px' }}>
              India · Free forever
            </div>
          </div>
          <div style={{ padding: '11px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <img
              src="/upi-qr.png"
              alt="Scan to pay via UPI"
              style={{ width: '108px', height: '108px', display: 'block', margin: '0 auto 8px', borderRadius: '7px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <span style={{ fontSize: '10px', color: '#d1d5db', fontFamily: 'ui-monospace, monospace' }}>
                {UPI_ID}
              </span>
              <button
                onClick={copyUpi}
                title={copied ? 'Copied!' : 'Copy UPI ID'}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '2px', color: copied ? '#6ee7b7' : '#9ca3af',
                  display: 'flex', alignItems: 'center',
                  transition: 'color 150ms', minHeight: 0, minWidth: 0,
                }}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
              </button>
            </div>
            {isAndroid && (
              <a
                href={UPI_LINK}
                style={{
                  display: 'block', textAlign: 'center', marginTop: '8px',
                  padding: '7px', borderRadius: '7px',
                  background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.40)',
                  color: '#6ee7b7', textDecoration: 'none', fontSize: '10px', letterSpacing: '0.06em',
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

export default function DonateWidget() {
  return (
    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
      <PayPalButton placement="up" />
      <UpiButton placement="up" />
    </div>
  );
}
