import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();
  useEffect(() => { if (localStorage.getItem('ss_token')) router.push('/dashboard'); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    const errEl = document.getElementById('login-error');
    errEl.classList.add('hidden');
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (!res.ok) { errEl.textContent = data.error || 'Invalid credentials'; errEl.classList.remove('hidden'); return; }
      localStorage.setItem('ss_token', data.token);
      localStorage.setItem('ss_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch { errEl.textContent = 'Network error.'; errEl.classList.remove('hidden'); }
  };

  return (
    <>
      <Head><title>Login - SafeSphere</title></Head>
      <header className="navbar glass" role="banner">
        <a href="/" className="logo" style={{textDecoration:'none'}}><div className="logo-icon"><i className="ph-fill ph-shield-check"></i></div><span>SafeSphere</span></a>
        <nav><ul className="nav-links"><li><a href="/login" className="btn-secondary">Login</a></li><li><a href="/register" className="btn-primary">Get Started</a></li></ul></nav>
      </header>
      <main role="main">
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-card glass glow-border">
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Login to access the SafeSphere Dashboard</p>
              </div>
              <div id="login-error" className="alert alert-error hidden"></div>
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-icon">
                    <i className="ph ph-user"></i>
                    <input type="text" id="username" name="username" placeholder="Enter your username" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-icon">
                    <i className="ph ph-lock"></i>
                    <input type="password" id="password" name="password" placeholder="Enter your password" required />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-100 mt-4">Secure Login <i className="ph ph-arrow-right"></i></button>
              </form>
              <div style={{textAlign:'right',marginTop:'10px'}}>
                <a href="/forgot-password" className="text-gray" style={{fontSize:'0.9rem'}}>Forgot Password?</a>
              </div>
              <div className="auth-separator" style={{textAlign:'center',margin:'30px 0 20px',position:'relative'}}>
                <hr style={{borderColor:'rgba(255,255,255,0.1)'}} />
                <span style={{background:'var(--surface-color)',padding:'0 15px',position:'absolute',top:'-10px',left:'50%',transform:'translateX(-50%)',fontSize:'0.9rem'}}>or sign in with</span>
              </div>
              <div className="social-logins" style={{display:'flex',gap:'10px',flexDirection:'column'}}>
                <a href="/api/oauth?provider=google" className="btn-secondary w-100" style={{color:'var(--text-light)',borderColor:'var(--text-main)'}}>
                  <i className="ph-fill ph-google-logo text-danger" style={{marginRight:'10px'}}></i> Google
                </a>
                <a href="/api/oauth?provider=facebook" className="btn-secondary w-100" style={{color:'var(--text-light)',borderColor:'var(--text-main)'}}>
                  <i className="ph-fill ph-facebook-logo text-primary" style={{marginRight:'10px'}}></i> Facebook
                </a>
              </div>
              <div className="auth-footer mt-4" style={{textAlign:'center'}}>
                Don&apos;t have an account? <a href="/register" className="text-accent">Get Started</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
