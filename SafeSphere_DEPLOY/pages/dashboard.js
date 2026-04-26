import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState({
    accel: { x: 0, y: 0, z: 9.8 },
    speed: 0,
    fireConfidence: 0,
    location: { lat: 28.6139, lon: 77.2090 },
    status: 'monitoring'
  })
  const [history, setHistory] = useState([])
  const [events, setEvents] = useState([])
  const frameRef = useRef(null)

  // Simulate live telemetry data
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newAccelX = (Math.random() - 0.5) * 2
        const newAccelY = (Math.random() - 0.5) * 2
        const newAccelZ = 9.8 + (Math.random() - 0.5) * 0.5
        const newSpeed = Math.max(0, prev.speed + (Math.random() - 0.48) * 5)
        const newFire = Math.max(0, Math.min(100, prev.fireConfidence + (Math.random() - 0.52) * 8))

        const newData = {
          accel: { x: newAccelX, y: newAccelY, z: newAccelZ },
          speed: Math.min(120, newSpeed),
          fireConfidence: newFire,
          location: {
            lat: prev.location.lat + (Math.random() - 0.5) * 0.0001,
            lon: prev.location.lon + (Math.random() - 0.5) * 0.0001
          },
          status: newSpeed > 80 ? 'warning' : newFire > 60 ? 'fire_alert' : 'monitoring'
        }

        setHistory(h => [...h.slice(-29), { time: Date.now(), speed: newData.speed, fire: newData.fireConfidence, accelMag: Math.sqrt(newAccelX**2 + newAccelY**2 + newAccelZ**2) }])
        return newData
      })
    }, 800)

    // Load events
    fetch('/api/events').then(r => r.json()).then(setEvents).catch(() => {})

    return () => clearInterval(interval)
  }, [])

  // Simple canvas chart
  useEffect(() => {
    const canvas = frameRef.current
    if (!canvas || history.length < 2) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const cw = w / 2, ch = h / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.fillStyle = '#0d1321'
    ctx.fillRect(0, 0, cw, ch)

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const y = (ch / 5) * i
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke()
    }

    const drawLine = (data, key, max, color) => {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      data.forEach((d, i) => {
        const x = (i / (data.length - 1)) * cw
        const y = ch - (d[key] / max) * ch
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    drawLine(history, 'speed', 120, '#3b82f6')
    drawLine(history, 'fire', 100, '#f59e0b')
    drawLine(history, 'accelMag', 20, '#10b981')

    // Legend
    ctx.font = '10px Inter, sans-serif'
    const legends = [['Speed', '#3b82f6'], ['Fire %', '#f59e0b'], ['Accel G', '#10b981']]
    legends.forEach(([label, color], i) => {
      ctx.fillStyle = color
      ctx.fillRect(cw - 170 + i * 60, 8, 10, 10)
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(label, cw - 157 + i * 60, 17)
    })
  }, [history])

  const statusColor = telemetry.status === 'monitoring' ? '#10b981' : telemetry.status === 'warning' ? '#f59e0b' : '#ef4444'
  const statusLabel = telemetry.status === 'monitoring' ? 'ALL SYSTEMS NORMAL' : telemetry.status === 'warning' ? 'HIGH SPEED WARNING' : 'FIRE RISK ELEVATED'

  return (
    <>
      <Head><title>Live Telemetry | SafeSphere</title></Head>
      <div style={s.page}>
        <div style={s.top}>
          <Link href="/" style={s.back}>← Home</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ ...s.statusDot, background: statusColor, boxShadow: `0 0 10px ${statusColor}` }}></span>
            <span style={{ color: statusColor, fontWeight: 800, fontSize: '0.8rem', letterSpacing: 1 }}>{statusLabel}</span>
          </div>
        </div>

        <h1 style={s.title}>Live Telemetry Dashboard</h1>

        {/* Sensor Cards Row */}
        <div style={s.grid4}>
          <div style={s.sensorCard}>
            <span style={s.sensorLabel}>SPEED</span>
            <span style={s.sensorValue}>{telemetry.speed.toFixed(1)}</span>
            <span style={s.sensorUnit}>km/h</span>
            <div style={s.bar}><div style={{ ...s.barFill, width: `${(telemetry.speed / 120) * 100}%`, background: telemetry.speed > 80 ? '#ef4444' : '#3b82f6' }}></div></div>
          </div>

          <div style={s.sensorCard}>
            <span style={s.sensorLabel}>FIRE CONFIDENCE</span>
            <span style={{ ...s.sensorValue, color: telemetry.fireConfidence > 60 ? '#ef4444' : '#f59e0b' }}>{telemetry.fireConfidence.toFixed(1)}</span>
            <span style={s.sensorUnit}>%</span>
            <div style={s.bar}><div style={{ ...s.barFill, width: `${telemetry.fireConfidence}%`, background: telemetry.fireConfidence > 60 ? '#ef4444' : '#f59e0b' }}></div></div>
          </div>

          <div style={s.sensorCard}>
            <span style={s.sensorLabel}>ACCELEROMETER</span>
            <span style={s.sensorValue}>{Math.sqrt(telemetry.accel.x**2 + telemetry.accel.y**2 + telemetry.accel.z**2).toFixed(2)}</span>
            <span style={s.sensorUnit}>m/s²</span>
            <div style={s.accelGrid}>
              <span style={s.accelItem}>X: {telemetry.accel.x.toFixed(2)}</span>
              <span style={s.accelItem}>Y: {telemetry.accel.y.toFixed(2)}</span>
              <span style={s.accelItem}>Z: {telemetry.accel.z.toFixed(2)}</span>
            </div>
          </div>

          <div style={s.sensorCard}>
            <span style={s.sensorLabel}>GPS LOCATION</span>
            <span style={{ ...s.sensorValue, fontSize: '1.1rem' }}>{telemetry.location.lat.toFixed(4)}</span>
            <span style={{ ...s.sensorValue, fontSize: '1.1rem', color: '#64748b' }}>{telemetry.location.lon.toFixed(4)}</span>
            <span style={s.sensorUnit}>lat / lon</span>
          </div>
        </div>

        {/* Live Chart */}
        <div style={s.chartCard}>
          <h3 style={s.chartTitle}>Live Sensor Feed</h3>
          <canvas ref={frameRef} style={s.canvas}></canvas>
        </div>

        {/* Recent Events */}
        <div style={s.eventsCard}>
          <h3 style={s.chartTitle}>Dispatched Events</h3>
          {events.length === 0 && <p style={{ color: '#475569', textAlign: 'center', padding: '1.5rem' }}>No events yet — trigger an SOS from the <Link href="/triggers" style={{ color: '#3b82f6' }}>Triggers</Link> page.</p>}
          {events.slice(0, 5).map(e => (
            <div key={e.event_id} style={s.eventRow}>
              <span style={s.eventTime}>{new Date(e.timestamp_utc).toLocaleTimeString()}</span>
              <span style={{ flex: 1 }}>{e.event_type}</span>
              <span style={{ color: e.canceled ? '#475569' : '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>
                {e.canceled ? 'CANCELED' : 'SENT'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', padding: '1.5rem 2rem', maxWidth: 1000, margin: '0 auto' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  back: { color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 },
  statusDot: { width: 10, height: 10, borderRadius: '50%', display: 'inline-block' },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' },

  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  sensorCard: { background: '#111827', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  sensorLabel: { fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase' },
  sensorValue: { fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1.1 },
  sensorUnit: { fontSize: '0.75rem', color: '#64748b' },
  bar: { height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: '0.5rem', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2, transition: 'width 0.6s ease' },
  accelGrid: { display: 'flex', gap: '0.5rem', marginTop: '0.35rem' },
  accelItem: { fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' },

  chartCard: { background: '#111827', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' },
  chartTitle: { fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', marginBottom: '1rem' },
  canvas: { width: '100%', height: 180, borderRadius: '0.5rem' },

  eventsCard: { background: '#111827', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' },
  eventRow: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem' },
  eventTime: { color: '#475569', fontSize: '0.75rem', minWidth: 75, fontFamily: 'monospace' },
}
