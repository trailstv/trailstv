# TrailsTV — Lake Tahoe Planner

A full-stack outdoor adventure planning app for the Lake Tahoe basin. Built with Next.js 16, React 19, Neon Postgres, and Leaflet. Covers all four shores across 13 activities — hiking, camping, kayaking, skiing, mountain biking, boating, fishing, rock climbing, and more.

**Live demo:** https://trailstv-tahoe-planner.vercel.app

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero with activity chips, six activity sections, campsite mini-map, 7-day forecast, CTA |
| `/activities` | Activity grid — 13 activities, each links to its own map page with pin count |
| `/activities/[activity]` | Per-activity map page — Leaflet map with typed pins, shore + type filters, sidebar, detail panel |
| `/campsites` | Campsite finder — Leaflet map, 14 campgrounds, shore filter, availability dots, booking links |
| `/trails` | Hiking trailhead map — 33 trailheads, difficulty filter, shore filter, sidebar, OSM tiles |
| `/map` | Amenities map — 34 locations across 6 categories, color-coded markers |
| `/plan` | Plan Your Trip wizard — 5-step form, template-generated brief, save to DB (hidden from nav) |
| `/about` | About page — what the service covers, all data sources listed |
| `/contact` | Contact form — name, email, subject, message |
| `/privacy-policy` | Privacy policy — 10 sections |
| `/terms` | Terms of service — 12 sections |
| `/cookies` | Cookie policy — table of all cookies used (essential only) |
| `/accessibility` | Accessibility statement — WCAG 2.1 AA commitment, accessible trail list |

---

## API Routes

All routes are in `app/api/`. Each uses Next.js `revalidate` for CDN-level caching.

| Endpoint | Method | Cache | What it does |
|---|---|---|---|
| `/api/weather` | GET | 30 min | Current conditions + 7-day forecast — OpenWeatherMap |
| `/api/fire` | GET | 1 hr | Fire restrictions — USFS LTBMU public alerts feed |
| `/api/lake` | GET | 6 hr | Lake level in feet — USGS gauge 10337000, Tahoe City |
| `/api/snow` | GET | 6 hr | Snow depth — NRCS SNOTEL network (Mt. Rose, Donner, Rubicon) |
| `/api/campsites` | GET | 15 min | Live campsite availability — Recreation.gov RIDB API |
| `/api/trailheads` | GET | 24 hr | Live trailhead nodes — OpenStreetMap Overpass API |
| `/api/trips` | GET, POST | — | Save and retrieve trip itineraries — Neon Postgres |
| `/api/onboarding` | GET, POST | — | Save and retrieve onboarding profiles — Neon Postgres |
| `/api/migrate` | GET | — | Create DB tables — run once, protected by `MIGRATE_SECRET` |

All routes fall back gracefully — if an API key is missing or an upstream source is down, they return static fallback data with a `source: 'fallback'` field rather than a 500 error.

---

## Components

| File | What it does |
|---|---|
| `Nav.tsx` | Sticky nav — main links + "More" dropdown (About, Contact, Privacy, Terms, Cookies, Accessibility) + mobile full-screen menu with hamburger |
| `Footer.tsx` | Live conditions panel — fetches all 5 data APIs on mount, refreshes every 30 min, fire alert bar, conditions ticker, legal links |
| `CampsiteMap.tsx` | Leaflet map — colored availability dots, OSM tiles, pan-to-selected, explicit 440px height |
| `TrailheadMap.tsx` | Leaflet map — triangle markers by difficulty, OSM tiles, sidebar integration, explicit 560px height |
| `ActivityMap.tsx` | Leaflet map — teardrop markers by activity color, OSM tiles, grouped sidebar, detail panel |
| `AmenitiesMap.tsx` | Leaflet map — dot markers by category color, OSM tiles, explicit 460px height |

All Leaflet maps are `dynamic(() => import(...), { ssr: false })` — Leaflet requires `window` and cannot render server-side. All use `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` tiles — consistent across every map.

---

## Data Libraries (`/lib`)

### `data.ts`
TypeScript types and static fallback data. Used when live APIs are unavailable.
- `CAMPS_FALLBACK` — 14 campgrounds with full metadata
- `ACTS_FALLBACK` — 13 activities with icon, name, description
- `AMENITIES_FALLBACK` — 34 amenity locations
- `SITE_DATA_FALLBACK` — weather, fire, lake, ski, camping, trails default values
- `avSt()` — availability status helper (open / limited / full)

### `trailheads.ts`
33 curated, hand-verified Tahoe trailheads.
- `TRAILHEADS` — 20 primary trailheads
- `TRAILHEADS_EXTRA` — 13 additional trailheads (Mount Rose area, MTB-specific, hiking gaps)
- `ALL_TRAILHEADS` — merged array used by the trails page

Each entry includes: id, name, trail name, coordinates, shore, difficulty, round-trip miles, elevation gain, max elevation, trail use types, season, permit requirement, parking fee, dog policy, highlights array, description, external info URL.

