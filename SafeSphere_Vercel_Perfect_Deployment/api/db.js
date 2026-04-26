const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const getDbPath = () => {
    if (process.env.VERCEL) {
        return '/tmp/safesphere.db';
    }
    return path.join(process.cwd(), 'safesphere.db');
};

const initDb = (db) => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT,
            name TEXT,
            email TEXT,
            phone TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            contact_id TEXT PRIMARY KEY,
            name TEXT,
            phone TEXT,
            email TEXT,
            type TEXT CHECK(type IN ('hospital','fire_station','family'))
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS events (
            event_id TEXT PRIMARY KEY,
            timestamp_utc TEXT,
            local_timestamp TEXT,
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
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS permissions (
            user_id INTEGER PRIMARY KEY,
            camera_enabled INTEGER,
            video_preview_enabled INTEGER,
            location_enabled INTEGER,
            telemetry_enabled INTEGER,
            fire_detection_enabled INTEGER,
            bluetooth_enabled INTEGER,
            alerts_enabled INTEGER,
            language TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);
    });
};

const getDb = () => {
    const dbPath = getDbPath();
    const db = new sqlite3.Database(dbPath);
    // On first connect, init tables
    initDb(db);
    return db;
};

module.exports = { getDb };
