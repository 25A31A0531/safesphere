import { useState, useEffect, useRef } from 'react';

const READINGS = [
  { key: 'speed', label: 'Speed', unit: 'km/h', min: 0, max: 120, color: '#3b82f6', icon: '🏎️' },
  { key: 'accel', label: 'Acceleration', unit: 'G', min: -3, max: 3, color: '#f97316', icon: '📡' },
  { key: 'temp', label: 'Temperature', unit: '°C', min: 20, max: 80, color: '#ef4444', icon: '🌡️' },
  { key: 'battery', label: 'Battery', unit: '%', min: 0, max: 100, color: '#22c55e', icon: '🔋' },
];

function getRandom(min, max, prev, step = 0.1) {
  const delta = (Math.random() - 0.5) * (max - min) * step;
  return Math.min(max, Math.max(min, prev + delta));
}

function Ring({ value, min, max, color, size = 80 }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
    </svg>
  );
}

export default function Telemetry({ onEvent }) {
  const [data, setData] = useState({ speed: 60, accel: 0, temp: 35, battery: 82 });
  const [history, setHistory] = useState([]);
  const [crashDetected, setCrashDetected] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setData(prev => {
        const newData = {
          speed: getRandom(0, 120, prev.speed, 0.08),
          accel: getRandom(-3, 3, prev.accel, 0.15),
          temp: getRandom(20, 80, prev.temp, 0.03),
          battery: Math.max(0, prev.battery - 0.01),
        };

        // Crash detection: sudden large accel
        if (Math.abs(newData.accel) > 2.5 && !crashDetected) {
          setCrashDetected(true);
          if (onEvent) onEvent({ event_type: 'Road accident detected', severity: 'Critical', area_name: 'Current Location', timestamp_utc: new Date().toISOString() });
          setTimeout(() => setCrashDetected(false), 5000);
        }

        setHistory(h => [...h.slice(-29), { ...newData, time: Date.now() }]);
        return newData;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="card-title">Live Telemetry</div>
          <div className="card-subtitle">Real-time sensor data</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`status-dot ${crashDetected ? 'danger' : 'online'}`} />
          <span style={{ fontSize: '0.8rem', color: crashDetected ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 600 }}>
            {crashDetected ? '⚠️ CRASH DETECTED' : 'Monitoring'}
          </span>
        </div>
      </div>

      {crashDetected && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          🚨 <strong>Crash Detected!</strong> Emergency contacts are being notified...
        </div>
      )}

      <div className="grid-2">
        {READINGS.map(r => (
          <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Ring value={data[r.key]} min={r.min} max={r.max} color={r.color} size={72} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: r.color }}>
                {r.icon}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {r.key === 'accel' ? data[r.key].toFixed(2) : Math.round(data[r.key])}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: 2 }}>{r.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sparkline chart */}
      {history.length > 2 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Speed History (last 30s)</div>
          <svg width="100%" height="48" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="sgrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const vals = history.map(h => h.speed);
              const max = Math.max(...vals, 1);
              const w = 600;
              const h = 48;
              const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ');
              return <>
                <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={pts} vectorEffect="non-scaling-stroke" preserveAspectRatio="none" style={{ vectorEffect: 'non-scaling-stroke' }} />
              </>;
            })()}
          </svg>
        </div>
      )}
    </div>
  );
}