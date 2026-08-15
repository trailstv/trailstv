// lib/parks/index.ts — National Parks registry

export type ParkSlug = 'great-smoky-mountains' | 'zion' | 'yellowstone' | 'grand-canyon' | 'yosemite' | 'lake-tahoe';

export interface ParkMeta {
  slug:         ParkSlug;
  npsCode:      string;
  name:         string;
  shortName:    string;
  tagline:      string;
  state:        string;
  lat:          number;
  lng:          number;
  zoom:         number;
  acreage:      string;
  established:  number;
  annualVisits: string;
  elevationFt:  { low: number; high: number };
  heroColor:    string;
  entranceFee:  string;
  permitRequired: boolean;
  website:      string;
  highlights:   string[];
  warnings:     string[];
  seasons:      { name: string; desc: string }[];
}

export const PARKS: Record<ParkSlug, ParkMeta> = {
  'great-smoky-mountains': {
    slug:'great-smoky-mountains', npsCode:'grsm',
    name:'Great Smoky Mountains National Park', shortName:'Great Smoky Mountains',
    tagline:'The most visited national park in America — and the most free.',
    state:'Tennessee & North Carolina', lat:35.6532, lng:-83.5070, zoom:10,
    acreage:'522,427', established:1934, annualVisits:'11.5M (2025)',
    elevationFt:{ low:875, high:6643 }, heroColor:'#4ABC78',
    entranceFee:'Free — no entrance fee', permitRequired:false,
    website:'https://www.nps.gov/grsm',
    highlights:[
      'Clingmans Dome — highest point at 6,643 ft',
      'Cades Cove — historic valley with wildlife and log cabins',
      'Appalachian Trail — 71 miles through the park',
      'Alum Cave Trail — iconic geology, 4.4 mi to summit',
      'Fall foliage — among the best in the eastern US',
      'Free admission — only major NPS park with no entrance fee',
    ],
    warnings:[
      'Bears are active — proper food storage required at all times',
      'Cades Cove parking often full by 9am in summer',
      'Thunderstorms develop quickly above 4,000 ft',
      'Clingmans Dome Road closed December 1 through March 31',
    ],
    seasons:[
      { name:'Spring (Mar–May)', desc:'Wildflowers and waterfalls at peak. Cooler temps, fewer crowds.' },
      { name:'Summer (Jun–Aug)', desc:'Busiest season. Start early. Cades Cove fills by 9am.' },
      { name:'Fall (Sep–Nov)',   desc:'Peak foliage mid-October. Book campsites far in advance.' },
      { name:'Winter (Dec–Feb)', desc:'Snow at higher elevations. Clingmans Dome Road closes Dec 1.' },
    ],
  },
  zion: {
    slug:'zion', npsCode:'zion',
    name:'Zion National Park', shortName:'Zion',
    tagline:"Utah's crown jewel — 5 million people in one canyon.",
    state:'Utah', lat:37.2982, lng:-113.0263, zoom:11,
    acreage:'147,242', established:1919, annualVisits:'4.98M (2025)',
    elevationFt:{ low:3666, high:8726 }, heroColor:'#E07040',
    entranceFee:'$35/vehicle · America the Beautiful pass accepted', permitRequired:true,
    website:'https://www.nps.gov/zion',
    highlights:[
      'The Narrows — wade the Virgin River between 1,000 ft walls',
      'Angels Landing — chains route, permit required, 5.4 mi RT',
      'Emerald Pools — three tiered pools, accessible for most',
      'Subway — technical slot canyon, permit required',
      'Canyon Overlook Trail — best view for the effort, 1 mi RT',
      'Kolob Canyons — quieter, less-visited section of the park',
    ],
    warnings:[
      'Angels Landing requires a permit — lottery at recreation.gov',
      'Flash floods can be fatal — check weather before any slot canyon',
      'Shuttle mandatory Apr–Nov — no private vehicles on scenic drive',
      'Heat exhaustion common Jun–Aug — carry 1L water per hour',
    ],
    seasons:[
      { name:'Spring (Mar–May)', desc:'Best conditions. Wildflowers, moderate temps.' },
      { name:'Summer (Jun–Aug)', desc:'Very hot (100°F+). Flash flood risk high. Start before 7am.' },
      { name:'Fall (Sep–Nov)',   desc:'Ideal weather. Best Narrows conditions. Still crowded.' },
      { name:'Winter (Dec–Feb)', desc:'Quietest season. Angels Landing icy. Narrows needs dry suit.' },
    ],
  },
  yellowstone: {
    slug:'yellowstone', npsCode:'yell',
    name:'Yellowstone National Park', shortName:'Yellowstone',
    tagline:"America's first national park. The world's largest active supervolcano.",
    state:'Wyoming, Montana & Idaho', lat:44.4280, lng:-110.5885, zoom:9,
    acreage:'2,219,791', established:1872, annualVisits:'4.76M (2025)',
    elevationFt:{ low:5282, high:11358 }, heroColor:'#D4A853',
    entranceFee:'$35/vehicle · Valid 7 days', permitRequired:false,
    website:'https://www.nps.gov/yell',
    highlights:[
      'Old Faithful — erupts every 44–125 minutes',
      'Grand Prismatic Spring — largest hot spring in the US',
      'Lamar Valley — best wildlife viewing in North America',
      'Grand Canyon of the Yellowstone — 308 ft Lower Falls',
      'Mammoth Hot Springs — terraced travertine formations',
      'Norris Geyser Basin — hottest thermal area in the park',
    ],
    warnings:[
      'Stay on boardwalks — thermal features can be scalding',
      'Stay 25 yards from bison, 100 yards from bears and wolves',
      'Altitude sickness possible above 8,000 ft',
      'Book lodging and campsites 6+ months in advance',
    ],
    seasons:[
      { name:'Spring (Apr–May)', desc:'Fewer crowds, baby bison, dramatic geyser steam.' },
      { name:'Summer (Jun–Aug)', desc:'All roads open. Best wildlife in Lamar Valley.' },
      { name:'Fall (Sep–Oct)',   desc:'Elk rut in September. Fewer people, great light.' },
      { name:'Winter (Nov–Mar)', desc:'Most roads closed. Snowcoach access only. Extraordinary.' },
    ],
  },
  'grand-canyon': {
    slug:'grand-canyon', npsCode:'grca',
    name:'Grand Canyon National Park', shortName:'Grand Canyon',
    tagline:'277 river miles. A billion years of Earth history.',
    state:'Arizona', lat:36.1069, lng:-112.1129, zoom:10,
    acreage:'1,217,262', established:1919, annualVisits:'4.9M (2024)',
    elevationFt:{ low:1200, high:9165 }, heroColor:'#C4603A',
    entranceFee:'$35/vehicle · Valid 7 days', permitRequired:true,
    website:'https://www.nps.gov/grca',
    highlights:[
      'South Rim — Mather Point, Yavapai Point, 13 miles of Rim Trail',
      'Bright Angel Trail — classic corridor route, 9.5 mi to river',
      'North Rim — cooler, quieter, 1,000 ft higher than South Rim',
      'Colorado River — multi-day whitewater raft trips',
      'Phantom Ranch — only lodging below the rim, book a year ahead',
      'Havasu Falls — turquoise waterfalls on Havasupai tribal land',
    ],
    warnings:[
      'Do NOT hike to the river and back in one day — people die attempting this',
      'Inner canyon exceeds 110°F in summer — hike only before 10am and after 4pm',
      'Bright Angel overnight permit required — apply via lottery',
      'Havasupai Falls requires a separate tribal permit, not NPS',
    ],
    seasons:[
      { name:'Spring (Mar–May)', desc:'Best inner canyon weather. Wildflowers on rim.' },
      { name:'Summer (Jun–Aug)', desc:'South Rim accessible. Inner canyon dangerously hot.' },
      { name:'Fall (Sep–Nov)',   desc:'Ideal temperatures. Best time for inner canyon hikes.' },
      { name:'Winter (Dec–Feb)', desc:'North Rim closed. South Rim open. Snow transforms canyon.' },
    ],
  },
  yosemite: {
    slug:'yosemite', npsCode:'yose',
    name:'Yosemite National Park', shortName:'Yosemite',
    tagline:'Granite. Waterfalls. Half Dome. The park that created conservation.',
    state:'California', lat:37.8651, lng:-119.5383, zoom:10,
    acreage:'759,620', established:1890, annualVisits:'4.28M (2025)',
    elevationFt:{ low:2127, high:13114 }, heroColor:'#4AADBC',
    entranceFee:'$35/vehicle · Reservation required Mar–Nov', permitRequired:true,
    website:'https://www.nps.gov/yose',
    highlights:[
      'Half Dome — 17 mi RT hike with cables, permit required',
      'El Capitan — 3,000 ft granite wall, world capital of big wall climbing',
      'Yosemite Falls — tallest waterfall in North America at 2,425 ft',
      'Glacier Point — 360° views over the valley',
      'Mariposa Grove — 500 giant sequoias',
      'Tuolumne Meadows — high country at 8,600 ft, less crowded',
    ],
    warnings:[
      'Valley day-use reservation required March–November',
      'Half Dome cables permit required — apply in March for summer',
      'Tioga Road closed November through May/June',
      'Bears active in all areas — never leave food in vehicles',
    ],
    seasons:[
      { name:'Spring (Apr–Jun)', desc:'Waterfalls at peak. Valley Reservation required.' },
      { name:'Summer (Jul–Sep)', desc:'All areas open. Half Dome permits required. Very crowded.' },
      { name:'Fall (Sep–Nov)',   desc:'Fewer crowds in October. Best photography light.' },
      { name:'Winter (Dec–Mar)', desc:'Snow in valley. Badger Pass skiing. Tioga Road closed.' },
    ],
  },

  'lake-tahoe': {
    slug:         'lake-tahoe' as ParkSlug,
    npsCode:      'tahoebf',
    name:         'Lake Tahoe Basin',
    shortName:    'Lake Tahoe',
    tagline:      'The crown jewel of the Sierra Nevada — 72 miles of shoreline, 70 ft of visibility, and adventure on every shore.',
    state:        'California & Nevada',
    lat:          39.0968, lng: -120.0324, zoom: 10,
    acreage:      '191,000',
    established:  1899,
    annualVisits: '15M+ (2025)',
    elevationFt:  { low: 6229, high: 10881 },
    heroColor:    '#4AADBC',
    entranceFee:  'Free entry — no entrance fee',
    permitRequired: false,
    website:      'https://www.fs.usda.gov/ltbmu',
    highlights: [
      '70+ feet of water clarity — among the clearest lakes in the world',
      'Emerald Bay — the most photographed spot in California',
      'Desolation Wilderness — stunning alpine backcountry',
      '33 trailheads across all four shores',
      '16 ski resorts including Palisades, Heavenly, and Northstar',
      '13 activity categories — boating, MTB, climbing, fishing, kayaking, and more',
    ],
    warnings: [
      'Boat inspections mandatory — all motorized watercraft must be inspected before launching',
      'Desolation Wilderness permits required for overnight camping',
      'Bears are active — use bear boxes, never leave food in vehicles',
      'Mountain road closures common in winter — check Caltrans before driving',
    ],
    seasons: [
      { name: 'Spring (Apr-Jun)', desc: 'Snowmelt waterfalls, wildflowers, uncrowded trails. Ski season winding down.' },
      { name: 'Summer (Jul-Sep)', desc: 'Busiest season. Boating, hiking, swimming. Reserve campsites 6 months ahead.' },
      { name: 'Fall (Sep-Nov)',   desc: 'Aspen color, cooler temps, fewer crowds. Best hiking weather of the year.' },
      { name: 'Winter (Dec-Mar)', desc: 'World-class skiing at 16 resorts. Chains required on mountain roads.' },
    ],
  },
};

export const PARK_SLUGS  = Object.keys(PARKS) as ParkSlug[];
export const PARK_LIST   = Object.values(PARKS);
export function getPark(slug: string): ParkMeta | null {
  return PARKS[slug as ParkSlug] ?? null;
}
