// GET /api/events — fetch all events
// POST /api/events — log a new event
// DELETE /api/events?id=X — delete one event
// DELETE /api/events — clear all (body: {all:true} or just DELETE)

import { v4 as uuidv4 } from 'uuid';

if (!global._ss_events) global._ss_events = [];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ events: global._ss_events.slice(0, 50) });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    // Reverse geocode area name if lat/lon provided
    let area = body.area_name || 'Unknown Location';
    if (!body.area_name && body.location_lat && body.location_lon) {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${body.location_lat}&lon=${body.location_lon}`, { headers: { 'User-Agent': 'SafeSphere/2.0' } });
        const d = await r.json();
        area = d.display_name?.split(',').slice(0, 2).join(', ') || 'Unknown';
      } catch {}
    }
    const event = {
      event_id: body.event_id || uuidv4(),
      event_type: body.event_type || 'Emergency',
      severity: body.severity || 'Moderate',
      area_name: area,
      timestamp_utc: body.timestamp_utc || new Date().toISOString(),
      local_timestamp: body.local_timestamp || new Date().toLocaleString(),
      location_lat: body.location_lat || 0,
      location_lon: body.location_lon || 0,
      canceled: body.canceled || 0,
      accel_peak: body.accel_peak || 0,
      speed_before: body.speed_before || 0,
      speed_after: body.speed_after || 0,
      fire_confidence: body.fire_confidence || 0,
      fallback_sent: 0,
      delivered_to: '[]',
    };
    global._ss_events.unshift(event);
    if (global._ss_events.length > 100) global._ss_events = global._ss_events.slice(0, 100);
    return res.status(201).json({ event });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (id) {
      global._ss_events = global._ss_events.filter(e => e.event_id !== id);
    } else {
      global._ss_events = [];
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
