// lib/data.ts — shared data types and inline fallbacks

export type Tier = 'free' | 'basic';
export type Shore = 'north' | 'south' | 'east' | 'west';

export interface Camp {
  id: string;
  name: string;
  lat: number;
  lng: number;
  shore: Shore;
  sites: number;
  available: number;
  limited: boolean;
  full: boolean;
  fee: number;
  hookups: boolean;
  pets: boolean;
  res: boolean;
  amenities: string[];
  desc: string;
  phone: string;
  url: string;
  bookSystem: string;
  img: string;
  region: string;
}

export interface Activity {
  icon: string;
  name: string;
  desc: string;
  tier: Tier;
}

export interface Amenity {
  name: string;
  type: string;
  lat: number;
  lng: number;
  loc: string;
  note: string;
}

export interface SiteData {
  meta: { lastUpdated: string | null; source: string };
  weather: {
    current: { tempF: number; feelsLike: number; humidity: number; windMph: number; condition: string; icon: string };
    waterTempF: number;
    forecast: { day: string; icon: string; hi: number; lo: number; cond: string; precip: number }[];
  };
  lake: { levelFt: number; levelStatus: string; clarityFt: number; visibility: string };
  trails: { status: string; statusLabel: string; snowFreeBelow: number; mudConditions: string; alerts: string[] };
  fire: { restrictionLevel: number; restrictionLabel: string; activeIncidents: number; alertText: string; alertActive: boolean };
  camping: { totalAvailable: number };
  ski: { season: string; baseDepthIn: number; newSnow48hrIn: number; resortCount: number; openResorts: number; resorts: { name: string; open: boolean; base: number; new48: number }[] };
}

// ── Availability status helper ───────────────────────────────
export function avSt(c: Camp): 'full' | 'limited' | 'open' {
  if (c.full || c.available === 0) return 'full';
  if (c.limited || c.available <= 5) return 'limited';
  return 'open';
}

