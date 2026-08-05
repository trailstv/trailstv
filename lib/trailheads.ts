// lib/trailheads.ts
// Curated, hand-verified Lake Tahoe trailhead data.
// Used as immediate fallback while Overpass API data loads.
// Sources: USFS LTBMU, Tahoe Rim Trail Association, AllTrails, tahoeoutdoorstv.com

export type Difficulty = 'easy' | 'moderate' | 'strenuous' | 'expert';
export type TrailUse   = 'hiking' | 'mtb' | 'equestrian' | 'mixed';
export type Shore      = 'north' | 'south' | 'east' | 'west';

export interface Trailhead {
  id:          string;
  name:        string;
  trail:       string;         // main trail name
  lat:         number;
  lng:         number;
  shore:       Shore;
  difficulty:  Difficulty;
  distanceMi:  number;         // round-trip miles (0 = one-way / variable)
  elevGainFt:  number;
  elevMaxFt:   number;
  use:         TrailUse[];
  season:      string;         // e.g. "May – Oct"
  permit:      boolean;        // true = wilderness permit required
  parking:     string;         // fee info
  dogs:        boolean;
  highlights:  string[];
  desc:        string;
  moreInfoUrl: string;
}

export const TRAILHEADS: Trailhead[] = [
  // ── TAHOE RIM TRAIL TRAILHEADS ──────────────────────────────────────────────
  {
    id: 'trt-tahoe-city',
    name: 'Tahoe City TRT Trailhead',
    trail: 'Tahoe Rim Trail',
    lat: 39.1718, lng: -120.1452, shore: 'north',
    difficulty: 'moderate', distanceMi: 165, elevGainFt: 24400, elevMaxFt: 10338,
    use: ['hiking','mtb','equestrian'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Fairway Community Center lot',
    dogs: true,
    highlights: ['165-mile loop','Views of Lake Tahoe','Burton Creek access'],
    desc: 'North shore access point for the Tahoe Rim Trail. Connects to Burton Creek State Park and north-shore ridge walks with lake views.',
    moreInfoUrl: 'https://tahoerimtrail.org',
  },
  {
    id: 'trt-brockway',
    name: 'Brockway Summit TRT Trailhead',
    trail: 'Tahoe Rim Trail',
    lat: 39.2545, lng: -120.0345, shore: 'north',
    difficulty: 'moderate', distanceMi: 0, elevGainFt: 1200, elevMaxFt: 8800,
    use: ['hiking','mtb'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Roadside pullout on Hwy 267',
    dogs: true,
    highlights: ['Panoramic lake views','North shore ridge','Connect to Martis Valley'],
    desc: 'Roadside trailhead on Hwy 267 offering immediate access to TRT ridgeline with dramatic lake views in both directions.',
    moreInfoUrl: 'https://tahoerimtrail.org',
  },
  {
    id: 'trt-spooner',
    name: 'Spooner Summit TRT Trailhead',
    trail: 'Tahoe Rim Trail / Flume Trail',
    lat: 39.1010, lng: -119.9082, shore: 'east',
    difficulty: 'moderate', distanceMi: 14, elevGainFt: 1600, elevMaxFt: 8200,
    use: ['hiking','mtb'], season: 'Jun – Oct',
    permit: false, parking: 'Nevada State Parks day-use fee · $10',
    dogs: true,
    highlights: ['Flume Trail access','Lake views 1,600 ft above water','World-class MTB'],
    desc: "Gateway to the legendary Flume Trail — one of the best mountain bike rides in North America. Hike or ride the ridge above Tahoe's east shore.",
    moreInfoUrl: 'https://parks.nv.gov/parks/lake-tahoe-nevada-state-park',
  },
  {
    id: 'trt-echo-summit',
    name: 'Echo Summit TRT Trailhead',
    trail: 'Tahoe Rim Trail / PCT',
    lat: 38.8073, lng: -120.0352, shore: 'south',
    difficulty: 'moderate', distanceMi: 0, elevGainFt: 800, elevMaxFt: 8895,
    use: ['hiking'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Hwy 50 pullout',
    dogs: true,
    highlights: ['PCT junction','Echo Lake access','Alpine meadows'],
    desc: 'Southern TRT access point also connecting to the Pacific Crest Trail. Starting point for multi-day Echo Lake to Tahoe City routes.',
    moreInfoUrl: 'https://tahoerimtrail.org',
  },

  // ── DESOLATION WILDERNESS TRAILHEADS ────────────────────────────────────────
  {
    id: 'glen-alpine',
    name: 'Glen Alpine Trailhead',
    trail: 'Glen Alpine / Desolation Wilderness',
    lat: 38.8932, lng: -120.0724, shore: 'south',
    difficulty: 'moderate', distanceMi: 10, elevGainFt: 1800, elevMaxFt: 8300,
    use: ['hiking'], season: 'Jul – Oct',
    permit: true, parking: 'USFS day-use fee · $5',
    dogs: false,
    highlights: ['Desolation Wilderness entry','Gilmore Lake','Susie Lake','Alpine scenery'],
    desc: 'Most popular Desolation Wilderness entry point. Day-use and overnight permits required. Leads to Gilmore, Susie, Half Moon, and Alta Morris Lakes.',
    moreInfoUrl: 'https://www.fs.usda.gov/ltbmu',
  },
  {
    id: 'echo-lake',
    name: 'Echo Lake Trailhead',
    trail: 'Desolation Wilderness / PCT',
    lat: 38.8305, lng: -120.0408, shore: 'south',
    difficulty: 'moderate', distanceMi: 26, elevGainFt: 2800, elevMaxFt: 9240,
    use: ['hiking'], season: 'Jul – Oct',
    permit: true, parking: 'Echo Chalet day fee · $10 · Seasonal water taxi available',
    dogs: false,
    highlights: ['Water taxi across Echo Lake','PCT junction','Lake Aloha','Desolation Valley'],
    desc: 'Classic Desolation Wilderness gateway. Take the seasonal water taxi across Echo Lake to save 2 miles. Connects to PCT and Lake Aloha loop.',
    moreInfoUrl: 'https://www.fs.usda.gov/ltbmu',
  },
  {
    id: 'bayview',
    name: 'Bayview Campground Trailhead',
    trail: 'Granite Lake / Desolation',
    lat: 38.9413, lng: -120.1055, shore: 'west',
    difficulty: 'strenuous', distanceMi: 4, elevGainFt: 900, elevMaxFt: 7740,
    use: ['hiking'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Bayview Campground',
    dogs: true,
    highlights: ['Granite Lake above Emerald Bay','Quick alpine access','Eagle Falls nearby'],
    desc: 'Short but steep trail to Granite Lake with stunning views over Emerald Bay. One of the best bang-for-effort hikes on the west shore.',
    moreInfoUrl: 'https://www.fs.usda.gov/ltbmu',
  },

  // ── SIGNATURE HIKES ──────────────────────────────────────────────────────────
  {
    id: 'eagle-falls',
    name: 'Eagle Falls Trailhead',
    trail: 'Eagle Falls / Eagle Lake',
    lat: 38.9538, lng: -120.1093, shore: 'west',
    difficulty: 'moderate', distanceMi: 3, elevGainFt: 620, elevMaxFt: 6895,
    use: ['hiking'], season: 'May – Oct',
    permit: false, parking: 'USFS day-use fee · $10 · Fills by 9am weekends',
    dogs: true,
    highlights: ['Eagle Falls waterfall','Eagle Lake','Emerald Bay views','Classic Tahoe hike'],
    desc: "One of Lake Tahoe's most photographed hikes. Lower falls visible from road. Upper trail to Eagle Lake offers jaw-dropping Emerald Bay panoramas.",
    moreInfoUrl: 'https://tahoeoutdoorstv.com/hiking/experience-the-majesty-of-eagle-falls-trail/',
  },
  {
    id: 'mount-tallac',
    name: 'Mount Tallac Trailhead',
    trail: 'Mount Tallac Summit Trail',
    lat: 38.9127, lng: -120.0856, shore: 'south',
    difficulty: 'strenuous', distanceMi: 9.4, elevGainFt: 3295, elevMaxFt: 9735,
    use: ['hiking'], season: 'Jul – Oct',
    permit: false, parking: 'Free · Spring/Cathedral Rd',
    dogs: true,
    highlights: ['Summit views of entire Tahoe basin','Cross-shaped snowfield visible spring','Most prominent peak above Tahoe'],
    desc: "Tahoe's most iconic summit hike. The cross-shaped snowfield on the face is visible from South Lake Tahoe. Views from the top stretch 100+ miles.",
    moreInfoUrl: 'https://tahoeoutdoorstv.com/hiking/hiking-mount-tallac/',
  },
  {
    id: 'cascade-falls',
    name: 'Cascade Falls Trailhead',
    trail: 'Cascade Falls Trail',
    lat: 38.9333, lng: -120.0882, shore: 'west',
    difficulty: 'easy', distanceMi: 1.6, elevGainFt: 200, elevMaxFt: 6640,
    use: ['hiking'], season: 'Apr – Oct',
    permit: false, parking: 'Free · Bayview area',
    dogs: true,
    highlights: ['Dramatic waterfall','Short & accessible','Spring snowmelt spectacular'],
    desc: 'Short, scenic trail to a dramatic waterfall above Cascade Lake. Best in spring when snowmelt peaks. One of the easiest reward-to-effort hikes at Tahoe.',
    moreInfoUrl: 'https://tahoeoutdoorstv.com',
  },
  {
    id: 'rubicon',
    name: 'D.L. Bliss Rubicon Trailhead',
    trail: 'Rubicon Trail',
    lat: 38.9738, lng: -120.1028, shore: 'west',
    difficulty: 'moderate', distanceMi: 5, elevGainFt: 800, elevMaxFt: 6340,
    use: ['hiking'], season: 'May – Oct',
    permit: false, parking: 'CA State Parks day fee · $10',
    dogs: false,
    highlights: ['Cliff-edge Tahoe views','Vikingsholm access','Most scenic lakeside trail'],
    desc: 'The most scenic lakeside trail at Tahoe — hugs granite cliffs hundreds of feet above the water. South end connects to Vikingsholm castle.',
    moreInfoUrl: 'https://tahoeoutdoorstv.com',
  },
  {
    id: 'vikingsholm',
    name: 'Vikingsholm Trailhead',
    trail: 'Vikingsholm Trail',
    lat: 38.9536, lng: -120.0988, shore: 'west',
    difficulty: 'easy', distanceMi: 2, elevGainFt: 320, elevMaxFt: 6490,
    use: ['hiking'], season: 'May – Oct',
    permit: false, parking: 'CA State Parks fee · $10 · Very limited',
    dogs: false,
    highlights: ['Vikingsholm Scandinavian castle','Emerald Bay beach','Tea house island viewpoint'],
    desc: "Switchback trail down to Vikingsholm, a 38-room Scandinavian-style castle on Emerald Bay's shore. One of the most unique destinations at Tahoe.",
    moreInfoUrl: 'https://www.vikingsholm.org',
  },

  // ── NORTH / EAST SHORE ───────────────────────────────────────────────────────
  {
    id: 'stateline-lookout',
    name: 'Stateline Lookout Trailhead',
    trail: 'Stateline Lookout Trail',
    lat: 39.2373, lng: -119.9752, shore: 'north',
    difficulty: 'easy', distanceMi: 1.5, elevGainFt: 180, elevMaxFt: 6920,
    use: ['hiking'], season: 'Apr – Nov',
    permit: false, parking: 'Free',
    dogs: true,
    highlights: ['360° basin views','Nevada/California border','Short family hike'],
    desc: 'Best panoramic views for least effort at Tahoe. 1.5 miles round-trip to a ridgeline overlook spanning the entire north basin. Dog-friendly.',
    moreInfoUrl: 'https://tahoeoutdoorstv.com',
  },
  {
    id: 'marlette-flume',
    name: 'Marlette Lake / Flume Trail Trailhead',
    trail: 'Marlette Lake — Flume Trail',
    lat: 39.0955, lng: -119.9128, shore: 'east',
    difficulty: 'strenuous', distanceMi: 22, elevGainFt: 3200, elevMaxFt: 8500,
    use: ['hiking','mtb'], season: 'Jun – Oct',
    permit: false, parking: 'Nevada State Parks · $10',
    dogs: true,
    highlights: ['Flume Trail ridge','Marlette Lake reservoir','Historic flume route','MTB shuttle optional'],
    desc: 'The Flume Trail follows a historic 19th-century water flume along a narrow ridge 1,600 ft above Lake Tahoe. Bucket-list hike or MTB ride.',
    moreInfoUrl: 'https://parks.nv.gov/parks/lake-tahoe-nevada-state-park',
  },
  {
    id: 'sand-harbor-lakeside',
    name: 'Sand Harbor Lakeside Trail',
    trail: 'Sand Harbor Nature Trail',
    lat: 39.1989, lng: -119.9316, shore: 'east',
    difficulty: 'easy', distanceMi: 1.2, elevGainFt: 0, elevMaxFt: 6240,
    use: ['hiking'], season: 'Apr – Nov',
    permit: false, parking: 'Nevada State Parks · $10 · $15 summer weekends',
    dogs: false,
    highlights: ['Crystal-clear water','Granite boulders','Stunning beach','Wildlife spotting'],
    desc: "Short lakeside walk at Nevada's most beautiful beach. Water clarity exceeds 70 feet. Popular launch point for kayak tours and clear-kayak rentals.",
    moreInfoUrl: 'https://parks.nv.gov',
  },

  // ── BACKCOUNTRY / EXPERT ─────────────────────────────────────────────────────
  {
    id: 'dicks-peak',
    name: "Dick's Peak Trailhead",
    trail: "Dick's Peak via Velma Lakes",
    lat: 38.9318, lng: -120.1056, shore: 'west',
    difficulty: 'expert', distanceMi: 18, elevGainFt: 3800, elevMaxFt: 9974,
    use: ['hiking'], season: 'Jul – Sep',
    permit: true, parking: 'Free · Bayview/Emerald Bay area',
    dogs: false,
    highlights: ["Second-highest point above Tahoe","Velma Lakes basin","Multi-day route","Remote alpine terrain"],
    desc: "One of Tahoe's most demanding summit hikes. Route through the Velma Lakes is one of the finest multi-day backpacking circuits in the Sierra.",
    moreInfoUrl: 'https://www.fs.usda.gov/ltbmu',
  },
  {
    id: 'relay-peak',
    name: 'Relay Peak Trailhead',
    trail: 'TRT to Relay Peak Summit',
    lat: 39.3092, lng: -119.9235, shore: 'north',
    difficulty: 'strenuous', distanceMi: 8, elevGainFt: 1800, elevMaxFt: 10338,
    use: ['hiking'], season: 'Jul – Oct',
    permit: false, parking: 'Free · Mt. Rose Hwy pullout',
    dogs: true,
    highlights: ['Highest point on the TRT','360° Sierra Nevada views','Often snow-free by mid-July'],
    desc: 'The highest point on the entire Tahoe Rim Trail at 10,338 ft. Clear days offer views deep into the Sierra Nevada, Nevada desert, and the full lake basin.',
    moreInfoUrl: 'https://tahoerimtrail.org',
  },
  {
    id: 'ellis-peak',
    name: 'Ellis Peak Trailhead',
    trail: 'Ellis Peak Summit',
    lat: 39.1048, lng: -120.1482, shore: 'west',
    difficulty: 'strenuous', distanceMi: 6, elevGainFt: 1800, elevMaxFt: 8740,
    use: ['hiking'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Barker Pass Road',
    dogs: true,
    highlights: ['Best 360° views on west shore','Snowshoe destination in winter','Less crowded than Tallac'],
    desc: "The west shore's best summit hike and the basin's top snowshoe destination. Views encompass Tahoe, Desolation Wilderness, and the Granite Chief Wilderness.",
    moreInfoUrl: 'https://tahoeoutdoorstv.com',
  },
  {
    id: 'horsetail-falls',
    name: 'Horsetail Falls Trailhead',
    trail: 'Horsetail Falls',
    lat: 38.7896, lng: -120.0252, shore: 'south',
    difficulty: 'moderate', distanceMi: 4, elevGainFt: 1000, elevMaxFt: 7800,
    use: ['hiking'], season: 'May – Oct',
    permit: false, parking: 'Free · Twin Bridges on Hwy 50',
    dogs: true,
    highlights: ['Dramatic 500-ft waterfall','Twin Bridges swimming hole','High Sierra canyon'],
    desc: 'South shore canyon hike to a dramatic 500-foot waterfall. The Twin Bridges swimming hole at the trailhead is one of the best in the Sierra.',
    moreInfoUrl: 'https://tahoeoutdoorstv.com',
  },
  {
    id: 'tahoe-east-shore-trail',
    name: 'East Shore Trail Trailhead',
    trail: 'Lake Tahoe East Shore Trail',
    lat: 39.1610, lng: -119.9442, shore: 'east',
    difficulty: 'easy', distanceMi: 4.2, elevGainFt: 100, elevMaxFt: 6240,
    use: ['hiking','mixed'], season: 'Apr – Nov',
    permit: false, parking: 'Free · Spooner Lake or Sand Harbor',
    dogs: true,
    highlights: ['Paved lakeside path','Bonsai Rock','Family-friendly','Incredible lake access'],
    desc: "Paved and accessible trail connecting Spooner Lake to Sand Harbor along Tahoe's dramatic east shore. Passes Bonsai Rock — the most photographed spot on the lake.",
    moreInfoUrl: 'https://tahoeoutdoorstv.com',
  },
];

// Helper — group by shore
export function byShore(shore: Shore | 'all'): Trailhead[] {
  if (shore === 'all') return TRAILHEADS;
  return TRAILHEADS.filter(t => t.shore === shore);
}

// Helper — filter by difficulty
export function byDifficulty(d: Difficulty | 'all'): Trailhead[] {
  if (d === 'all') return TRAILHEADS;
  return TRAILHEADS.filter(t => t.difficulty === d);
}

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy:     '#4ABC78',
  moderate: '#4AADBC',
  strenuous:'#E0B85C',
  expert:   '#E05050',
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy:     'Easy',
  moderate: 'Moderate',
  strenuous:'Strenuous',
  expert:   'Expert',
};

// ═══════════════════════════════════════════════════════════
//  ADDITIONAL TRAILHEADS — Hiking + MTB expansion
//  Added: Mount Rose, north/south/west MTB, hiking gaps
// ═══════════════════════════════════════════════════════════

export const TRAILHEADS_EXTRA: Trailhead[] = [

  // ── MOUNT ROSE AREA (east/north — Hwy 431) ───────────────────────────────
  {
    id: 'mount-rose-summit',
    name: 'Mount Rose Summit Trailhead',
    trail: 'Mount Rose Trail',
    lat: 39.3133, lng: -119.8972, shore: 'east',
    difficulty: 'strenuous', distanceMi: 10.9, elevGainFt: 2395, elevMaxFt: 10776,
    use: ['hiking'], season: 'Jun – Oct',
    permit: false, parking: 'Free · ~50 spaces · Restrooms & trail maps on-site · Hwy 431',
    dogs: true,
    highlights: ['Third-highest peak in Tahoe basin','Galena Falls','Galena Creek meadows','TRT junction','Lake Tahoe & Reno views'],
    // Confirmed: 10.9mi loop, 2,395ft gain, 8,921ft trailhead, 10,776ft summit — AllTrails/SummitPost
    desc: "Mount Rose is the third-highest peak in the Tahoe basin at 10,776 ft. The trail passes Galena Falls and Galena Creek meadows before the steep final push. Views stretch across the entire basin to Reno. Start early — the summit is exposed and windy.",
    moreInfoUrl: 'https://www.alltrails.com/trail/us/nevada/mount-rose-trail',
  },
  {
    id: 'tahoe-meadows',
    name: 'Tahoe Meadows Trailhead',
    trail: 'Tahoe Meadows Loop / TRT',
    lat: 39.2980, lng: -119.9070, shore: 'east',
    difficulty: 'easy', distanceMi: 1.3, elevGainFt: 60, elevMaxFt: 8740,
    use: ['hiking'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Large lot · Hwy 431 near Mt. Rose summit',
    dogs: true,
    highlights: ['Sub-alpine meadow','Wildflowers July–Aug','Accessible boardwalk','TRT access','Family-friendly'],
    // Confirmed: flat 1.3mi boardwalk loop at 8,740ft, near Mt. Rose trailhead on Hwy 431
    desc: "Flat boardwalk loop through a stunning sub-alpine meadow at nearly 9,000 ft. Best wildflowers in the basin July through August. Also the north access point for the Tahoe Rim Trail. Note: MTB restricted to even-numbered days.",
    moreInfoUrl: 'https://tahoerimtrail.org',
  },
  {
    id: 'galena-creek',
    name: 'Galena Creek Trailhead',
    trail: 'Galena Creek Trail / Tahoe Rim Trail',
    lat: 39.3028, lng: -119.8622, shore: 'east',
    difficulty: 'moderate', distanceMi: 9.2, elevGainFt: 2100, elevMaxFt: 8300,
    use: ['hiking'], season: 'May – Oct',
    permit: false, parking: 'Free · Galena Creek Regional Park · off Hwy 341',
    dogs: true,
    highlights: ['Lower-elevation start','Loop options','Tahoe Rim Trail access','Galena Creek Regional Park'],
    // Confirmed: 9.2mi loop through Mt. Rose Wilderness, Galena Creek Regional Park — travelnevada.com
    desc: "9.2-mile loop through the Mt. Rose Wilderness starting from Galena Creek Regional Park. Lower starting elevation makes it more accessible than the main Mt. Rose trailhead. Multiple loop options from easy creek walks to strenuous ridge climbs.",
    moreInfoUrl: 'https://travelnevada.com/parks-recreational-areas/mount-rose-wilderness-area/',
  },

  // ── NORTH SHORE — MTB ────────────────────────────────────────────────────
  {
    id: 'burton-creek-mtb',
    name: 'Burton Creek MTB Trailhead',
    trail: 'Burton Creek State Park Trail Network',
    lat: 39.1900, lng: -120.1355, shore: 'north',
    difficulty: 'easy', distanceMi: 20, elevGainFt: 800, elevMaxFt: 6800,
    use: ['hiking', 'mtb'], season: 'May – Nov',
    permit: false, parking: 'Free · Old Mill Rd off Hwy 28 · Tahoe City',
    dogs: true,
    highlights: ['20+ miles of XC trails','Beginner & intermediate','Old-growth forest','No crowds'],
    // Confirmed: Burton Creek State Park, largest undeveloped state park on Lake Tahoe, north shore XC network
    desc: "Burton Creek State Park offers the largest undeveloped trail network on the north shore — 20+ miles of XC singletrack through old-growth forest. Best beginner-to-intermediate MTB on the north shore. Dog-friendly and rarely crowded.",
    moreInfoUrl: 'https://tahoeoutdoorstv.com',
  },
  {
    id: 'martis-valley',
    name: 'Martis Valley Trail System',
    trail: 'Martis Valley / Northstar Trails',
    lat: 39.2750, lng: -120.1200, shore: 'north',
    difficulty: 'moderate', distanceMi: 35, elevGainFt: 1500, elevMaxFt: 7100,
    use: ['hiking', 'mtb'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Multiple access points off Hwy 267',
    dogs: true,
    highlights: ['35+ miles of trail','Flow trails & XC','Northstar bike park adjacent','Beginner to expert'],
    // Confirmed: Martis Valley trail system, Northstar-adjacent, multiple trail types
    desc: "35+ miles of flow trails, XC, and technical singletrack in the Martis Valley between Tahoe City and Truckee. Adjacent to Northstar's lift-accessed bike park. Best variety of MTB terrain on the north shore.",
    moreInfoUrl: 'https://www.northstarcalifornia.com',
  },
  {
    id: 'blackwood-canyon',
    name: 'Blackwood Canyon / Barker Pass Trailhead',
    trail: 'Blackwood Canyon — Ward Creek — TRT',
    lat: 39.1050, lng: -120.1622, shore: 'west',
    difficulty: 'moderate', distanceMi: 8, elevGainFt: 1600, elevMaxFt: 7650,
    use: ['hiking', 'mtb'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Restrooms · Off Hwy 89 near Tahoe City',
    dogs: true,
    highlights: ['Paved canyon road to Barker Pass','Aspen groves & meadows','TRT connection at summit','Multiple use — quiet & scenic'],
    // Confirmed: Blackwood Canyon Rd, paved climb to Barker Pass, TRT connection — laketahoe.com MTB guide
    desc: "Gentle paved canyon road climbs 4 miles through aspen groves and open meadows to Barker Pass TRT junction. Excellent mixed-use corridor — ride up, hike back or link to TRT. One of the quietest and most scenic west shore access roads.",
    moreInfoUrl: 'https://tahoe.com/articles/lake-tahoe-mountain-biking-beginner-advanced',
  },

  // ── SOUTH SHORE — MTB ────────────────────────────────────────────────────
  {
    id: 'mr-toads',
    name: "Mr. Toad's Wild Ride Trailhead",
    trail: "Mr. Toad's Wild Ride / Saxon Creek",
    lat: 38.8782, lng: -119.9905, shore: 'south',
    difficulty: 'expert', distanceMi: 10, elevGainFt: 3200, elevMaxFt: 9100,
    use: ['mtb'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Big Meadow Trailhead · Hwy 89 at Luther Pass',
    dogs: false,
    highlights: ['Most technical MTB descent in Tahoe','Saxon Creek drainage','TRT ridge approach','Expert riders only'],
    // Confirmed: Big Meadow TH on Hwy 89, shuttle or loop, Saxon Creek descent — TAMBA, Trailforks (4.9★)
    desc: "Tahoe's most legendary MTB trail. Start at Big Meadow on the TRT and descend the relentless Saxon Creek drainage — continuous rock gardens, tight switchbacks, and technical challenge all the way down. Shuttle strongly recommended. Expert riders only.",
    moreInfoUrl: 'https://tamba.org/trails/',
  },
  {
    id: 'corral-trail',
    name: 'Corral Trail Hub — South Shore MTB',
    trail: 'Corral / Sidewinder / Armstrong / Powerline Network',
    lat: 38.9212, lng: -119.9558, shore: 'south',
    difficulty: 'moderate', distanceMi: 5, elevGainFt: 700, elevMaxFt: 7200,
    use: ['hiking', 'mtb'], season: 'May – Nov',
    permit: false, parking: 'Free · Fountain Place Rd off Oneidas St · South Lake Tahoe',
    dogs: true,
    highlights: ['Unofficial south shore MTB hub','All ability levels','Jump lines & berms','Links to TRT & Mr. Toads'],
    // Confirmed: Fountain Place dirt lot, Corral/Sidewinder/Armstrong network — TAMBA, southshorebikestahoe.com
    desc: "The beating heart of South Shore mountain biking. The Corral network has something for everyone — Sidewinder for beginners, Corral for intermediates, Armstrong and connector trails for advanced riders. The Powerline trail links back to town. Built and maintained by TAMBA.",
    moreInfoUrl: 'https://tamba.org/trails/',
  },
  {
    id: 'powerline-trail',
    name: 'Powerline Trail Trailhead',
    trail: 'Powerline Trail — South Lake Tahoe',
    lat: 38.9302, lng: -119.9710, shore: 'south',
    difficulty: 'easy', distanceMi: 7, elevGainFt: 500, elevMaxFt: 6900,
    use: ['hiking', 'mtb'], season: 'May – Nov',
    permit: false, parking: 'Free · Multiple street access points in South Lake Tahoe',
    dogs: true,
    highlights: ['Smooth beginner MTB trail','Town access — no drive needed','Links to Corral network','7 miles through pine forest'],
    // Confirmed: 7mi smooth trail from SLT through forest, beginner-friendly — visitlaketahoe.com
    desc: "Smooth, well-maintained trail running from South Lake Tahoe through pine forest to the Corral network. The best beginner MTB option on the south shore — no shuttle, no technical moves, just flowing singletrack through the trees.",
    moreInfoUrl: 'https://visitlaketahoe.com/things-to-do/biking/top-mountain-bike-trails-south-lake-tahoe/',
  },

  // ── WEST SHORE — MTB + HIKING GAPS ───────────────────────────────────────
  {
    id: 'tahoe-city-trt-mtb',
    name: 'Tahoe City TRT — MTB Access',
    trail: 'Tahoe Rim Trail — North Shore Segment',
    lat: 39.1720, lng: -120.1432, shore: 'north',
    difficulty: 'moderate', distanceMi: 12, elevGainFt: 1400, elevMaxFt: 7800,
    use: ['mtb'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Fairway Dr · Tahoe City',
    dogs: true,
    highlights: ['TRT ridgeline MTB','Lake views from above','Links to Brockway Summit','Intermediate singletrack'],
    // Confirmed: TRT north shore segment, MTB-legal, Tahoe City access
    desc: "North shore TRT segment ridden as a point-to-point or out-and-back from Tahoe City. Climbs to exposed ridgeline with sweeping lake views. Intermediate trail with sustained climbing and flowy singletrack on the descent. Combine with Brockway for a full-day epic.",
    moreInfoUrl: 'https://tahoerimtrail.org',
  },
  {
    id: 'five-lakes-trail',
    name: 'Five Lakes Trailhead',
    trail: 'Five Lakes Trail — Granite Chief Wilderness',
    lat: 39.1908, lng: -120.2260, shore: 'north',
    difficulty: 'moderate', distanceMi: 4.6, elevGainFt: 1000, elevMaxFt: 7400,
    use: ['hiking'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Alpine Meadows Rd off Hwy 89',
    dogs: true,
    highlights: ['Five alpine lakes basin','Granite Chief Wilderness','Less crowded than Desolation','Quick alpine access'],
    // Confirmed: 4.6mi RT, 1,000ft gain, Granite Chief Wilderness — multiple sources
    desc: "4.6-mile round trip to a stunning basin holding five alpine lakes inside the Granite Chief Wilderness. Less crowded than Desolation Wilderness but equally beautiful. The basin opens up dramatically at the top of the climb.",
    moreInfoUrl: 'https://tahoeoutdoorstv.com',
  },
  {
    id: 'ward-creek',
    name: 'Ward Creek / Stanford Rock Trailhead',
    trail: 'Ward Creek — Stanford Rock Loop',
    lat: 39.1492, lng: -120.1712, shore: 'west',
    difficulty: 'moderate', distanceMi: 10, elevGainFt: 1800, elevMaxFt: 7780,
    use: ['hiking', 'mtb'], season: 'Jun – Oct',
    permit: false, parking: 'Free · Ward Creek Blvd off Hwy 89',
    dogs: true,
    highlights: ['Stanford Rock viewpoint','Ward Creek valley','Old-growth forest','Less traveled west shore option'],
    // Confirmed: Ward Creek trail system, Stanford Rock, west shore USFS — Tahoe guide sources
    desc: "Loop hike through the Ward Creek valley to Stanford Rock viewpoint overlooking the lake. Quieter than the popular Emerald Bay trails with equally rewarding views. Also rideable as an MTB loop via Blackwood Canyon connector.",
    moreInfoUrl: 'https://tahoeoutdoorstv.com',
  },

  // ── EAST SHORE — ADDITIONAL ──────────────────────────────────────────────
  {
    id: 'diamond-peak-mtb',
    name: 'Diamond Peak MTB / Tahoe Meadows Connector',
    trail: 'TRT — Incline Village to Tahoe Meadows',
    lat: 39.2485, lng: -119.9292, shore: 'east',
    difficulty: 'strenuous', distanceMi: 14, elevGainFt: 2800, elevMaxFt: 9000,
    use: ['hiking', 'mtb'], season: 'Jul – Oct',
    permit: false, parking: 'Free · Tunnel Creek Rd · Incline Village',
    dogs: true,
    highlights: ['TRT ridge above east shore','Tunnel Creek descent','Links Tahoe Meadows to Spooner','Epic east shore views'],
    // Confirmed: Tunnel Creek Rd Incline Village TRT access, MTB-legal, east shore ridge riding
    desc: "East shore TRT segment from Incline Village up to the ridge above Diamond Peak ski area, continuing to Tahoe Meadows. Epic exposed ridgeline with views of the full basin. The Tunnel Creek descent is one of the best legal MTB descents on the east shore.",
    moreInfoUrl: 'https://tahoerimtrail.org',
  },
];

// Merge with primary TRAILHEADS array
export const ALL_TRAILHEADS: Trailhead[] = [...TRAILHEADS, ...TRAILHEADS_EXTRA];
