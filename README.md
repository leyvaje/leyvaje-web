# leyvaje.com

Personal website with interactive beat maker, wind-driven particle animation, and Discord-powered CMS.

## 📁 Structure

```
/
├── index.html              Main website (everything in one file)
├── beatmaker.html          Standalone beat maker demo
├── CLAUDE.md               Design spec & requirements
├── supabase-schema.sql     Database schema (run in Supabase)
├── assets/
│   ├── images/             Images (photos, artwork)
│   └── documents/          PDFs, CV, etc
├── bot/                    Discord bot (Node.js + Discord.js)
│   ├── index.js
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── railway.toml
└── .gitignore
```

## 🚀 Quick Start

### 1. Local Development
No build step needed — `index.html` works in the browser immediately.

```bash
# Serve locally
python3 -m http.server 8000
# Open http://localhost:8000
```

### 2. Discord Bot Setup (CMS)
See `bot/` folder for complete setup instructions:
- Create Discord bot token
- Set up Supabase database
- Deploy to Railway
- Connect to `index.html` with Supabase keys

### 3. Deploy the Website
- **Vercel**: Connect this repo → auto-deploys on push
- **Netlify**: Same process
- **GitHub Pages**: Push to `gh-pages` branch

## 🎨 Features

**Interactive Animation**
- Particle flow field driven by Perlin noise
- Mouse gravity attraction
- Real wind data from Open-Meteo API
- Adjustable based on user location or Attendorn defaults

**Beat Maker** (always visible at bottom)
- Keyboard: numbers 1–0 for drums, Q–] for C4–B4 melody, A–; for C5–A#5
- Click "hide keys" to collapse the keyboard guide
- "Save art" to download the particle animation as PNG

**Dark/Light Theme**
- Toggle with button in header
- Respects system preferences (optional)

**Discord CMS**
- Post thoughts/photos/audio to a private Discord channel
- Automatically synced to your website via Supabase
- Edit or delete posts — changes reflect instantly

## 🔧 Configuration

### Before Deploying:

**`index.html`** — Find these lines (~line 870) and update:
```js
const SUPABASE_URL  = 'https://xxxx.supabase.co';
const SUPABASE_ANON = 'your_anon_key_here';
```

### Environment Variables:

#### Discord Bot (`.env` in `bot/`)
```
DISCORD_TOKEN=your_bot_token
DISCORD_CHANNEL_ID=your_channel_id
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

## 📝 How to Use

### Updating Content

**Via Discord** (`#leyvaje-posts` channel):
- 💭 Post text → appears as "Thought"
- 📸 Post image → appears as "Photo"  
- 🎵 Post audio/video → appears as "Music"
- 🔗 Post URL → appears as "Link"
- Start with `--` to draft without publishing

**Manual HTML edits**:
Edit the sections directly in `index.html`:
- Work experience: search `<h2>Experience</h2>`
- Skills: search `<h2>Skills</h2>`
- Education: search `<h2>Education</h2>`

## 🎹 Technologies

- **Frontend**: Vanilla HTML/CSS/JS + p5.js
- **Audio**: Tone.js (Web Audio API synthesis)
- **Data**: Supabase (PostgreSQL + REST API)
- **Bot**: Discord.js v14
- **Hosting**: Vercel, Railway
- **API**: Open-Meteo (wind conditions)

## 📦 Browser Support

Works on any modern browser:
- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

## 📄 License

Personal project. Feel free to reference for inspiration.

---

**Author**: Jose Enrique Leyva N. (@leyvaje)