Difficulty colors: Easy `#4ABC78` · Moderate `#4AADBC` · Strenuous `#E0B85C` · Expert `#E05050`

### `activityLocations.ts`
Per-activity map pins for all 13 activity pages. Each activity has a color, center coordinates, zoom level, description, and an array of pins.

| Activity | Pins | Pin types |
|---|---|---|
| Camping | 14 | campsite |
| Hiking | 14 | trailhead |
| Kayaking | 21 | launch, rental |
| MTB | 19 | trailhead, rental |
| Skiing | 16 | resort |
| Swimming | 9 | beach |
| Boating | 8 | marina, launch, rental |
| Fishing | 17 | marina, spot |
| SUP | 7 | launch, rental |
| Backpacking | 6 | trailhead |
| Wildlife | 7 | viewpoint |
| Snowshoeing | 7 | trailhead |
| Rock Climbing | 12 | trailhead, spot, rental |

### `db.ts`
Neon Postgres client using `@neondatabase/serverless`.
- `getSql()` — returns a `neon(DATABASE_URL)` tagged template function
- `upsertUser()` — find-or-create user by email
- `corsHeaders()` — standard CORS response headers

### `narrative.ts`
Template engine for personalized trip briefs. Zero API calls, loads instantly.
Assembles a 4-paragraph narrative from user answers: name + shore + activities + season + group type + trip length. Uses lookup tables — 10 activities × 4 shores = 40 unique activity tip variants.

---

## Campground Data

14 verified campgrounds across all four shores.

| Shore | Count | Campgrounds |
|---|---|---|
| West | 5 | D.L. Bliss, Eagle Point (Emerald Bay), Sugar Pine Point, William Kent, Meeks Bay |
| North | 3 | Tahoe State Recreation Area, Lake Forest, Kaspian |
| South | 3 | Fallen Leaf Lake, Camp Richardson, Campground by the Lake |
| East | 3 | Nevada Beach, Zephyr Cove, Spooner Backcountry |

Booking systems: ReserveCalifornia (CA State Parks), Recreation.gov (USFS + federal), Nevada State Parks, TCPUD (first-come, first-served).

---

## Amenities Data

34 locations in `lib/data.ts` and `public/data/amenities.json`.

| Category | Count | Examples |
|---|---|---|
| Grocery | 12 | Safeway (×4 locations), Raley's (×2), Whole Foods, Grocery Outlet (×2), New Moon Natural Foods |
| Bike shops | 5 | Tahoe Sports Ltd, Shoreline MTB, Olympic Bike Shop, Flume Trail Bikes, Anderson's |
| Outfitters | 4 | REI South Lake Tahoe, Tahoe Outdoor Center, Alpenglow Sports, Dave's Ski & Board |
| Gas | 5 | Chevron (×2), Shell, 76, Mobil |
| Rentals | 6 | Tahoe Paddle & Oar, Emerald Bay Water Sports, Zephyr Cove, Tahoe City Kayak, Sand Harbor Clear Kayak, Camp Richardson |
| Camp gear | 2 | Basin Gear & Supply, Tahoe City Hardware |

---

## Ski Resorts

16 resorts pinned on `/activities/skiing`.

| Shore | Resorts |
|---|---|
| North | Palisades Tahoe, Alpine Meadows, Northstar California, Sugar Bowl, Boreal Mountain, Donner Ski Ranch, Soda Springs, Tahoe Donner, Granlibakken |
| South | Heavenly Mountain, Kirkwood Mountain, Sierra-at-Tahoe |
| West | Homewood Mountain |
| East | Mt. Rose Ski Tahoe, Diamond Peak, Sky Tavern |

Pass affiliations: Ikon (Palisades, Alpine, Sierra), Epic (Heavenly, Northstar, Kirkwood), Indy (Sugar Bowl, Mt. Rose), Independent (Donner Ranch, Boreal, Soda Springs, Sky Tavern).

---

## Database Schema

Three tables created by `GET /api/migrate?secret=YOUR_SECRET`.

