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
