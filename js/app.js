/* ================================================================
   Lake Tahoe Planner — TrailsTV
   app.js — Main application
   All data loaded dynamically from /data/*.json
   ================================================================ */

'use strict';

// ═══════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  USE_MOCK:     true,   // true = mock data  |  false = call proxy
  USE_PROXY:    false,  // true = call /api/campsites proxy endpoint
  PROXY_URL:    '/api/campsites',
  DATA_BASE:    './data',  // path to JSON data files
  REFRESH_MS:   900000,    // auto-refresh interval (15 min)
};

// ═══════════════════════════════════════════════════════════════
//  RUNTIME STATE
// ═══════════════════════════════════════════════════════════════
let CAMPS     = [];   // loaded from data/camps.json
let AMENITIES = [];   // loaded from data/amenities.json
let ACTS      = [];   // loaded from data/activities.json
let SITE_DATA = {};   // loaded from data/site-data.json

let AMICONS  = { bike:'🚵', sport:'🏪', camp:'⛺', grocery:'🛒', gas:'⛽', rental:'🛶' };
let AMCOLORS = { bike:'#4AADBC', sport:'#D4A853', camp:'#6ABE3A', grocery:'#D47A3A', gas:'#8B9EA8', rental:'#4AADBC' };

let tier       = 'free';
let cFilter    = 'all';
let cSort      = 'avail';
let cSearch    = '';
let lmap       = null;
let amap       = null;
let markers    = {};
let amF        = 'all';
let loginTier  = 'free';
let campsData  = [];
let billingAnnual = false;
let _refreshLock  = false;

// ═══════════════════════════════════════════════════════════════
//  INLINE FALLBACK DATA
//  Used immediately on boot so the page works on any protocol.
//  Also used as .catch() fallback if JSON files can't be fetched.
// ═══════════════════════════════════════════════════════════════
const ACTS_FALLBACK = [
  {icon:'⛺',name:'Camping',         desc:"D.L. Bliss, Sugar Pine, Fallen Leaf — 300+ sites with lake views.",              tier:'f'},
  {icon:'🥾',name:'Hiking',          desc:"165+ miles of trails from Tahoe Rim to Desolation Wilderness.",                  tier:'f'},
  {icon:'🛶',name:'Kayaking',        desc:"Paddle Emerald Bay, Cave Rock, and Sand Harbor on crystal-clear water.",         tier:'b'},
  {icon:'🚵',name:'Mountain Biking', desc:"Flume Trail, Mr Toads Wild Ride — world-class Sierra singletrack.",              tier:'b'},
  {icon:'⛷️',name:'Skiing & Riding', desc:"14 resorts: Palisades, Heavenly, Northstar, Sierra-at-Tahoe, and more.",        tier:'b'},
  {icon:'🏔️',name:'Snowshoeing',    desc:"Ellis Peak, Spooner Lake, Cascade Falls — serene winter wonderlands.",           tier:'b'},
  {icon:'🎣',name:'Fishing',         desc:"Mackinaw trout up to 37 lbs. Guided lake charters year-round.",                 tier:'b'},
  {icon:'🏄',name:'Paddleboarding',  desc:"Glassy morning water, 70+ ft visibility. Rentals at 8 locations.",              tier:'b'},
  {icon:'🧗',name:'Rock Climbing',   desc:"Lovers Leap and Luther Spires — world-class granite sport climbing.",            tier:'b'},
  {icon:'🌲',name:'Backpacking',     desc:"Desolation Wilderness multi-day routes through dramatic Sierra terrain.",        tier:'b'},
  {icon:'🏊',name:'Swimming',        desc:"Sand Harbor, Emerald Bay, Kings Beach — pristine, 70+ ft clarity.",             tier:'f'},
  {icon:'🦅',name:'Wildlife Watching',desc:"Black bears, bald eagles, mule deer — guided tours spring through fall.",      tier:'b'},
];

const AMENITIES_FALLBACK = [
  {name:'Tahoe Sports Ltd',          type:'bike',    lat:39.1682, lng:-120.1513, loc:'Tahoe City',        note:'Rentals & repair'},
  {name:'Shoreline MTB Shop',        type:'bike',    lat:38.9380, lng:-119.9820, loc:'South Lake Tahoe',  note:'MTB specialists'},
  {name:'REI — South Lake Tahoe',    type:'sport',   lat:38.9310, lng:-119.9780, loc:'South Lake Tahoe',  note:'Full outfitter'},
  {name:'Tahoe Outdoor Center',      type:'sport',   lat:39.1690, lng:-120.1490, loc:'Tahoe City',        note:'Gear & advice'},
  {name:'Basin Gear & Supply',       type:'camp',    lat:39.2350, lng:-120.0200, loc:'Kings Beach',       note:'Camping specialist'},
  {name:'Safeway — Lake Tahoe Blvd', type:'grocery', lat:38.9270, lng:-119.9820, loc:'South Lake Tahoe',  note:'Open 6am–11pm'},
  {name:'New Moon Natural Foods',    type:'grocery', lat:39.1695, lng:-120.1500, loc:'Tahoe City',        note:'Organic & local'},
  {name:'Shell — Stateline Ave',     type:'gas',     lat:38.9670, lng:-119.9430, loc:'Stateline',         note:'24hr · Convenience'},
  {name:'Chevron — Kings Beach',     type:'gas',     lat:39.2370, lng:-120.0220, loc:'Kings Beach',       note:'Firewood available'},
  {name:'Tahoe Paddle & Oar',        type:'rental',  lat:39.2360, lng:-120.0230, loc:'Kings Beach',       note:'Kayak, SUP, pontoon'},
  {name:'Emerald Bay Water Sports',  type:'rental',  lat:38.9540, lng:-120.1060, loc:'South Lake Tahoe',  note:'Guided kayak tours'},
];

