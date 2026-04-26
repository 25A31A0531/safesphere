import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Triggers() {
  const [countdown, setCountdown] = useState(null)
  const [activeType, setActiveType] = useState(null)

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      dispatchSOS()
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const startSOS = (type) => {
    setActiveType(type)
    setCountdown(10)
  }

  const cancelSOS = () => {
    setCountdown(null)
    setActiveType(null)
  }

  const dispatchSOS = async () => {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: activeType === 'accident' ? 'Manual Accident SOS' : 'Manual Fire SOS',
        severity: 'Critical',
        canceled: 0
      })
    })
    alert("SOS DISPATCHED TO ALL CONTACTS!")
    setCountdown(null)
    setActiveType(null)
  }

  return (
    <div className="container">
      <Head><title>Emergency Triggers | SafeSphere</title></Head>
      <nav><Link href="/">← Home</Link></nav>
      <main>
        <h1>SOS Triggers</h1>
        
        {countdown === null ? (
          <div className="grid">
            <button className="sos-btn accident" onClick={() => startSOS('accident')}>
              <div className="icon">🚗</div>
              ACCIDENT SOS
            </button>
            <button className="sos-btn fire" onClick={() => startSOS('fire')}>
              <div className="icon">🔥</div>
              FIRE SOS
            </button>
          </div>
        ) : (
          <div className="countdown-overlay">
            <div className="pulse-circle">{countdown}</div>
            <h2>Sending {activeType.toUpperCase()} Alert...</h2>
            <p>Alerting all emergency contacts in {countdown} seconds</p>
            <button className="cancel-btn" onClick={cancelSOS}>CANCEL ALERT</button>
          </div>
        )}
      </main>
      <style jsx>{`
        .container { min-height: 100vh; background: #0f172a; color: white; padding: 2rem; font-family: 'Inter', sans-serif; text-align: center; }
        nav { text-align: left; margin-bottom: 2rem; }
        nav a { color: #3b82f6; text-decoration: none; }
        h1 { margin-bottom: 3rem; }
        .grid { display: flex; gap: 2rem; justify-content: center; }
        .sos-btn { width: 220px; height: 220px; border-radius: 2rem; border: none; color: white; font-weight: 800; cursor: pointer; transition: transform 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
        .icon { font-size: 3rem; }
        .accident { background: linear-gradient(135deg, #ef4444, #991b1b); box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3); }
        .fire { background: linear-gradient(135deg, #f59e0b, #9a3412); box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3); }
        .sos-btn:hover { transform: scale(1.05); }

        .countdown-overlay { margin-top: 5rem; }
        .pulse-circle { width: 150px; height: 150px; border-radius: 50%; background: #ef4444; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; font-size: 4rem; font-weight: 900; animation: pulse 1s infinite; }
        @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        .cancel-btn { margin-top: 3rem; padding: 1rem 3rem; border-radius: 9999px; background: white; color: #0f172a; font-weight: 800; border: none; cursor: pointer; }
      `}</style>
    </div>
  )
}
