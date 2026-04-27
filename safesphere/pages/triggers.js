import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import TriggerButton from '../components/TriggerButton';

const TRIGGERS = [
  { id: 'accident', label: 'Road Accident', icon: '🚗', desc: 'Triggers emergency dispatch for road accidents', color: '#ef4444', severity: 'Critical', countdown: 10 },
  { id: 'fire', label: 'Fire Emergency', icon: '🔥', desc: 'Alerts fire stations and emergency services', color: '#f97316', severity: 'Critical', countdown: 10 },
  { id: 'medical', label: 'Medical Emergency', icon: '🏥', desc: 'Notifies hospitals and family contacts', color: '#3b82f6', severity: 'Severe', countdown: 15 },
  { id: 'fall', label: 'Fall Detected', icon: '⬇️', desc: 'For sudden falls or dangerous impacts', color: '#a855f7', severity: 'Moderate', countdown: 20 },
  { id: 'crime', label: 'Criminal Threat', icon: '🚨', desc: 'Silently alerts police and emergency contacts', color: '#eab308', severity: 'Critical', countdown: 5 },
  { id: 'gas', label: 'Gas Leak', icon: '💨', desc: 'Alerts fire stations for gas leak emergencies', color: '#6b7280', severity: 'Severe', countdown: 10 },
];

export default function Triggers() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [sosActive, setSosActive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    const u = localStorage.getItem('ss_user');
    if (!token || !u) { router.push('/'); return; }
    setUser(JSON.parse(u));
  }, []);

  const handleTriggered = (trigger, wasCanceled) => {
    setActiveId(null);
    const entry = { ...trigger, canceled: wasCanceled, timestamp: new Date().toISOString() };
    setHistory(prev => [entry, ...prev.slice(0, 19)]);

    if (!wasCanceled) {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: `${trigger.label} (Manual)`, severity: trigger.severity, canceled: 0, location_lat: null, location_lon: null }),
      }).catch(() => {});
    }
  };

  const handleSOS = () => {
    setSosActive(true);
    setTimeout(() => {
      setSosActive(false);
      fetch('/api/alerts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'SOS', severity: 'Critical' }) }).catch(() => {});
      setHistory(prev => [{ label: 'SOS Alert', icon: '🆘', severity: 'Critical', canceled: false, timestamp: new Date().toISOString() }, ...prev.slice(0, 19)]);
    }, 500);
  };

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Emergency Triggers — SafeSphere</title>
        <meta name="description" content="Manually trigger emergency alerts with countdown cancel timers." />
      </Head>
      <div className="page-wrapper">
        <Nav active="triggers" user={user} />
        <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
          <div className="page-header" style={{ paddingTop: 0 }}>
            <h1 className="page-title">Emergency Triggers</h1>
            <p className="page-description">Press any button to activate — you'll have time to cancel before alerts are sent</p>
          </div>

          {/* SOS Button */}
          <div className="card" style={{ textAlign: 'center', marginBottom: 28, background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(220,38,38,0.04))', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Emergency SOS</div>
            <div className="sos-btn-wrap">
              <button className={`sos-btn ${sosActive ? 'active' : ''}`} onClick={handleSOS}>
                <span className="sos-btn-label">SOS</span>
                <span className="sos-btn-sub">Hold for Emergency</span>
              </button>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: 280 }}>
                Tap to immediately dispatch alerts to <strong>all</strong> emergency contacts and services
              </div>
            </div>
          </div>

          {/* Trigger Grid */}
          <div style={{ marginBottom: 12 }}>
            <div className="section-title" style={{ marginBottom: 16 }}>Specific Emergency Types</div>
            <div className="grid-3">
              {TRIGGERS.map(t => (
                <TriggerButton key={t.id} trigger={t} isActive={activeId === t.id} onActivate={() => setActiveId(t.id)} onComplete={(canceled) => handleTriggered(t, canceled)} />
              ))}
            </div>
          </div>

          {/* Alert History */}
          {history.length > 0 && (
            <div className="card" style={{ marginTop: 28 }}>
              <div className="section-header">
                <div className="section-title">Trigger History</div>
                <button className="btn btn-ghost btn-sm" onClick={() => setHistory([])}>Clear</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10 }}>
                    <span style={{ fontSize: '1.2rem' }}>{h.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.label}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(h.timestamp).toLocaleString()}</div>
                    </div>
                    <span className={`badge ${h.canceled ? 'badge-yellow' : 'badge-red'}`}>{h.canceled ? 'Canceled' : 'Dispatched'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}