import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const update = (key, val) => setForm({ ...form, [key]: val })

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/login')
      } else {
        setError(data.error || 'Signup failed')
      }
    } catch (err) {
      setError('Network error')
    }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Sign Up | SafeSphere</title></Head>
      <div style={s.page}>
        <div style={s.card}>
          <Link href="/" style={s.back}>← Home</Link>
          <h1 style={s.title}>Join SafeSphere</h1>
          <p style={s.sub}>Create your emergency guardian account</p>
          {error && <div style={s.err}>{error}</div>}
          <form onSubmit={handleSignup} style={s.form}>
            <input style={s.input} placeholder="Username *" onChange={e => update('username', e.target.value)} required />
            <input style={s.input} type="password" placeholder="Password *" onChange={e => update('password', e.target.value)} required />
            <input style={s.input} placeholder="Full Name" onChange={e => update('name', e.target.value)} />
            <input style={s.input} type="email" placeholder="Email" onChange={e => update('email', e.target.value)} />
            <input style={s.input} type="tel" placeholder="Phone" onChange={e => update('phone', e.target.value)} />
            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <p style={s.footer}>Already have an account? <Link href="/login" style={s.link}>Login</Link></p>
        </div>
      </div>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#111827', padding: '2.5rem', borderRadius: '1rem', width: '100%', maxWidth: 420, border: '1px solid rgba(255,255,255,0.08)' },
  back: { color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 },
  title: { fontSize: '1.75rem', fontWeight: 800, marginTop: '1.5rem', color: '#fff' },
  sub: { color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' },
  err: { background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid rgba(239,68,68,0.2)' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  input: { padding: '0.85rem 1rem', borderRadius: '0.5rem', background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', outline: 'none' },
  btn: { padding: '0.9rem', borderRadius: '0.5rem', background: '#3b82f6', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' },
  footer: { marginTop: '1.5rem', color: '#64748b', fontSize: '0.85rem', textAlign: 'center' },
  link: { color: '#3b82f6', fontWeight: 600 },
}
