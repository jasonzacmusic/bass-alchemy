import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const PAYPAL_URL = 'https://paypal.me/jasonzac';
const UPI_ID    = 'jasonzac-1@okhdfcbank';
const UPI_LINK  = `upi://pay?pa=${UPI_ID}&pn=Nathaniel+School+of+Music&tn=Support+Bass+Alchemy&cu=INR`;
const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

const PAYPAL_ICON = (size = 12) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
  </svg>
);

/* ── Header: PayPal direct link pill ── */
export function PayPalHeaderLink() {
  return (
    <a
      href={PAYPAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: 'rgba(0,68,153,0.12)',
        border: '1px solid rgba(0,120,212,0.30)',
        borderRadius: '20px',
        padding: '4px 10px 4px 8px',
        color: '#93c5fd',
        fontSize: '10px',
        letterSpacing: '0.10em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'all 180ms',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(0,68,153,0.26)';
        e.currentTarget.style.borderColor = 'rgba(0,120,212,0.58)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(0,68,153,0.12)';
        e.currentTarget.style.borderColor = 'rgba(0,120,212,0.30)';
      }}
    >
      {PAYPAL_ICON(9)}
      PayPal
    </a>
  );
}

/* ── Header: UPI copy-to-clipboard pill ── */
export function UpiHeaderButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(UPI_ID); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <button
      onClick={copy}
      title={copied ? 'UPI ID copied!' : 'Copy UPI ID to clipboard'}
      style={{
        background: copied ? 'rgba(34,197,94,0.18)' : 'rgba(34,197,94,0.07)',
        border: `1px solid ${copied ? 'rgba(34,197,94,0.55)' : 'rgba(34,197,94,0.26)'}`,
        borderRadius: '20px',
        padding: '4px 10px 4px 8px',
        cursor: 'pointer',
        color: copied ? '#4ade80' : '#6ee7b7',
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
      <span style={{ fontSize: '11px', lineHeight: 1 }}>₹</span>
      {copied ? 'Copied!' : 'UPI'}
    </button>
  );
}

/* ── Footer: full two-card support section ── */
export default function SupportSection() {
  const [copied, setCopied] = useState(false);
  const copyUpi = async () => {
    try { await navigator.clipboard.writeText(UPI_ID); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <div style={{ fontSize: '8px', letterSpacing: '0.30em', textTransform: 'uppercase', color: '#5c4220' }}>
          Support this free tool
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>

        {/* ── PayPal card — entire card is the link ── */}
        <a
          href={PAYPAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '16px 18px',
            borderRadius: '14px',
            background: 'linear-gradient(145deg, rgba(0,36,90,0.30) 0%, rgba(0,18,50,0.18) 100%)',
            border: '1px solid rgba(59,130,246,0.22)',
            textDecoration: 'none',
            transition: 'border-color 200ms, background 200ms',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.48)';
            e.currentTarget.style.background = 'linear-gradient(145deg, rgba(0,36,90,0.42) 0%, rgba(0,18,50,0.28) 100%)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.22)';
            e.currentTarget.style.background = 'linear-gradient(145deg, rgba(0,36,90,0.30) 0%, rgba(0,18,50,0.18) 100%)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '9px' }}>
            {PAYPAL_ICON(14)}
            <span style={{ fontSize: '10px', color: '#93c5fd', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
              PayPal
            </span>
          </div>
          <p style={{
            fontSize: '10.5px', color: '#94a3b8', lineHeight: '1.55',
            margin: '0 0 11px',
            fontFamily: "'Fraunces', serif", fontStyle: 'italic',
          }}>
            Support music education from anywhere in the world — every contribution keeps this tool free.
          </p>
          <span style={{ fontSize: '10px', color: '#60a5fa', letterSpacing: '0.10em', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Donate via PayPal
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </span>
        </a>

        {/* ── UPI card ── */}
        <div style={{
          padding: '16px 18px',
          borderRadius: '14px',
          background: 'linear-gradient(145deg, rgba(0,50,25,0.28) 0%, rgba(0,25,12,0.16) 100%)',
          border: '1px solid rgba(34,197,94,0.20)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '9px' }}>
            <span style={{ fontSize: '15px', color: '#4ade80', lineHeight: 1, fontWeight: 300 }}>₹</span>
            <span style={{ fontSize: '10px', color: '#4ade80', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
              UPI · Google Pay
            </span>
          </div>
          <p style={{
            fontSize: '10.5px', color: '#94a3b8', lineHeight: '1.55',
            margin: '0 0 11px',
            fontFamily: "'Fraunces', serif", fontStyle: 'italic',
          }}>
            India — scan with Google Pay, PhonePe, or any UPI app to send even ₹50.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/upi-qr.png"
              alt="Scan to pay via UPI"
              style={{ width: '68px', height: '68px', borderRadius: '7px', flexShrink: 0, display: 'block' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '9px', color: '#86efac', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.02em', wordBreak: 'break-all' }}>
                {UPI_ID}
              </span>
              {isAndroid ? (
                <a href={UPI_LINK} style={{ fontSize: '10px', color: '#4ade80', textDecoration: 'none', padding: '4px 8px', borderRadius: '6px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', display: 'inline-flex', alignItems: 'center' }}>
                  Open UPI App
                </a>
              ) : (
                <button
                  onClick={copyUpi}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '10px', color: copied ? '#4ade80' : '#6ee7b7',
                    background: copied ? 'rgba(34,197,94,0.20)' : 'rgba(34,197,94,0.10)',
                    border: `1px solid ${copied ? 'rgba(34,197,94,0.50)' : 'rgba(34,197,94,0.28)'}`,
                    borderRadius: '6px', padding: '4px 9px',
                    cursor: 'pointer', transition: 'all 150ms',
                    minHeight: 0, minWidth: 0, letterSpacing: '0.06em',
                  }}
                >
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                  {copied ? 'Copied!' : 'Copy ID'}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
