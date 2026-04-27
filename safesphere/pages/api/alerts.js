// Twilio SMS alert sender
// Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER in Vercel env vars

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, severity, location, contacts, message } = req.body;

  const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const FROM = process.env.TWILIO_FROM_NUMBER;

  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM) {
    // Mock alert when Twilio is not configured
    console.log('[SafeSphere] Mock alert dispatched:', { type, severity, contacts });
    return res.status(200).json({
      success: true,
      mock: true,
      message: 'Alert logged (Twilio not configured — add env vars on Vercel for real SMS)',
      details: { type, severity, location },
    });
  }

  const alertMessage = message || `🚨 SafeSphere ALERT: ${type || 'Emergency'} detected. Severity: ${severity || 'High'}. ${location ? `Location: ${location}.` : ''} Please call emergency services immediately.`;

  // Get contacts from store
  const allContacts = global._contacts || [];
  const targets = contacts || allContacts.map(c => c.phone).filter(Boolean);

  const results = [];
  for (const phone of targets.slice(0, 10)) {
    try {
      const body = new URLSearchParams({ To: phone, From: FROM, Body: alertMessage });
      const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: { 'Authorization': 'Basic ' + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = await r.json();
      results.push({ phone, sid: data.sid, status: data.status });
    } catch (err) {
      results.push({ phone, error: err.message });
    }
  }

  return res.status(200).json({ success: true, sent: results.length, results });
}
