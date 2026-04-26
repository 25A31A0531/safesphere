const { v4: uuidv4 } = require('uuid');
const store = require('../../lib/store');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(store.contacts);
  }

  if (req.method === 'POST') {
    const { name, phone, email, type } = req.body || {};
    const newContact = {
      contact_id: uuidv4(),
      name: name || '',
      phone: phone || '',
      email: email || '',
      type: type || 'family'
    };
    store.contacts.push(newContact);
    return res.status(200).json({ status: 'Contact added', contact_id: newContact.contact_id });
  }

  if (req.method === 'PUT') {
    const { contact_id, name, phone, email, type } = req.body || {};
    const idx = store.contacts.findIndex(c => c.contact_id === contact_id);
    if (idx === -1) return res.status(404).json({ error: 'Contact not found' });
    store.contacts[idx] = { contact_id, name, phone, email, type };
    return res.status(200).json({ status: 'Contact updated' });
  }

  if (req.method === 'DELETE') {
    const { contact_id } = req.query;
    store.contacts = store.contacts.filter(c => c.contact_id !== contact_id);
    return res.status(200).json({ status: 'Contact deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
