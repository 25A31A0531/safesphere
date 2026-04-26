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
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error')
    }
    setLoading(false)
  }

  const handleSocial = (provider) => {
    // Mock OAuth — in production, integrate real Google/Facebook SDK
    localStorage.setItem('token', 'mock_' + provider + '_token')
    localStorage.setItem('user', JSON.stringify({ id: 99, username: provider + '_user', name: provider.charAt(0).toUpperCase() + provider.slice(1) + ' User' }))
    router.push('/dashboard')
  }

  return (
    <>
      <Head><title>Login | SafeSphere</title></Head>
      <div style={s.page}>
        <div style={s.card}>
          <Link href="/" style={s.back}>← Home</Link>
          <h1 style={s.title}>Welcome Back</h1>
          <p style={s.sub}>Sign in to your SafeSphere account</p>

          {/* Social Login */}
          <div style={s.socialRow}>
            <button onClick={() => handleSocial('google')} style={s.socialBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span>Google</span>
            </button>
            <button onClick={() => handleSocial('facebook')} style={{...s.socialBtn, background: '#1877F2', color: '#fff'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook</span>
            </button>
          </div>

          <div style={s.divider}><span style={s.dividerText}>or sign in with email</span></div>

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
  socialRow: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' },
  socialBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: '#fff', color: '#333', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  divider: { textAlign: 'center', marginBottom: '1.5rem', position: 'relative', height: 20 },
  dividerText: { background: '#111827', padding: '0 1rem', color: '#475569', fontSize: '0.8rem', position: 'relative', zIndex: 1 },
  err: { background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid rgba(239,68,68,0.2)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.85rem 1rem', borderRadius: '0.5rem', background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', outline: 'none' },
  btn: { padding: '0.9rem', borderRadius: '0.5rem', background: '#3b82f6', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' },
  footer: { marginTop: '1.5rem', color: '#64748b', fontSize: '0.85rem', textAlign: 'center' },
  link: { color: '#3b82f6', fontWeight: 600 },
  hint: { marginTop: '0.75rem', color: '#334155', fontSize: '0.75rem', textAlign: 'center' },
}