const CAMPS_FALLBACK = [
  {id:'dlbliss',name:"D.L. Bliss State Park",lat:38.9695,lng:-120.1035,shore:'west',sites:168,available:18,limited:false,full:false,fee:35,hookups:false,pets:true,res:true,amenities:['Flush Toilets','Hot Showers','Dump Station','Beach Access','Bear Boxes'],desc:"One of Tahoe's most beloved campgrounds — reopened May 2026.",phone:'530-525-7277',url:'https://www.reservecalifornia.com/CaliforniaWebHome/Facilities/AdvanceSearch.aspx',bookSystem:'ReserveCalifornia',img:'⛺',region:'CA State Parks · West Shore'},
  {id:'eaglepoint',name:"Emerald Bay — Eagle Point",lat:38.9540,lng:-120.1060,shore:'west',sites:97,available:4,limited:true,full:false,fee:35,hookups:false,pets:false,res:true,amenities:['Flush Toilets','Coin Showers','Fire Rings','Bear Boxes'],desc:"97-site campground inside Emerald Bay State Park.",phone:'530-541-3030',url:'https://www.reservecalifornia.com/CaliforniaWebHome/Facilities/AdvanceSearch.aspx',bookSystem:'ReserveCalifornia',img:'🏰',region:'CA State Parks · West Shore'},
  {id:'sugarpine',name:"Sugar Pine Point — General Creek",lat:39.0418,lng:-120.1120,shore:'west',sites:175,available:31,limited:false,full:false,fee:35,hookups:false,pets:true,res:true,amenities:['Flush Toilets','Showers','Fire Rings','Boat Ramp'],desc:"175 sites — one loop stays open year-round.",phone:'530-525-7982',url:'https://www.reservecalifornia.com/CaliforniaWebHome/Facilities/AdvanceSearch.aspx',bookSystem:'ReserveCalifornia',img:'🌲',region:'CA State Parks · West Shore'},
  {id:'232769',name:'Fallen Leaf Lake Campground',lat:38.8980,lng:-120.0540,shore:'south',sites:206,available:0,limited:false,full:true,fee:30,hookups:false,pets:true,res:true,amenities:['Flush Toilets','6 Yurts','Boat Ramp','Dump Station'],desc:"206 sites on serene Fallen Leaf Lake. Yurts sleep 5-6.",phone:'530-541-1537',url:'https://www.recreation.gov/camping/campgrounds/232769',bookSystem:'Recreation.gov',img:'🍂',region:'USFS · South Shore'},
  {id:'232768',name:'Nevada Beach Campground',lat:38.9630,lng:-119.9280,shore:'east',sites:54,available:12,limited:false,full:false,fee:32,hookups:false,pets:true,res:true,amenities:['Flush Toilets','Sandy Beach','Fire Rings','Accessible Sites'],desc:"USFS camp with the widest beach on Tahoe.",phone:'775-588-5562',url:'https://www.recreation.gov/camping/campgrounds/232768',bookSystem:'Recreation.gov',img:'🏖️',region:'USFS · East Shore'},
  {id:'232874',name:'William Kent Campground',lat:39.0895,lng:-120.1340,shore:'west',sites:95,available:19,limited:false,full:false,fee:32,hookups:false,pets:true,res:true,amenities:['Flush Toilets','Showers','3 Yurts','Fire Rings'],desc:"USFS camp 2 miles south of Tahoe City under tall pines.",phone:'530-541-1537',url:'https://www.recreation.gov/camping/campgrounds/232874',bookSystem:'Recreation.gov',img:'🌲',region:'USFS · West Shore'},
  {id:'10220612',name:'Meeks Bay Resort & Campground',lat:39.0226,lng:-120.1182,shore:'west',sites:77,available:8,limited:false,full:false,fee:42,hookups:true,pets:false,res:true,amenities:['Sandy Beach','Kayak & SUP Rentals','Washoe Tribe Operated'],desc:"Washoe Tribe-operated resort. Sandy beach, kayak rentals. No pets.",phone:'530-214-9422',url:'https://www.recreation.gov/camping/campgrounds/10220612',bookSystem:'Recreation.gov',img:'🌊',region:'Meeks Bay Resort · West Shore'},
  {id:'10300216',name:'Zephyr Cove RV & Campground',lat:38.9945,lng:-119.9390,shore:'east',sites:149,available:22,limited:false,full:false,fee:45,hookups:true,pets:true,res:true,amenities:['92 Full-Hookup RV Sites','47 Walk-In Tent Sites','Marina','Restaurant'],desc:"Southeast shore resort. Steps from the MS Dixie II and marina.",phone:'775-589-4906',url:'https://www.recreation.gov/camping/campgrounds/10300216',bookSystem:'Recreation.gov',img:'⚓',region:'Zephyr Cove Resort · East Shore'},
  {id:'10305470',name:"Camp Richardson — RV Village",lat:38.9345,lng:-120.0485,shore:'south',sites:98,available:15,limited:false,full:false,fee:55,hookups:true,pets:false,res:true,amenities:['Full Hookup RV Sites','Bar & Grill','General Store','Full Marina'],desc:"Historic Camp Richardson on the south shore. RV-only with full hookups.",phone:'530-494-2228',url:'https://www.recreation.gov/camping/campgrounds/10305470',bookSystem:'Recreation.gov',img:'🏕️',region:'Camp Richardson · South Shore'},
  {id:'spooner',name:'Spooner Backcountry Campgrounds',lat:39.1020,lng:-119.9080,shore:'east',sites:15,available:6,limited:false,full:false,fee:15,hookups:false,pets:false,res:false,amenities:['Vault Toilets','Bear Boxes','Walk-In Only','Flume Trail Access'],desc:"Three primitive hike-in campgrounds. First-come, first-served.",phone:'775-831-0494',url:'https://parks.nv.gov/parks/lake-tahoe-nevada-state-park',bookSystem:'Nevada State Parks (First-Come)',img:'🚵',region:'NV State Parks · East Shore'},
];

const SITE_DATA_FALLBACK = {
  meta:{lastUpdated:null,source:'fallback'},
  weather:{
    current:{tempF:72,feelsLike:69,humidity:38,windMph:8,condition:'Sunny',icon:'☀️'},
    waterTempF:65,
    forecast:[
      {day:'Today',    icon:'☀️', hi:72,lo:48,cond:'Sunny',         precip:0 },
      {day:'Tomorrow', icon:'⛅', hi:68,lo:45,cond:'Partly Cloudy', precip:10},
      {day:'Thu',      icon:'🌤',hi:74,lo:50,cond:'Mostly Clear',  precip:5 },
      {day:'Fri',      icon:'⛈', hi:61,lo:44,cond:'PM Storms',     precip:75},
      {day:'Sat',      icon:'☀️', hi:76,lo:49,cond:'Sunny',         precip:0 },
      {day:'Sun',      icon:'🌤',hi:73,lo:47,cond:'Mostly Clear',  precip:5 },
      {day:'Mon',      icon:'⛅', hi:69,lo:46,cond:'Partly Cloudy', precip:15},
    ],
  },
  lake:{levelFt:6222.4,levelStatus:'normal',clarityFt:71,visibility:'exceptional'},
  trails:{status:'open',statusLabel:'All Open',snowFreeBelow:7200,mudConditions:'dry',alerts:[]},
  fire:{restrictionLevel:1,restrictionLabel:'Stage 1',activeIncidents:0,alertText:'Stage 1 Fire Restrictions in effect. No campfires outside designated fire rings.',alertActive:true},
  camping:{totalAvailable:0},
  ski:{season:'off',baseDepthIn:0,newSnow48hrIn:0,resortCount:14,openResorts:0,
    resorts:[
      {name:'Palisades Tahoe',open:false,base:0,new48:0},
      {name:'Heavenly',       open:false,base:0,new48:0},
      {name:'Northstar',      open:false,base:0,new48:0},
      {name:'Sierra-at-Tahoe',open:false,base:0,new48:0},
    ]},
};

// ═══════════════════════════════════════════════════════════════
//  BOOT — load all JSON then initialise
// ═══════════════════════════════════════════════════════════════
async function boot() {
  // ── Always start immediately with inline fallback data ───────────────────
  // This guarantees the page renders and navigation works on ANY protocol
  // including file://, before any network requests are attempted.
  CAMPS     = CAMPS_FALLBACK;
  AMENITIES = AMENITIES_FALLBACK;
  ACTS      = ACTS_FALLBACK;
  SITE_DATA = { ...SITE_DATA_FALLBACK };
  campsData = CAMPS_FALLBACK;
  SITE_DATA.camping = SITE_DATA.camping || {};
  SITE_DATA.camping.totalAvailable = CAMPS.reduce(
    (n, c) => n + (avSt(c) !== 'full' ? c.available : 0), 0
  );
  SITE_DATA.meta = { lastUpdated: new Date(), source: 'fallback' };

  // ── Render everything now — page is fully interactive ────────────────────
  renderSiteData(SITE_DATA);

  // ── Upgrade data from JSON files if running on http:// ───────────────────
  // Skip silently on file:// to avoid console errors
  if (window.location.protocol === 'file:') return;

  try {
    const [camps, amenities, acts, siteData] = await Promise.all([
      fetchJSON(`${CONFIG.DATA_BASE}/camps.json`).catch(() => CAMPS_FALLBACK),
      fetchJSON(`${CONFIG.DATA_BASE}/amenities.json`).catch(() => AMENITIES_FALLBACK),
      fetchJSON(`${CONFIG.DATA_BASE}/activities.json`).catch(() => ACTS_FALLBACK),
      fetchJSON(`${CONFIG.DATA_BASE}/site-data.json`).catch(() => SITE_DATA_FALLBACK),
    ]);

    CAMPS     = camps;
    AMENITIES = amenities;
    ACTS      = acts;
    SITE_DATA = siteData;
    campsData = camps;

    // Compute initial camping total
    SITE_DATA.camping = SITE_DATA.camping || {};
    SITE_DATA.camping.totalAvailable = CAMPS.reduce(
      (n, c) => n + (avSt(c) !== 'full' ? c.available : 0), 0
    );
    SITE_DATA.meta = SITE_DATA.meta || {};
    SITE_DATA.meta.lastUpdated = new Date();

    // Render everything
    renderSiteData(SITE_DATA);
    startAutoRefresh();

  } catch (err) {
    console.error('Boot failed — falling back to inline stubs:', err);
    // Graceful degradation: page still works with empty data
    SITE_DATA = { weather:{ forecast:[], current:{tempF:72}, waterTempF:65 }, camping:{totalAvailable:0}, lake:{levelFt:6222,clarityFt:71}, trails:{status:'open',statusLabel:'Open'}, fire:{restrictionLevel:1,restrictionLabel:'Stage 1',alertActive:true,alertText:'Stage 1 Fire Restrictions in effect.'}, ski:{season:'off',baseDepthIn:0,openResorts:0,resortCount:14}, meta:{} };
    renderSiteData(SITE_DATA);
  }
}

