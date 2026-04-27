import { v4 as uuidv4 } from 'uuid';

if (!global._events) global._events = [];

const AREA_NAMES = ['Downtown District, Sector 4', 'North Hills, Highland Ave', 'Westside Industrial Park', 'Southgate Residential', 'City Center, Main St', 'Tech Hub, Cyber Lane'];

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return res.status(200).json({ events: global._events.slice(0, 50) });
  }

  if (method === 'POST') {
    const { event_type, severity, canceled, location_lat, location_lon, accel_peak, speed_before, speed_after, fire_confidence } = req.body;
    const area = location_lat && location_lon
      ? await reverseGeocode(location_lat, location_lon)
      : AREA_NAMES[Math.floor(Math.random() * AREA_NAMES.length)];

    const event = {
      id: uuidv4(),
      event_id: uuidv4(),
      event_type: event_type || 'Emergency Detected',
      severity: severity || 'Moderate',
      area_name: area,
      timestamp_utc: new Date().toISOString(),
      canceled: canceled || 0,
      accel_peak: accel_peak || 0,
      speed_before: speed_before || 0,
      speed_after: speed_after || 0,
      fire_confidence: fire_confidence || 0,
    };

    global._events.unshift(event);
    if (global._events.length > 100) global._events = global._events.slice(0, 100);

    return res.status(201).json({ event });
  }

  if (method === 'DELETE') {
    global._events = [];
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, { headers: { 'User-Agent': 'SafeSphere/1.0' } });
    const data = await res.json();
    return data.display_name?.split(',').slice(0, 2).join(', ') || 'Unknown Location';
  } catch {
    return 'Unknown Location';
  }
}
