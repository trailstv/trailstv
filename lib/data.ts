// lib/data.ts — shared data types and inline fallbacks

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
  { id:'dlbliss', name:"D.L. Bliss State Park", lat:38.9695, lng:-120.1035, shore:'west', sites:168, available:18, limited:false, full:false, fee:35, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Hot Showers','Dump Station','Beach Access','Bear Boxes'], desc:"One of Tahoe's most beloved campgrounds — reopened May 2026.", phone:'530-525-7277', url:'https://reservecalifornia.com/park/637', bookSystem:'ReserveCalifornia', img:'⛺', region:'CA State Parks · West Shore' },
  { id:'eaglepoint', name:"Emerald Bay — Eagle Point", lat:38.9540, lng:-120.1060, shore:'west', sites:97, available:4, limited:true, full:false, fee:35, hookups:false, pets:false, res:true, amenities:['Flush Toilets','Coin Showers','Fire Rings','Bear Boxes'], desc:"97-site campground inside Emerald Bay State Park.", phone:'530-541-3030', url:'https://reservecalifornia.com/park/641', bookSystem:'ReserveCalifornia', img:'🏰', region:'CA State Parks · West Shore' },
  { id:'sugarpine', name:"Sugar Pine Point — General Creek", lat:39.0418, lng:-120.1120, shore:'west', sites:175, available:31, limited:false, full:false, fee:35, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Showers','Fire Rings','Boat Ramp'], desc:"175 sites — one loop stays open year-round.", phone:'530-525-7982', url:'https://www.parks.ca.gov/?page_id=510', bookSystem:'ReserveCalifornia', img:'🌲', region:'CA State Parks · West Shore' },
  { id:'232769', name:'Fallen Leaf Lake Campground', lat:38.8980, lng:-120.0540, shore:'south', sites:206, available:0, limited:false, full:true, fee:30, hookups:false, pets:true, res:true, amenities:['Flush Toilets','6 Yurts','Boat Ramp','Dump Station'], desc:"206 sites on serene Fallen Leaf Lake. Yurts sleep 5-6.", phone:'530-541-1537', url:'https://www.recreation.gov/camping/campgrounds/232769', bookSystem:'Recreation.gov', img:'🍂', region:'USFS · South Shore' },
  { id:'232768', name:'Nevada Beach Campground', lat:38.9630, lng:-119.9280, shore:'east', sites:54, available:12, limited:false, full:false, fee:32, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Sandy Beach','Fire Rings','Accessible Sites'], desc:"USFS camp with the widest beach on Tahoe.", phone:'775-588-5562', url:'https://www.recreation.gov/camping/campgrounds/232768', bookSystem:'Recreation.gov', img:'🏖️', region:'USFS · East Shore' },
  { id:'232874', name:'William Kent Campground', lat:39.0895, lng:-120.1340, shore:'west', sites:95, available:19, limited:false, full:false, fee:32, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Showers','3 Yurts','Fire Rings'], desc:"USFS camp 2 miles south of Tahoe City.", phone:'530-541-1537', url:'https://www.recreation.gov/camping/campgrounds/232874', bookSystem:'Recreation.gov', img:'🌲', region:'USFS · West Shore' },
  { id:'10220612', name:'Meeks Bay Resort & Campground', lat:39.0226, lng:-120.1182, shore:'west', sites:77, available:8, limited:false, full:false, fee:42, hookups:true, pets:false, res:true, amenities:['Sandy Beach','Kayak & SUP Rentals','Washoe Tribe Operated'], desc:"Washoe Tribe-operated resort. Sandy beach, kayak rentals. No pets.", phone:'530-214-9422', url:'https://www.recreation.gov/camping/campgrounds/10220612', bookSystem:'Recreation.gov', img:'🌊', region:'Meeks Bay Resort · West Shore' },
  { id:'10300216', name:'Zephyr Cove RV & Campground', lat:38.9945, lng:-119.9390, shore:'east', sites:149, available:22, limited:false, full:false, fee:45, hookups:true, pets:true, res:true, amenities:['92 Full-Hookup RV Sites','47 Walk-In Tent Sites','Marina','Restaurant'], desc:"Southeast shore resort. Steps from the MS Dixie II and marina.", phone:'775-589-4906', url:'https://www.recreation.gov/camping/campgrounds/10300216', bookSystem:'Recreation.gov', img:'⚓', region:'Zephyr Cove Resort · East Shore' },
  { id:'10305470', name:"Camp Richardson — RV Village", lat:38.9345, lng:-120.0485, shore:'south', sites:98, available:15, limited:false, full:false, fee:55, hookups:true, pets:false, res:true, amenities:['Full Hookup RV Sites','Bar & Grill','General Store','Full Marina'], desc:"Historic Camp Richardson on the south shore. RV-only with full hookups.", phone:'530-494-2228', url:'https://www.recreation.gov/camping/campgrounds/10305470', bookSystem:'Recreation.gov', img:'🏕️', region:'Camp Richardson · South Shore' },
  { id:'spooner', name:'Spooner Backcountry Campgrounds', lat:39.1020, lng:-119.9080, shore:'east', sites:15, available:6, limited:false, full:false, fee:15, hookups:false, pets:false, res:false, amenities:['Vault Toilets','Bear Boxes','Walk-In Only','Flume Trail Access'], desc:"Three primitive hike-in campgrounds. First-come, first-served.", phone:'775-831-0494', url:'https://parks.nv.gov/parks/spooner-lake', bookSystem:'Nevada State Parks · First-Come', img:'🚵', region:'NV State Parks · East Shore' },

  // ── NORTH SHORE ──────────────────────────────────────────────────────────────
  { id:'tahoe-sra', name:'Tahoe State Recreation Area', lat:39.1720, lng:-120.1465, shore:'north', sites:23, available:8, limited:false, full:false, fee:35, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Hot Showers','Bear Boxes','Bike Path','Lake Access'], desc:"The only lakeside campground on the north shore — 23 sites steps from Lake Tahoe in the heart of Tahoe City. Bike path to town. Open May–September.", phone:'(530) 583-3074', url:'https://www.parks.ca.gov/?page_id=504', bookSystem:'ReserveCalifornia', img:'🏕️', region:'CA State Parks · North Shore' },
  { id:'lake-forest', name:'Lake Forest Campground', lat:39.1778, lng:-120.1342, shore:'north', sites:20, available:12, limited:false, full:false, fee:25, hookups:false, pets:true, res:false, amenities:['Flush Toilets','Boat Ramp','Swimming','First-Come First-Served'], desc:"First-come, first-served campground 1 mile east of Tahoe City. One of the few no-reservation options at Tahoe. Boat ramp on-site. Arrive early on summer mornings.", phone:'(530) 583-3796', url:'https://www.tcpud.org/parks-facilities/facilities-parks-and-rentals/lake-forest-campground', bookSystem:'First-Come (TCPUD)', img:'🌲', region:'TCPUD · North Shore' },
  { id:'kaspian', name:'Kaspian Campground', lat:39.1138, lng:-120.1548, shore:'north', sites:10, available:5, limited:false, full:false, fee:27, hookups:false, pets:true, res:true, amenities:['Flush Toilets','Drinking Water','Fire Rings','Lake Views'], desc:"Small tent-only USFS campground 4 miles south of Tahoe City. Sites nestled in tall ponderosa pines across the road from Lake Tahoe.", phone:'(530) 544-5994', url:'https://www.recreation.gov/camping/campgrounds/232875', bookSystem:'Recreation.gov', img:'🌲', region:'USFS · North Shore' },

  // ── SOUTH SHORE (additional) ─────────────────────────────────────────────────
  { id:'campground-by-the-lake', name:'Campground by the Lake', lat:38.9274, lng:-119.9742, shore:'south', sites:170, available:35, limited:false, full:false, fee:39, hookups:true, pets:true, res:true, amenities:['Flush Toilets','Showers','RV Hookups','Bike Trail Access','Near Beach'], desc:"City-run campground in the heart of South Lake Tahoe. 170 sites including RV hookups. One block from Safeway, across from El Dorado Beach. Opens May 1, 2026.", phone:'(530) 542-6096', url:'https://www.recreation.gov/camping/campgrounds/232488', bookSystem:'Recreation.gov', img:'🏕️', region:'City of SLT · South Shore' },
];

export const ACTS_FALLBACK: Activity[] = [
  { icon:'⛺', name:'Camping',          desc:"D.L. Bliss, Sugar Pine, Fallen Leaf — 300+ sites with lake views." },
  { icon:'🥾', name:'Hiking',           desc:"165+ miles of trails from Tahoe Rim to Desolation Wilderness." },
  { icon:'🏊', name:'Swimming',         desc:"Sand Harbor, Emerald Bay, Kings Beach — pristine, 70+ ft clarity." },
  { icon:'🛶', name:'Kayaking',         desc:"Paddle Emerald Bay, Cave Rock, and Sand Harbor on crystal-clear water." },
  { icon:'⛵', name:'Boating',          desc:"22-mile lake, marinas on every shore. Pontoon & ski boat rentals, guided cruises, and the MS Dixie II paddlewheeler." },
  { icon:'🚵', name:'Mountain Biking',  desc:"Flume Trail, Mr. Toad's Wild Ride — world-class Sierra singletrack." },
  { icon:'⛷️', name:'Skiing & Riding', desc:"16 resorts: Palisades, Heavenly, Northstar, Kirkwood, Sugar Bowl, and more." },
  { icon:'🏔️', name:'Snowshoeing',    desc:"Ellis Peak, Spooner Lake, Cascade Falls — serene winter wonderlands." },
  { icon:'🎣', name:'Fishing',          desc:"Mackinaw trout up to 37 lbs. Guided lake charters year-round." },
  { icon:'🏄', name:'Paddleboarding',   desc:"Glassy morning water, 70+ ft visibility. Rentals at 8 locations." },
  { icon:'🧗', name:'Rock Climbing',    desc:"Lovers Leap and Luther Spires — world-class granite sport climbing." },
  { icon:'🌲', name:'Backpacking',      desc:"Desolation Wilderness multi-day routes through dramatic Sierra terrain." },
  { icon:'🦅', name:'Wildlife Watching',desc:"Black bears, bald eagles, mule deer — guided tours spring through fall." },
];

export const AMENITIES_FALLBACK: Amenity[] = [

  // ── GROCERY ──────────────────────────────────────────────────────────────────
  // South Lake Tahoe
  { name:'Safeway — Johnson Lane',         type:'grocery', lat:38.9188, lng:-119.9765, loc:'South Lake Tahoe, CA', note:'Open 24 hrs · Pharmacy · Deli · 1020 Johnson Ln' },
  { name:"Raley's — Emerald Bay Rd",       type:'grocery', lat:38.9295, lng:-120.0042, loc:'South Lake Tahoe, CA', note:'6am–11pm · Full service · Deli & hot bar · 1040 Emerald Bay Rd' },
  { name:'Whole Foods Market',             type:'grocery', lat:38.9380, lng:-119.9762, loc:'South Lake Tahoe, CA', note:'8am–10pm · Organic · Hot bar · 3600 Lake Tahoe Blvd' },
  { name:'Grocery Outlet — SLT',          type:'grocery', lat:38.9345, lng:-119.9718, loc:'South Lake Tahoe, CA', note:'Discount grocery · Name brands 40–70% off' },
  // Zephyr Cove / Stateline
  { name:'Safeway — Zephyr Cove',         type:'grocery', lat:38.9935, lng:-119.9525, loc:'Zephyr Cove, NV',       note:'Pharmacy · Deli · 212 Elks Point Rd' },
  // North / Kings Beach
  { name:'Safeway — Kings Beach',         type:'grocery', lat:39.2378, lng:-120.0268, loc:'Kings Beach, CA',       note:'Open 24 hrs · Pharmacy · Deli · 7815 N Lake Blvd' },
  { name:'Tahoe Central Market',          type:'grocery', lat:39.2362, lng:-120.0198, loc:'Kings Beach, CA',       note:'Fresh local & organic · Deli · 8487 N Tahoe Blvd' },
  // Tahoe City
  { name:'Safeway — Tahoe City',          type:'grocery', lat:39.1682, lng:-120.1468, loc:'Tahoe City, CA',        note:'6am–10pm · Pharmacy · Deli · 100 W River Rd' },
  { name:'New Moon Natural Foods',        type:'grocery', lat:39.1695, lng:-120.1500, loc:'Tahoe City, CA',        note:'Organic & natural · Supplements · 505 W Lake Blvd' },
  { name:'West Shore Market',             type:'grocery', lat:39.0732, lng:-120.1288, loc:'Tahoma, CA',            note:'Local market · West shore staples' },
  // Incline Village
  { name:"Raley's — Incline Village",     type:'grocery', lat:39.2532, lng:-119.9638, loc:'Incline Village, NV',   note:'(775) 831-3400 · Full service · 930 Tahoe Blvd' },
  { name:'Grocery Outlet — Incline Village', type:'grocery', lat:39.2518, lng:-119.9612, loc:'Incline Village, NV', note:'Discount grocery · 770 Mays Blvd' },

  // ── BIKE SHOPS ────────────────────────────────────────────────────────────────
  { name:'Tahoe Sports Ltd',              type:'bike',    lat:39.1682, lng:-120.1513, loc:'Tahoe City, CA',        note:'Rentals, repair & sales · Full service' },
  { name:'Shoreline MTB Shop',           type:'bike',    lat:38.9380, lng:-119.9820, loc:'South Lake Tahoe, CA',  note:'MTB specialists · Trek & Specialized' },
  { name:'Olympic Bike Shop',            type:'bike',    lat:39.1690, lng:-120.1505, loc:'Tahoe City, CA',        note:'Rentals & guided rides · Family bikes' },
  { name:'Flume Trail Bikes',            type:'bike',    lat:39.2540, lng:-119.9382, loc:'Incline Village, NV',   note:'Flume Trail shuttle service & MTB rentals' },
  { name:'Anderson\'s Bike Rental',      type:'bike',    lat:39.2370, lng:-120.0225, loc:'Kings Beach, CA',       note:'Casual & beach cruiser rentals' },

  // ── OUTFITTERS / SPORT ───────────────────────────────────────────────────────
  { name:'REI — South Lake Tahoe',       type:'sport',   lat:38.9310, lng:-119.9780, loc:'South Lake Tahoe, CA',  note:'Full outfitter · Rentals · Expert staff' },
  { name:'Tahoe Outdoor Center',         type:'sport',   lat:39.1690, lng:-120.1490, loc:'Tahoe City, CA',        note:'Gear, advice & guided adventures' },
  { name:'Alpenglow Sports',             type:'sport',   lat:39.3275, lng:-120.1837, loc:'Truckee, CA',           note:'Backcountry & ski · Climbing gear · Truckee hub' },
  { name:'Dave\'s Ski & Board',          type:'sport',   lat:38.9345, lng:-119.9782, loc:'South Lake Tahoe, CA',  note:'Ski & snowboard rentals & tuning' },

  // ── CAMP GEAR ────────────────────────────────────────────────────────────────
  { name:'Basin Gear & Supply',          type:'camp',    lat:39.2350, lng:-120.0200, loc:'Kings Beach, CA',       note:'Camping specialist · Stoves, packs & bear canisters' },
  { name:'Tahoe City Hardware & Supply', type:'camp',    lat:39.1700, lng:-120.1490, loc:'Tahoe City, CA',        note:'Camp supplies · Propane · Firewood' },

  // ── GAS ──────────────────────────────────────────────────────────────────────
  { name:'Chevron — Kings Beach',        type:'gas',     lat:39.2370, lng:-120.0220, loc:'Kings Beach, CA',       note:'24hr · Firewood available' },
  { name:'Shell — Stateline Ave',        type:'gas',     lat:38.9670, lng:-119.9430, loc:'Stateline, NV',         note:'24hr · Convenience store' },
  { name:'Chevron — South Lake Tahoe',   type:'gas',     lat:38.9402, lng:-119.9765, loc:'South Lake Tahoe, CA',  note:'Near Heavenly · Convenience' },
  { name:'76 — Tahoe City',             type:'gas',     lat:39.1685, lng:-120.1480, loc:'Tahoe City, CA',        note:'Near lake · Convenience' },
  { name:'Mobil — Incline Village',      type:'gas',     lat:39.2510, lng:-119.9648, loc:'Incline Village, NV',   note:'24hr · Close to Sand Harbor' },

  // ── RENTALS ──────────────────────────────────────────────────────────────────
  { name:'Tahoe Paddle & Oar',           type:'rental',  lat:39.2360, lng:-120.0230, loc:'Kings Beach, CA',       note:'Kayak, SUP, pontoon & pedal boat' },
  { name:'Emerald Bay Water Sports',     type:'rental',  lat:38.9540, lng:-120.1060, loc:'South Lake Tahoe, CA',  note:'Guided kayak tours · Emerald Bay access' },
  { name:'Zephyr Cove Boat Rentals',     type:'rental',  lat:38.9940, lng:-119.9385, loc:'Zephyr Cove, NV',       note:'Powerboats, pontoons, jet ski, parasailing' },
  { name:'Tahoe City Kayak',             type:'rental',  lat:39.1695, lng:-120.1470, loc:'Tahoe City, CA',        note:'Kayak & SUP rentals · Lake access' },
  { name:'Sand Harbor Clear Kayak Tours',type:'rental',  lat:39.1989, lng:-119.9316, loc:'Sand Harbor, NV',       note:'Clear kayak tours · Stunning east shore water' },
  { name:'Camp Richardson Watersports',  type:'rental',  lat:38.9345, lng:-120.0485, loc:'South Lake Tahoe, CA',  note:'Kayak, SUP, paddleboats · South shore' },
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
    season:'off', baseDepthIn:0, newSnow48hrIn:0, resortCount:16, openResorts:0,
    resorts:[
      { name:'Palisades Tahoe',  open:false, base:0, new48:0 },
      { name:'Heavenly',         open:false, base:0, new48:0 },
      { name:'Northstar',        open:false, base:0, new48:0 },
      { name:'Sierra-at-Tahoe',  open:false, base:0, new48:0 },
    ],
  },
};
