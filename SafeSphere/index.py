from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db, init_db
import os
import uuid
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'super_secret_hackathon_key'

# Initialize DB on startup
db_path = 'safesphere.db'
if os.environ.get('VERCEL'):
    db_path = '/tmp/safesphere.db'

if not os.path.exists(db_path):
    init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error='Invalid credentials')
            
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        name = request.form.get('name', '')
        email = request.form.get('email', '')
        phone = request.form.get('phone', '')
        
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        if user:
            return render_template('register.html', error='Username already exists')
            
        hashed = generate_password_hash(password)
        conn.execute("INSERT INTO users (username, password_hash, name, email, phone) VALUES (?, ?, ?, ?, ?)", (username, hashed, name, email, phone))
        conn.commit()
        
        fetched_user = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
        conn.execute("INSERT OR IGNORE INTO permissions (user_id, camera_enabled, video_preview_enabled, location_enabled, telemetry_enabled, fire_detection_enabled, bluetooth_enabled, alerts_enabled, language) VALUES (?, 1, 0, 1, 1, 0, 1, 1, 'en')", (fetched_user['id'],))
        conn.commit()
        
        return redirect(url_for('login'))
        
    return render_template('register.html')

@app.route('/forgot-password')
def forgot_password():
    return render_template('forgot_password.html')

@app.route('/oauth/<provider>')
def mock_oauth(provider):
    conn = get_db()
    mock_username = f"mock_{provider}_user"
    user = conn.execute("SELECT * FROM users WHERE username = ?", (mock_username,)).fetchone()
    if not user:
        conn.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (mock_username, "mock_hash"))
        conn.commit()
        
        user = conn.execute("SELECT * FROM users WHERE username = ?", (mock_username,)).fetchone()
        conn.execute("INSERT OR IGNORE INTO permissions (user_id, camera_enabled, video_preview_enabled, location_enabled, telemetry_enabled, fire_detection_enabled, bluetooth_enabled, alerts_enabled, language) VALUES (?, 1, 0, 1, 1, 0, 1, 1, 'en')", (user['id'],))
        conn.commit()
    session['user_id'] = user['id']
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html')

@app.route('/api/settings', methods=['GET'])
def get_settings():
    if 'user_id' not in session: return jsonify({'camera_enabled': 0, 'video_preview_enabled': 0, 'location_enabled': 0, 'telemetry_enabled': 0, 'fire_detection_enabled': 0, 'bluetooth_enabled': 0, 'alerts_enabled': 0, 'language': 'en'})
    conn = get_db()
    perms = conn.execute("SELECT * FROM permissions WHERE user_id = ?", (session['user_id'],)).fetchone()
    if not perms:
        conn.execute("INSERT INTO permissions (user_id, camera_enabled, video_preview_enabled, location_enabled, telemetry_enabled, fire_detection_enabled, bluetooth_enabled, alerts_enabled, language) VALUES (?, 1, 0, 1, 1, 0, 1, 1, 'en')", (session['user_id'],))
        conn.commit()
        perms = conn.execute("SELECT * FROM permissions WHERE user_id = ?", (session['user_id'],)).fetchone()
    return jsonify(dict(perms))

@app.route('/api/settings', methods=['POST'])
def update_settings():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    conn = get_db()
    
    fields = []
    values = []
    for key in ['camera_enabled', 'video_preview_enabled', 'location_enabled', 'telemetry_enabled', 'fire_detection_enabled', 'bluetooth_enabled', 'alerts_enabled']:
        if key in data:
            fields.append(f"{key} = ?")
            values.append(int(data[key]))
    
    if 'language' in data:
        fields.append("language = ?")
        values.append(data['language'])
            
    if fields:
        values.append(session['user_id'])
        conn.execute(f"UPDATE permissions SET {', '.join(fields)} WHERE user_id = ?", values)
        conn.commit()
        
    return jsonify({'status': 'Settings globally updated'})

