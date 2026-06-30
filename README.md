# Lake Tahoe Planner — TrailsTV

A fully dynamic outdoor adventure planning web app for the Lake Tahoe basin.
Plan camping, hiking, kayaking, skiing, mountain biking, and boating — powered
by live data from the Recreation.gov API.

---

## Project Structure

```
tahoe-planner/
├── index.html                   # Main HTML — structure only, no inline CSS/JS
├── css/
│   └── styles.css               # All styles
├── js/
│   └── app.js                   # All application logic, dynamic data loading
├── data/
│   ├── camps.json               # Campground data (static fallback)
│   ├── amenities.json           # Local amenities (bike shops, grocery, etc.)
│   ├── activities.json          # Activity definitions for the Activities page
│   └── site-data.json           # Weather, conditions, lake level, fire alerts
├── netlify/
│   └── functions/
│       └── campsites.js         # Serverless proxy — keeps API key off browser
├── netlify.toml                 # Netlify routing config
├── .gitignore
└── README.md
```

---

## Quick Start (Local)

> **Important:** Because `app.js` fetches JSON files via `fetch()`, you must
> serve the project through a local web server — not by opening `index.html`
> directly as a `file://` URL (browsers block local fetch requests).

### Option A — VS Code Live Server
1. Install the **Live Server** extension
2. Right-click `index.html` → **Open with Live Server**

### Option B — Python
```bash
cd tahoe-planner
python3 -m http.server 8080
# open http://localhost:8080
```

### Option C — Node
```bash
npx serve tahoe-planner
```

---

## Going Live — Recreation.gov API

The app currently runs in **mock mode** (sample data from `data/camps.json`).
To connect to live Recreation.gov availability:

### 1. Get your free API key
Register at [recreation.gov/use-our-data](https://recreation.gov/use-our-data)

### 2. Deploy to Netlify (free tier)
Drag the project folder to [netlify.com/drop](https://app.netlify.com/drop)

### 3. Set your environment variable
Netlify Dashboard → Site Settings → Environment Variables:
```
Key:   RECGOV_KEY
Value: your_actual_key_here
```

### 4. Flip the flags in `js/app.js`
```js
const CONFIG = {
  USE_MOCK:  false,   // ← change to false
  USE_PROXY: true,    // ← change to true
  PROXY_URL: '/api/campsites',
  ...
};
```

The `netlify/functions/campsites.js` proxy injects your key server-side —
it never appears in any browser-visible file.

---

## Replacing Mock Data with Live APIs

| Data | Current source | Live replacement |
|------|---------------|-----------------|
| Campsite availability | `data/camps.json` | Recreation.gov RIDB `/api/v1/facilities` via proxy |
| Weather / forecast | `data/site-data.json` | [Open-Meteo](https://open-meteo.com) (free, no key) |
| Trail conditions | `data/site-data.json` | TrailsTV backend / AllTrails API |
| Lake level | `data/site-data.json` | [USGS Water Resources](https://waterdata.usgs.gov) |
| Fire restrictions | `data/site-data.json` | [InciWeb](https://inciweb.nwcg.gov) / USFS |
| Snow conditions | `data/site-data.json` | [OpenSnow API](https://opensnow.com/developers) |

Each source replaces the corresponding section inside `fetchSiteData()` in
`js/app.js` — the render pipeline is already wired, just swap the data in.

---

## Membership Tiers

| Tier | Price | Key features |
|------|-------|-------------|
| Free | $0 | Activity overviews, weather, 2 saved trips |
| Basic | $3.99/mo | Kayak & bike rental guides, live campsite availability |
| All Tahoe | $10.99/mo | Boating in-depth, camping fees & permits, ski conditions, offline maps |

---

## Tech Stack

- **Vanilla HTML/CSS/JS** — no build step, no framework
- **Leaflet.js** — interactive maps (OpenStreetMap tiles)
- **Google Fonts** — Playfair Display + Inter
- **Netlify Functions** — serverless API proxy (Node.js)
- **Recreation.gov RIDB API** — campsite availability
- **JSON data files** — fully replaceable with live API endpoints

---

## License

© TrailsTV.com — All rights reserved.
Always check current fire restrictions, permit requirements, and trail
closures before any outdoor adventure.
