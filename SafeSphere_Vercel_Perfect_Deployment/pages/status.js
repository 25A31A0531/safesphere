import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Status() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(data)
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const isFireActive = events.some(e => e.event_type.includes('Fire') && !e.canceled)
  const isAccidentActive = events.some(e => e.event_type.includes('accident') && !e.canceled)

  return (
    <div className="container">
      <Head><title>System Status | SafeSphere</title></Head>
      <nav><Link href="/">← Home</Link></nav>
      <main>
        <h1>System Status</h1>
        
        <div className="status-grid">
          <div className={`status-card ${isAccidentActive ? 'danger' : 'safe'}`}>
            <div className="icon">🚗</div>
            <h3>Road Safety</h3>
            <div className="indicator">{isAccidentActive ? 'ACCIDENT DETECTED' : 'CLEAR'}</div>
          </div>

          <div className={`status-card ${isFireActive ? 'danger' : 'safe'}`}>
            <div className="icon">🔥</div>
            <h3>Fire Safety</h3>
            <div className="indicator">{isFireActive ? 'FIRE DETECTED' : 'CLEAR'}</div>
          </div>
        </div>

        <div className="log-section">
            <h2>Recent Activity</h2>
            <div className="logs">
                {events.slice(0, 5).map(e => (
                    <div key={e.event_id} className="log-item">
                        <span>{new Date(e.timestamp_utc).toLocaleTimeString()}</span>
                        <span>{e.event_type}</span>
                        <span className={e.canceled ? 'text-gray' : 'text-red'}>{e.canceled ? 'Canceled' : 'Alerted'}</span>
                    </div>
                ))}
            </div>
        </div>
      </main>
      <style jsx>{`
        .container { min-height: 100vh; background: #0f172a; color: white; padding: 2rem; font-family: 'Inter', sans-serif; text-align: center; }
        nav { text-align: left; margin-bottom: 2rem; }
        nav a { color: #3b82f6; text-decoration: none; }
        h1 { margin-bottom: 3rem; }
        .status-grid { display: flex; gap: 2rem; justify-content: center; margin-bottom: 4rem; }
        .status-card { width: 250px; background: #1e293b; padding: 2rem; border-radius: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.1); }
        .icon { font-size: 3rem; margin-bottom: 1rem; }
        .indicator { font-weight: 800; font-size: 0.9rem; margin-top: 1rem; padding: 0.5rem; border-radius: 0.5rem; }
        .safe .indicator { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .danger .indicator { background: rgba(239, 68, 68, 0.1); color: #ef4444; animation: blink 1s infinite; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        
        .log-section { max-width: 600px; margin: 0 auto; text-align: left; }
        .logs { background: #1e293b; border-radius: 1rem; padding: 1rem; }
        .log-item { display: flex; justify-content: space-between; padding: 0.8rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.9rem; }
        .text-red { color: #ef4444; font-weight: 600; }
        .text-gray { color: #64748b; }
      `}</style>
    </div>
  )
}
