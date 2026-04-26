const { getDb } = require('./db');
const { v4: uuidv4 } = require('uuid');

export default async function handler(req, res) {
    const db = getDb();

    if (req.method === 'GET') {
        db.all(`SELECT * FROM events ORDER BY timestamp_utc DESC LIMIT 50`, (err, rows) => {
            res.status(200).json(rows || []);
        });
    } else if (req.method === 'POST') {
        const data = req.body;
        const event_id = data.event_id || uuidv4();
        const timestamp_utc = data.timestamp_utc || new Date().toISOString();
        
        // Mock delivered_to logic
        let delivered_to = "None (Canceled)";
        if (!data.canceled) {
            delivered_to = JSON.stringify(["Hospital", "Emergency Services"]);
        }

        db.run(`INSERT INTO events (event_id, timestamp_utc, local_timestamp, area_name, event_type, severity, canceled, accel_peak, speed_before, speed_after, fire_confidence, fallback_sent, delivered_to)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [event_id, timestamp_utc, data.local_timestamp || timestamp_utc, data.area_name || "Unknown", data.event_type, data.severity, data.canceled || 0, data.accel_peak || 0, data.speed_before || 0, data.speed_after || 0, data.fire_confidence || 0, data.fallback_sent || 0, delivered_to],
            function(err) {
                res.status(200).json({ status: 'Event logged', event_id });
            }
        );
    }
}
