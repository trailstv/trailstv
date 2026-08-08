# TrailsTV — Lake Tahoe Planner

A full-stack outdoor adventure planning app for the Lake Tahoe basin. Built with Next.js 16, Neon Postgres (@neondatabase/serverless), and Leaflet. Covers camping, hiking, kayaking, skiing, mountain biking, and more across all four shores of the lake.

---

## What's Built

### Pages

| Route | What it does |
|---|---|
| `/` | Home — hero, activity grid, live campsite status, 7-day forecast, CTA |
| `/campsites` | Campsite finder — Leaflet map, filter by shore/availability, booking links |
| `/activities` | Activity grid — 12 activities, tier-gated content, plan links |
| `/trails` | Hiking trailhead map — topo tiles, 20 verified trailheads, difficulty filters |
| `/map` | Amenities map — bike shops, outfitters, grocery, gas, rental locations |
| `/plan` | Plan Your Trip — auth gate, 5-step wizard, personalized brief, save to DB |
| `/pricing` | Pricing — Free and Basic plans, monthly/annual toggle, feature table |

### API Routes

| Endpoint | Method | What it does |
|---|---|---|
| `/api/trips` | GET, POST | Save and retrieve trip itineraries — writes to Vercel Postgres |
| `/api/onboarding` | GET, POST | Save and retrieve onboarding profiles — writes to Vercel Postgres |
| `/api/campsites` | GET | Proxies Recreation.gov RIDB API — keeps API key server-side, cached 15 min |
| `/api/trailheads` | GET | Fetches live trailhead nodes from OpenStreetMap Overpass API, cached 24hr |
| `/api/migrate` | GET | Creates all database tables — run once after connecting Vercel Postgres |

### Database (Vercel Postgres)

Three tables created by `/api/migrate`:

**`users`** — registered accounts
- `id`, `email`, `name`, `auth_provider` (google / email), `tier` (free / basic), `google_id`, `created_at`, `updated_at`

**`trips`** — saved itineraries from the Plan Your Trip wizard
- `id`, `user_id`, `email`, `season`, `group_type`, `trip_length`, `activities` (JSONB), `level`, `shores` (JSONB), `notes`, `created_at`

**`onboarding`** — completed onboarding profiles
- `id`, `email`, `name`, `tier`, `auth_provider`, `season`, `stay_type`, `group_type`, `trip_length`, `activities` (JSONB), `shores` (JSONB), `camp_features` (JSONB), `raw` (JSONB), `created_at`

### Components

| Component | What it does |
|---|---|
| `Nav.tsx` | Sticky nav bar, active route highlighting via `usePathname()` |
| `Footer.tsx` | Live conditions ticker, fire alert bar, social links, legal footer |
| `CampsiteMap.tsx` | Leaflet map for campsites — custom colored dot markers, popups, pan-to-selected |
| `TrailheadMap.tsx` | Leaflet map with OpenTopoMap topo tiles — triangle markers colored by difficulty |
| `AmenitiesMap.tsx` | Leaflet map for amenities — color-coded by type |

### Libraries (`/lib`)

| File | What it contains |
|---|---|
| `data.ts` | TypeScript types + all inline fallback data (camps, activities, amenities, weather) |
| `db.ts` | Vercel Postgres client — `sql` tagged template, `upsertUser()`, CORS headers |
| `trailheads.ts` | 20 curated Tahoe trailheads with difficulty, distance, elevation, permit, parking, dogs |
| `narrative.ts` | Template engine for personalized trip briefs — assembles from user answers, zero API calls |

---

## Campground Data

10 verified campgrounds covering all four shores. All booking URLs confirmed.

| Campground | Shore | System | URL |
|---|---|---|---|
| D.L. Bliss State Park | West | ReserveCalifornia | reservecalifornia.com `#!park/718` |
| Emerald Bay — Eagle Point | West | ReserveCalifornia | reservecalifornia.com `#!park/121` |
| Sugar Pine Point — General Creek | West | ReserveCalifornia | reservecalifornia.com `#!park/120` |
| William Kent Campground | West | Recreation.gov | campground/232874 |
| Meeks Bay Resort | West | Recreation.gov | campground/10220612 |
| Fallen Leaf Lake | South | Recreation.gov | campground/232769 |
| Camp Richardson RV Village | South | Recreation.gov | campground/10305470 |
| Nevada Beach | East | Recreation.gov | campground/232768 |
| Zephyr Cove RV & Campground | East | Recreation.gov | campground/10300216 |
| Spooner Backcountry | East | Nevada State Parks | parks.nv.gov/parks/spooner-lake |

---

## Trailhead Data

20 curated trailheads in `lib/trailheads.ts`. Each entry includes:
- Name, trail name, coordinates, shore
- Difficulty (easy / moderate / strenuous / expert)
- Distance (round-trip miles), elevation gain, max elevation
- Trail use (hiking / MTB / equestrian)
- Season window, permit requirement, parking fee, dog policy
- Highlights array, description, external info URL

