// GET/POST/PUT/DELETE /api/contacts
import { v4 as uuidv4 } from 'uuid';

if (!global._ss_contacts) {
  global._ss_contacts = [
    { contact_id: uuidv4(), name: 'Mom', phone: '+91 8885242624', email: 'mom@email.com', type: 'family' },
    { contact_id: uuidv4(), name: 'Dad', phone: '+91 9876543210', email: 'dad@email.com', type: 'family' },
    { contact_id: uuidv4(), name: 'City General Hospital', phone: '112-EXT-1', email: 'er@citygeneral.com', type: 'hospital' },
    { contact_id: uuidv4(), name: 'Sector 4 Fire Station', phone: '101-EXT-1', email: 'dispatch@fire4.com', type: 'fire_station' },
    { contact_id: uuidv4(), name: 'Paramedics Unit', phone: '108', email: 'dispatch@ems.com', type: 'hospital' },
  ];
}

export default function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json({ contacts: global._ss_contacts });

  if (req.method === 'POST') {
    const { name, phone, email, type } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Name required' });
    const contact = { contact_id: uuidv4(), name, phone: phone || '', email: email || '', type: type || 'family' };
    global._ss_contacts.push(contact);
    return res.status(201).json({ contact });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const idx = global._ss_contacts.findIndex(c => c.contact_id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    global._ss_contacts[idx] = { ...global._ss_contacts[idx], ...req.body };
    return res.status(200).json({ contact: global._ss_contacts[idx] });
  }

  if (req.method === 'DELETE') {
    global._ss_contacts = global._ss_contacts.filter(c => c.contact_id !== id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
