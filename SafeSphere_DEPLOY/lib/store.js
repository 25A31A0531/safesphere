// In-memory data store — works perfectly on Vercel serverless.
// Data resets on cold starts, which is fine for a hackathon demo.
// For production, swap this for a real DB (e.g. Vercel Postgres, PlanetScale).

let users = [
  { id: 1, username: 'demo', password_hash: '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ12', name: 'Demo User', email: 'demo@safesphere.app', phone: '+91 98765 43210' }
];

let contacts = [
  { contact_id: 'c1', name: 'City General Hospital', phone: '112-EXT-1', email: 'er@citygeneral.org', type: 'hospital' },
  { contact_id: 'c2', name: 'Central Fire Station', phone: '101', email: 'ops@firestation.org', type: 'fire_station' },
  { contact_id: 'c3', name: 'Mom', phone: '+91 99887 76655', email: 'mom@email.com', type: 'family' },
];

let events = [];

let permissions = {};

module.exports = { users, contacts, events, permissions };
