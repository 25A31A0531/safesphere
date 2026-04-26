import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <Head><title>SafeSphere | Emergency Guardian</title></Head>
      <main className="hero">
        <h1>SafeSphere <span className="highlight">Guardian</span></h1>
        <p>AI-Powered Emergency Response System</p>
        <div className="actions">
          <Link href="/login" className="btn btn-primary">Login</Link>
          <Link href="/signup" className="btn btn-secondary">Sign Up</Link>
        </div>
        <nav className="footer-nav">
            <Link href="/status">System Status</Link>
            <Link href="/triggers">SOS Triggers</Link>
            <Link href="/contacts">Contacts</Link>
        </nav>
      </main>
      <style jsx>{`
        .container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: white; font-family: 'Inter', sans-serif; }
        .hero { text-align: center; }
        h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; }
        .highlight { color: #3b82f6; }
        p { font-size: 1.2rem; color: #94a3b8; margin-bottom: 2rem; }
        .actions { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; }
        .btn { padding: 0.8rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-secondary { background: rgba(255, 255, 255, 0.1); color: white; }
        .footer-nav { display: flex; gap: 2rem; justify-content: center; font-size: 0.9rem; }
        .footer-nav a { color: #64748b; text-decoration: none; }
        .footer-nav a:hover { color: #3b82f6; }
      `}</style>
    </div>
  )
}
