const { v4: uuidv4 } = require('uuid');
const store = require('../../lib/store');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(store.events);
  }

  if (req.method === 'POST') {
    const data = req.body || {};
    const newEvent = {
      event_id: data.event_id || uuidv4(),
      timestamp_utc: data.timestamp_utc || new Date().toISOString(),
      local_timestamp: data.local_timestamp || new Date().toLocaleString(),
      area_name: data.area_name || 'Unknown Area',
      event_type: data.event_type || 'Unknown',
      severity: data.severity || 'Unknown',
      canceled: data.canceled || 0,
      delivered_to: data.canceled ? 'None (Canceled)' : JSON.stringify(['Hospital', 'Fire Station', 'Family'])
    };
    store.events.unshift(newEvent);
    return res.status(200).json({ status: 'Event logged', event_id: newEvent.event_id });
  }

  if (req.method === 'DELETE') {
    const { event_id } = req.query;
    if (event_id === 'all') {
      store.events.length = 0;
      return res.status(200).json({ status: 'All events cleared' });
    }
    store.events = store.events.filter(e => e.event_id !== event_id);
    return res.status(200).json({ status: 'Event deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
