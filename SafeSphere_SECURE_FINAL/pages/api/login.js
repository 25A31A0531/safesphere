const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../../lib/store');

const SECRET = 'safesphere_hackathon_secret_2024';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = store.users.find(u => u.username === username);

  // For the demo account, accept password "demo"
  if (user && user.username === 'demo' && password === 'demo') {
    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET, { expiresIn: '24h' });
    return res.status(200).json({ token, user: { id: user.id, username: user.username, name: user.name } });
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, SECRET, { expiresIn: '24h' });
  return res.status(200).json({ token, user: { id: user.id, username: user.username, name: user.name } });
}
