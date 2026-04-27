import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return; }
      localStorage.setItem('ss_token', data.token);
      localStorage.setItem('ss_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    // For demo: mock OAuth by creating a session-like token in localStorage
    const mockUser = { id: `oauth_${provider}_001`, username: `${provider}_user`, name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User` };
    localStorage.setItem('ss_token', 'mock_oauth_token_' + provider);
    localStorage.setItem('ss_user', JSON.stringify(mockUser));
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>SafeSphere — Emergency Detection System</title>
        <meta name="description" content="AI-powered emergency detection system. Stay safe with real-time alerts, live telemetry, and instant SOS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Left Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
          {/* Background glow */}
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
              <div className="nav-logo shield-icon" style={{ width: 48, height: 48, fontSize: '1.4rem', borderRadius: 12 }}>🛡️</div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  Safe<span style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sphere</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Emergency Detection System</div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, marginBottom: 32 }}>
              {['login', 'signup'].map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(''); }}
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                    background: mode === m ? 'linear-gradient(135deg,#ef4444,#f97316)' : 'transparent',
                    color: mode === m ? 'white' : 'var(--text-muted)' }}>
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* OAuth Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              <button onClick={() => handleOAuth('google')} className="btn btn-secondary btn-full btn-lg" style={{ justifyContent: 'center', gap: 12 }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/><path fill="#4285F4" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/><path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/></svg>
                Continue with Google
              </button>
              <button onClick={() => handleOAuth('facebook')} className="btn btn-secondary btn-full btn-lg" style={{ justifyContent: 'center', gap: 12 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Continue with Facebook
              </button>
            </div>

            <div className="divider-text">or {mode === 'login' ? 'sign in' : 'sign up'} with email</div>

            {/* Form */}
            {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
                  </div>
                </>
              )}
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" name="username" placeholder="Enter username" value={form.username} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? <><span className="spinner" /> Processing...</> : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel — Hero */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(249,115,22,0.04) 100%)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}
          className="hide-mobile">
          <div style={{ position: 'absolute', top: '10%', right: '10%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(239,68,68,0.12), transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 150, height: 150, background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)', borderRadius: '50%' }} />

          <div style={{ textAlign: 'center', maxWidth: 480, position: 'relative' }}>
            <div style={{ fontSize: '5rem', marginBottom: 24, animation: 'float 3s ease-in-out infinite' }}>🛡️</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
              Your AI-Powered<br />
              <span style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Safety Guardian</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, fontSize: '1rem' }}>
              Real-time accident detection, fire alerts, and instant SOS — powered by AI, protecting lives 24/7.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
              {[
                { icon: '🎯', title: 'AI Accident Detection', desc: 'TensorFlow.js detects road accidents in real-time' },
                { icon: '🔥', title: 'Fire & Smoke Alerts', desc: 'Instant detection and emergency service dispatch' },
                { icon: '📍', title: 'Live GPS Tracking', desc: 'Real-time location shared with emergency contacts' },
                { icon: '📞', title: 'Instant Alerts', desc: 'SMS alerts sent to your emergency contacts via Twilio' },
              ].map((f) => (
                <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
                  <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
      `}</style>
    </>
  );
}