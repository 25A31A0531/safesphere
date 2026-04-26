export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { message, contact_id } = req.body;
    console.log(`Sending alert to ${contact_id}: ${message}`);
    
    res.status(200).json({ status: 'Alert sent (mocked)', provider: 'Twilio/Mock' });
}
