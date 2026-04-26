import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/status')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error')
    }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Login | SafeSphere</title></Head>
      <div style={s.page}>
        <div style={s.card}>
          <Link href="/" style={s.back}>← Home</Link>
          <h1 style={s.title}>Welcome Back</h1>
          <p style={s.sub}>Sign in to your SafeSphere account</p>
          {error && <div style={s.err}>{error}</div>}
          <form onSubmit={handleLogin} style={s.form}>
            <input style={s.input} type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <input style={s.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          </form>
          <p style={s.footer}>No account? <Link href="/signup" style={s.link}>Sign up</Link></p>
          <p style={s.hint}>Demo: <strong>demo / demo</strong></p>
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
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.85rem 1rem', borderRadius: '0.5rem', background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', outline: 'none' },
  btn: { padding: '0.9rem', borderRadius: '0.5rem', background: '#3b82f6', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' },
  footer: { marginTop: '1.5rem', color: '#64748b', fontSize: '0.85rem', textAlign: 'center' },
  link: { color: '#3b82f6', fontWeight: 600 },
  hint: { marginTop: '0.75rem', color: '#334155', fontSize: '0.75rem', textAlign: 'center' },
}