```sql
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  auth_provider VARCHAR(50) DEFAULT 'email',
  tier VARCHAR(20) DEFAULT 'free',
  google_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255),
  season VARCHAR(50),
  group_type VARCHAR(50),
  trip_length VARCHAR(50),
  activities JSONB,
  level VARCHAR(50),
  shores JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

onboarding (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(100),
  tier VARCHAR(20) DEFAULT 'free',
  auth_provider VARCHAR(50),
  season VARCHAR(50),
  stay_type VARCHAR(50),
  group_type VARCHAR(50),
  trip_length VARCHAR(50),
  activities JSONB,
  shores JSONB,
  camp_features JSONB,
  raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

---

## Live Data Sources

The Footer fetches all five APIs on mount and refreshes every 30 minutes using `Promise.allSettled` — any single failure doesn't affect the others. Each API returns a `source` field: `'openweathermap'`, `'usgs-10337000'`, etc. or `'fallback'` with a yellow indicator dot when serving static data.

| Data | API | Key | Cache |
|---|---|---|---|
| Weather + forecast | OpenWeatherMap `/data/2.5/weather` + `/forecast` | `OPENWEATHER_API_KEY` | 30 min |
| Fire restrictions | USFS LTBMU alerts feed | None | 1 hr |
| Lake level | USGS gauge `10337000` at Tahoe City | None | 6 hr |
| Snow depth | NRCS SNOTEL — sites 1049:NV, 778:CA, 734:CA, 602:CA | None | 6 hr |
| Campsite availability | Recreation.gov RIDB API | `RECGOV_KEY` | 15 min |
| Trailheads (live) | OSM Overpass API — bbox `38.75,-120.25,39.40,-119.85` | None | 24 hr |
| Trailheads (fallback) | `lib/trailheads.ts` — curated static data | None | Static |

---

## Environment Variables

Add these in **Vercel → Settings → Environment Variables**.

| Variable | Source | Required |
|---|---|---|
| `DATABASE_URL` | Auto-injected when you connect Neon via Vercel dashboard → Storage | Yes |
| `MIGRATE_SECRET` | Any string you choose — used once to run `/api/migrate` | Yes |
| `OPENWEATHER_API_KEY` | openweathermap.org → free tier, no card required | Yes — live weather |
| `RECGOV_KEY` | ridb.recreation.gov → free, instant approval | Yes — live campsites |
| `GOOGLE_CLIENT_ID` | console.cloud.google.com | When Google OAuth is enabled |
| `GOOGLE_CLIENT_SECRET` | console.cloud.google.com | When Google OAuth is enabled |

No key needed for fire (`/api/fire`), lake level (`/api/lake`), snow (`/api/snow`), or trailheads (`/api/trailheads`) — all use free public federal data.

For local development, copy connection strings from Vercel dashboard → Storage → your database → `.env.local` tab into your local `.env.local`.

---

## Images

Place these in `/public/assets/`. Copy from your TrailsTV server via cPanel or FTP. The site works without them — hero falls back to a dark blue gradient, activity cards show emoji icons.

| File | Used on | Spec |
|---|---|---|
| `hero-tahoe.jpg` | Home page hero background | 2400px wide, JPEG |
| `activity-camping.jpg` | Home page activity section | 800×450px, 16:9 |
| `activity-hiking.jpg` | Home page activity section | 800×450px, 16:9 |
| `activity-mtb.jpg` | Home page activity section | 800×450px, 16:9 |
| `activity-kayaking.jpg` | Home page activity section | 800×450px, 16:9 |
| `activity-skiing.jpg` | Home page activity section | 800×450px, 16:9 |
| `activity-boating.jpg` | Home page activity section | 800×450px, 16:9 |

The hero uses `next/image` with `fill` + `priority` for optimal LCP. Activity images use `fill` with `sizes="(max-width: 768px) 100vw, 50vw"`. All images have `onError` handlers that hide broken images silently.

---

## Navigation

**Desktop nav:** Explore · Activities · Trail Map · Campsites · Amenities · More ▾

The **More** dropdown contains: About Us · Contact · Privacy Policy · Terms of Service · Cookie Policy · Accessibility. Opens on click, closes on outside click or navigation, highlights the active page, chevron rotates on open.

**Mobile nav:** Hamburger icon opens a full-screen overlay with two sections — Navigation and More — animated with `fadeUp`. Closes automatically on route change.

The `/plan` (Plan Your Trip) page is preserved but hidden from all navigation pending future activation. No links to `/plan` exist anywhere in the UI — it is accessible directly by URL.

---

## Deployment

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/trailstv.git
git push -u origin main

# 2. Connect on Vercel
# vercel.com → New Project → Import → Framework: Next.js → Deploy

# 3. Connect Neon Postgres
# Vercel dashboard → Storage → Create → Postgres (Neon) → Connect to project
# DATABASE_URL is injected automatically

# 4. Add environment variables in Vercel dashboard

# 5. Create database tables — visit once:
# https://your-project.vercel.app/api/migrate?secret=YOUR_MIGRATE_SECRET

# 6. Add images to public/assets/ (copy from your TrailsTV server)
```

**Node version:** 24.x (set in `package.json` engines and Vercel project settings — must match)

**Build command:** `next build` (default — no custom config needed)

**Framework:** Next.js 16 App Router, React 19, TypeScript 5

---

## What's Not Yet Active

| Feature | Status | What's needed |
|---|---|---|
| Google OAuth | UI present, simulated | `GOOGLE_CLIENT_ID/SECRET` + `/api/auth/google/callback` route |
| Plan Your Trip | Page exists at `/plan`, hidden from nav | Uncomment nav link when ready |
| Email / magic link auth | Not built | `/api/auth/email` route + email service |
| Water temperature (live) | Estimated from air temp | UC Davis Tahoe Research Group has no public API |
| Kokanee salmon run dates | Static | USFS Taylor Creek visitor center — no public API |
