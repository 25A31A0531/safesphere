// Camera AI processing endpoint
// TensorFlow.js runs client-side in the browser; this endpoint handles server-side event logging from detections

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { detections, fire_heuristic, timestamp, location } = req.body;

  const highRiskClasses = ['fire', 'smoke', 'person'];
  const detected = (detections || []).filter(d => highRiskClasses.includes(d.class) && d.score > 0.6);
  const fireDetected = fire_heuristic || detected.some(d => ['fire', 'smoke'].includes(d.class));

  if (fireDetected || detected.length > 0) {
    const eventType = fireDetected ? 'Fire detected (Camera AI)' : `Object detected: ${detected.map(d => d.class).join(', ')}`;
    const event = {
      id: Date.now().toString(),
      event_type: eventType,
      severity: fireDetected ? 'Critical' : 'Moderate',
      area_name: location || 'Camera View',
      timestamp_utc: timestamp || new Date().toISOString(),
      canceled: 0,
      detections,
    };
    if (!global._events) global._events = [];
    global._events.unshift(event);
    return res.status(200).json({ success: true, triggered: true, event });
  }

  return res.status(200).json({ success: true, triggered: false });
}
