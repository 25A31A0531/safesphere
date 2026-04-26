import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Settings() {
  const [settings, setSettings] = useState({
    camera_enabled: true,
    video_preview: false,
    location_enabled: true,
    telemetry_enabled: true,
    fire_detection: true,
    bluetooth_enabled: true,
    alerts_enabled: true,
    language: 'en'
  })
  const [saved, setSaved] = useState(false)

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const reset = () => {
    setSettings({ camera_enabled: true, video_preview: false, location_enabled: true, telemetry_enabled: true, fire_detection: true, bluetooth_enabled: true, alerts_enabled: true, language: 'en' })
    setSaved(false)
  }

  const Toggle = ({ label, desc, k, icon }) => (
    <div style={s.row}>
      <div style={s.rowLeft}>
        <span style={s.rowIcon}>{icon}</span>
        <div>
          <div style={s.rowLabel}>{label}</div>
          <div style={s.rowDesc}>{desc}</div>
        </div>
      </div>
      <button onClick={() => toggle(k)} style={{...s.toggle, background: settings[k] ? '#3b82f6' : '#1e293b', borderColor: settings[k] ? '#3b82f6' : '#334155' }}>
        <div style={{...s.toggleDot, transform: settings[k] ? 'translateX(20px)' : 'translateX(0)' }}></div>
      </button>
    </div>
  )

  return (
    <>
      <Head><title>Settings | SafeSphere</title></Head>
      <div style={s.page}>
        <div style={s.container}>
          <Link href="/dashboard" style={s.back}>← Dashboard</Link>
          <h1 style={s.title}>Settings</h1>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>Sensors & Detection</h3>
            <Toggle icon="📸" label="Camera AI" desc="Enable AI-powered visual detection" k="camera_enabled" />
            <Toggle icon="🎥" label="Video Preview" desc="Show live camera feed on dashboard" k="video_preview" />
            <Toggle icon="🔥" label="Fire Detection" desc="AI fire/smoke confidence analysis" k="fire_detection" />
            <Toggle icon="📊" label="Telemetry Tracking" desc="Accelerometer + speed monitoring" k="telemetry_enabled" />
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>Connectivity</h3>
            <Toggle icon="📍" label="Live Location" desc="GPS tracking and reverse geocoding" k="location_enabled" />
            <Toggle icon="⌚" label="Bluetooth Watch" desc="Pair with smartwatch for wrist alerts" k="bluetooth_enabled" />
            <Toggle icon="🔔" label="Emergency Alerts" desc="SMS/Call dispatch to contacts" k="alerts_enabled" />
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>Language</h3>
            <div style={s.langRow}>
              {[['en','English'],['es','Español'],['fr','Français'],['hi','हिंदी']].map(([code, name]) => (
                <button key={code} onClick={() => setSettings({...settings, language: code})} style={{...s.langBtn, ...(settings.language === code ? s.langActive : {})}}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div style={s.btnRow}>
            <button onClick={save} style={s.saveBtn}>{saved ? '✓ Saved!' : 'Save Settings'}</button>
            <button onClick={reset} style={s.resetBtn}>Reset to Defaults</button>
          </div>
        </div>
      </div>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', padding: '2rem' },
  container: { maxWidth: 600, margin: '0 auto' },
  back: { color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 },
  title: { fontSize: '1.75rem', fontWeight: 800, margin: '1.5rem 0 2rem', color: '#fff' },
  section: { background: '#111827', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', padding: '0.25rem 0', marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '0.7rem', fontWeight: 700, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', padding: '1rem 1.5rem 0.5rem' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' },
  rowLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  rowIcon: { fontSize: '1.25rem' },
  rowLabel: { color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' },
  rowDesc: { color: '#64748b', fontSize: '0.75rem', marginTop: 2 },
  toggle: { width: 48, height: 28, borderRadius: 14, border: '2px solid', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', padding: 0 },
  toggleDot: { width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: 2, transition: 'transform 0.2s' },
  langRow: { display: 'flex', gap: '0.5rem', padding: '1rem 1.5rem', flexWrap: 'wrap' },
  langBtn: { padding: '0.5rem 1.25rem', borderRadius: '0.5rem', background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  langActive: { background: '#3b82f6', borderColor: '#3b82f6', color: '#fff' },
  btnRow: { display: 'flex', gap: '1rem' },
  saveBtn: { flex: 1, padding: '0.9rem', borderRadius: '0.5rem', background: '#3b82f6', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.95rem' },
  resetBtn: { padding: '0.9rem 1.5rem', borderRadius: '0.5rem', background: 'transparent', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
}
