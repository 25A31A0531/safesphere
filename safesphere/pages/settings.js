import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [prefs, setPrefs] = useState({ camera_enabled: true, location_enabled: true, telemetry_enabled: true, bluetooth_enabled: false, alerts_enabled: true, fire_detection_enabled: true, sound_alerts: true, language: 'en' });
  const [btDevices, setBtDevices] = useState([]);
  const [btScanning, setBtScanning] = useState(false);
  const [btStatus, setBtStatus] = useState('disconnected');
  const [saved, setSaved] = useState(false);
  const [twilioPhone, setTwilioPhone] = useState('');
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    const u = localStorage.getItem('ss_user');
    if (!token || !u) { router.push('/'); return; }
    setUser(JSON.parse(u));
    const saved = localStorage.getItem('ss_prefs');
    if (saved) setPrefs(JSON.parse(saved));
  }, []);

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));
  const handleSave = () => {
    localStorage.setItem('ss_prefs', JSON.stringify(prefs));
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    localStorage.removeItem('ss_prefs');
    router.push('/');
  };

  const scanBluetooth = async () => {
    setBtScanning(true);
    try {
      if (!navigator.bluetooth) { alert('Web Bluetooth not supported in this browser.'); setBtScanning(false); return; }
      const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: ['battery_service', 'generic_access'] });
      setBtDevices(prev => [...prev.filter(d => d.id !== device.id), { id: device.id, name: device.name || 'Unknown Device' }]);
      setBtStatus('connected');
      setPrefs(p => ({ ...p, bluetooth_enabled: true }));
    } catch (err) {
      if (err.name !== 'NotFoundError') console.error(err);
    } finally { setBtScanning(false); }
  };

  const TOGGLES = [
    { key: 'camera_enabled', label: 'Camera AI Detection', desc: 'Enable real-time camera monitoring and object detection' },
    { key: 'fire_detection_enabled', label: 'Fire Detection', desc: 'Detect fire and smoke through camera feed' },
    { key: 'location_enabled', label: 'GPS Location Tracking', desc: 'Share live GPS location with emergency contacts' },
    { key: 'telemetry_enabled', label: 'Telemetry Monitoring', desc: 'Monitor device sensors for crash detection' },
    { key: 'alerts_enabled', label: 'Emergency Alerts', desc: 'Send SMS/email alerts to emergency contacts' },
    { key: 'sound_alerts', label: 'Sound Alerts', desc: 'Play alarm sounds when emergency is detected' },
  ];

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Settings — SafeSphere</title>
        <meta name="description" content="Configure your SafeSphere preferences, Bluetooth devices, and notification settings." />
      </Head>
      <div className="page-wrapper">
        <Nav active="settings" user={user} />
        <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
          <div className="page-header" style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 className="page-title">Settings</h1>
                <p className="page-description">Configure detection, Bluetooth, and notification preferences</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {saved && <div className="badge badge-green" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>✅ Settings Saved!</div>}
                <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Detection Settings */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: '1.3rem' }}>⚙️</span>
                <div>
                  <div className="card-title">Detection Settings</div>
                  <div className="card-subtitle">Control AI detection features</div>
                </div>
              </div>
              {TOGGLES.map(t => (
                <div key={t.key} className="toggle-wrap">
                  <div className="toggle-info">
                    <div className="toggle-label">{t.label}</div>
                    <div className="toggle-desc">{t.desc}</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={prefs[t.key]} onChange={() => toggle(t.key)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>

            {/* Bluetooth */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: '1.3rem' }}>📡</span>
                  <div>
                    <div className="card-title">Bluetooth Devices</div>
                    <div className="card-subtitle">Connect crash-detection sensors</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span className={`status-dot ${btStatus === 'connected' ? 'online' : 'offline'}`} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{btStatus === 'connected' ? 'Device Connected' : 'No device connected'}</span>
                </div>
                <button className="btn btn-secondary btn-full" onClick={scanBluetooth} disabled={btScanning}>
                  {btScanning ? <><span className="spinner" /> Scanning...</> : '📡 Scan for Devices'}
                </button>
                {btDevices.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paired Devices</div>
                    {btDevices.map(d => (
                      <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8 }}>
                        <span className="status-dot online" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', wordBreak: 'break-all' }}>{d.id}</div>
                        </div>
                        <span className="badge badge-green">Connected</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Twilio Config */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: '1.3rem' }}>📱</span>
                  <div>
                    <div className="card-title">Twilio SMS Config</div>
                    <div className="card-subtitle">Configure SMS alert credentials</div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Alert Phone Number</label>
                  <input className="form-input" placeholder="+1 (555) 000-0000" value={twilioPhone} onChange={e => setTwilioPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Twilio Account SID</label>
                  <input className="form-input" placeholder="ACxxxxxxxxxxxxxxxxxxxxx" value={twilioSid} onChange={e => setTwilioSid(e.target.value)} type="password" />
                </div>
                <div className="form-group">
                  <label className="form-label">Twilio Auth Token</label>
                  <input className="form-input" placeholder="Auth token..." value={twilioToken} onChange={e => setTwilioToken(e.target.value)} type="password" />
                </div>
                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem', color: '#93c5fd' }}>
                  ℹ️ Store credentials in Vercel Environment Variables for production. These are stored locally only.
                </div>
              </div>

              {/* Language */}
              <div className="card">
                <div className="card-title" style={{ marginBottom: 16 }}>🌍 Language</div>
                <select className="form-input" value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))}>
                  <option value="en">🇬🇧 English</option>
                  <option value="hi">🇮🇳 Hindi</option>
                  <option value="te">🇮🇳 Telugu</option>
                  <option value="ta">🇮🇳 Tamil</option>
                  <option value="es">🇪🇸 Spanish</option>
                  <option value="fr">🇫🇷 French</option>
                </select>
              </div>

              {/* Danger Zone */}
              <div className="card" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
                <div className="card-title" style={{ marginBottom: 4, color: 'var(--accent-red)' }}>⚠️ Danger Zone</div>
                <div className="card-subtitle" style={{ marginBottom: 16 }}>These actions cannot be undone</div>
                <button className="btn btn-ghost btn-full" onClick={handleLogout} style={{ color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}