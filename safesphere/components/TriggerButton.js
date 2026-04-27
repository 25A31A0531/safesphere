import { useState, useEffect, useRef } from 'react';

export default function TriggerButton({ trigger, isActive, onActivate, onComplete }) {
  const [phase, setPhase] = useState('idle'); // idle | countdown | dispatching | done
  const [count, setCount] = useState(trigger.countdown);
  const intervalRef = useRef(null);

  const start = () => {
    if (phase !== 'idle') return;
    setPhase('countdown');
    setCount(trigger.countdown);
    onActivate();

    let remaining = trigger.countdown;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setCount(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setPhase('dispatching');
        setTimeout(() => { setPhase('done'); setTimeout(() => { setPhase('idle'); setCount(trigger.countdown); onComplete(false); }, 1500); }, 800);
      }
    }, 1000);
  };

  const cancel = () => {
    clearInterval(intervalRef.current);
    setPhase('idle');
    setCount(trigger.countdown);
    onComplete(true);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const progress = ((trigger.countdown - count) / trigger.countdown) * 100;

  return (
    <div style={{
      background: phase === 'countdown' ? `rgba(${trigger.color === '#ef4444' ? '239,68,68' : trigger.color === '#f97316' ? '249,115,22' : trigger.color === '#3b82f6' ? '59,130,246' : trigger.color === '#a855f7' ? '168,85,247' : trigger.color === '#eab308' ? '234,179,8' : '107,114,128'}, 0.08)` : 'var(--bg-card)',
      border: `1px solid ${phase === 'idle' ? 'var(--border)' : trigger.color + '40'}`,
      borderRadius: 'var(--radius)',
      padding: '20px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Progress bar */}
      {phase === 'countdown' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, background: trigger.color, width: `${progress}%`, transition: 'width 1s linear' }} />
      )}

      <div style={{ fontSize: '2rem', marginBottom: 10 }}>{trigger.icon}</div>
      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{trigger.label}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.4 }}>{trigger.desc}</div>
      <div style={{ marginBottom: 14 }}>
        <span className={`badge ${trigger.severity === 'Critical' ? 'badge-red' : trigger.severity === 'Severe' ? 'badge-orange' : 'badge-yellow'}`}>
          {trigger.severity}
        </span>
      </div>

      {phase === 'idle' && (
        <button onClick={start} className="btn btn-full" style={{ background: trigger.color + '20', color: trigger.color, border: `1px solid ${trigger.color}40`, fontWeight: 700, padding: '10px' }}>
          Activate
        </button>
      )}

      {phase === 'countdown' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, textAlign: 'center', background: trigger.color, borderRadius: 10, padding: '10px', color: 'white' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.9, marginTop: 2 }}>seconds</div>
          </div>
          <button onClick={cancel} className="btn btn-ghost" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid var(--border)' }}>
            ✕ Cancel
          </button>
        </div>
      )}

      {phase === 'dispatching' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: trigger.color + '15', borderRadius: 10, padding: '12px', border: `1px solid ${trigger.color}30` }}>
          <span className="spinner" style={{ borderTopColor: trigger.color, borderColor: trigger.color + '40' }} />
          <span style={{ color: trigger.color, fontWeight: 700, fontSize: '0.85rem' }}>Dispatching alert...</span>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(34,197,94,0.1)', borderRadius: 10, padding: '12px', border: '1px solid rgba(34,197,94,0.3)' }}>
          <span style={{ fontSize: '1.1rem' }}>✅</span>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem' }}>Alert Dispatched!</span>
        </div>
      )}
    </div>
  );
}