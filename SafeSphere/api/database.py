import sqlite3

import os

def get_db():
    db_path = 'safesphere.db'
    if os.environ.get('VERCEL'):
        db_path = '/tmp/safesphere.db'
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    with conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT,
                email TEXT,
                phone TEXT
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS permissions (
                user_id INTEGER PRIMARY KEY,
                camera_enabled INTEGER DEFAULT 0,
                video_preview_enabled INTEGER DEFAULT 0,
                location_enabled INTEGER DEFAULT 0,
                telemetry_enabled INTEGER DEFAULT 0,
                fire_detection_enabled INTEGER DEFAULT 0,
                bluetooth_enabled INTEGER DEFAULT 0,
                alerts_enabled INTEGER DEFAULT 0,
                language TEXT DEFAULT 'en',
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS devices (
                id TEXT PRIMARY KEY,
                user_id INTEGER,
                name TEXT,
                status TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS events (
                event_id TEXT PRIMARY KEY,
                timestamp_utc TEXT NOT NULL,
                local_timestamp TEXT NOT NULL,
                area_name TEXT,
                event_type TEXT,
                severity TEXT,
                canceled INTEGER DEFAULT 0,
                accel_peak REAL,
                speed_before REAL,
                speed_after REAL,
                fire_confidence REAL,
                fallback_sent INTEGER DEFAULT 0,
                delivered_to TEXT
            )
        ''')
        # Contacts table for fallback routing
        # Contacts table exactly as per final spec
        conn.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                contact_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                type TEXT CHECK(type IN ('hospital','fire_station','family'))
            )
        ''')
        # Seed default contacts
        import uuid
        conn.execute("INSERT OR IGNORE INTO contacts (contact_id, name, phone, email, type) VALUES (?, 'Mom', '+91 8885242624', 'mom@email.com', 'family')", (str(uuid.uuid4()),))
        conn.execute("INSERT OR IGNORE INTO contacts (contact_id, name, phone, email, type) VALUES (?, 'Dad', '+91 9876543210', 'dad@email.com', 'family')", (str(uuid.uuid4()),))
        conn.execute("INSERT OR IGNORE INTO contacts (contact_id, name, phone, email, type) VALUES (?, 'City General Hospital', '112-EXT-1', 'er@citygeneral.com', 'hospital')", (str(uuid.uuid4()),))
        conn.execute("INSERT OR IGNORE INTO contacts (contact_id, name, phone, email, type) VALUES (?, 'Sector 4 Fire Station', '101-EXT-1', 'dispatch@fire4.com', 'fire_station')", (str(uuid.uuid4()),))
        conn.execute("INSERT OR IGNORE INTO contacts (contact_id, name, phone, email, type) VALUES (?, 'Paramedics Unit', '108', 'dispatch@ems.com', 'hospital')", (str(uuid.uuid4()),))
    print("Database initialized with Final V12 Schema.")


if __name__ == '__main__':
    init_db()
