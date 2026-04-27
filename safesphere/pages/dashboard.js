import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import Telemetry from '../components/Telemetry';
import CameraAI from '../components/CameraAI';
import LocationTracker from '../components/LocationTracker';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, activeAlerts: 0, safeZone: true });

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    const u = localStorage.getItem('ss_user');
    if (!token || !u) { router.push('/'); return; }
    setUser(JSON.parse(u));
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.events || []);
        setStats({ totalEvents: data.events?.length || 0, activeAlerts: data.events?.filter(e => !e.canceled).length || 0, safeZone: (data.events?.length || 0) === 0 });
      }
    } catch {}
  };

  const handleNewEvent = (event) => {
    setAlerts(prev => [event, ...prev.slice(0, 9)]);
    setStats(prev => ({ ...prev, totalEvents: prev.totalEvents + 1, activeAlerts: prev.activeAlerts + 1, safeZone: false }));
  };

  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
      <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
    </div>
  );

  return (
    <>
      <Head>
        <title>Dashboard — SafeSphere</title>
        <meta name="description" content="Live telemetry, camera AI detection, GPS tracking, and emergency alerts." />
      </Head>
      <div className="page-wrapper">
        <Nav active="dashboard" user={user} />
        <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
          {/* Header */}
          <div className="page-header" style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span className={`status-dot ${stats.safeZone ? 'online' : 'danger'}`} />
                  <span style={{ fontSize: '0.85rem', color: stats.safeZone ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                    {stats.safeZone ? 'All Systems Normal' : 'Alert Active'}
                  </span>
                </div>
                <h1 className="page-title">Live Dashboard</h1>
                <p className="page-description">Welcome back, <strong>{user.name || user.username}</strong> — monitoring active</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="stat-card" style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <div className="stat-label">Total Events</div>
                  <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.totalEvents}</div>
                </div>
                <div className="stat-card" style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <div className="stat-label">Active Alerts</div>
                  <div className="stat-value" style={{ fontSize: '1.5rem', color: stats.activeAlerts > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{stats.activeAlerts}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <Telemetry onEvent={handleNewEvent} />
            <LocationTracker />
          </div>

          {/* Camera + Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
            <CameraAI onDetection={handleNewEvent} />

            {/* Recent Alerts */}
            <div className="card">
              <div className="section-header" style={{ marginBottom: 16 }}>
                <div>
                  <div className="card-title">Recent Alerts</div>
                  <div className="card-subtitle">Latest emergency events</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={fetchAlerts}>↻ Refresh</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                    <div style={{ fontWeight: 600 }}>No alerts recorded</div>
                    <div style={{ fontSize: '0.8rem', marginTop: 4 }}>System is monitoring</div>
                  </div>
                ) : alerts.map((alert, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10 }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{alert.event_type?.includes('Fire') ? '🔥' : alert.event_type?.includes('accident') ? '🚗' : '⚠️'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, truncate: true }}>{alert.event_type || 'Emergency Alert'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{alert.area_name || 'Unknown Location'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{new Date(alert.timestamp_utc || Date.now()).toLocaleString()}</div>
                    </div>
                    <span className={`badge ${alert.severity === 'Critical' ? 'badge-red' : alert.severity === 'Severe' ? 'badge-orange' : 'badge-yellow'}`} style={{ flexShrink: 0 }}>
                      {alert.severity || 'Med'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}