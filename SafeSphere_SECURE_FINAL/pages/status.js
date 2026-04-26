import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Status() {
  const [events, setEvents] = useState([])
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/events')
        setEvents(await res.json())
      } catch (e) { /* ignore */ }
    }
    load()
    const interval = setInterval(() => { load(); setNow(new Date()) }, 5000)
    return () => clearInterval(interval)
  }, [])

  const activeEvents = events.filter(e => !e.canceled)
  const fireActive = activeEvents.some(e => e.event_type && e.event_type.toLowerCase().includes('fire'))
  const accidentActive = activeEvents.some(e => e.event_type && e.event_type.toLowerCase().includes('accident'))

  return (
    <>
      <Head><title>System Status | SafeSphere</title></Head>
      <div style={s.page}>
        <div style={s.container}>
          <Link href="/" style={s.back}>← Home</Link>
          <h1 style={s.title}>System Status</h1>
          <p style={s.sub}>Live monitoring · Updated {now.toLocaleTimeString()}</p>

          <div style={s.grid}>
            <div style={{...s.card, borderColor: accidentActive ? '#ef4444' : '#10b981'}}>
              <div style={s.iconWrap}>
                <span style={s.icon}>🚗</span>
              </div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Road Safety</h3>
              <div style={{
                ...s.indicator,
                background: accidentActive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                color: accidentActive ? '#ef4444' : '#10b981',
                borderColor: accidentActive ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)',
              }}>
                <span style={s.dot(accidentActive)}></span>
                {accidentActive ? 'ACCIDENT DETECTED' : 'ALL CLEAR'}
              </div>
            </div>

            <div style={{...s.card, borderColor: fireActive ? '#ef4444' : '#10b981'}}>
              <div style={s.iconWrap}>
                <span style={s.icon}>🔥</span>
              </div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Fire Safety</h3>
              <div style={{
                ...s.indicator,
                background: fireActive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                color: fireActive ? '#ef4444' : '#10b981',
                borderColor: fireActive ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)',
              }}>
                <span style={s.dot(fireActive)}></span>
                {fireActive ? 'FIRE DETECTED' : 'ALL CLEAR'}
              </div>
            </div>
          </div>

          <div style={s.logSection}>
            <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.15rem' }}>Recent Activity</h2>
            {events.length === 0 && <p style={s.empty}>No events recorded yet.</p>}
            {events.slice(0, 10).map(e => (
              <div key={e.event_id} style={s.logItem}>
                <span style={s.logTime}>{new Date(e.timestamp_utc).toLocaleTimeString()}</span>
                <span style={{ flex: 1 }}>{e.event_type}</span>
                <span style={{ color: e.canceled ? '#64748b' : '#ef4444', fontWeight: 700, fontSize: '0.8rem' }}>
                  {e.canceled ? 'CANCELED' : 'DISPATCHED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', padding: '2rem' },
  container: { maxWidth: 700, margin: '0 auto' },
  back: { color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 },
  title: { fontSize: '1.75rem', fontWeight: 800, margin: '1.5rem 0 0.25rem', color: '#fff' },
  sub: { color: '#64748b', marginBottom: '2.5rem', fontSize: '0.85rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },
  card: { background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid', textAlign: 'center' },
  iconWrap: { marginBottom: '1rem' },
  icon: { fontSize: '2.5rem' },
  indicator: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: 999, fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, border: '1px solid' },
  dot: (danger) => ({ width: 8, height: 8, borderRadius: '50%', background: danger ? '#ef4444' : '#10b981', display: 'inline-block', boxShadow: danger ? '0 0 8px #ef4444' : '0 0 8px #10b981' }),
  logSection: { background: '#111827', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.06)' },
  empty: { color: '#475569', textAlign: 'center', padding: '2rem' },
  logItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.9rem' },
  logTime: { color: '#64748b', fontSize: '0.8rem', minWidth: 80 },
}
