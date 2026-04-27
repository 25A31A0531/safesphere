import Link from 'next/link';
import { useRouter } from 'next/router';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊', key: 'dashboard' },
  { href: '/triggers', label: 'Triggers', icon: '🚨', key: 'triggers' },
  { href: '/contacts', label: 'Contacts', icon: '👥', key: 'contacts' },
  { href: '/settings', label: 'Settings', icon: '⚙️', key: 'settings' },
];

export default function Nav({ active, user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    router.push('/');
  };

  return (
    <nav className="nav">
      <Link href="/dashboard" className="nav-logo" style={{ textDecoration: 'none' }}>
        <div className="shield-icon" style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#ef4444,#f97316)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🛡️</div>
        <span>Safe<span style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sphere</span></span>
      </Link>

      <ul className="nav-links">
        {LINKS.map(l => (
          <li key={l.key}>
            <Link href={l.href} className={`nav-link ${active === l.key ? 'active' : ''}`}>
              {l.icon} {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#ef4444,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
            {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'none' }} className="name-label">{user?.name || user?.username}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign Out</button>
      </div>
    </nav>
  );
}
