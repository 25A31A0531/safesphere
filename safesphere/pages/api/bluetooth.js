// Bluetooth pairing endpoint
// Web Bluetooth API runs entirely client-side; this endpoint handles logging of paired devices

if (!global._btDevices) global._btDevices = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ devices: global._btDevices });
  }

  if (req.method === 'POST') {
    const { device_id, device_name, status } = req.body;
    if (!device_id) return res.status(400).json({ error: 'device_id is required' });

    const existing = global._btDevices.findIndex(d => d.id === device_id);
    const device = { id: device_id, name: device_name || 'Unknown Device', status: status || 'connected', paired_at: new Date().toISOString() };

    if (existing > -1) global._btDevices[existing] = device;
    else global._btDevices.push(device);

    return res.status(200).json({ success: true, device });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    global._btDevices = global._btDevices.filter(d => d.id !== id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
