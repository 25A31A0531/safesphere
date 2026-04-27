import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const errEl = document.getElementById('reg-error');
    errEl.classList.add('hidden');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username.value, password: form.password.value, name: form.name.value, email: form.email.value, phone: form.phone.value }),
      });
      const data = await res.json();
      if (!res.ok) { errEl.textContent = data.error || 'Registration failed'; errEl.classList.remove('hidden'); return; }
      localStorage.setItem('ss_token', data.token);
      localStorage.setItem('ss_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch { errEl.textContent = 'Network error.'; errEl.classList.remove('hidden'); }
  };

  return (
    <>
      <Head><title>Register - SafeSphere</title></Head>
      <header className="navbar glass">
        <a href="/" className="logo" style={{textDecoration:'none'}}><div className="logo-icon"><i className="ph-fill ph-shield-check"></i></div><span>SafeSphere</span></a>
        <nav><ul className="nav-links"><li><a href="/login" className="btn-secondary">Login</a></li><li><a href="/register" className="btn-primary">Get Started</a></li></ul></nav>
      </header>
      <main role="main">
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-card glass glow-border">
              <div className="auth-header">
                <h2>Create Account</h2>
                <p>Join the Universal AI Emergency Response System</p>
              </div>
              <div id="reg-error" className="alert alert-error hidden"></div>
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group"><label htmlFor="name">Full Name</label><div className="input-icon"><i className="ph ph-identification-card"></i><input type="text" id="name" name="name" placeholder="John Doe" required /></div></div>
                <div className="form-group"><label htmlFor="email">Email Address</label><div className="input-icon"><i className="ph ph-envelope"></i><input type="email" id="email" name="email" placeholder="john@example.com" required /></div></div>
                <div className="form-group"><label htmlFor="phone">Phone Number</label><div className="input-icon"><i className="ph ph-phone"></i><input type="tel" id="phone" name="phone" placeholder="+1 234 567 8900" required /></div></div>
                <div className="form-group"><label htmlFor="username">Choose Username</label><div className="input-icon"><i className="ph ph-user-plus"></i><input type="text" id="username" name="username" placeholder="Unique username" required /></div></div>
                <div className="form-group"><label htmlFor="password">Secure Password</label><div className="input-icon"><i className="ph ph-lock-key"></i><input type="password" id="password" name="password" placeholder="Strong password" required /></div></div>
                <button type="submit" className="btn-primary w-100 mt-4">Register System <i className="ph ph-arrow-right"></i></button>
              </form>
              <div className="auth-separator" style={{textAlign:'center',margin:'30px 0 20px',position:'relative'}}>
                <hr style={{borderColor:'rgba(255,255,255,0.1)'}} />
                <span style={{background:'var(--surface-color)',padding:'0 15px',position:'absolute',top:'-10px',left:'50%',transform:'translateX(-50%)',fontSize:'0.9rem'}}>or sign up with</span>
              </div>
              <div className="social-logins" style={{display:'flex',gap:'10px',flexDirection:'column'}}>
                <a href="/api/oauth?provider=google" className="btn-secondary w-100" style={{color:'var(--text-light)',borderColor:'var(--text-main)'}}><i className="ph-fill ph-google-logo text-danger" style={{marginRight:'10px'}}></i> Google</a>
                <a href="/api/oauth?provider=facebook" className="btn-secondary w-100" style={{color:'var(--text-light)',borderColor:'var(--text-main)'}}><i className="ph-fill ph-facebook-logo text-primary" style={{marginRight:'10px'}}></i> Facebook</a>
              </div>
              <div className="auth-footer mt-4" style={{textAlign:'center'}}>
                Already have an account? <a href="/login" className="text-accent">Login</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
