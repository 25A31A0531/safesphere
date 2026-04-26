import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>SafeSphere — AI Emergency Guardian</title>
        <meta name="description" content="AI-Powered Emergency Detection & Response System" />
      </Head>
      <div style={styles.page}>
        <div style={styles.glow}></div>
        <main style={styles.hero}>
          <span style={styles.badge}>🛡️ AI-POWERED PROTECTION</span>
          <h1 style={styles.title}>
            Safe<span style={styles.accent}>Sphere</span>
          </h1>
          <p style={styles.subtitle}>
            Real-time accident detection, fire monitoring, and instant emergency alerts — all in one guardian system.
          </p>

          <div style={styles.authRow}>
            <Link href="/login" style={styles.btnPrimary}>Login</Link>
            <Link href="/signup" style={styles.btnOutline}>Sign Up</Link>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.navGrid}>
            <Link href="/status" style={styles.navCard}>
              <span style={styles.navIcon}>📡</span>
              <span style={styles.navLabel}>System Status</span>
            </Link>
            <Link href="/triggers" style={styles.navCard}>
              <span style={styles.navIcon}>🚨</span>
              <span style={styles.navLabel}>SOS Triggers</span>
            </Link>
            <Link href="/contacts" style={styles.navCard}>
              <span style={styles.navIcon}>📋</span>
              <span style={styles.navLabel}>Contacts</span>
            </Link>
            <Link href="/dashboard" style={styles.navCard}>
              <span style={styles.navIcon}>📊</span>
              <span style={styles.navLabel}>Live Telemetry</span>
            </Link>
          </div>

          <p style={styles.demo}>Demo credentials: <strong>demo / demo</strong></p>
        </main>
      </div>
    </>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '2rem' },
  glow: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)', top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' },
  hero: { textAlign: 'center', maxWidth: 700, zIndex: 1 },
  badge: { display: 'inline-block', padding: '0.5rem 1.25rem', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, border: '1px solid rgba(59,130,246,0.2)', marginBottom: '1.5rem' },
  title: { fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.25rem', color: '#fff' },
  accent: { background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 550, marginLeft: 'auto', marginRight: 'auto' },
  authRow: { display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' },
  btnPrimary: { padding: '0.9rem 2.5rem', borderRadius: '0.6rem', background: '#3b82f6', color: '#fff', fontWeight: 700, fontSize: '1rem', transition: 'transform 0.15s', cursor: 'pointer' },
  btnOutline: { padding: '0.9rem 2.5rem', borderRadius: '0.6rem', background: 'transparent', color: '#e2e8f0', fontWeight: 700, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.15)', transition: 'transform 0.15s', cursor: 'pointer' },
  divider: { width: 60, height: 3, background: 'rgba(255,255,255,0.08)', margin: '0 auto 2.5rem', borderRadius: 2 },
  navGrid: { display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' },
  navCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.25rem 2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', transition: 'background 0.2s', cursor: 'pointer', minWidth: 140 },
  navIcon: { fontSize: '1.75rem' },
  navLabel: { fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' },
  demo: { fontSize: '0.8rem', color: '#475569' },
}
