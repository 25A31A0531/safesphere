import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';

const TYPE_LABELS = { family: { label: 'Family', icon: '👨‍👩‍👧', color: 'badge-blue' }, hospital: { label: 'Hospital', icon: '🏥', color: 'badge-green' }, fire_station: { label: 'Fire Station', icon: '🚒', color: 'badge-orange' }, police: { label: 'Police', icon: '👮', color: 'badge-yellow' } };
const EMPTY_FORM = { name: '', phone: '', email: '', type: 'family' };

export default function Contacts() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    const u = localStorage.getItem('ss_user');
    if (!token || !u) { router.push('/'); return; }
    setUser(JSON.parse(u));
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) { const data = await res.json(); setContacts(data.contacts || []); }
    } catch {}
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal('add'); };
  const openEdit = (c) => { setForm({ name: c.name, phone: c.phone, email: c.email || '', type: c.type }); setEditId(c.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); setEditId(null); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.phone) return;
    setLoading(true);
    try {
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const url = modal === 'edit' ? `/api/contacts?id=${editId}` : '/api/contacts';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { await fetchContacts(); closeModal(); setMsg(modal === 'edit' ? 'Contact updated!' : 'Contact added!'); setTimeout(() => setMsg(''), 3000); }
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
      setContacts(prev => prev.filter(c => c.id !== id));
      setMsg('Contact deleted.'); setTimeout(() => setMsg(''), 3000);
    } catch {}
  };

  const filtered = contacts.filter(c => {
    const matchType = filterType === 'all' || c.type === filterType;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    return matchType && matchSearch;
  });

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Emergency Contacts — SafeSphere</title>
        <meta name="description" content="Manage your emergency contacts for SafeSphere alerts." />
      </Head>
      <div className="page-wrapper">
        <Nav active="contacts" user={user} />
        <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
          <div className="page-header" style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 className="page-title">Emergency Contacts</h1>
                <p className="page-description">Manage who gets notified when an emergency is detected</p>
              </div>
              <button className="btn btn-primary" onClick={openAdd}>+ Add Contact</button>
            </div>
          </div>

          {msg && <div className="alert alert-success">{msg}</div>}

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <input className="form-input" placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'family', 'hospital', 'fire_station', 'police'].map(t => (
                <button key={t} onClick={() => setFilterType(t)} className="btn btn-sm"
                  style={{ background: filterType === t ? 'var(--gradient-primary)' : 'var(--bg-card)', color: filterType === t ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                  {t === 'all' ? 'All' : TYPE_LABELS[t]?.label || t}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: 24 }}>
            {[{ type: 'all', label: 'Total', icon: '👥' }, { type: 'family', label: 'Family', icon: '👨‍👩‍👧' }, { type: 'hospital', label: 'Hospitals', icon: '🏥' }, { type: 'fire_station', label: 'Fire Stations', icon: '🚒' }].map(s => (
              <div key={s.type} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilterType(s.type)}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{s.type === 'all' ? contacts.length : contacts.filter(c => c.type === s.type).length}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Contact List */}
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>No contacts found</div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>Add emergency contacts to receive SOS alerts when an emergency is detected.</div>
              <button className="btn btn-primary" onClick={openAdd}>+ Add First Contact</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((c) => {
                const info = TYPE_LABELS[c.type] || { label: c.type, icon: '📞', color: 'badge-blue' };
                return (
                  <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{info.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{c.name}</div>
                        <span className={`badge ${info.color}`}>{info.label}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>📞 {c.phone}</div>
                        {c.email && <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>✉️ {c.email}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                      <button className="btn btn-sm" onClick={() => handleDelete(c.id)} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.2)' }}>🗑️ Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{modal === 'edit' ? 'Edit Contact' : 'Add Contact'}</div>
            <div className="modal-subtitle">{modal === 'edit' ? 'Update contact information' : 'Add a new emergency contact'}</div>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-input" name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" placeholder="email@example.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" name="type" value={form.type} onChange={handleChange}>
                <option value="family">👨‍👩‍👧 Family</option>
                <option value="hospital">🏥 Hospital</option>
                <option value="fire_station">🚒 Fire Station</option>
                <option value="police">👮 Police</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading || !form.name || !form.phone}>
                {loading ? <span className="spinner" /> : (modal === 'edit' ? 'Save Changes' : 'Add Contact')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}