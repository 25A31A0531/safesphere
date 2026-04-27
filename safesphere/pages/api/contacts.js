import { v4 as uuidv4 } from 'uuid';

if (!global._contacts) {
  global._contacts = [
    { id: uuidv4(), name: 'City General Hospital', phone: '112-EXT-1', email: 'emergency@citygeneral.com', type: 'hospital' },
    { id: uuidv4(), name: 'Central Fire Station', phone: '101', email: '', type: 'fire_station' },
    { id: uuidv4(), name: 'Emergency Services', phone: '112', email: '', type: 'police' },
  ];
}

export default async function handler(req, res) {
  const { method, query, body } = req;

  if (method === 'GET') {
    return res.status(200).json({ contacts: global._contacts });
  }

  if (method === 'POST') {
    const { name, phone, email, type } = body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
    const contact = { id: uuidv4(), name, phone, email: email || '', type: type || 'family' };
    global._contacts.push(contact);
    return res.status(201).json({ contact });
  }

  if (method === 'PUT') {
    const { id } = query;
    const idx = global._contacts.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Contact not found' });
    global._contacts[idx] = { ...global._contacts[idx], ...body };
    return res.status(200).json({ contact: global._contacts[idx] });
  }

  if (method === 'DELETE') {
    const { id } = query;
    const before = global._contacts.length;
    global._contacts = global._contacts.filter(c => c.id !== id);
    if (global._contacts.length === before) return res.status(404).json({ error: 'Contact not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
