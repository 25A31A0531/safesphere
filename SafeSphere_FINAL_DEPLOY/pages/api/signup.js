const bcrypt = require('bcryptjs');
const store = require('../../lib/store');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password, name, email, phone } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (store.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: store.users.length + 1,
    username,
    password_hash: hashed,
    name: name || '',
    email: email || '',
    phone: phone || ''
  };

  store.users.push(newUser);
  return res.status(200).json({ status: 'Account created successfully' });
}
