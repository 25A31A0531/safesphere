import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '', phone: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      router.push('/login')
    } else {
      const data = await res.json()
      setError(data.error)
    }
  }

  return (
    <div className="container">
      <Head><title>Sign Up | SafeSphere</title></Head>
      <div className="card">
        <h1>Join SafeSphere</h1>
        <p>Protect yourself and your loved ones</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Username" onChange={(e) => setForm({...form, username: e.target.value})} required />
          <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} required />
          <input type="text" placeholder="Full Name" onChange={(e) => setForm({...form, name: e.target.value})} />
          <input type="email" placeholder="Email Address" onChange={(e) => setForm({...form, email: e.target.value})} />
          <input type="tel" placeholder="Phone Number" onChange={(e) => setForm({...form, phone: e.target.value})} />
          <button type="submit" className="btn-primary">Create Account</button>
        </form>
      </div>
      <style jsx>{`
        .container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: white; font-family: 'Inter', sans-serif; }
        .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; width: 100%; max-width: 400px; border: 1px solid rgba(255, 255, 255, 0.1); }
        h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        p { color: #94a3b8; margin-bottom: 2rem; }
        form { display: flex; flex-direction: column; gap: 1rem; }
        input { padding: 0.875rem; border-radius: 0.5rem; background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); color: white; outline: none; }
        input:focus { border-color: #3b82f6; }
        button { padding: 1rem; border-radius: 0.5rem; background: #3b82f6; color: white; font-weight: 600; border: none; cursor: pointer; }
        .error { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid rgba(239, 68, 68, 0.2); }
      `}</style>
    </div>
  )
}
