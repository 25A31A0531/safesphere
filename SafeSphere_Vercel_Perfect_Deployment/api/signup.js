const { getDb } = require('./db');
const bcrypt = require('bcryptjs');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { username, password, name, email, phone } = req.body;
    const db = getDb();

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (username, password_hash, name, email, phone) VALUES (?, ?, ?, ?, ?)`, 
        [username, hashedPassword, name, email, phone], 
        function(err) {
            if (err) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            const userId = this.lastID;
            db.run(`INSERT INTO permissions (user_id, camera_enabled, video_preview_enabled, location_enabled, telemetry_enabled, fire_detection_enabled, bluetooth_enabled, alerts_enabled, language) 
                    VALUES (?, 1, 0, 1, 1, 0, 1, 1, 'en')`, [userId]);
            
            res.status(200).json({ status: 'User created' });
        }
    );
}