Coverage includes the Tahoe Rim Trail (all 6 major trailheads), Desolation Wilderness entries, signature hikes (Mt. Tallac, Eagle Falls, Rubicon, Vikingsholm, Cascade Falls), east shore (Flume Trail, Sand Harbor, Marlette Lake), and backcountry routes (Dick's Peak, Relay Peak, Ellis Peak).

---

## Personalized Trip Narrative

The Plan Your Trip wizard generates a 4-paragraph personalized brief using a template engine in `lib/narrative.ts`. No API calls, no cost, loads instantly.

Assembly uses the user's actual answers:
- **Paragraph 1** — personal opener with first name + shore description
- **Paragraph 2** — season-specific conditions (water temp, snow, crowds, booking timing)
- **Paragraph 3** — activity tips for top 2 activities, matched to their shore (10 activities × 4 shores = 40 unique variants)
- **Paragraph 4** — campsite booking urgency + trip-length logistics

---

## Tiers

Two tiers — Free and Basic ($3.99/month, $3.19/month billed annually).

**Free includes:** campsite map, 7-day weather forecast, fire alerts, activity overview (all 12), lake conditions, basic trail status.

**Basic adds:** kayak and bike rental directories, live campsite availability alerts, activity depth guides and tips, backcountry permit guides, fishing charter listings, ski and snow conditions, 15 saved trips.

Tier gating is implemented in the Activities page. Locked activities show a "Basic" badge and an upgrade link. No hard blocks — the content is explained either way.

---

## Data Sources

| Data | Source | Key required | Cache |
|---|---|---|---|
| Campsite availability | Recreation.gov RIDB API | `RECGOV_KEY` | 15 min (Vercel CDN) |
| Trailheads (live) | OpenStreetMap Overpass API | None | 24 hr (Vercel CDN) |
| Trailheads (fallback) | Curated — `lib/trailheads.ts` | None | Static |
| Campground data (fallback) | Curated — `lib/data.ts` | None | Static |
| Weather / conditions | Curated — `lib/data.ts` | None | Static (update manually) |
| Map tiles | OpenTopoMap (trails) / OpenStreetMap (camps + amenities) | None | Browser cache |
| User data | Vercel Postgres | `POSTGRES_URL` (auto-injected) | Live |

---

## Maps

Three separate Leaflet map instances, all `dynamic()` imported with `ssr: false` because Leaflet requires `window`.

- **Campsite map** — OpenStreetMap tiles, dot markers colored by availability (green / yellow / red)
- **Trailhead map** — OpenTopoMap topo tiles, triangle markers colored by difficulty, pan-to-selected on sidebar click
- **Amenities map** — OpenStreetMap tiles, dot markers colored by category (bike / sport / camp / grocery / gas / rental)

All map tiles are free, no API key required. Attribution included per OpenStreetMap ODbL license.

---

## Environment Variables

Set these in Vercel → Settings → Environment Variables.

| Variable | Where to get it | Required |
|---|---|---|
| `DATABASE_URL` | Auto-injected when you connect Neon via Vercel dashboard | Yes |
| `RECGOV_KEY` | ridb.recreation.gov — free, instant | Yes — live campsite data |
| `MIGRATE_SECRET` | Any string you choose | Yes — run `/api/migrate` once |
| `OPENWEATHER_API_KEY` | openweathermap.org — free, no card | Yes — live weather |
| `AIRNOW_API_KEY` | docs.airnowapi.org — free, instant | Optional — air quality |
| `GOOGLE_CLIENT_ID` | console.cloud.google.com | When Google OAuth is connected |
| `GOOGLE_CLIENT_SECRET` | console.cloud.google.com | When Google OAuth is connected |

**No key needed** — these three use free public federal data APIs:
- `/api/fire` — USFS LTBMU public alerts feed (fire restrictions)
- `/api/lake` — USGS gauge 10337000 at Tahoe City (lake level, 6-hr cache)
- `/api/snow` — NRCS SNOTEL network (snow depth, 6-hr cache)

---

## Images Required

Place these in `/public/assets/`. Copy from your existing server via cPanel or FTP.

| File | Used on | Spec |
|---|---|---|
| `hero-tahoe.jpg` | Home page hero background | 2400px wide, JPEG |
| `activity-camping.jpg` | Home page activity grid | 800×450px, 16:9 |
| `activity-hiking.jpg` | Home page activity grid | 800×450px, 16:9 |
| `activity-mtb.jpg` | Home page activity grid | 800×450px, 16:9 |
| `activity-kayaking.jpg` | Home page activity grid | 800×450px, 16:9 |
| `activity-skiing.jpg` | Home page activity grid | 800×450px, 16:9 |
| `activity-boating.jpg` | Home page activity grid | 800×450px, 16:9 |
| `favicon.ico` | Browser tab | Already included |
| `icon-180.png` | Apple Touch Icon | Already included |
| `icon-192.png` | Android / PWA | Already included |

All images fall back gracefully — the hero shows a dark blue gradient, activity cards show their emoji icon — so the site works without them.

---

## Local Development

```bash
# Install dependencies
npm install

# Copy Vercel Postgres connection strings from:
# Vercel Dashboard → Storage → your database → .env.local tab
# Paste into .env.local

npm run dev
# → http://localhost:3000
```

---

## Deployment

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/trailstv.git
git push -u origin main

# 2. Connect on Vercel
# vercel.com → New Project → Import repo → Framework: Next.js → Deploy

# 3. Add Neon Postgres via Vercel Marketplace
# Vercel dashboard → Add integration → Neon Postgres → Connect to project
# This injects DATABASE_URL automatically

# 4. Add environment variables in Vercel dashboard

# 5. Create database tables (run once)
# https://your-project.vercel.app/api/migrate?secret=YOUR_MIGRATE_SECRET
```

---

## What's Not Yet Connected

| Feature | Status | What's needed |
|---|---|---|
| Google OAuth | UI complete, simulated | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `/api/auth/google` callback route |
| Live weather | Static fallback data | Weather API integration (OpenWeatherMap or NWS) |
| Live fire conditions | Static fallback data | USFS or InciWeb API integration |
| Live ski conditions | Static fallback data | Snotel or resort API integration |
| Email login | UI complete | Magic link or password flow — needs `/api/auth/email` route |
| Campsite real-time availability | Proxied via Recreation.gov | Activate with `RECGOV_KEY` — already built |
