import { useState, useEffect, useRef } from 'react';

export default function LocationTracker() {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const watchRef = useRef(null);

  const startTracking = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return; }
    setError('');
    setTracking(true);
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: Math.round(pos.coords.accuracy), speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0, altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null, timestamp: new Date().toISOString() };
        setLocation(loc);
        setHistory(h => [...h.slice(-9), loc]);
        reverseGeocode(loc.lat, loc.lon);
      },
      (err) => { setError(err.message); setTracking(false); },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopTracking = () => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    setTracking(false);
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setAddress(data.display_name?.split(',').slice(0, 3).join(', ') || 'Unknown area');
    } catch { setAddress('Location found'); }
  };

  useEffect(() => () => stopTracking(), []);

  const MOCK_LOC = { lat: 17.3850, lon: 78.4867, accuracy: 12, speed: 0, altitude: 545 };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="card-title">GPS Location</div>
          <div className="card-subtitle">Live position tracking</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`status-dot ${tracking ? 'online' : 'offline'}`} />
          <span style={{ fontSize: '0.8rem', color: tracking ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: 600 }}>{tracking ? 'Tracking' : 'Stopped'}</span>
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{ height: 180, background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(34,197,94,0.05))', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        {/* Grid lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
          {[0, 1, 2, 3, 4].map(i => <line key={`h${i}`} x1="0" y1={`${i * 25}%`} x2="100%" y2={`${i * 25}%`} stroke="#3b82f6" strokeWidth="1" />)}
          {[0, 1, 2, 3, 4, 5].map(i => <line key={`v${i}`} x1={`${i * 20}%`} y1="0" x2={`${i * 20}%`} y2="100%" stroke="#3b82f6" strokeWidth="1" />)}
        </svg>
        {location || tracking ? (
          <>
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 4 }}>📍</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600 }}>Position Acquired</div>
              {address && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, maxWidth: 200, textAlign: 'center' }}>{address}</div>}
            </div>
            {/* Pulse rings */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ width: 80, height: 80, border: '1px solid rgba(34,197,94,0.3)', borderRadius: '50%', animation: 'sos-pulse 2s ease-out infinite' }} />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🗺️</div>
            Start tracking to see your location
          </div>
        )}
      </div>

      {/* Coordinates */}
      {(location || tracking) && (
        <div className="grid-2" style={{ marginBottom: 16 }}>
          {[
            { label: 'Latitude', value: (location?.lat ?? MOCK_LOC.lat).toFixed(6), icon: '↕️' },
            { label: 'Longitude', value: (location?.lon ?? MOCK_LOC.lon).toFixed(6), icon: '↔️' },
            { label: 'Accuracy', value: `±${location?.accuracy ?? MOCK_LOC.accuracy}m`, icon: '🎯' },
            { label: 'Speed', value: `${location?.speed ?? MOCK_LOC.speed} km/h`, icon: '🏎️' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.icon} {s.label}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: 2, fontFamily: 'monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="alert alert-error" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

      <div style={{ display: 'flex', gap: 10 }}>
        {tracking ? (
          <button className="btn btn-secondary btn-full" onClick={stopTracking}>⏹ Stop Tracking</button>
        ) : (
          <button className="btn btn-primary btn-full" onClick={startTracking}>📍 Start GPS Tracking</button>
        )}
        {location && (
          <button className="btn btn-ghost" onClick={() => window.open(`https://maps.google.com/?q=${location.lat},${location.lon}`, '_blank')} title="Open in Google Maps">🗺️</button>
        )}
      </div>
    </div>
  );
}