// ═══════════════════════════════════════════════════════════
//  INLINE FALLBACK DATA
// ═══════════════════════════════════════════════════════════
export const CAMPS_FALLBACK: Camp[] = [
  { id:'dlbliss', name:"D.L. Bliss State Park", lat:38.9695, lng:-120.1035, shore:'west', sites:168, available:18, limited:false, full:false, fee:35, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Hot Showers','Dump Station','Beach Access','Bear Boxes'], desc:"One of Tahoe's most beloved campgrounds — reopened May 2026.", phone:'530-525-7277', url:'https://www.reservecalifornia.com/Web/Default.aspx#!park/718', bookSystem:'ReserveCalifornia', img:'⛺', region:'CA State Parks · West Shore' },
  { id:'eaglepoint', name:"Emerald Bay — Eagle Point", lat:38.9540, lng:-120.1060, shore:'west', sites:97, available:4, limited:true, full:false, fee:35, hookups:false, pets:false, res:true, amenities:['Flush Toilets','Coin Showers','Fire Rings','Bear Boxes'], desc:"97-site campground inside Emerald Bay State Park.", phone:'530-541-3030', url:'https://www.reservecalifornia.com/Web/Default.aspx#!park/121', bookSystem:'ReserveCalifornia', img:'🏰', region:'CA State Parks · West Shore' },
  { id:'sugarpine', name:"Sugar Pine Point — General Creek", lat:39.0418, lng:-120.1120, shore:'west', sites:175, available:31, limited:false, full:false, fee:35, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Showers','Fire Rings','Boat Ramp'], desc:"175 sites — one loop stays open year-round.", phone:'530-525-7982', url:'https://www.reservecalifornia.com/Web/Default.aspx#!park/120', bookSystem:'ReserveCalifornia', img:'🌲', region:'CA State Parks · West Shore' },
  { id:'232769', name:'Fallen Leaf Lake Campground', lat:38.8980, lng:-120.0540, shore:'south', sites:206, available:0, limited:false, full:true, fee:30, hookups:false, pets:true, res:true, amenities:['Flush Toilets','6 Yurts','Boat Ramp','Dump Station'], desc:"206 sites on serene Fallen Leaf Lake. Yurts sleep 5-6.", phone:'530-541-1537', url:'https://www.recreation.gov/camping/campgrounds/232769', bookSystem:'Recreation.gov', img:'🍂', region:'USFS · South Shore' },
  { id:'232768', name:'Nevada Beach Campground', lat:38.9630, lng:-119.9280, shore:'east', sites:54, available:12, limited:false, full:false, fee:32, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Sandy Beach','Fire Rings','Accessible Sites'], desc:"USFS camp with the widest beach on Tahoe.", phone:'775-588-5562', url:'https://www.recreation.gov/camping/campgrounds/232768', bookSystem:'Recreation.gov', img:'🏖️', region:'USFS · East Shore' },
  { id:'232874', name:'William Kent Campground', lat:39.0895, lng:-120.1340, shore:'west', sites:95, available:19, limited:false, full:false, fee:32, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Showers','3 Yurts','Fire Rings'], desc:"USFS camp 2 miles south of Tahoe City.", phone:'530-541-1537', url:'https://www.recreation.gov/camping/campgrounds/232874', bookSystem:'Recreation.gov', img:'🌲', region:'USFS · West Shore' },
  { id:'10220612', name:'Meeks Bay Resort & Campground', lat:39.0226, lng:-120.1182, shore:'west', sites:77, available:8, limited:false, full:false, fee:42, hookups:true, pets:false, res:true, amenities:['Sandy Beach','Kayak & SUP Rentals','Washoe Tribe Operated'], desc:"Washoe Tribe-operated resort. Sandy beach, kayak rentals. No pets.", phone:'530-214-9422', url:'https://www.recreation.gov/camping/campgrounds/10220612', bookSystem:'Recreation.gov', img:'🌊', region:'Meeks Bay Resort · West Shore' },
  { id:'10300216', name:'Zephyr Cove RV & Campground', lat:38.9945, lng:-119.9390, shore:'east', sites:149, available:22, limited:false, full:false, fee:45, hookups:true, pets:true, res:true, amenities:['92 Full-Hookup RV Sites','47 Walk-In Tent Sites','Marina','Restaurant'], desc:"Southeast shore resort. Steps from the MS Dixie II and marina.", phone:'775-589-4906', url:'https://www.recreation.gov/camping/campgrounds/10300216', bookSystem:'Recreation.gov', img:'⚓', region:'Zephyr Cove Resort · East Shore' },
  { id:'10305470', name:"Camp Richardson — RV Village", lat:38.9345, lng:-120.0485, shore:'south', sites:98, available:15, limited:false, full:false, fee:55, hookups:true, pets:false, res:true, amenities:['Full Hookup RV Sites','Bar & Grill','General Store','Full Marina'], desc:"Historic Camp Richardson on the south shore. RV-only with full hookups.", phone:'530-494-2228', url:'https://www.recreation.gov/camping/campgrounds/10305470', bookSystem:'Recreation.gov', img:'🏕️', region:'Camp Richardson · South Shore' },
  { id:'spooner', name:'Spooner Backcountry Campgrounds', lat:39.1020, lng:-119.9080, shore:'east', sites:15, available:6, limited:false, full:false, fee:15, hookups:false, pets:false, res:false, amenities:['Vault Toilets','Bear Boxes','Walk-In Only','Flume Trail Access'], desc:"Three primitive hike-in campgrounds. First-come, first-served.", phone:'775-831-0494', url:'https://parks.nv.gov/parks/spooner-lake', bookSystem:'Nevada State Parks · First-Come', img:'🚵', region:'NV State Parks · East Shore' },
];

export const ACTS_FALLBACK: Activity[] = [
  { icon:'⛺', name:'Camping',          desc:"D.L. Bliss, Sugar Pine, Fallen Leaf — 300+ sites with lake views.",           tier:'free' },
  { icon:'🥾', name:'Hiking',           desc:"165+ miles of trails from Tahoe Rim to Desolation Wilderness.",               tier:'free' },
  { icon:'🏊', name:'Swimming',         desc:"Sand Harbor, Emerald Bay, Kings Beach — pristine, 70+ ft clarity.",           tier:'free' },
  { icon:'🛶', name:'Kayaking',         desc:"Paddle Emerald Bay, Cave Rock, and Sand Harbor on crystal-clear water.",      tier:'basic' },
  { icon:'🚵', name:'Mountain Biking',  desc:"Flume Trail, Mr. Toad's Wild Ride — world-class Sierra singletrack.",         tier:'basic' },
  { icon:'⛷️', name:'Skiing & Riding', desc:"14 resorts: Palisades, Heavenly, Northstar, Sierra-at-Tahoe, and more.",     tier:'basic' },
  { icon:'🏔️', name:'Snowshoeing',    desc:"Ellis Peak, Spooner Lake, Cascade Falls — serene winter wonderlands.",         tier:'basic' },
  { icon:'🎣', name:'Fishing',          desc:"Mackinaw trout up to 37 lbs. Guided lake charters year-round.",              tier:'basic' },
  { icon:'🏄', name:'Paddleboarding',   desc:"Glassy morning water, 70+ ft visibility. Rentals at 8 locations.",           tier:'basic' },
  { icon:'🧗', name:'Rock Climbing',    desc:"Lovers Leap and Luther Spires — world-class granite sport climbing.",         tier:'basic' },
  { icon:'🌲', name:'Backpacking',      desc:"Desolation Wilderness multi-day routes through dramatic Sierra terrain.",     tier:'basic' },
  { icon:'🦅', name:'Wildlife Watching',desc:"Black bears, bald eagles, mule deer — guided tours spring through fall.",    tier:'basic' },
];

export const AMENITIES_FALLBACK: Amenity[] = [
  { name:'Tahoe Sports Ltd',           type:'bike',    lat:39.1682, lng:-120.1513, loc:'Tahoe City',       note:'Rentals & repair' },
  { name:'Shoreline MTB Shop',         type:'bike',    lat:38.9380, lng:-119.9820, loc:'South Lake Tahoe', note:'MTB specialists' },
  { name:'REI — South Lake Tahoe',     type:'sport',   lat:38.9310, lng:-119.9780, loc:'South Lake Tahoe', note:'Full outfitter' },
  { name:'Tahoe Outdoor Center',       type:'sport',   lat:39.1690, lng:-120.1490, loc:'Tahoe City',       note:'Gear & advice' },
  { name:'Basin Gear & Supply',        type:'camp',    lat:39.2350, lng:-120.0200, loc:'Kings Beach',      note:'Camping specialist' },
  { name:'Safeway — Lake Tahoe Blvd', type:'grocery', lat:38.9270, lng:-119.9820, loc:'South Lake Tahoe', note:'Open 6am–11pm' },
  { name:'New Moon Natural Foods',     type:'grocery', lat:39.1695, lng:-120.1500, loc:'Tahoe City',       note:'Organic & local' },
  { name:'Shell — Stateline Ave',      type:'gas',     lat:38.9670, lng:-119.9430, loc:'Stateline',        note:'24hr · Convenience' },
  { name:'Chevron — Kings Beach',      type:'gas',     lat:39.2370, lng:-120.0220, loc:'Kings Beach',      note:'Firewood available' },
  { name:'Tahoe Paddle & Oar',         type:'rental',  lat:39.2360, lng:-120.0230, loc:'Kings Beach',      note:'Kayak, SUP, pontoon' },
  { name:'Emerald Bay Water Sports',   type:'rental',  lat:38.9540, lng:-120.1060, loc:'South Lake Tahoe', note:'Guided kayak tours' },
];

export const SITE_DATA_FALLBACK: SiteData = {
  meta: { lastUpdated: null, source: 'fallback' },
  weather: {
    current: { tempF:72, feelsLike:69, humidity:38, windMph:8, condition:'Sunny', icon:'☀️' },
    waterTempF: 65,
    forecast: [
      { day:'Today',    icon:'☀️', hi:72, lo:48, cond:'Sunny',         precip:0  },
      { day:'Tomorrow', icon:'⛅', hi:68, lo:45, cond:'Partly Cloudy', precip:10 },
      { day:'Thu',      icon:'🌤', hi:74, lo:50, cond:'Mostly Clear',  precip:5  },
      { day:'Fri',      icon:'⛈', hi:61, lo:44, cond:'PM Storms',     precip:75 },
      { day:'Sat',      icon:'☀️', hi:76, lo:49, cond:'Sunny',         precip:0  },
      { day:'Sun',      icon:'🌤', hi:73, lo:47, cond:'Mostly Clear',  precip:5  },
      { day:'Mon',      icon:'⛅', hi:69, lo:46, cond:'Partly Cloudy', precip:15 },
    ],
  },
  lake:   { levelFt:6222.4, levelStatus:'normal', clarityFt:71, visibility:'exceptional' },
  trails: { status:'open', statusLabel:'All Open', snowFreeBelow:7200, mudConditions:'dry', alerts:[] },
  fire:   { restrictionLevel:1, restrictionLabel:'Stage 1', activeIncidents:0, alertText:'Stage 1 Fire Restrictions in effect. No campfires outside designated fire rings.', alertActive:true },
  camping:{ totalAvailable: 135 },
  ski: {
    season:'off', baseDepthIn:0, newSnow48hrIn:0, resortCount:14, openResorts:0,
    resorts:[
      { name:'Palisades Tahoe',  open:false, base:0, new48:0 },
      { name:'Heavenly',         open:false, base:0, new48:0 },
      { name:'Northstar',        open:false, base:0, new48:0 },
      { name:'Sierra-at-Tahoe',  open:false, base:0, new48:0 },
    ],
  },
};
