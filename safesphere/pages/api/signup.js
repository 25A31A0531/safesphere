import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'safesphere_secret_2024';

if (!global._users) {
  global._users = [];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password, name, email, phone } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const exists = global._users.find(u => u.username === username);
  if (exists) return res.status(409).json({ error: 'Username already taken' });

  const password_hash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), username, name: name || username, email: email || '', phone: phone || '', password_hash, created_at: new Date().toISOString() };
  global._users.push(user);

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: { id: user.id, username: user.username, name: user.name, email: user.email } });
}
