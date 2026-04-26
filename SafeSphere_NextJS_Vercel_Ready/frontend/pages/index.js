import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>SafeSphere | Emergency Guardian</title>
        <meta name="description" content="AI-Powered Emergency Detection" />
      </Head>

      <main className="hero">
        <div className="badge">AI-POWERED PROTECTION</div>
        <h1>Your Personal <span className="highlight">Emergency Guardian</span></h1>
        <p>Real-time detection, instant alerts, and dual-telemetry monitoring for road accidents and fire hazards.</p>
        
        <div className="actions">
          <Link href="/login" className="btn btn-primary">Login</Link>
          <Link href="/signup" className="btn btn-secondary">Sign Up</Link>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          color: white;
          font-family: 'Inter', sans-serif;
        }
        .hero {
          text-align: center;
          max-width: 800px;
          padding: 2rem;
        }
        h1 { font-size: 4rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.1; }
        .highlight { background: linear-gradient(135deg, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { font-size: 1.25rem; color: #94a3b8; margin-bottom: 2.5rem; }
        .badge { display: inline-block; padding: 0.5rem 1rem; background: rgba(59, 130, 246, 0.1); color: #60a5fa; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; margin-bottom: 1rem; border: 1px solid rgba(59, 130, 246, 0.2); }
        .actions { display: flex; gap: 1rem; justify-content: center; }
        .btn { padding: 1rem 2.5rem; border-radius: 0.75rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; transform: translateY(-2px); }
        .btn-secondary { background: rgba(255, 255, 255, 0.05); color: white; border: 1px solid rgba(255, 255, 255, 0.1); }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }
      `}</style>
    </div>
  )
}
