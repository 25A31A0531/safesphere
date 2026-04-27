// Telemetry ingestion endpoint
if (!global._telemetry) global._telemetry = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { speed, acceleration, temperature, battery, timestamp } = req.body;
    const entry = { speed: speed ?? 0, acceleration: acceleration ?? 0, temperature: temperature ?? 25, battery: battery ?? 100, timestamp: timestamp || new Date().toISOString() };
    global._telemetry.unshift(entry);
    if (global._telemetry.length > 500) global._telemetry = global._telemetry.slice(0, 500);
    return res.status(200).json({ success: true, entry });
  }
  if (req.method === 'GET') {
    return res.status(200).json({ telemetry: global._telemetry.slice(0, 100) });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
