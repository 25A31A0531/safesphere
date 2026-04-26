import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Triggers() {
  const [countdown, setCountdown] = useState(null)
  const [activeType, setActiveType] = useState(null)

  const dispatchSOS = useCallback(async () => {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: activeType === 'accident' ? 'Manual Accident SOS' : 'Manual Fire SOS',
        severity: 'Critical',
        canceled: 0
      })
    })
    setCountdown(null)
    setActiveType(null)
    alert('🚨 SOS DISPATCHED to all emergency contacts!')
  }, [activeType])

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) { dispatchSOS(); return }
    const t = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, dispatchSOS])

  const start = (type) => { setActiveType(type); setCountdown(10) }
  const cancel = async () => {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: `${activeType} SOS (Canceled)`, severity: 'Canceled', canceled: 1 })
    })
    setCountdown(null); setActiveType(null)
  }

  return (
    <>
      <Head><title>SOS Triggers | SafeSphere</title></Head>
      <div style={s.page}>
        <div style={s.container}>
          <Link href="/" style={s.back}>← Home</Link>
          <h1 style={s.title}>Emergency SOS</h1>
          <p style={s.sub}>Press a button to alert all emergency contacts.</p>

          {countdown === null ? (
            <div style={s.grid}>
              <button onClick={() => start('accident')} style={s.sosAccident}>
                <span style={s.sosIcon}>🚗</span>
                <span style={s.sosLabel}>ACCIDENT</span>
                <span style={s.sosHint}>Road collision detected</span>
              </button>
              <button onClick={() => start('fire')} style={s.sosFire}>
                <span style={s.sosIcon}>🔥</span>
                <span style={s.sosLabel}>FIRE</span>
                <span style={s.sosHint}>Fire hazard detected</span>
              </button>
            </div>
          ) : (
            <div style={s.countdownBox}>
              <div style={s.pulseRing}>
                <div style={s.pulseNum}>{countdown}</div>
              </div>
              <h2 style={{ color: '#fff', marginTop: '2rem' }}>
                Sending {activeType === 'accident' ? '🚗 Accident' : '🔥 Fire'} Alert...
              </h2>
              <p style={s.sub}>Dispatching to all contacts in {countdown}s</p>
              <button onClick={cancel} style={s.cancelBtn}>✕ CANCEL ALERT</button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          70% { box-shadow: 0 0 0 30px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  container: { maxWidth: 600, width: '100%', textAlign: 'center' },
  back: { color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 },
  title: { fontSize: '2rem', fontWeight: 900, margin: '1.5rem 0 0.5rem', color: '#fff' },
  sub: { color: '#64748b', marginBottom: '3rem' },
  grid: { display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' },
  sosAccident: { width: 230, height: 260, borderRadius: '1.5rem', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'linear-gradient(145deg, #dc2626, #7f1d1d)', boxShadow: '0 15px 40px rgba(220,38,38,0.3)', transition: 'transform 0.2s' },
  sosFire: { width: 230, height: 260, borderRadius: '1.5rem', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'linear-gradient(145deg, #d97706, #78350f)', boxShadow: '0 15px 40px rgba(217,119,6,0.3)', transition: 'transform 0.2s' },
  sosIcon: { fontSize: '3.5rem' },
  sosLabel: { fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: 2 },
  sosHint: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' },
  countdownBox: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  pulseRing: { width: 160, height: 160, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-ring 1.2s ease-out infinite' },
  pulseNum: { fontSize: '4rem', fontWeight: 900, color: '#fff' },
  cancelBtn: { marginTop: '2rem', padding: '1rem 3rem', borderRadius: 999, background: '#fff', color: '#0a0f1e', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '1rem', letterSpacing: 1 },
}
