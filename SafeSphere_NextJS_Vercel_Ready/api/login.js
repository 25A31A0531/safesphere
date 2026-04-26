const { getDb } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super_secret_hackathon_key';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { username, password } = req.body;
    const db = getDb();

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '24h' });
        res.status(200).json({ token, user: { id: user.id, username: user.username } });
    });
}
