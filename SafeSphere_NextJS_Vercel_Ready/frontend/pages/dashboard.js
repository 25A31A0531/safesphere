import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [contacts, setContacts] = useState([])
  const [activeTab, setActiveTab] = useState('status')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    // Mock user load
    setUser({ username: 'User' })
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    const [evRes, conRes] = await Promise.all([
      fetch('/api/events'),
      fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` }})
    ])
    setEvents(await evRes.json())
    setContacts(await conRes.json())
  }

  const triggerSOS = async (type) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: type === 'accident' ? 'Road accident detected' : 'Fire hazard detected',
        severity: 'Critical',
        canceled: 0
      })
    })
    if (res.ok) {
      alert(`${type.toUpperCase()} SOS DISPATCHED!`)
      fetchData()
    }
  }

  return (
    <div className="container">
      <Head><title>Dashboard | SafeSphere</title></Head>
      
      <aside className="sidebar">
        <div className="logo">SafeSphere</div>
        <nav>
          <button onClick={() => setActiveTab('status')} className={activeTab === 'status' ? 'active' : ''}>Status</button>
          <button onClick={() => setActiveTab('contacts')} className={activeTab === 'contacts' ? 'active' : ''}>Contacts</button>
          <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>History</button>
        </nav>
        <button className="logout" onClick={() => { localStorage.removeItem('token'); router.push('/'); }}>Logout</button>
      </aside>

      <main className="content">
        <header>
          <h1>Emergency Dashboard</h1>
          <div className="sos-actions">
            <button className="btn-sos accident" onClick={() => triggerSOS('accident')}>ACCIDENT SOS</button>
            <button className="btn-sos fire" onClick={() => triggerSOS('fire')}>FIRE SOS</button>
          </div>
        </header>

        {activeTab === 'status' && (
          <div className="status-grid">
            <div className="stat-card">
              <h3>System Status</h3>
              <div className="pulse-green">Active</div>
            </div>
            <div className="stat-card">
              <h3>Recent Event</h3>
              <p>{events[0]?.event_type || 'No recent events'}</p>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-panel">
            <h2>Emergency Contacts</h2>
            <div className="list">
              {contacts.map(c => (
                <div key={c.contact_id} className="item">
                  <span>{c.name} ({c.type})</span>
                  <span>{c.phone}</span>
                </div>
              ))}
              {contacts.length === 0 && <p>No contacts added yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-panel">
            <h2>Event History</h2>
            <table>
              <thead>
                <tr><th>Time</th><th>Event</th><th>Status</th></tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.event_id}>
                    <td>{new Date(e.timestamp_utc).toLocaleTimeString()}</td>
                    <td>{e.event_type}</td>
                    <td>{e.canceled ? 'Canceled' : 'Dispatched'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx>{`
        .container { display: flex; min-height: 100vh; background: #0f172a; color: white; font-family: 'Inter', sans-serif; }
        .sidebar { width: 260px; background: #1e293b; padding: 2rem; display: flex; flex-direction: column; border-right: 1px solid rgba(255, 255, 255, 0.1); }
        .logo { font-size: 1.5rem; font-weight: 800; margin-bottom: 3rem; color: #3b82f6; }
        nav { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        nav button { background: none; border: none; color: #94a3b8; text-align: left; padding: 1rem; border-radius: 0.5rem; cursor: pointer; transition: 0.2s; font-size: 1rem; }
        nav button:hover { background: rgba(255, 255, 255, 0.05); color: white; }
        nav button.active { background: #3b82f6; color: white; }
        .logout { margin-top: auto; color: #ef4444; background: none; border: 1px solid #ef4444; padding: 0.75rem; border-radius: 0.5rem; cursor: pointer; }
        
        .content { flex: 1; padding: 3rem; }
        header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .sos-actions { display: flex; gap: 1rem; }
        .btn-sos { padding: 1rem 2rem; border-radius: 0.75rem; font-weight: 800; border: none; cursor: pointer; transition: transform 0.2s; }
        .accident { background: #ef4444; color: white; }
        .fire { background: #f59e0b; color: white; }
        .btn-sos:hover { transform: scale(1.05); }

        .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .stat-card { background: #1e293b; padding: 2rem; border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.1); }
        .pulse-green { color: #10b981; font-weight: 700; position: relative; padding-left: 1.5rem; }
        .pulse-green::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; }

        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th { text-align: left; color: #94a3b8; padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        td { padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .item { display: flex; justify-content: space-between; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 0.5rem; margin-bottom: 0.5rem; }
      `}</style>
    </div>
  )
}
