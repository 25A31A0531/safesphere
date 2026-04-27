// In-memory user store (resets on cold start — fine for Vercel demo)
// For production, replace with Vercel Postgres / Supabase
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'safesphere_secret_2024';

// Shared store across requests in same warm instance
if (!global._users) {
  global._users = [
    { id: 'demo_001', username: 'demo', name: 'Demo User', email: 'demo@safesphere.ai', phone: '+91 9876543210',
      password_hash: bcrypt.hashSync('demo123', 10) }
  ];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

  const user = global._users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  return res.status(200).json({ token, user: { id: user.id, username: user.username, name: user.name, email: user.email } });
}
