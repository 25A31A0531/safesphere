export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, phone, type } = req.body || {};

  // In production, integrate Twilio here.
  // For the hackathon demo, we simulate the alert.
  console.log(`[ALERT] Sending ${type || 'SMS'} to ${phone}: ${message}`);

  return res.status(200).json({
    status: 'Alert dispatched (simulated)',
    to: phone,
    message: message,
    provider: 'Twilio (mock)'
  });
}