@app.route('/api/settings/reset', methods=['POST'])
def reset_settings():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    conn = get_db()
    conn.execute("UPDATE permissions SET camera_enabled=1, video_preview_enabled=0, location_enabled=1, telemetry_enabled=1, fire_detection_enabled=0, bluetooth_enabled=1, alerts_enabled=1, language='en' WHERE user_id = ?", (session['user_id'],))
    conn.commit()
    return jsonify({'status': 'Settings logic reset'})

@app.route('/api/alerts')
def api_alerts():
    conn = get_db()
    events = conn.execute("SELECT * FROM events ORDER BY timestamp_utc DESC LIMIT 50").fetchall()
    return jsonify([dict(e) for e in events])

def reverse_geocode(lat, lon):
    if lat is None or lon is None: return "Unknown Area"
    areas = ["Downtown District, Sector 4", "North Hills, Highland Ave", "Westside Industrial Park", "Southgate Residential", "City Center, Main St"]
    import random
    return random.choice(areas)

@app.route('/api/events', methods=['POST'])
def handle_event():
    data = request.json
    
    event_id = data.get('event_id', str(uuid.uuid4()))
    evt_type = data.get('event_type', 'Road accident detected')
    severity = data.get('severity', 'Unknown')
    timestamp_utc = data.get('timestamp_utc', datetime.utcnow().isoformat() + "Z")
    local_timestamp = data.get('local_timestamp', timestamp_utc)
    canceled = data.get('canceled', 0)
    fallback_sent = data.get('fallback_sent', 0)
    
    loc_lat = data.get('location_lat')
    loc_lon = data.get('location_lon')
    area_name = reverse_geocode(loc_lat, loc_lon)

    accel_peak = data.get('accel_peak', 0.0)
    speed_before = data.get('speed_before', 0.0)
    speed_after = data.get('speed_after', 0.0)
    fire_confidence = data.get('fire_confidence', 0.0)
    
    # Build delivery targets from contacts table
    conn = get_db()
    delivered_to = "None (Canceled)"
    if canceled == 0:
        contacts = conn.execute("SELECT name, phone, type FROM contacts").fetchall()
        targets = []
        family = [f"{c['name']} ({c['phone']})" for c in contacts if c['type'] == 'family']
        hospitals = [f"{c['name']}" for c in contacts if c['type'] == 'hospital']
        fire_stations = [f"{c['name']}" for c in contacts if c['type'] == 'fire_station']
        ems = [f"{c['name']}" for c in contacts if c['type'] == 'hospital']
        
        if 'Fire' in evt_type:
            targets = fire_stations + hospitals + family + ems
        else:
            targets = hospitals + ems + family
        
        if not targets:
            targets = ["Emergency Services (112)"]
        delivered_to = json.dumps(targets)

    conn.execute('''
        INSERT INTO events (event_id, timestamp_utc, local_timestamp, area_name, event_type, severity, canceled, accel_peak, speed_before, speed_after, fire_confidence, fallback_sent, delivered_to)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (event_id, timestamp_utc, local_timestamp, area_name, evt_type, severity, canceled, accel_peak, speed_before, speed_after, fire_confidence, fallback_sent, delivered_to))
    conn.commit()

    return jsonify({'status': 'Event logged successfully', 'event_id': event_id, 'area_name': area_name, 'delivered_to': delivered_to})

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_single_event(event_id):
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    conn = get_db()
    conn.execute("DELETE FROM events WHERE event_id = ?", (event_id,))
    conn.commit()
    return jsonify({'status': f'Event {event_id} deleted successfully.'})

@app.route('/api/events/clear', methods=['DELETE'])
def clear_all_events():
    if 'user_id' not in session: return jsonify({'error': 'Unauthorized'}), 401
    conn = get_db()
    conn.execute("DELETE FROM events")
    conn.commit()
    return jsonify({'status': 'All logs purged successfully.'})

@app.route('/api/nearby/hospitals')
def api_hospitals():
    lat = request.args.get('lat', '0')
    lon = request.args.get('lon', '0')
    # Provide mock localized hospitals based on coords
    return jsonify({
        'status': 'success',
        'query_location': {'lat': lat, 'lon': lon},
        'hospitals': [
            {'name': 'City General Regional Hospital', 'distance_km': 1.2, 'contact': '112-EXT-1'},
            {'name': 'St. Jude Emergency Center', 'distance_km': 3.4, 'contact': '112-EXT-2'}
        ]
    })

@app.route('/api/devices')
def api_devices():
    return jsonify({'devices': []})

@app.route('/api/devices/pair', methods=['POST'])
def api_pair_device():
    data = request.json
    device_id = data.get('device_id', str(uuid.uuid4()))
    device_name = data.get('device_name', 'Unknown BLE Device')
    
    if 'user_id' in session:
        conn = get_db()
        conn.execute("INSERT OR IGNORE INTO devices (id, user_id, name, status) VALUES (?, ?, ?, ?)", (device_id, session['user_id'], device_name, 'connected'))
        conn.commit()
        
    return jsonify({'status': 'pairing successful', 'device_id': device_id})

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('index'))

@app.route('/api/contacts')
def api_contacts():
    conn = get_db()
    contacts = conn.execute("SELECT * FROM contacts ORDER BY type, name").fetchall()
    return jsonify([dict(c) for c in contacts])

@app.route('/api/contacts', methods=['POST'])
def add_contact():
    data = request.json
    conn = get_db()
    import uuid
    new_id = str(uuid.uuid4())
    conn.execute("INSERT INTO contacts (contact_id, name, phone, email, type) VALUES (?, ?, ?, ?, ?)",
        (new_id, data.get('name'), data.get('phone'), data.get('email'), data.get('type', 'family')))
    conn.commit()
    return jsonify({'status': 'Contact added', 'contact_id': new_id})

@app.route('/api/contacts/<contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    conn = get_db()
    conn.execute("DELETE FROM contacts WHERE contact_id = ?", (contact_id,))
    conn.commit()
    return jsonify({'status': 'Contact deleted'})

@app.route('/api/contacts/<contact_id>', methods=['PUT'])
def edit_contact(contact_id):
    data = request.json
    conn = get_db()
    conn.execute("UPDATE contacts SET name=?, phone=?, email=?, type=? WHERE contact_id=?",
                 (data.get('name'), data.get('phone'), data.get('email'), data.get('type'), contact_id))
    conn.commit()
    return jsonify({'status': 'Contact updated'})

@app.route('/api/fallback', methods=['POST'])
def send_fallback():
    """Emergency fallback: pre-shutdown last-known event dispatch."""
    data = request.json
    event_id = data.get('event_id', str(uuid.uuid4()))
    loc_lat = data.get('location_lat')
    loc_lon = data.get('location_lon')
    area_name = reverse_geocode(loc_lat, loc_lon)
    evt_type = data.get('event_type', 'Road accident detected (FALLBACK)')
    severity = data.get('severity', 'Severe')
    
    conn = get_db()
    contacts = conn.execute("SELECT name, phone, contact_type FROM contacts WHERE is_default = 1").fetchall()
    targets = [f"{c['name']} ({c['phone']})" for c in contacts]
    if not targets:
        targets = ["Emergency Services (112)"]
    delivered_to = json.dumps(targets)
    
    conn.execute('''
        INSERT INTO events (event_id, timestamp_utc, local_timestamp, area_name, event_type, severity, canceled, fallback_sent, delivered_to)
        VALUES (?, ?, ?, ?, ?, ?, 0, 1, ?)
    ''', (event_id, datetime.utcnow().isoformat() + "Z", datetime.utcnow().isoformat(), area_name, evt_type, severity, delivered_to))
    conn.commit()
    return jsonify({'status': 'Fallback dispatched', 'delivered_to': targets})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
