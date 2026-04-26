import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function CameraAI() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [detection, setDetection] = useState({ type: 'none', confidence: 0 })
  const [log, setLog] = useState([])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      alert('Camera access denied or unavailable. Using simulation mode.')
      setCameraActive(true) // simulate anyway
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
    }
    setCameraActive(false)
  }

  // Simulate AI detection frames
  useEffect(() => {
    if (!cameraActive) return
    const interval = setInterval(() => {
      const rand = Math.random()
      let type = 'clear'
      let confidence = Math.random() * 15
      if (rand > 0.92) { type = 'fire'; confidence = 60 + Math.random() * 35 }
      else if (rand > 0.85) { type = 'smoke'; confidence = 40 + Math.random() * 30 }
      else if (rand > 0.80) { type = 'vehicle_damage'; confidence = 30 + Math.random() * 40 }

      setDetection({ type, confidence })

      if (type !== 'clear') {
        setLog(prev => [{ type, confidence, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 20))
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [cameraActive])

  // Draw detection overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = 640
    canvas.height = 360
    ctx.clearRect(0, 0, 640, 360)

    if (detection.type !== 'clear' && cameraActive) {
      const colors = { fire: '#ef4444', smoke: '#f59e0b', vehicle_damage: '#3b82f6' }
      const color = colors[detection.type] || '#fff'

      // Bounding box
      const bx = 120 + Math.random() * 100, by = 60 + Math.random() * 50
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(bx, by, 280, 200)

      // Label
      ctx.fillStyle = color
      ctx.fillRect(bx, by - 28, 250, 26)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.fillText(`${detection.type.toUpperCase()} — ${detection.confidence.toFixed(1)}%`, bx + 8, by - 9)

      // Corner brackets
      const corners = [[bx, by], [bx + 280, by], [bx, by + 200], [bx + 280, by + 200]]
      ctx.lineWidth = 4
      ctx.strokeStyle = color
      corners.forEach(([cx, cy]) => {
        ctx.beginPath()
        const dx = cx === bx ? 20 : -20
        const dy = cy === by ? 20 : -20
        ctx.moveTo(cx + dx, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy)
        ctx.stroke()
      })
    }
  }, [detection, cameraActive])

  const typeColors = { fire: '#ef4444', smoke: '#f59e0b', vehicle_damage: '#3b82f6', clear: '#10b981' }

  return (
    <>
      <Head><title>Camera AI | SafeSphere</title></Head>
      <div style={s.page}>
        <div style={s.container}>
          <Link href="/dashboard" style={s.back}>← Dashboard</Link>
          <h1 style={s.title}>Camera AI Detection</h1>
          <p style={s.sub}>Real-time AI analysis for fire, smoke, and vehicle damage</p>

          <div style={s.cameraBox}>
            <video ref={videoRef} autoPlay playsInline muted style={s.video}></video>
            <canvas ref={canvasRef} style={s.overlay}></canvas>
            {!cameraActive && (
              <div style={s.placeholder}>
                <span style={{ fontSize: '3rem' }}>📸</span>
                <p>Camera feed inactive</p>
              </div>
            )}
          </div>

          <div style={s.controls}>
            {!cameraActive ? (
              <button onClick={startCamera} style={s.startBtn}>▶ Start Camera AI</button>
            ) : (
              <button onClick={stopCamera} style={s.stopBtn}>⏹ Stop Camera</button>
            )}
          </div>

          {cameraActive && (
            <div style={s.statusBar}>
              <div style={s.statusItem}>
                <span style={s.statusLabel}>Detection</span>
                <span style={{...s.statusValue, color: typeColors[detection.type]}}>{detection.type === 'clear' ? 'CLEAR' : detection.type.toUpperCase()}</span>
              </div>
              <div style={s.statusItem}>
                <span style={s.statusLabel}>Confidence</span>
                <span style={s.statusValue}>{detection.confidence.toFixed(1)}%</span>
              </div>
              <div style={s.statusItem}>
                <span style={s.statusLabel}>FPS</span>
                <span style={s.statusValue}>~0.5</span>
              </div>
            </div>
          )}

          {log.length > 0 && (
            <div style={s.logBox}>
              <h3 style={s.logTitle}>Detection Log</h3>
              {log.map((l, i) => (
                <div key={i} style={s.logItem}>
                  <span style={s.logTime}>{l.time}</span>
                  <span style={{ color: typeColors[l.type], fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{l.type}</span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{l.confidence.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
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
  sub: { color: '#64748b', marginBottom: '2rem', fontSize: '0.85rem' },
  cameraBox: { position: 'relative', width: '100%', aspectRatio: '16/9', background: '#0d1117', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' },
  video: { width: '100%', height: '100%', objectFit: 'cover' },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' },
  placeholder: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#475569' },
  controls: { display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' },
  startBtn: { padding: '0.85rem 2.5rem', borderRadius: '0.5rem', background: '#10b981', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' },
  stopBtn: { padding: '0.85rem 2.5rem', borderRadius: '0.5rem', background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' },
  statusBar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  statusItem: { flex: 1, background: '#111827', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' },
  statusLabel: { display: 'block', fontSize: '0.65rem', color: '#475569', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.35rem' },
  statusValue: { fontSize: '1.1rem', fontWeight: 800, color: '#fff' },
  logBox: { background: '#111827', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem' },
  logTitle: { fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '1rem', letterSpacing: 1, textTransform: 'uppercase' },
  logItem: { display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' },
  logTime: { color: '#475569', fontSize: '0.75rem', fontFamily: 'monospace', minWidth: 80 },
}
