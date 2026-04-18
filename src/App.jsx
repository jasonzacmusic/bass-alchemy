import { Component } from 'react';
import BassAlchemy from './components/BassAlchemy';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
          background:'#050403', color:'#fcf4dc', fontFamily:'Inter, sans-serif', textAlign:'center', padding:'2rem' }}>
          <div>
            <div style={{ fontSize:'1.5rem', marginBottom:'1rem', color:'#fde68a' }}>Bass Alchemy</div>
            <div style={{ color:'#d2bb85', marginBottom:'1rem' }}>Something went wrong. Please reload the page.</div>
            <button onClick={() => window.location.reload()}
              style={{ padding:'0.5rem 1.5rem', borderRadius:'9999px', border:'1px solid rgba(245,184,65,0.5)',
                background:'rgba(245,184,65,0.1)', color:'#fde68a', cursor:'pointer' }}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BassAlchemy />
    </ErrorBoundary>
  );
}
