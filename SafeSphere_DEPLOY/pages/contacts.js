import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: 'family' })
  const [editing, setEditing] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    const res = await fetch('/api/contacts')
    setContacts(await res.json())
  }

  const save = async (e) => {
    e.preventDefault()
    if (editing) {
      await fetch('/api/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, contact_id: editing })
      })
      setEditing(null)
    } else {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setForm({ name: '', phone: '', email: '', type: 'family' })
    load()
  }

  const del = async (id) => {
    await fetch(`/api/contacts?contact_id=${id}`, { method: 'DELETE' })
    load()
  }

  const edit = (c) => {
    setEditing(c.contact_id)
    setForm({ name: c.name, phone: c.phone, email: c.email || '', type: c.type })
  }

  const typeColors = { family: '#3b82f6', hospital: '#10b981', fire_station: '#f59e0b' }
  const typeLabels = { family: 'Family', hospital: 'Hospital', fire_station: 'Fire Station' }

  return (
    <>
      <Head><title>Emergency Contacts | SafeSphere</title></Head>
      <div style={s.page}>
        <div style={s.container}>
          <Link href="/" style={s.back}>← Home</Link>
          <h1 style={s.title}>Emergency Contacts</h1>

          <form onSubmit={save} style={s.form}>
            <div style={s.row}>
              <input style={{...s.input, flex: 2}} placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <input style={{...s.input, flex: 2}} placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
            </div>
            <div style={s.row}>
              <input style={{...s.input, flex: 2}} placeholder="Email (optional)" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <select style={{...s.input, flex: 1}} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="family">Family</option>
                <option value="hospital">Hospital</option>
                <option value="fire_station">Fire Station</option>
              </select>
              <button style={s.addBtn} type="submit">{editing ? 'Update' : '+ Add'}</button>
            </div>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', phone: '', email: '', type: 'family' }) }} style={s.cancelBtn}>Cancel Edit</button>}
          </form>

          <div style={s.list}>
            {contacts.length === 0 && <p style={s.empty}>No contacts yet. Add one above.</p>}
            {contacts.map(c => (
              <div key={c.contact_id} style={s.card}>
                <div>
                  <div style={s.cardHeader}>
                    <strong style={{ color: '#fff' }}>{c.name}</strong>
                    <span style={{...s.badge, background: `${typeColors[c.type]}22`, color: typeColors[c.type], borderColor: `${typeColors[c.type]}44`}}>{typeLabels[c.type] || c.type}</span>
                  </div>
                  <p style={s.cardSub}>{c.phone}{c.email ? ` · ${c.email}` : ''}</p>
                </div>
                <div style={s.cardActions}>
                  <button onClick={() => edit(c)} style={s.editBtn}>Edit</button>
                  <button onClick={() => del(c.contact_id)} style={s.delBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const s = {
  page: { minHeight: '100vh', padding: '2rem' },
  container: { maxWidth: 700, margin: '0 auto' },
  back: { color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 },
  title: { fontSize: '1.75rem', fontWeight: 800, margin: '1.5rem 0 2rem', color: '#fff' },
  form: { background: '#111827', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.06)' },
  row: { display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' },
  input: { padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', outline: 'none', minWidth: 120 },
  addBtn: { padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: '#3b82f6', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' },
  cancelBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' },
  list: {},
  empty: { color: '#475569', textAlign: 'center', padding: '3rem' },
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111827', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' },
  badge: { fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 999, border: '1px solid', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardSub: { color: '#64748b', fontSize: '0.85rem' },
  cardActions: { display: 'flex', gap: '0.5rem' },
  editBtn: { padding: '0.4rem 1rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 },
  delBtn: { padding: '0.4rem 1rem', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 },
}
