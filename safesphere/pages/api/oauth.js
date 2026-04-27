import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'safesphere_secret_2024';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Mock OAuth: In production, redirect to Google/Facebook OAuth flow
  const { provider } = req.body;
  const mockUser = {
    id: `oauth_${provider}_${Date.now()}`,
    username: `${provider}_user_${Math.random().toString(36).slice(2, 6)}`,
    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    email: `user@${provider}.com`,
  };

  if (!global._users) global._users = [];
  global._users.push({ ...mockUser, password_hash: '' });

  const token = jwt.sign({ id: mockUser.id, username: mockUser.username }, JWT_SECRET, { expiresIn: '7d' });
  return res.status(200).json({ token, user: mockUser });
}
