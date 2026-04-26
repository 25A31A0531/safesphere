import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [newContact, setNewContact] = useState({ name: '', phone: '', type: 'family' })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    setContacts(data)
  }

  const addContact = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newContact)
    })
    setNewContact({ name: '', phone: '', type: 'family' })
    fetchContacts()
  }

  const deleteContact = async (id) => {
    const token = localStorage.getItem('token')
    await fetch(`/api/contacts?contact_id=${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchContacts()
  }

  return (
    <div className="container">
      <Head><title>Emergency Contacts | SafeSphere</title></Head>
      <nav><Link href="/">← Home</Link></nav>
      <main>
        <h1>Emergency Contacts</h1>
        
        <form onSubmit={addContact} className="add-form">
          <input type="text" placeholder="Name" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} required />
          <input type="text" placeholder="Phone" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} required />
          <select value={newContact.type} onChange={e => setNewContact({...newContact, type: e.target.value})}>
            <option value="family">Family</option>
            <option value="hospital">Hospital</option>
            <option value="fire_station">Fire Station</option>
          </select>
          <button type="submit">Add Contact</button>
        </form>

        <div className="list">
          {contacts.map(c => (
            <div key={c.contact_id} className="card">
              <div>
                <strong>{c.name}</strong>
                <span className="badge">{c.type}</span>
                <p>{c.phone}</p>
              </div>
              <button onClick={() => deleteContact(c.contact_id)} className="btn-delete">Delete</button>
            </div>
          ))}
        </div>
      </main>
      <style jsx>{`
        .container { min-height: 100vh; background: #0f172a; color: white; padding: 2rem; font-family: 'Inter', sans-serif; }
        nav { margin-bottom: 2rem; }
        nav a { color: #3b82f6; text-decoration: none; }
        main { max-width: 600px; margin: 0 auto; }
        h1 { margin-bottom: 2rem; }
        .add-form { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem; background: #1e293b; padding: 1.5rem; border-radius: 0.5rem; }
        input, select { padding: 0.8rem; background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); color: white; border-radius: 0.4rem; }
        button { padding: 0.8rem; background: #3b82f6; color: white; border: none; border-radius: 0.4rem; font-weight: 600; cursor: pointer; }
        .card { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 1.2rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid rgba(255, 255, 255, 0.05); }
        .badge { font-size: 0.7rem; background: rgba(59, 130, 246, 0.2); color: #3b82f6; padding: 0.2rem 0.5rem; border-radius: 1rem; margin-left: 0.5rem; text-transform: uppercase; }
        p { color: #94a3b8; margin: 0.5rem 0 0; }
        .btn-delete { background: rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 0.8rem; padding: 0.5rem 1rem; }
      `}</style>
    </div>
  )
}
