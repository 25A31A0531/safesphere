import Head from 'next/head';
export default function ForgotPassword() {
  return (
    <>
      <Head><title>Forgot Password - SafeSphere</title></Head>
      <header className="navbar glass"><a href="/" className="logo" style={{textDecoration:'none'}}><div className="logo-icon"><i className="ph-fill ph-shield-check"></i></div><span>SafeSphere</span></a></header>
      <main role="main">
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-card glass glow-border">
              <div className="auth-header"><h2>Reset Password</h2><p>Enter your username to receive a reset link.</p></div>
              <form className="auth-form" onSubmit={e=>{e.preventDefault();alert('Reset link sent! (Demo mode — use demo/demo123 to login)');}}>
                <div className="form-group"><label htmlFor="username">Username</label><div className="input-icon"><i className="ph ph-user"></i><input type="text" id="username" name="username" placeholder="Your username" required /></div></div>
                <button type="submit" className="btn-primary w-100 mt-4">Send Reset Link <i className="ph ph-arrow-right"></i></button>
              </form>
              <div className="auth-footer mt-4" style={{textAlign:'center'}}><a href="/login" className="text-accent">← Back to Login</a></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
