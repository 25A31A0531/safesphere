# SafeSphere — AI Emergency Detection System

A full-stack Next.js application ready for Vercel deployment.

## 🚀 Quick Deploy

1. Upload this folder to a new GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Vercel auto-detects Next.js and deploys instantly

## 🔑 Demo Login
- **Username:** `demo`  
- **Password:** `demo123`

## 📁 Structure

```
safesphere/
├── pages/              # Frontend routes (Next.js)
│   ├── index.js        # Login/signup + OAuth
│   ├── dashboard.js    # Live telemetry + camera AI + GPS
│   ├── contacts.js     # Emergency contacts CRUD
│   ├── triggers.js     # Manual SOS triggers with cancel timers
│   ├── settings.js     # Bluetooth + preferences
│   └── api/            # Serverless API routes
│       ├── login.js
│       ├── signup.js
│       ├── oauth.js
│       ├── contacts.js
│       ├── events.js
│       ├── alerts.js   # Twilio SMS
│       ├── telemetry.js
│       ├── camera.js
│       └── bluetooth.js
├── components/
│   ├── Nav.js
│   ├── Telemetry.js        # Live sensor rings + crash detection
│   ├── CameraAI.js         # TensorFlow.js COCO-SSD detection
│   ├── LocationTracker.js  # GPS + Nominatim reverse geocoding
│   └── TriggerButton.js    # Countdown + cancel
├── styles/globals.css
├── next.config.js
├── package.json
└── vercel.json
```

## ⚙️ Optional: Twilio SMS Alerts

Add these environment variables in Vercel dashboard:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1XXXXXXXXXX
JWT_SECRET=your_strong_secret_here
```

Without these, alerts are mocked (logged to console) — the app still works fully.

## 🛠️ Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

Node.js 18+ required.
