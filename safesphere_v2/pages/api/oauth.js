// GET/POST /api/oauth?provider=google|facebook — mock OAuth, issues JWT
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
const JWT_SECRET = process.env.JWT_SECRET || 'safesphere_dev_secret';

export default function handler(req, res) {
  const provider = req.query.provider || req.body?.provider || 'google';
  const mockUser = { id: uuidv4(), username: `${provider}_${Math.random().toString(36).slice(2,6)}`, name: `${provider.charAt(0).toUpperCase()+provider.slice(1)} User`, email: `user@${provider}.com` };
  if (!global._ss_users) global._ss_users = [];
  global._ss_users.push({ ...mockUser, password_hash: '' });
  const token = jwt.sign({ id: mockUser.id, username: mockUser.username }, JWT_SECRET, { expiresIn: '7d' });
  // For GET requests (direct link), redirect to dashboard with token in query
  if (req.method === 'GET') {
    return res.redirect(302, `/dashboard?token=${token}&user=${encodeURIComponent(JSON.stringify(mockUser))}`);
  }
  return res.status(200).json({ token, user: mockUser });
}
