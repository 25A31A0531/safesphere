const { getDb } = require('./db');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const SECRET_KEY = 'super_secret_hackathon_key';

export default async function handler(req, res) {
    // Basic auth check
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY);
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    const db = getDb();

    if (req.method === 'GET') {
        db.all(`SELECT * FROM contacts ORDER BY type, name`, (err, rows) => {
            res.status(200).json(rows || []);
        });
    } else if (req.method === 'POST') {
        const { name, phone, email, type } = req.body;
        const id = uuidv4();
        db.run(`INSERT INTO contacts (contact_id, name, phone, email, type) VALUES (?, ?, ?, ?, ?)`,
            [id, name, phone, email, type || 'family'],
            function(err) {
                res.status(200).json({ status: 'Contact added', contact_id: id });
            }
        );
    } else if (req.method === 'PUT') {
        const { contact_id, name, phone, email, type } = req.body;
        db.run(`UPDATE contacts SET name=?, phone=?, email=?, type=? WHERE contact_id=?`,
            [name, phone, email, type, contact_id],
            function(err) {
                res.status(200).json({ status: 'Contact updated' });
            }
        );
    } else if (req.method === 'DELETE') {
        const { contact_id } = req.query;
        db.run(`DELETE FROM contacts WHERE contact_id=?`, [contact_id], (err) => {
            res.status(200).json({ status: 'Contact deleted' });
        });
    }
}