async function fetchJSON(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`${url} → ${resp.status}`);
  return resp.json();
}

// ═══════════════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════════════
function SP(id) {
  const target = document.getElementById('page-' + id);
  if (!target) { console.warn('SP: no page found for id:', id); return; }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  target.classList.add('active');
  document.querySelectorAll('.nl').forEach(b => b.classList.remove('active'));
  const nb = document.getElementById('nav-' + id);
  if (nb) nb.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (id === 'camp' && !lmap)   initCampMap();
  if (id === 'map'  && !amap)   initAMap();
  if (id === 'act')              renderActs();
  if (id === 'plan')             initPlanPage();
}

function scrollToActivity(id) {
  if (!document.getElementById('page-home').classList.contains('active')) {
    SP('home');
    setTimeout(() => {
      const el = document.getElementById('act-' + id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  } else {
    const el = document.getElementById('act-' + id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ═══════════════════════════════════════════════════════════════
//  CAMPSITE AVAILABILITY STATUS
// ═══════════════════════════════════════════════════════════════
function avSt(c) {
  if (c.full || c.available === 0) return 'full';
  if (c.limited || c.available <= 5) return 'limited';
  return 'open';
}

// ═══════════════════════════════════════════════════════════════
//  CAMP API FETCH (proxy or mock)
// ═══════════════════════════════════════════════════════════════
async function fetchCamps() {
  if (CONFIG.USE_MOCK) {
    await new Promise(r => setTimeout(r, 650));
    return CAMPS;
  }
  if (CONFIG.USE_PROXY) {
    const p = new URLSearchParams({
      latitude: 39.0968, longitude: -120.0324, radius: 25, limit: 50, activity: 'CAMPING'
    });
    const resp = await fetch(CONFIG.PROXY_URL + '?' + p);
    if (!resp.ok) throw new Error('Proxy returned ' + resp.status);
    const d = await resp.json();
    if (!d.RECDATA || !d.RECDATA.length) {
      console.warn('Proxy: no RECDATA, falling back to static');
      return CAMPS;
    }
    return d.RECDATA
      .filter(x => x.FacilityLatitude && x.FacilityLongitude)
      .map(x => ({
        id:        String(x.FacilityID),
        name:      x.FacilityName,
        lat:       parseFloat(x.FacilityLatitude),
        lng:       parseFloat(x.FacilityLongitude),
        sites:     Math.floor(Math.random() * 120) + 20,
        available: Math.floor(Math.random() * 35) + 1,
        fee:       25,
        hookups:   false, pets: true, res: !!x.FacilityReservationURL,
        limited: false, full: false,
        amenities: x.ATTRIBUTES ? x.ATTRIBUTES.slice(0, 5).map(a => a.AttributeName) : ['Toilets', 'Fire Rings'],
        desc:      x.FacilityDescription ? x.FacilityDescription.replace(/<[^>]+>/g, '').slice(0, 200) : 'Campground in the Lake Tahoe basin.',
        url:       x.FacilityReservationURL || 'https://www.recreation.gov/camping/campgrounds/' + x.FacilityID,
        img: '⛺', region: 'Recreation.gov', shore: 'west', bookSystem: 'Recreation.gov',
      }));
  }
  console.warn('USE_MOCK and USE_PROXY are both false — returning static data.');
  return CAMPS;
}

// ═══════════════════════════════════════════════════════════════
//  CAMPSITE MAP (Leaflet)
// ═══════════════════════════════════════════════════════════════
function mkHtml(st) {
  const bg  = st === 'open' ? '#1a4a2e' : st === 'limited' ? '#3a2e0a' : '#3a0a0a';
  const bc  = st === 'open' ? 'rgba(74,188,110,.4)' : st === 'limited' ? 'rgba(212,168,83,.5)' : 'rgba(220,60,60,.4)';
  const em  = st === 'open' ? '🟢' : st === 'limited' ? '🟡' : '🔴';
  return `<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${bg};border:2px solid ${bc};display:flex;align-items:center;justify-content:center;cursor:pointer"><span style="transform:rotate(45deg);font-size:.9rem">${em}</span></div>`;
}

function initCampMap() {
  lmap = L.map('lmap', { center: [39.0968, -120.0324], zoom: 11 });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>', maxZoom: 18
  }).addTo(lmap);

  const today = new Date();
  const arr   = new Date(today); arr.setDate(arr.getDate() + 7);
  const dep   = new Date(arr);   dep.setDate(dep.getDate() + 3);
  document.getElementById('arr').value = arr.toISOString().split('T')[0];
  document.getElementById('dep').value = dep.toISOString().split('T')[0];
  updNights();
  loadCamps();
}

async function loadCamps() {
  document.getElementById('cresults').innerHTML =
    '<div class="spin-wrap"><div class="spinner"></div>Fetching campgrounds…</div>';
  try {
    campsData = await fetchCamps();
    Object.values(markers).forEach(m => m.remove());
    markers = {};
    campsData.forEach(addMk);
    renderCards();
    updSidebarAvail();
    updateCampMini();
    const ss = document.getElementById('stat-sites'); if (ss) ss.textContent = campsData.reduce((n, c) => n + (avSt(c) !== 'full' ? c.available : 0), 0);
    const hs = document.getElementById('hero-sites'); if (hs) hs.textContent = campsData.reduce((n, c) => n + (avSt(c) !== 'full' ? c.available : 0), 0) + ' ⛺';
  } catch (e) {
    document.getElementById('cresults').innerHTML =
      '<div class="spin-wrap" style="color:#E24B4A">⚠️ Could not load campgrounds.</div>';
  }
}

function addMk(c) {
  const st   = avSt(c);
  const icon = L.divIcon({ html: mkHtml(st), className: '', iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -36] });
  const mk   = L.marker([c.lat, c.lng], { icon }).addTo(lmap);
  mk.bindPopup(popHtml(c), { maxWidth: 270 });
  mk.on('click', () => hlCard(c.id));
  mk.on('mouseover', function () { this.openPopup(); });
  markers[c.id] = mk;
}

function popHtml(c) {
  const s  = avSt(c);
  const av = s === 'open'
    ? `<span style="color:#6ABE3A;font-weight:700">● ${c.available} sites open</span>`
    : s === 'limited'
    ? `<span style="color:var(--gold);font-weight:700">● ${c.available} left</span>`
    : `<span style="color:#E24B4A;font-weight:700">● Full</span>`;
  return `<div style="font-family:'Inter',sans-serif;min-width:195px">
    <div style="font-weight:700;font-size:.92rem;margin-bottom:3px">${c.img} ${c.name}</div>
    <div style="font-size:.73rem;color:#8B9EA8;margin-bottom:6px">${c.region}</div>
    <div style="font-size:.76rem;margin-bottom:7px">${av}</div>
    <div style="font-size:.73rem;color:#8B9EA8">$${c.fee}/night · ${c.hookups ? 'Hookups ⚡' : 'Tent/RV'}</div>
    <div style="font-size:.68rem;color:#8B9EA8;margin-top:5px">Books via: ${c.bookSystem || 'Recreation.gov'}</div>
    <button onclick="openCD('${c.id}')" style="margin-top:8px;width:100%;background:#4AADBC;color:#0D1B2A;border:none;border-radius:6px;padding:7px;font-weight:700;font-size:.76rem;cursor:pointer">View Details &amp; Book →</button>
  </div>`;
}

function getFiltered() {
  return campsData.filter(c => {
    if (cFilter === 'avail' && avSt(c) === 'full') return false;
    if (['north', 'south', 'west', 'east'].includes(cFilter) && c.shore !== cFilter) return false;
    if (cSearch && !c.name.toLowerCase().includes(cSearch.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (cSort === 'name') return a.name.localeCompare(b.name);
    const o = { open: 0, limited: 1, full: 2 };
    return o[avSt(a)] - o[avSt(b)];
  });
}

function renderCards() {
  const list = getFiltered();
  document.getElementById('rlabel').textContent = `${list.length} campground${list.length !== 1 ? 's' : ''} found`;
  if (!list.length) {
    document.getElementById('cresults').innerHTML =
      '<div style="padding:2rem;color:var(--granite);font-size:.86rem">No campgrounds match your filters.</div>';
    return;
  }
  document.getElementById('cresults').innerHTML = list.map(c => {
    const s    = avSt(c);
    const bc   = s === 'open' ? 'ao' : s === 'limited' ? 'al' : 'afl';
    const bt   = s === 'open' ? `${c.available} sites open` : s === 'limited' ? `${c.available} left` : 'Full';
    const bookLabel = c.bookSystem === 'ReserveCalifornia'
      ? 'Reserve on ReserveCalifornia.com →'
      : c.bookSystem && c.bookSystem.includes('Nevada')
      ? 'View Nevada State Parks →'
      : 'Reserve on Recreation.gov →';
    const tags = [
      c.hookups ? '🔌 Hookups' : '🏕️ Tent/RV',
      c.pets ? '🐕 Pets OK' : '🚫 No Pets',
      c.res ? '📅 Reservable' : '🎲 First-Come',
      `$${c.fee}/night`
    ].map(t => `<span class="ctg">${t}</span>`).join('');
    const bk = s === 'full'
      ? `<button class="bkbtn full" disabled>Campground Full — Check Back</button>`
      : `<button class="bkbtn" onclick="openRec('${c.url}')">${bookLabel}</button>`;
    return `<div class="ccard" id="cc-${c.id}" onclick="focC('${c.id}')">
      <div class="ch"><div class="cn">${c.img} ${c.name}</div><span class="ab ${bc}">${bt}</span></div>
      <div class="cm">${tags}</div>
      <div class="crow"><span>Region</span><span>${c.region}</span></div>
      <div class="crow"><span>Shore</span><span>${c.shore.charAt(0).toUpperCase() + c.shore.slice(1)}</span></div>
      <div class="crow"><span>Total sites</span><span>${c.sites}</span></div>
      <p style="font-size:.74rem;color:var(--granite);line-height:1.55;margin-top:.65rem">${c.desc.slice(0, 95)}…</p>
      ${bk}
      <button onclick="openCD('${c.id}');event.stopPropagation()" style="width:100%;margin-top:.4rem;background:transparent;border:1px solid var(--cborder);color:var(--granite);border-radius:7px;font-family:'Inter',sans-serif;font-size:.74rem;padding:7px;cursor:pointer;transition:all .2s" onmouseover="this.style.borderColor='var(--glacial)'" onmouseout="this.style.borderColor='var(--cborder)'">View Full Details</button>
    </div>`;
  }).join('');
}

function focC(id) {
  const c = campsData.find(x => x.id === id); if (!c) return;
  lmap.flyTo([c.lat, c.lng], 13, { animate: true, duration: .75 });
  markers[id]?.openPopup();
  hlCard(id);
}

function hlCard(id) {
  document.querySelectorAll('.ccard').forEach(e => e.classList.remove('hl'));
  const el = document.getElementById('cc-' + id);
  if (el) { el.classList.add('hl'); el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
}

function setCF(btn, v) {
  cFilter = v;
  document.querySelectorAll('#page-camp .mfb').forEach(b => b.classList.remove('act'));
  btn.classList.add('act');
  renderCards();
  const vis = new Set(getFiltered().map(c => c.id));
  Object.entries(markers).forEach(([id, mk]) => {
    const el = mk.getElement(); if (el) el.style.opacity = vis.has(id) ? '1' : '0.22';
  });
}

function filterC()      { cSearch = document.getElementById('csearch').value; renderCards(); }
function sortC(by)      { cSort = by; document.getElementById('sn').classList.toggle('act', by === 'name'); document.getElementById('sa').classList.toggle('act', by === 'avail'); renderCards(); }
function refreshC()     { loadCamps(); }
function onDC()         { updNights(); }
function openRec(url)   { window.open(url, '_blank'); }

function updNights() {
  const a = document.getElementById('arr').value;
  const d = document.getElementById('dep').value;
  const b = document.getElementById('nbadge');
  if (a && d) {
    const diff = Math.round((new Date(d) - new Date(a)) / 86400000);
    b.textContent = diff > 0 ? `${diff} night${diff !== 1 ? 's' : ''}` : 'Invalid range';
    b.style.color = diff > 0 ? 'var(--glacial)' : '#E24B4A';
  } else { b.textContent = 'Select dates'; }
}

function updSidebarAvail() {
  const el = document.getElementById('savail'); if (!el) return;
  el.innerHTML = campsData.slice(0, 5).map(c => {
    const s = avSt(c);
    const cls = s === 'open' ? 'dg-btn' : s === 'limited' ? 'dy-btn' : 'dr-btn';
    const txt = s === 'open' ? `${c.available} open` : s === 'limited' ? `${c.available} left` : 'Full';
    return `<div class="ar"><span>${c.name.split(' ').slice(0, 3).join(' ')}</span><span class="${cls}">● ${txt}</span></div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
//  CAMP DETAIL MODAL
// ═══════════════════════════════════════════════════════════════
function openCD(id) {
  const c = campsData.find(x => x.id === id); if (!c) return;
  const s = avSt(c);
  const today = new Date();
  const dn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const hdrs = dn.map(d => `<div class="chd">${d}</div>`).join('');
  const cal = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() + i);
    const r = Math.random();
    const cls = s === 'full' ? 'cfull' : r > .7 ? 'cfull' : r > .45 ? 'clim' : 'cav';
    return `<div class="calday ${cls}">${d.getDate()}</div>`;
  }).join('');
  const resLabel = c.bookSystem === 'ReserveCalifornia'
    ? 'Reserve on ReserveCalifornia.com →'
    : c.bookSystem && c.bookSystem.includes('Nevada')
    ? 'View Nevada State Parks →'
    : 'Reserve on Recreation.gov →';
  document.getElementById('cdbody').innerHTML = `
    <h2 style="font-family:var(--fd);font-size:1.35rem;margin-bottom:.22rem">${c.img} ${c.name}</h2>
    <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-bottom:.9rem">
      <span style="font-size:.73rem;color:var(--granite)">${c.region}</span>
      <span style="font-size:.63rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:2px 9px;border-radius:20px;background:${c.bookSystem === 'ReserveCalifornia' ? 'rgba(212,168,83,.12)' : 'rgba(74,173,188,.1)'};color:${c.bookSystem === 'ReserveCalifornia' ? 'var(--gold)' : 'var(--glacial)'}">📅 ${c.bookSystem || 'Recreation.gov'}</span>
      <span style="font-size:.73rem;color:var(--granite)">${c.phone}</span>
    </div>
    <p style="font-size:.81rem;color:rgba(242,245,247,.8);line-height:1.65;margin-bottom:.7rem">${c.desc}</p>
    <div class="cdgrid">
      <div class="cds"><div class="cdsl">Available</div><div class="cdsv" style="color:${s === 'full' ? '#E24B4A' : s === 'limited' ? 'var(--gold)' : '#6ABE3A'}">${s === 'full' ? 'Full' : c.available + ' sites'}</div></div>
      <div class="cds"><div class="cdsl">Nightly Fee</div><div class="cdsv">$${c.fee}</div></div>
      <div class="cds"><div class="cdsl">Total Sites</div><div class="cdsv">${c.sites}</div></div>
      <div class="cds"><div class="cdsl">Hookups</div><div class="cdsv">${c.hookups ? 'Yes ⚡' : 'No'}</div></div>
    </div>
    <div style="font-size:.64rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--granite);margin-bottom:.4rem">Amenities</div>
    <div class="cdam">${c.amenities.map(a => `<span class="cda">${a}</span>`).join('')}</div>
    <div style="font-size:.64rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--granite);margin-top:.7rem;margin-bottom:.38rem">Availability — Next 14 Days</div>
    <div style="display:flex;gap:.5rem;font-size:.66rem;color:var(--granite);margin-bottom:.38rem"><span style="color:#6ABE3A">● Open</span><span style="color:var(--gold)">● Limited</span><span style="color:#E24B4A">● Full</span></div>
    <div class="acal">${hdrs}${cal}</div>
    <div style="display:flex;gap:.7rem;margin-top:1.15rem">
      <a href="${c.url}" target="_blank" style="flex:1;text-align:center;background:var(--glacial);color:var(--midnight);text-decoration:none;border-radius:7px;padding:10px;font-weight:700;font-size:.82rem;display:block;transition:background .2s" onmouseover="this.style.background='#5BBFCE'" onmouseout="this.style.background='var(--glacial)'">${resLabel}</a>
      <button onclick="document.getElementById('cdoverlay').classList.remove('open')" style="padding:10px 16px;background:transparent;border:1px solid var(--cborder);color:var(--granite);border-radius:7px;font-family:'Inter',sans-serif;font-size:.8rem;cursor:pointer">Close</button>
    </div>`;
  document.getElementById('cdoverlay').classList.add('open');
}

// ═══════════════════════════════════════════════════════════════
//  AMENITY MAP
// ═══════════════════════════════════════════════════════════════
function initAMap() {
  amap = L.map('amap', { center: [39.05, -120.05], zoom: 11 });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 18
  }).addTo(amap);
  renderAMks();
  renderAMCards();
}

function renderAMks() {
  if (!amap) return;
  amap.eachLayer(l => { if (l instanceof L.Marker) amap.removeLayer(l); });
  AMENITIES.filter(a => amF === 'all' || a.type === amF).forEach(a => {
    const icon = L.divIcon({
      html: `<div style="background:${AMCOLORS[a.type]};width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid rgba(255,255,255,.28);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:.82rem">${AMICONS[a.type]}</span></div>`,
      className: '', iconSize: [26, 26], iconAnchor: [13, 26], popupAnchor: [0, -26]
    });
    L.marker([a.lat, a.lng], { icon }).addTo(amap)
      .bindPopup(`<b style="font-family:Inter,sans-serif">${a.name}</b><br><span style="font-size:.72rem;color:#8B9EA8">${a.loc} · ${a.note}</span>`);
  });
}

function filterAM(btn, t) {
  amF = t;
  document.querySelectorAll('#amfilters .mfb').forEach(b => b.classList.remove('act'));
  btn.classList.add('act');
  renderAMks();
  renderAMCards();
}

function renderAMCards() {
  document.getElementById('amcards').innerHTML = AMENITIES
    .filter(a => amF === 'all' || a.type === amF)
    .map(a => `<div class="amit"><div class="amicon">${AMICONS[a.type]}</div><div><div class="amname">${a.name}</div><div class="amdist">${a.loc} · ${a.note}</div></div></div>`)
    .join('');
}

// ═══════════════════════════════════════════════════════════════
//  ACTIVITIES PAGE (rendered from activities.json)
// ═══════════════════════════════════════════════════════════════
const TL = { f: 'Free', b: 'Basic', o: 'Basic' };
const TC = { f: 'cf',   b: 'cb',    o: 'cb' };

function renderActs() {
  if (!ACTS.length) return;
  document.getElementById('agrid').innerHTML = ACTS.map((a, idx) =>
    `<div class="card">
      <div class="ci">${a.icon}</div>
      <div class="ct">${a.name}</div>
      <div class="cd">${a.desc}</div>
      <span class="ctag ${TC[a.tier]}">${TL[a.tier]}</span>
      <button class="cbtn" id="abtn${idx}">Plan ${a.name}</button>
    </div>`
  ).join('');
  ACTS.forEach((a, idx) => {
    document.getElementById('abtn' + idx).onclick = () => {
      if (a.tier === 'f') { SP('plan'); return; }
      if (a.tier === 'b') reqTier('basic');
      if (a.tier === 'o') reqTier('basic');
    };
  });
}

function reqTier(needed) {
  const lv = { free: 0, basic: 1 };
  if ((lv[tier] || 0) >= (lv[needed] || 1)) { SP('plan'); return; }
  toast('Upgrade to Basic ($3.99/mo) to unlock this.');
  setTimeout(() => SP('price'), 1700);
}

// ═══════════════════════════════════════════════════════════════
//  CAMP MINI AVAILABILITY (home page)
// ═══════════════════════════════════════════════════════════════
function updateCampMini() {
  const mini = document.getElementById('camp-avail-mini'); if (!mini) return;
  if (!campsData.length) return;
  mini.innerHTML = campsData.slice(0, 5).map(c => {
    const s   = avSt(c);
    const cls = s === 'open' ? 'dg-btn' : s === 'limited' ? 'dy-btn' : 'dr-btn';
    const txt = s === 'open' ? `${c.available} open` : s === 'limited' ? `${c.available} left` : 'Full';
    return `<div class="cam-row"><span>${c.name.split(' ').slice(0, 4).join(' ')}</span><span class="${cls}">● ${txt}</span></div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
//  PLANNER
// ═══════════════════════════════════════════════════════════════
function addTrip() {
  const act = document.getElementById('asel')?.value || '';
  const loc = (document.getElementById('locin')?.value || '').trim();
  if (!act || !loc) { toast('Choose an activity and enter a location.'); return; }
  const icon = act.split(' ')[0];
  const name = act.replace(/^[^\s]+\s/, '') + ' — ' + loc;
  const s    = document.getElementById('tstart')?.value || '';
  const date = s ? new Date(s + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Upcoming';
  const li   = document.createElement('li');
  li.className = 'ti';
  li.innerHTML = `<span class="tic">${icon}</span><div class="tin"><div class="tn">${name}</div><div class="td">${date}</div></div><button class="rmv" onclick="remTrip(this)">✕</button>`;
  document.getElementById('tlist').appendChild(li);
  const _a=document.getElementById('asel'); if(_a)_a.value='';
  const _l=document.getElementById('locin'); if(_l)_l.value='';
  toast('Trip added to your itinerary! ✓');
}

function remTrip(btn) { btn.closest('.ti').remove(); }

// ═══════════════════════════════════════════════════════════════
//  TIER / LOGIN
// ═══════════════════════════════════════════════════════════════
function selTier(t) {
  tier = t;
  const b       = document.getElementById('tbadge');
  const labels  = { free: 'Free', basic: 'Basic' };
  const classes = { free: 'tf',   basic: 'tb'    };
  b.className   = 'tbadge ' + (classes[t] || 'tf');
  b.textContent = labels[t] || t;
  const msgs = {
    free:  'Free plan active. Explore Tahoe!',
    basic: 'Basic unlocked — full access to the entire basin. 🏔️🌊⛷️🛶',
  };
  toast(msgs[t] || 'Plan updated.');
}

function openLogin() { document.getElementById('lmodal').classList.add('open'); }
function swTab(t) {
  document.getElementById('tin').classList.toggle('act', t === 'in');
  document.getElementById('tup').classList.toggle('act', t === 'up');
  document.getElementById('tradios').style.display = t === 'up' ? 'block' : 'none';
}
function selR(el, t) {
  document.querySelectorAll('.tr-row').forEach(r => r.classList.remove('sel'));
  el.classList.add('sel');
  loginTier = (t === 'alltahoe' || t === 'oyster') ? 'basic' : t;
}
function doLogin() {
  selTier(loginTier || 'free');
  document.getElementById('lmodal').classList.remove('open');
  toast('Welcome to Lake Tahoe Planner! 🏔️');
}

['cdoverlay', 'lmodal'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); });
});

// ═══════════════════════════════════════════════════════════════
//  BILLING TOGGLE
// ═══════════════════════════════════════════════════════════════
const PRICES = { free: { mo: '$0', yr: '$0' }, basic: { mo: '$3.99', yr: '$3.19' } };

function toggleBilling() {
  billingAnnual = !billingAnnual;
  document.getElementById('bill-toggle').classList.toggle('on', billingAnnual);
  document.getElementById('bill-label-mo').style.color = billingAnnual ? 'var(--granite)' : 'var(--snow)';
  document.getElementById('bill-label-yr').style.color = billingAnnual ? 'var(--snow)' : 'var(--granite)';
  const key = billingAnnual ? 'yr' : 'mo';
  document.getElementById('price-free').textContent  = PRICES.free[key];
  document.getElementById('price-basic').innerHTML   = PRICES.basic[key] + '<span class="pamt2-sub">/mo</span>';
  document.getElementById('pper-basic').textContent  = billingAnnual ? 'billed annually' : 'billed monthly';
}

// ═══════════════════════════════════════════════════════════════
//  SITE DATA — fetch, render, refresh
// ═══════════════════════════════════════════════════════════════
async function fetchSiteData() {
  // PRODUCTION: replace with your real API endpoint
  // const resp = await fetch('https://api.trailstv.com/v1/tahoe/conditions');
  // return resp.json();

  // MOCK: simulate slight variation on refresh
  await new Promise(r => setTimeout(r, 800));
  const variance = () => Math.floor((Math.random() - .5) * 4);
  return {
    ...SITE_DATA,
    weather: {
      ...SITE_DATA.weather,
      current:    { ...SITE_DATA.weather.current, tempF: (SITE_DATA.weather?.current?.tempF || 72) + variance() },
      waterTempF: (SITE_DATA.weather?.waterTempF || 65) + Math.floor((Math.random() - .5) * 2),
    },
    camping: {
      totalAvailable: campsData.length
        ? campsData.reduce((n, c) => n + (avSt(c) !== 'full' ? c.available : 0), 0)
        : 0,
    },
    meta: { ...SITE_DATA.meta, lastUpdated: new Date(), source: 'mock' },
  };
}

function renderSiteData(d) {
  // Hero ribbon
  const hs = document.getElementById('hero-sites');
  if (hs) hs.textContent = (d.camping?.totalAvailable || '—') + ' ⛺';
  const ss = document.getElementById('stat-sites'); if (ss) ss.textContent = d.camping?.totalAvailable || '—';

  // Weather strip
  const wx = document.getElementById('wx-strip');
  if (wx && d.weather?.forecast?.length) {
    wx.innerHTML = d.weather.forecast.map(w =>
      `<div class="wxc">
        <div class="wxd">${w.day}</div>
        <div class="wxi">${w.icon}</div>
        <div class="wxt">${w.hi}°<span style="color:var(--granite);font-size:.72rem"> / ${w.lo}°</span></div>
        <div class="wxco">${w.cond}</div>
        ${w.precip > 0 ? `<div style="font-size:.62rem;color:#4AADBC;margin-top:2px">💧${w.precip}%</div>` : ''}
      </div>`
    ).join('');
  }

  // Footer live conditions
  const setFL = (id, val, cls) => {
    const el = document.getElementById(id); if (!el) return;
    el.textContent = val;
    el.className   = 'flr-val' + (cls ? ' ' + cls : '');
  };
  setFL('fl-water',  (d.weather?.waterTempF || '—') + '°F', (d.weather?.waterTempF || 0) >= 60 ? 'flr-good' : 'flr-warn');
  setFL('fl-high',   (d.weather?.current?.tempF || '—') + '°F', '');
  setFL('fl-sites',  d.camping?.totalAvailable || '—', (d.camping?.totalAvailable || 0) > 20 ? 'flr-good' : (d.camping?.totalAvailable || 0) > 5 ? 'flr-warn' : 'flr-alert');
  setFL('fl-trails', d.trails?.statusLabel || 'Open', d.trails?.status === 'open' ? 'flr-good' : 'flr-warn');
  setFL('fl-snow',   d.ski?.season === 'active' ? d.ski.baseDepthIn + '"' : 'Off-season', '');
  setFL('fl-fire',   d.fire?.restrictionLabel || 'None', d.fire?.restrictionLevel === 0 ? 'flr-good' : d.fire?.restrictionLevel === 1 ? 'flr-warn' : 'flr-alert');
  setFL('fl-lake',   (d.lake?.levelFt || '—') + ' ft', '');

  // Fire alert banner
  const alertBar = document.getElementById('footer-alert');
  const alertTxt = document.getElementById('footer-alert-text');
  if (alertBar && alertTxt) {
    if (d.fire?.alertActive && d.fire?.restrictionLevel > 0) {
      alertBar.classList.remove('hidden');
      alertTxt.textContent = d.fire.alertText;
    } else { alertBar.classList.add('hidden'); }
  }

  buildTicker(d);
  updateCampMini();
  updSidebarAvail();

  const lu = document.getElementById('footer-last-updated');
  if (lu && d.meta?.lastUpdated) {
    lu.textContent = 'Last updated: ' + new Date(d.meta.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

function buildTicker(d) {
  const track = document.getElementById('ticker-track'); if (!track) return;
  const items = [
    { label: 'Water Temp',        val: (d.weather?.waterTempF || '—') + '°F',   cls: (d.weather?.waterTempF || 0) >= 60 ? 'ti-good' : 'ti-warn' },
    { label: 'Today High',        val: (d.weather?.current?.tempF || '—') + '°F', cls: '' },
    { label: 'Sites Available',   val: (d.camping?.totalAvailable || '—') + ' sites', cls: (d.camping?.totalAvailable || 0) > 10 ? 'ti-good' : 'ti-warn' },
    { label: 'Lake Clarity',      val: (d.lake?.clarityFt || '—') + ' ft visibility', cls: 'ti-good' },
    { label: 'Lake Level',        val: (d.lake?.levelFt || '—') + ' ft',         cls: '' },
    { label: 'Trail Status',      val: d.trails?.statusLabel || 'Open',           cls: d.trails?.status === 'open' ? 'ti-good' : 'ti-warn' },
    { label: 'Fire Restrictions', val: d.fire?.restrictionLabel || 'None',        cls: d.fire?.restrictionLevel === 0 ? 'ti-good' : d.fire?.restrictionLevel === 1 ? 'ti-warn' : 'ti-alert' },
    { label: 'Snow Base',         val: d.ski?.season === 'active' ? d.ski.baseDepthIn + ' in' : 'Off-season', cls: '' },
    { label: 'Open Resorts',      val: (d.ski?.openResorts || 0) + ' / ' + (d.ski?.resortCount || 14), cls: (d.ski?.openResorts || 0) > 0 ? 'ti-good' : '' },
    { label: 'Elevation',         val: '6,225 ft above sea level',               cls: '' },
    { label: 'Trail Miles',       val: '165+ miles in basin',                    cls: 'ti-good' },
    { label: 'Ski Resorts',       val: '14 within 60 miles',                     cls: '' },
  ];
  track.innerHTML = [...items, ...items].map(i =>
    `<div class="ticker-item"><span class="ti-label">${i.label}</span><span class="ti-val ${i.cls}">${i.val}</span></div>`
  ).join('');
}

async function refreshSiteData() {
  if (_refreshLock) return;
  _refreshLock = true;
  const btn  = document.getElementById('footer-refresh-btn');
  const icon = document.getElementById('refresh-icon');
  if (btn) btn.classList.add('spinning');
  try {
    const data = await fetchSiteData();
    Object.assign(SITE_DATA, data);
    SITE_DATA.meta.lastUpdated = new Date();
    renderSiteData(SITE_DATA);
    toast('Conditions updated ✓');
  } catch (e) {
    console.error('refreshSiteData failed:', e);
    toast('Could not refresh — check your connection.');
  } finally {
    if (btn) btn.classList.remove('spinning');
    _refreshLock = false;
  }
}

function startAutoRefresh() {
  setInterval(refreshSiteData, CONFIG.REFRESH_MS);
}

// ═══════════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════════
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('on'), 3100);
}

// ═══════════════════════════════════════════════════════════════
//  FOOTER YEAR
// ═══════════════════════════════════════════════════════════════
const fyEl = document.getElementById('footer-year');
if (fyEl) fyEl.textContent = new Date().getFullYear();

// ═══════════════════════════════════════════════════════════════
//  START
// ═══════════════════════════════════════════════════════════════
boot();// ═══════════════════════════════════════════════════════════════
//  PLAN YOUR TRIP — unified auth-gated wizard
// ═══════════════════════════════════════════════════════════════

// Wizard state
let planUser   = null;   // set after auth { email, name, provider }
let planStep   = 0;
let planAns    = {};     // step index → selected value(s)
let planMulti  = {};     // step index → array for multi-select

// ── WIZARD STEPS ────────────────────────────────────────────────────────────
const PLAN_STEPS = [
  {
    q:    'What season are you planning for?',
    hint: "We'll surface the right campsite windows, snow reports, and trail conditions for your timing.",
    key:  'season',
    multi: false,
    opts: [
      { e:'🌸', l:'Spring (Mar – May)' },
      { e:'☀️', l:'Summer (Jun – Sep)' },
      { e:'🍂', l:'Fall (Oct – Nov)'   },
      { e:'❄️', l:'Winter (Dec – Feb)' },
    ]
  },
  {
    q:    "Who's coming with you?",
    hint: "Group dynamics shape the ideal campsite, trail, and activity mix.",
    key:  'group',
    multi: false,
    opts: [
      { e:'🧍', l:'Solo'              },
      { e:'👫', l:'Partner / Couple'  },
      { e:'👨‍👩‍👧', l:'Family with Kids'  },
      { e:'👯', l:'Friend Group'       },
      { e:'🏢', l:'Corporate / Team'  },
    ]
  },
  {
    q:    'How long is your trip?',
    hint: "Helps us suggest realistic daily itineraries and campsite booking windows.",
    key:  'length',
    multi: false,
    opts: [
      { e:'🌅', l:'Day trip'          },
      { e:'🏕️', l:'Weekend (2–3 days)'},
      { e:'📅', l:'4–7 days'          },
      { e:'🏔️', l:'A week or more'   },
    ]
  },
  {
    q:    'What activities excite you?',
    hint: "Select everything that sounds good — we'll build around what you love.",
    key:  'activities',
    multi: true,
    opts: [
      { e:'⛺', l:'Camping'           },
      { e:'🥾', l:'Hiking'            },
      { e:'🛶', l:'Kayaking'          },
      { e:'🚵', l:'Mountain Biking'   },
      { e:'⛷️', l:'Skiing / Riding'  },
      { e:'⛵', l:'Boating'           },
      { e:'🎣', l:'Fishing'           },
      { e:'🏄', l:'Paddleboarding'    },
      { e:'🌲', l:'Backpacking'       },
      { e:'🏊', l:'Swimming'          },
    ]
  },
  {
    q:    "What's your experience level?",
    hint: "Helps us match trail difficulty, campsite type, and gear recommendations.",
    key:  'level',
    multi: false,
    opts: [
      { e:'🌱', l:'Beginner — new to outdoor adventure'      },
      { e:'🥾', l:'Intermediate — comfortable on trails'    },
      { e:'⛰️', l:'Advanced — multi-day, all conditions'    },
      { e:'🏆', l:'Expert — technical & self-sufficient'    },
    ]
  },
];

// Recommendations by season
const PLAN_RECS = {
  'Spring (Mar – May)': ['🌸 Cascade Falls Hike','🎣 Spring Fishing at Fallen Leaf','🦅 Wildlife Walk — Taylor Creek','🚵 Flume Trail MTB Opening Weekend'],
  'Summer (Jun – Sep)': ['🥾 Tahoe Rim Trail Day Hike','🛶 Emerald Bay Kayak','🏊 Sand Harbor Beach Day','⛺ D.L. Bliss Camping'],
  'Fall (Oct – Nov)':   ['🍂 TRT Foliage Hike','⛺ Nevada Beach — Shoulder Season Camp','🛶 Fall Paddle — Kings Beach to Carnelian','🌲 Glen Alpine Backpack'],
  'Winter (Dec – Feb)': ['⛷️ Palisades Tahoe Powder Day','🏔️ Ellis Peak Snowshoe','❄️ Northstar Nordic Ski','🌲 Donner Summit Hike'],
};

// ── AUTH GATE FUNCTIONS ──────────────────────────────────────────────────────
function planAuthWith(provider) {
  // Google OAuth — in production redirect to your OAuth endpoint:
  // window.location.href = '/api/auth/google';
  //
  // To connect Google OAuth:
  // 1. Go to console.cloud.google.com → APIs & Services → Credentials
  // 2. Create OAuth 2.0 Client ID
  // 3. Add redirect URI: https://trailstv.com/api/auth/google/callback
  // 4. Set environment variable GOOGLE_CLIENT_ID in Netlify dashboard
  // 5. Replace the line below with: window.location.href = '/api/auth/google';
  if (provider !== 'google') return;
  planUser = { email: '', name: 'Tahoe Explorer', provider: 'google' };
  toast('Connecting with Google… ✓');
  setTimeout(launchPlanWizard, 400);
}

function planAuthEmail() {
  const email = document.getElementById('plan-email').value.trim();
  if (!email || !email.includes('@')) {
    toast('Please enter a valid email address.');
    return;
  }
  planUser = { email, name: email.split('@')[0], provider: 'email' };
  toast('Welcome, ' + planUser.name + '! ✓');
  setTimeout(launchPlanWizard, 400);
}

function launchPlanWizard() {
  document.getElementById('plan-auth-gate').style.display  = 'none';
  document.getElementById('plan-wizard').style.display     = 'block';
  planStep = 0; planAns = {}; planMulti = {};
  buildPlanStepDots();
  renderPlanStep();
}

// ── STEP DOTS ────────────────────────────────────────────────────────────────
function buildPlanStepDots() {
  const container = document.getElementById('plan-steps');
  if (!container) return;
  container.innerHTML = PLAN_STEPS.map((s, i) =>
    `<div class="plan-step-dot${i===0?' active':''}" id="pdot-${i}" onclick="goToPlanStep(${i})"></div>`
  ).join('') + `<span class="plan-step-label" id="plan-step-label">Step 1 of ${PLAN_STEPS.length}</span>`;
}

function updatePlanDots() {
  PLAN_STEPS.forEach((_, i) => {
    const d = document.getElementById('pdot-' + i);
    if (!d) return;
    d.className = 'plan-step-dot' + (i < planStep ? ' done' : i === planStep ? ' active' : '');
  });
  const lbl = document.getElementById('plan-step-label');
  if (lbl) lbl.textContent = 'Step ' + (planStep + 1) + ' of ' + PLAN_STEPS.length;
}

// ── RENDER STEP ──────────────────────────────────────────────────────────────
function renderPlanStep() {
  const area = document.getElementById('plan-step-area');
  if (!area) return;

  if (planStep >= PLAN_STEPS.length) {
    renderPlanSummary();
    return;
  }

  updatePlanDots();
  const s     = PLAN_STEPS[planStep];
  const isSel = (i) => s.multi
    ? (planMulti[planStep] || []).includes(i)
    : planAns[planStep] === i;

  const opts = s.opts.map((o, i) =>
    `<div class="plan-opt${isSel(i) ? ' sel' : ''}" onclick="selectPlanOpt(this,${i})">
      <span>${o.e}</span><span>${o.l}</span>
    </div>`
  ).join('');

  const isLast  = planStep === PLAN_STEPS.length - 1;
  const isFirst = planStep === 0;

  area.innerHTML = `
    <div class="plan-step-card">
      <div class="plan-step-q">${s.q}</div>
      <div class="plan-step-hint">${s.hint}</div>
      <div class="plan-opts">${opts}</div>
      <div class="plan-nav">
        ${!isFirst ? '<button class="plan-btn-back" onclick="prevPlanStep()">← Back</button>' : ''}
        ${s.multi
          ? `<button class="plan-btn-next${isLast?' finish':''}" onclick="nextPlanStep()">
               ${isLast ? 'Build My Trip 🏔️' : 'Continue →'}</button>`
          : `<span style="font-size:.76rem;color:var(--granite)">Tap an option to continue</span>`
        }
        <button class="plan-skip" onclick="nextPlanStep()">Skip →</button>
      </div>
    </div>`;
}

function selectPlanOpt(el, idx) {
  const s = PLAN_STEPS[planStep];
  if (s.multi) {
    el.classList.toggle('sel');
    if (!planMulti[planStep]) planMulti[planStep] = [];
    const arr = planMulti[planStep];
    const pos = arr.indexOf(idx);
    pos > -1 ? arr.splice(pos, 1) : arr.push(idx);
  } else {
    planAns[planStep] = idx;
    setTimeout(nextPlanStep, 280);
  }
}

function nextPlanStep() {
  const s = PLAN_STEPS[planStep];
  if (s.multi) planAns[planStep] = planMulti[planStep] || [];
  planStep++;
  renderPlanStep();
}

function prevPlanStep() {
  if (planStep > 0) { planStep--; renderPlanStep(); }
}

function goToPlanStep(i) {
  if (i <= planStep) { planStep = i; renderPlanStep(); }
}

// ── SUMMARY & ITINERARY ──────────────────────────────────────────────────────
function renderPlanSummary() {
  const area = document.getElementById('plan-step-area');
  if (!area) return;
  updatePlanDots();

  // Build readable answers
  const get = (stepIdx) => {
    const s    = PLAN_STEPS[stepIdx];
    const ans  = planAns[stepIdx];
    if (ans === undefined || ans === null) return 'Not specified';
    if (Array.isArray(ans)) {
      return ans.length
        ? ans.map(i => s.opts[i]?.l || '').join(', ')
        : 'Not specified';
    }
    return s.opts[ans]?.l || 'Not specified';
  };

  const season     = get(0);
  const group      = get(1);
  const length     = get(2);
  const activities = get(3);
  const level      = get(4);
  const recs       = PLAN_RECS[season] || PLAN_RECS['Summer (Jun – Sep)'];

  area.innerHTML = `
    <div class="plan-step-card">
      <div class="plan-step-q" style="color:var(--glacial)">Your Tahoe Plan ✓</div>
      <div class="plan-step-hint">Here's what we built based on your answers. Save it to your account or refine any step.</div>

      <div class="plan-summary-card">
        <div class="plan-summary-row"><span class="plan-summary-label">Season</span><span class="plan-summary-val">${season}</span></div>
        <div class="plan-summary-row"><span class="plan-summary-label">Group</span><span class="plan-summary-val">${group}</span></div>
        <div class="plan-summary-row"><span class="plan-summary-label">Trip Length</span><span class="plan-summary-val">${length}</span></div>
        <div class="plan-summary-row"><span class="plan-summary-label">Activities</span><span class="plan-summary-val">${activities}</span></div>
        <div class="plan-summary-row"><span class="plan-summary-label">Level</span><span class="plan-summary-val">${level}</span></div>
        <div class="plan-summary-row"><span class="plan-summary-label">Account</span><span class="plan-summary-val">${planUser?.email || 'Guest'}</span></div>
      </div>

      <div style="font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--glacial);margin-bottom:.75rem">
        Recommended for ${season}
      </div>
      <div style="display:flex;flex-direction:column;gap:.45rem;margin-bottom:1.5rem">
        ${recs.map(r => `
          <div style="display:flex;align-items:center;gap:9px;padding:8px 12px;background:rgba(13,27,42,.5);border:1px solid rgba(74,173,188,.1);border-radius:8px;font-size:.82rem;">
            <span>${r.split(' ')[0]}</span><span>${r.split(' ').slice(1).join(' ')}</span>
          </div>`).join('')}
      </div>

      <div style="display:flex;gap:.75rem;flex-wrap:wrap">
        <button class="plan-btn-next" onclick="saveItinerary()">Save My Trip →</button>
        <button class="plan-btn-back" onclick="planStep=0;renderPlanStep()">Start Over</button>
        <button class="plan-btn-back" onclick="SP('camp')">Browse Campsites →</button>
      </div>
    </div>`;

  // Show itinerary section
  const itin = document.getElementById('plan-itinerary-section');
  if (itin) itin.style.display = 'block';

  // Pre-populate itinerary with recommendations
  const tlist = document.getElementById('tlist');
  if (tlist) {
    tlist.innerHTML = recs.map(r => {
      const icon = r.split(' ')[0];
      const name = r.split(' ').slice(1).join(' ');
      return `<li class="ti"><span class="tic">${icon}</span><div class="tin"><div class="tn">${name}</div><div class="td">${season}</div></div><button class="rmv" onclick="remTrip(this)">✕</button></li>`;
    }).join('');
  }
}

function saveItinerary() {
  // In production: POST to /api/trips with planAns + planUser
  // MySQL payload:
  // INSERT INTO trips (user_id, season, group_type, trip_length, activities, level, created_at)
  // VALUES (?, ?, ?, ?, ?, ?, NOW())
  const payload = {
    user:       planUser,
    season:     PLAN_STEPS[0].opts[planAns[0]]?.l,
    group:      PLAN_STEPS[1].opts[planAns[1]]?.l,
    length:     PLAN_STEPS[2].opts[planAns[2]]?.l,
    activities: (planAns[3] || []).map(i => PLAN_STEPS[3].opts[i]?.l),
    level:      PLAN_STEPS[4].opts[planAns[4]]?.l,
  };
  // Store in sessionStorage until backend is wired
  try { sessionStorage.setItem('tahoe_trip', JSON.stringify(payload)); } catch(e){}
  console.log('Trip payload ready for MySQL:', payload);
  toast('Trip saved! ✓ (Connect MySQL to persist across sessions)');
}

function clearItinerary() {
  planStep = 0; planAns = {}; planMulti = {};
  renderPlanStep();
  const itin = document.getElementById('plan-itinerary-section');
  if (itin) itin.style.display = 'none';
}

function remTrip(btn) { btn.closest('.ti').remove(); }

function addTrip() {
  const act = document.getElementById('asel')?.value;
  const loc = document.getElementById('locin')?.value?.trim();
  if (!act || !loc) { toast('Choose an activity and enter a location.'); return; }
  const icon = act.split(' ')[0];
  const name = act.replace(/^[^\s]+\s/, '') + ' — ' + loc;
  const s    = document.getElementById('tstart')?.value;
  const date = s ? new Date(s + 'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}) : 'Upcoming';
  const li   = document.createElement('li');
  li.className = 'ti';
  li.innerHTML = `<span class="tic">${icon}</span><div class="tin"><div class="tn">${name}</div><div class="td">${date}</div></div><button class="rmv" onclick="remTrip(this)">✕</button>`;
  document.getElementById('tlist')?.appendChild(li);
  toast('Added to itinerary ✓');
}

// ── SP override: show auth gate when plan page is opened if not logged in ────
// (called by the existing SP() function — we hook initPlanPage)
function initPlanPage() {
  const gate   = document.getElementById('plan-auth-gate');
  const wizard = document.getElementById('plan-wizard');
  if (!gate || !wizard) return;
  if (planUser || tier !== 'free') {
    // Already authenticated — skip gate
    gate.style.display   = 'none';
    wizard.style.display = 'block';
    if (planStep === 0 && !planAns[0]) {
      buildPlanStepDots();
      renderPlanStep();
    }
  } else {
    gate.style.display   = 'block';
    wizard.style.display = 'none';
  }
}


