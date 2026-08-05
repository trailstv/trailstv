// lib/activityLocations.ts
// Per-activity map pins — shown on each activity's dedicated map page.
// Each pin has a name, lat/lng, type (launch/trailhead/rental/resort/spot),
// difficulty where applicable, and an external info URL.

export type PinType =
  | 'trailhead'
  | 'launch'
  | 'rental'
  | 'resort'
  | 'beach'
  | 'marina'
  | 'campsite'
  | 'spot'
  | 'viewpoint';

export interface ActivityPin {
  id:         string;
  name:       string;
  lat:        number;
  lng:        number;
  type:       PinType;
  shore:      'north' | 'south' | 'east' | 'west';
  desc:       string;
  difficulty?: string;
  fee?:       string;
  url?:       string;
  note?:      string;
}

export interface ActivityMeta {
  id:       string;
  label:    string;
  icon:     string;
  color:    string;    // marker color
  center:   [number, number];
  zoom:     number;
  desc:     string;
  pins:     ActivityPin[];
}

export const ACTIVITY_MAPS: Record<string, ActivityMeta> = {

  // ─────────────────────────────────────────────────────────────────────────
  camping: {
    id: 'camping', label: 'Camping', icon: '⛺', color: '#4ABC78',
    center: [39.02, -120.02], zoom: 11,
    desc: '14 verified campgrounds around the basin — click any pin to book.',
    pins: [
      { id:'dlbliss',   name:'D.L. Bliss State Park',          lat:38.9695, lng:-120.1035, type:'campsite', shore:'west', desc:'168 sites · Beach access · ReserveCalifornia', fee:'$35/night', url:'https://www.reservecalifornia.com/Web/Default.aspx#!park/718' },
      { id:'eaglepoint',name:'Eagle Point — Emerald Bay',      lat:38.9540, lng:-120.1060, type:'campsite', shore:'west', desc:'97 sites · Bay views · ReserveCalifornia',    fee:'$35/night', url:'https://www.reservecalifornia.com/Web/Default.aspx#!park/121' },
      { id:'sugarpine', name:'Sugar Pine Point',               lat:39.0418, lng:-120.1120, type:'campsite', shore:'west', desc:'175 sites · Year-round · ReserveCalifornia',  fee:'$35/night', url:'https://www.reservecalifornia.com/Web/Default.aspx#!park/120' },
      { id:'williamkent',name:'William Kent Campground',       lat:39.0895, lng:-120.1340, type:'campsite', shore:'west', desc:'95 sites · 3 yurts · Recreation.gov',          fee:'$32/night', url:'https://www.recreation.gov/camping/campgrounds/232874' },
      { id:'meeksbay',  name:'Meeks Bay Resort',               lat:39.0226, lng:-120.1182, type:'campsite', shore:'west', desc:'77 sites · Sandy beach · Recreation.gov',      fee:'$42/night', url:'https://www.recreation.gov/camping/campgrounds/10220612' },
      { id:'tahoesra',  name:'Tahoe State Recreation Area',    lat:39.1720, lng:-120.1465, type:'campsite', shore:'north',desc:'23 sites · Lakeside · ReserveCalifornia',      fee:'$35/night', url:'https://www.reservecalifornia.com/Web/Default.aspx#!park/104' },
      { id:'lakeforest',name:'Lake Forest Campground',         lat:39.1778, lng:-120.1342, type:'campsite', shore:'north',desc:'20 sites · First-come · Boat ramp',            fee:'$25/night', url:'https://www.recreation.gov/camping/campgrounds/233116' },
      { id:'kaspian',   name:'Kaspian Campground',             lat:39.1138, lng:-120.1548, type:'campsite', shore:'north',desc:'10 sites · Tent-only · Lake views',            fee:'$27/night', url:'https://www.recreation.gov/camping/campgrounds/232490' },
      { id:'fallenlf',  name:'Fallen Leaf Lake',               lat:38.8980, lng:-120.0540, type:'campsite', shore:'south',desc:'206 sites · 6 yurts · Recreation.gov',         fee:'$30/night', url:'https://www.recreation.gov/camping/campgrounds/232769' },
      { id:'camprich',  name:'Camp Richardson RV Village',     lat:38.9345, lng:-120.0485, type:'campsite', shore:'south',desc:'98 RV sites · Full hookups · Recreation.gov', fee:'$55/night', url:'https://www.recreation.gov/camping/campgrounds/10305470' },
      { id:'campbythelake',name:'Campground by the Lake',      lat:38.9422, lng:-119.9738, type:'campsite', shore:'south',desc:'170 sites · RV hookups · City of SLT',         fee:'$39/night', url:'https://www.recreation.gov/camping/campgrounds/232488' },
      { id:'nvbeach',   name:'Nevada Beach',                   lat:38.9630, lng:-119.9280, type:'campsite', shore:'east', desc:'54 sites · Sandy beach · Recreation.gov',      fee:'$32/night', url:'https://www.recreation.gov/camping/campgrounds/232768' },
      { id:'zephyr',    name:'Zephyr Cove RV & Campground',    lat:38.9945, lng:-119.9390, type:'campsite', shore:'east', desc:'149 sites · Full hookups · Recreation.gov',    fee:'$45/night', url:'https://www.recreation.gov/camping/campgrounds/10300216' },
      { id:'spooner',   name:'Spooner Backcountry',            lat:39.1020, lng:-119.9080, type:'campsite', shore:'east', desc:'15 walk-in sites · Free · NV State Parks',    fee:'$15/night', url:'https://parks.nv.gov/parks/spooner-lake' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  hiking: {
    id: 'hiking', label: 'Hiking', icon: '🥾', color: '#4AADBC',
    center: [39.00, -120.04], zoom: 11,
    desc: '20+ verified trailheads — filter by shore or difficulty on the Trail Map.',
    pins: [
      { id:'eaglefalls',  name:'Eagle Falls Trailhead',      lat:38.9538, lng:-120.1093, type:'trailhead', shore:'west',  desc:'Eagle Lake · 3mi RT · Moderate · Emerald Bay views', difficulty:'Moderate', url:'https://tahoeoutdoorstv.com/hiking/experience-the-majesty-of-eagle-falls-trail/' },
      { id:'tallac',      name:'Mount Tallac Trailhead',     lat:38.9127, lng:-120.0856, type:'trailhead', shore:'south', desc:'Summit · 9.4mi RT · Strenuous · 9,735ft', difficulty:'Strenuous', url:'https://tahoeoutdoorstv.com/hiking/hiking-mount-tallac/' },
      { id:'rubicon',     name:'Rubicon Trail — D.L. Bliss', lat:38.9738, lng:-120.1028, type:'trailhead', shore:'west',  desc:'Cliff-edge lake views · 5mi · Moderate', difficulty:'Moderate' },
      { id:'vikingsholm', name:'Vikingsholm Trailhead',      lat:38.9536, lng:-120.0988, type:'trailhead', shore:'west',  desc:'Emerald Bay castle · 2mi RT · Easy', difficulty:'Easy', url:'https://www.vikingsholm.org' },
      { id:'cascade',     name:'Cascade Falls Trailhead',   lat:38.9333, lng:-120.0882, type:'trailhead', shore:'west',  desc:'Waterfall · 1.6mi RT · Easy', difficulty:'Easy' },
      { id:'mtrose',      name:'Mount Rose Summit TH',       lat:39.3133, lng:-119.8972, type:'trailhead', shore:'east',  desc:'10,776ft summit · 10.9mi · Strenuous', difficulty:'Strenuous', url:'https://www.alltrails.com/trail/us/nevada/mount-rose-trail' },
      { id:'galena',      name:'Galena Creek Trailhead',     lat:39.3028, lng:-119.8622, type:'trailhead', shore:'east',  desc:'9.2mi loop · Mt. Rose Wilderness · Moderate', difficulty:'Moderate' },
      { id:'tahoe-meadows',name:'Tahoe Meadows',             lat:39.2980, lng:-119.9070, type:'trailhead', shore:'east',  desc:'Wildflower meadow boardwalk · 1.3mi · Easy', difficulty:'Easy' },
      { id:'stateline-lk', name:'Stateline Lookout',        lat:39.2373, lng:-119.9752, type:'trailhead', shore:'north', desc:'1.5mi RT · Panoramic basin views · Easy', difficulty:'Easy' },
      { id:'fivelakets',  name:'Five Lakes Trailhead',       lat:39.1908, lng:-120.2260, type:'trailhead', shore:'north', desc:'Granite Chief Wilderness · 4.6mi RT · Moderate', difficulty:'Moderate' },
      { id:'glena',       name:'Glen Alpine Trailhead',      lat:38.8932, lng:-120.0724, type:'trailhead', shore:'south', desc:'Desolation Wilderness · Permit required · Moderate', difficulty:'Moderate' },
      { id:'echo-lake',   name:'Echo Lake Trailhead',        lat:38.8305, lng:-120.0408, type:'trailhead', shore:'south', desc:'PCT junction · Desolation entry · Strenuous', difficulty:'Strenuous' },
      { id:'spooner-th',  name:'Spooner Summit TRT',         lat:39.1010, lng:-119.9082, type:'trailhead', shore:'east',  desc:'Flume Trail access · TRT junction · Moderate', difficulty:'Moderate' },
      { id:'sand-harbor-th',name:'East Shore Trail',         lat:39.1610, lng:-119.9442, type:'trailhead', shore:'east',  desc:'Paved lakeside path · 4.2mi · Easy · Bonsai Rock', difficulty:'Easy' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  kayaking: {
    id: 'kayaking', label: 'Kayaking', icon: '🛶', color: '#4AADBC',
    center: [39.02, -120.00], zoom: 11,
    desc: 'Launch spots, rental locations, and guided tours around the lake.',
    pins: [
      // ── Drop-in / Launch Spots ────────────────────────────────────────────
      { id:'meeks-launch',     name:'Meeks Bay — Launch',            lat:39.0226, lng:-120.1182, type:'launch', shore:'west',  desc:'Best west shore kayak launch · Protected bay · Glassy before 10am · Rentals on-site' },
      { id:'emerald-launch',   name:'Emerald Bay — Kayak Launch',    lat:38.9540, lng:-120.1100, type:'launch', shore:'west',  desc:'Most scenic paddle at Tahoe · No-wake zone · Vikingsholm beach access · Glassy at dawn' },
      { id:'dlbliss-launch',   name:'D.L. Bliss Beach',              lat:38.9695, lng:-120.1020, type:'launch', shore:'west',  desc:'West shore beach drop-in · Cliff-edge scenery · No rentals on-site · Morning glass' },
      { id:'sugar-pine-launch',name:'Sugar Pine Point Beach',        lat:39.0418, lng:-120.1112, type:'launch', shore:'west',  desc:'State park beach · Calm water · Good for families · Near boat ramp' },
      { id:'kings-launch',     name:'Kings Beach — Drop-In',         lat:39.2362, lng:-120.0198, type:'launch', shore:'north', desc:'Wide shallow bay · Best beginner launch on north shore · Calm mornings · Rentals steps away' },
      { id:'tahoe-city-launch',name:'Tahoe City Commons Beach',      lat:39.1685, lng:-120.1480, type:'launch', shore:'north', desc:'Free in-town launch · Flat water · Easy parking · North shore hub' },
      { id:'carnelian-launch', name:'Carnelian Bay Launch',          lat:39.2168, lng:-120.0728, type:'launch', shore:'north', desc:'Quiet north shore cove · Minimal boat traffic · Good intermediate paddle destination' },
      { id:'sand-harbor-k',    name:'Sand Harbor — Drop-In',         lat:39.1989, lng:-119.9316, type:'launch', shore:'east',  desc:'Clearest water at Tahoe · 70+ ft visibility · Granite boulders · Arrive before 9am weekends', fee:'$10 park entry' },
      { id:'cave-rock-launch', name:'Cave Rock Beach Launch',        lat:39.0332, lng:-119.9592, type:'launch', shore:'east',  desc:'East shore sea cave exploration · Intermediate paddle · Deep clear water · Dramatic scenery' },
      { id:'zephyr-launch',    name:'Zephyr Cove Beach Launch',      lat:38.9940, lng:-119.9390, type:'launch', shore:'east',  desc:'East shore central location · Protected cove · Easy entry · Rentals adjacent' },
      { id:'nevada-beach-k',   name:'Nevada Beach Drop-In',          lat:38.9630, lng:-119.9280, type:'launch', shore:'east',  desc:'Widest east shore beach · Sandy entry · Good for longer paddle south toward Zephyr' },
      { id:'pope-launch',      name:'Pope Beach Launch',             lat:38.9302, lng:-120.0642, type:'launch', shore:'south', desc:'Wide sandy USFS beach · Minimal powerboat traffic near shore · South shore central' },
      { id:'el-dorado-launch', name:'El Dorado Beach Launch',        lat:38.9430, lng:-119.9750, type:'launch', shore:'south', desc:'Free in-town SLT launch · Busy but accessible · Kayak/SUP rentals nearby' },
      { id:'fallen-leaf-k',    name:'Fallen Leaf Lake Launch',       lat:38.8980, lng:-120.0540, type:'launch', shore:'south', desc:'Mirror-flat alpine lake · NO motorized boats · Best flat-water paddle near Tahoe · Serene' },
      { id:'baldw-launch',     name:'Baldwin Beach Drop-In',         lat:38.9318, lng:-120.0788, type:'launch', shore:'south', desc:'Shallow sandy entry · Calm water · Family-friendly · Short paddle to rocky coves' },
      // ── Rental Outfitters ─────────────────────────────────────────────────
      { id:'tahoe-city-kayak', name:'Tahoe City Kayak',              lat:39.1695, lng:-120.1470, type:'rental', shore:'north', desc:'Kayak & SUP rentals · Guided tours available · North shore · Hourly & half-day', url:'https://tahoecitykayak.com' },
      { id:'tahoe-paddle-oar', name:'Tahoe Paddle & Oar — Kings Beach', lat:39.2360, lng:-120.0230, type:'rental', shore:'north', desc:'Kayak · SUP · Pontoon · Pedal boat · Kings Beach location · Best north shore outfitter', url:'https://tahoepaddle.com' },
      { id:'sand-harbor-clear',name:'Sand Harbor Clear Kayak Tours', lat:39.1992, lng:-119.9318, type:'rental', shore:'east',  desc:'Clear-bottom kayak tours · 70ft visibility · See the lake floor · Guided & self-guided', url:'https://www.sandharborlaketahoe.com' },
      { id:'emerald-bay-ws',   name:'Emerald Bay Water Sports',      lat:38.9540, lng:-120.1062, type:'rental', shore:'west',  desc:'Guided kayak tours into Emerald Bay · Vikingsholm stop · Half & full-day tours', url:'https://emeraldbaywatersports.com' },
      { id:'camp-rich-k',      name:'Camp Richardson Watersports',   lat:38.9345, lng:-120.0485, type:'rental', shore:'south', desc:'Kayak · SUP · Paddleboat rentals · South shore central · All ability levels', url:'https://camprichardson.com' },
      { id:'zephyr-kayak',     name:'Zephyr Cove Kayak Rentals',     lat:38.9940, lng:-119.9385, type:'rental', shore:'east',  desc:'Sit-on-top kayak rentals · East shore central · Hourly & half-day · Calm bay' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  mtb: {
    id: 'mtb', label: 'Mountain Biking', icon: '🚵', color: '#E0B85C',
    center: [39.02, -120.04], zoom: 11,
    desc: 'Trailheads and trail systems for all ability levels around the basin.',
    pins: [
      // ── East Shore ────────────────────────────────────────────────────────
      { id:'flume-mtb',     name:'Flume Trail — Spooner Summit TH',  lat:39.1010, lng:-119.9082, type:'trailhead', shore:'east',  desc:'Tahoe\'s most famous MTB ride · 14mi ridge · 1,600ft above lake · Shuttle or self-powered · Bucket list', difficulty:'Intermediate', url:'https://parks.nv.gov/parks/lake-tahoe-nevada-state-park' },
      { id:'marlette-mtb',  name:'Marlette Lake Trailhead',           lat:39.0955, lng:-119.9128, type:'trailhead', shore:'east',  desc:'Full Flume loop via Marlette Lake · 22mi strenuous circuit · Intermediate-Expert · Spectacular', difficulty:'Strenuous' },
      { id:'tunnel-creek',  name:'Tunnel Creek Rd — Incline Village', lat:39.2485, lng:-119.9292, type:'trailhead', shore:'east',  desc:'Best legal MTB descent on east shore · TRT ridge access · Tunnel Creek descent · Strenuous climb', difficulty:'Strenuous' },
      { id:'hobart-road',   name:'Hobart Road Trailhead',             lat:39.0820, lng:-119.9420, type:'trailhead', shore:'east',  desc:'Intermediate XC connector · Links Spooner to Marlette · Pine forest riding · Less crowded', difficulty:'Moderate' },
      // ── South Shore ───────────────────────────────────────────────────────
      { id:'mr-toads-th',   name:"Mr. Toad's Wild Ride — Big Meadow", lat:38.8782, lng:-119.9905, type:'trailhead', shore:'south', desc:'Tahoe\'s most technical descent · Saxon Creek drainage · 10mi · Expert rock gardens & switchbacks · Shuttle recommended', difficulty:'Expert', url:'https://tamba.org/trails/' },
      { id:'corral-th',     name:'Corral Trail Hub — SLT',            lat:38.9212, lng:-119.9558, type:'trailhead', shore:'south', desc:'South shore MTB hub · Corral/Sidewinder/Armstrong network · All levels · TAMBA-built & maintained', difficulty:'Moderate', url:'https://tamba.org/trails/' },
      { id:'powerline-th',  name:'Powerline Trail — SLT',             lat:38.9302, lng:-119.9710, type:'trailhead', shore:'south', desc:'7mi smooth singletrack · Best beginner trail south shore · Town access · Links to Corral · Dog-friendly', difficulty:'Easy' },
      { id:'angora-mtb',    name:'Angora Ridge Road',                  lat:38.9053, lng:-120.0500, type:'trailhead', shore:'south', desc:'Dirt road climb with rewarding views · Easy spin · Family-friendly · Links to XC routes above Fallen Leaf', difficulty:'Easy' },
      { id:'sidewinder',    name:'Sidewinder Trail',                   lat:38.9180, lng:-119.9570, type:'trailhead', shore:'south', desc:'South shore beginner-friendly flow trail · Part of TAMBA Corral network · Berms & rollers · Confidence builder', difficulty:'Easy' },
      // ── North Shore ───────────────────────────────────────────────────────
      { id:'burton-mtb',    name:'Burton Creek State Park',            lat:39.1900, lng:-120.1355, type:'trailhead', shore:'north', desc:'20+ miles of XC singletrack · Old-growth forest · North shore\'s best-kept secret · No crowds · Dog-friendly', difficulty:'Easy' },
      { id:'martis-mtb',    name:'Martis Valley Trail System',         lat:39.2750, lng:-120.1200, type:'trailhead', shore:'north', desc:'35+ miles of flow & XC · Adjacent to Northstar lift-access bike park · Something for every rider', difficulty:'Moderate' },
      { id:'trt-tahoe-city',name:'TRT North Shore Ridgeline',          lat:39.1720, lng:-120.1432, type:'trailhead', shore:'north', desc:'North shore TRT ridgeline MTB · Lake views from above · Links Tahoe City to Brockway Summit · Intermediate', difficulty:'Moderate' },
      { id:'brockway-mtb',  name:'Brockway Summit TRT',                lat:39.2545, lng:-120.0345, type:'trailhead', shore:'north', desc:'Ridge access · Connect north to TRT or descend east · Less traffic than south segments · Views', difficulty:'Moderate' },
      // ── West Shore ────────────────────────────────────────────────────────
      { id:'blackwood-mtb', name:'Blackwood Canyon / Barker Pass',     lat:39.1050, lng:-120.1622, type:'trailhead', shore:'west',  desc:'Paved canyon climb to TRT Barker Pass · Aspen groves · Quiet road · Mixed use', difficulty:'Moderate' },
      { id:'ward-creek-mtb',name:'Ward Creek Trail System',            lat:39.1492, lng:-120.1712, type:'trailhead', shore:'west',  desc:'West shore singletrack · Stanford Rock loop option · Connector to Blackwood · Intermediate XC', difficulty:'Moderate' },
      // ── Rentals & Shuttles ────────────────────────────────────────────────
      { id:'flume-bikes',   name:'Flume Trail Bikes — Incline Village', lat:39.2540, lng:-119.9382, type:'rental', shore:'east',  desc:'Full-suspension MTB rentals · Flume Trail shuttle service · Expert-level bikes · East shore specialist', url:'https://www.flumetrailbikes.com' },
      { id:'tahoe-sports-mtb',name:'Tahoe Sports Ltd — Tahoe City',   lat:39.1682, lng:-120.1513, type:'rental', shore:'north', desc:'MTB rentals · Repair shop · Trail maps & beta · North shore central', url:'https://tahoe-sports.com' },
      { id:'shoreline-mtb-shop',name:'Shoreline MTB — SLT',           lat:38.9380, lng:-119.9820, type:'rental', shore:'south', desc:'MTB specialists · Trek & Specialized · South shore · Corral/Toad shuttle info', url:'https://shorelinemtb.com' },
      { id:'anderson-bikes',name:'Anderson\'s Bike Rental — Kings Beach', lat:39.2370, lng:-120.0225, type:'rental', shore:'north', desc:'Casual & beach cruiser rentals · Entry-level MTB · North shore · Budget-friendly' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  skiing: {
    id: 'skiing', label: 'Skiing & Riding', icon: '⛷️', color: '#8BB8E8',
    center: [39.10, -120.18], zoom: 10,
    desc: '14 resorts within 60 miles — the premier ski destination in North America.',
    pins: [
      { id:'palisades',  name:'Palisades Tahoe',      lat:39.1952, lng:-120.2350, type:'resort', shore:'north', desc:'6,000+ acres · Expert terrain · Olympic history', url:'https://www.palisadestahoe.com' },
      { id:'alpine',     name:'Alpine Meadows',        lat:39.1670, lng:-120.2320, type:'resort', shore:'north', desc:'Linked to Palisades · Tree skiing · Bowls', url:'https://www.palisadestahoe.com' },
      { id:'northstar',  name:'Northstar California',  lat:39.2760, lng:-120.1210, type:'resort', shore:'north', desc:'Family-friendly · Village base · Terrain parks', url:'https://www.northstarcalifornia.com' },
      { id:'homewood',   name:'Homewood Mountain',     lat:39.0812, lng:-120.1612, type:'resort', shore:'west',  desc:'Best lake views · Small & local · No crowds', url:'https://www.skihomewood.com' },
      { id:'tahoe-donner',name:'Tahoe Donner',         lat:39.3505, lng:-120.2290, type:'resort', shore:'north', desc:'Family · Beginner terrain · Nordic center', url:'https://www.tahoedonner.com' },
      { id:'heavenly',   name:'Heavenly Mountain',     lat:38.9350, lng:-119.9395, type:'resort', shore:'south', desc:'3,500 acres · NV & CA terrain · Gondola from Stateline', url:'https://www.skiheavenly.com' },
      { id:'sierra',     name:'Sierra-at-Tahoe',       lat:38.7983, lng:-120.0805, type:'resort', shore:'south', desc:'South shore · All levels · Family-friendly', url:'https://www.sierraattahoe.com' },
      { id:'kirkwood',   name:'Kirkwood Mountain',     lat:38.6847, lng:-120.0650, type:'resort', shore:'south', desc:'Deepest snowpack · 500+ inch seasons · Expert terrain', url:'https://www.kirkwood.com' },
      { id:'mt-rose',    name:'Mt. Rose Ski Tahoe',    lat:39.3292, lng:-119.8858, type:'resort', shore:'east',  desc:'Highest base in Tahoe · 8,260ft · Reliable snow', url:'https://skirose.com' },
      { id:'diamond-peak',name:'Diamond Peak',         lat:39.2455, lng:-119.9312, type:'resort', shore:'east',  desc:'Overlooking Lake Tahoe · Family · No crowds', url:'https://www.diamondpeak.com' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  swimming: {
    id: 'swimming', label: 'Swimming', icon: '🏊', color: '#4AADBC',
    center: [39.02, -120.00], zoom: 11,
    desc: 'The clearest alpine lake in North America — 70+ ft visibility at peak clarity.',
    pins: [
      { id:'sand-harbor-sw',name:'Sand Harbor State Park',    lat:39.1989, lng:-119.9316, type:'beach', shore:'east',  desc:'Most beautiful beach at Tahoe · Granite boulders · 70ft+ clarity', fee:'$10 day use', url:'https://www.nevadastatesparks.org' },
      { id:'calawee',      name:"Calawee Cove — D.L. Bliss", lat:38.9695, lng:-120.1020, type:'beach', shore:'west',  desc:"West shore's clearest swim beach · Hike in · No dogs" },
      { id:'kings-beach-sw',name:'Kings Beach SRA',           lat:39.2378, lng:-120.0268, type:'beach', shore:'north', desc:'Longest north shore beach · Sandy · Family-friendly · Free' },
      { id:'pope-beach',   name:'Pope Beach',                 lat:38.9302, lng:-120.0642, type:'beach', shore:'south', desc:'Wide USFS beach · Shallow entry · Best south shore swim' },
      { id:'baldwin-beach',name:'Baldwin Beach',              lat:38.9318, lng:-120.0788, type:'beach', shore:'south', desc:'Shallow · Family-friendly · Best for young kids' },
      { id:'eldorado',     name:'El Dorado Beach',            lat:38.9430, lng:-119.9750, type:'beach', shore:'south', desc:'In-town SLT · Free access · SUP & kayak rentals nearby' },
      { id:'vikingsholm-beach',name:'Vikingsholm Beach',      lat:38.9505, lng:-120.1020, type:'beach', shore:'west',  desc:'Emerald Bay · Hike in · Most dramatic setting at Tahoe' },
      { id:'speedboat',    name:'Speedboat Beach',            lat:39.1930, lng:-120.0892, type:'beach', shore:'north', desc:"Locals' secret · Cove access · Rocky entry · Less crowded" },
      { id:'nevada-beach-sw',name:'Nevada Beach',             lat:38.9630, lng:-119.9280, type:'beach', shore:'east',  desc:'Widest beach on Tahoe · Sandy · NV side · Campground adjacent' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  boating: {
    id: 'boating', label: 'Boating', icon: '⛵', color: '#D4A853',
    center: [39.02, -120.00], zoom: 11,
    desc: 'Marinas, launch ramps, and rental locations across all four shores.',
    pins: [
      { id:'zephyr-marina',name:'Zephyr Cove Marina',         lat:38.9940, lng:-119.9385, type:'marina', shore:'east',  desc:'Powerboats · Pontoons · Jet ski · Parasailing · MS Dixie II', url:'https://zephyrcove.com' },
      { id:'camp-rich-marina',name:'Camp Richardson Marina',  lat:38.9345, lng:-120.0485, type:'marina', shore:'south', desc:'Full service · Boat & SUP rentals · Bar & Grill', url:'https://camprichardson.com' },
      { id:'ski-run-marina',name:'Ski Run Marina — SLT',      lat:38.9388, lng:-119.9632, type:'marina', shore:'south', desc:'Powerboat rentals · Jet ski · Tours · South shore hub' },
      { id:'tahoe-city-marina',name:'Tahoe City Marina',       lat:39.1695, lng:-120.1470, type:'marina', shore:'north', desc:'Full service · Guided tours · North shore hub' },
      { id:'lake-forest-ramp',name:'Lake Forest Boat Ramp',   lat:39.1778, lng:-120.1342, type:'marina', shore:'north', desc:'Free public launch ramp · Less crowded · Locals\' choice' },
      { id:'kings-ramp',   name:'Kings Beach Boat Ramp',      lat:39.2378, lng:-120.0220, type:'marina', shore:'north', desc:'Public ramp · East end of Kings Beach · Water sports nearby' },
      { id:'cave-rock-ramp',name:'Cave Rock Boat Launch',     lat:39.0332, lng:-119.9592, type:'marina', shore:'east',  desc:'East shore ramp · Cave Rock nearby · USFS managed' },
      { id:'homewood-marina',name:'Homewood Marina',          lat:39.0812, lng:-120.1595, type:'marina', shore:'west',  desc:'West shore · Boat storage & launch · Dock access' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  fishing: {
    id: 'fishing', label: 'Fishing', icon: '🎣', color: '#4ABC78',
    center: [39.02, -120.00], zoom: 11,
    desc: 'Mackinaw trout up to 37 lbs. Charter boats, shore spots, and alpine lakes.',
    pins: [
      // ── Charter Boat Departures ───────────────────────────────────────────
      { id:'tahoe-city-fish',   name:'Tahoe City — Charter Departure',   lat:39.1695, lng:-120.1470, type:'marina', shore:'north', desc:'Deep-water Mackinaw trout charters · Year-round · 37lb fish possible · Multiple operators · Half & full day' },
      { id:'camp-rich-fish',    name:'Camp Richardson — Charter Departure', lat:38.9345, lng:-120.0485, type:'marina', shore:'south', desc:'South shore Mackinaw & kokanee charters · Full-service marina · Multiple operators', url:'https://camprichardson.com' },
      { id:'zephyr-fish',       name:'Zephyr Cove — Charter Departure',  lat:38.9940, lng:-119.9385, type:'marina', shore:'east',  desc:'East shore charter boats · Mackinaw & rainbow · Guided lake fishing · Half & full day' },
      { id:'ski-run-fish',      name:'Ski Run Marina — Charter Departure', lat:38.9388, lng:-119.9632, type:'marina', shore:'south', desc:'South shore · Multiple charter operators · Mackinaw trolling year-round · SLT central' },
      // ── Shore & Stream Fishing ────────────────────────────────────────────
      { id:'taylor-creek',      name:'Taylor Creek — Kokanee Salmon Run', lat:38.9402, lng:-120.0438, type:'spot',   shore:'south', desc:'October kokanee salmon run · Bears, bald eagles & osprey gather · Viewing platform · Free · Unmissable fall event', url:'https://www.fs.usda.gov/ltbmu' },
      { id:'trout-creek',       name:'Trout Creek — SLT',                 lat:38.9320, lng:-119.9850, type:'spot',   shore:'south', desc:'Small stream · Rainbow & brown trout · Walk from town · Fly fishing' },
      { id:'general-creek',     name:'General Creek — Sugar Pine Point',  lat:39.0418, lng:-120.1120, type:'spot',   shore:'west',  desc:'Coastal stream fishing · Rainbow trout · CA State Park · Peaceful setting' },
      { id:'blackwood-creek',   name:'Blackwood Creek',                   lat:39.1050, lng:-120.1560, type:'spot',   shore:'west',  desc:'West shore creek · Brown & rainbow trout · Early season best · Catch & release recommended' },
      { id:'nevada-beach-fish', name:'Nevada Beach Shore Fishing',        lat:38.9630, lng:-119.9280, type:'spot',   shore:'east',  desc:'Sandy shore with deep shelf access · Rainbow & Mackinaw · Evening fishing best · CA/NV license required' },
      { id:'kings-fish',        name:'Kings Beach Shore Fishing',         lat:39.2378, lng:-120.0268, type:'spot',   shore:'north', desc:'Rocky point access · Rainbow trout · Early morning best · CA license required' },
      { id:'cave-rock-fish',    name:'Cave Rock Shore Fishing',           lat:39.0332, lng:-119.9592, type:'spot',   shore:'east',  desc:'Deep water shelf drop-off · Mackinaw accessible from shore · One of the best shore spots on the lake' },
      { id:'fleur-du-lac',      name:'Fleur du Lac — West Shore Trolling', lat:39.0540, lng:-120.1380, type:'spot',  shore:'west',  desc:'West shore deep-water trolling corridor · Mackinaw & rainbow · Best from boat · Charter area' },
      // ── Alpine Lakes (hike-in) ────────────────────────────────────────────
      { id:'fallen-leaf-fish',  name:'Fallen Leaf Lake',                  lat:38.8980, lng:-120.0540, type:'spot',   shore:'south', desc:'Rainbow & brown trout · Shore & boat fishing · No motorized boats · Beautiful alpine lake · Easy access' },
      { id:'spooner-lake',      name:'Spooner Lake',                      lat:39.1020, lng:-119.9080, type:'spot',   shore:'east',  desc:'Best no-hike alpine fishing near Tahoe · 5-fish catch & keep · Rainbow & Lahontan cutthroat · License required', url:'https://parks.nv.gov/parks/spooner-lake' },
      { id:'marlette-lake',     name:'Marlette Lake — Catch & Release',   lat:39.0700, lng:-119.9450, type:'spot',   shore:'east',  desc:'Catch & release only · Artificial lures only · Jul 15 – Sep 30 · 5-mile hike in · Stunning alpine lake', note:'Catch & release · Artificial lures only · Jul 15–Sep 30' },
      { id:'gilmore-lake',      name:'Gilmore Lake — Desolation',         lat:38.9050, lng:-120.0880, type:'spot',   shore:'south', desc:'Alpine lake · Brook & rainbow trout · Permit required · 5mi hike from Glen Alpine · Spectacular backcountry' },
      { id:'echo-lakes-fish',   name:'Echo Lakes',                        lat:38.8305, lng:-120.0408, type:'spot',   shore:'south', desc:'Upper & lower Echo Lakes · Rainbow & brown trout · Water taxi or walk · Good early season lake fishing' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  sup: {
    id: 'sup', label: 'Paddleboarding', icon: '🏄', color: '#A78BFA',
    center: [39.02, -120.00], zoom: 11,
    desc: 'Glassy morning water and 70+ ft visibility — best SUP in the Sierra.',
    pins: [
      { id:'meeks-sup',    name:'Meeks Bay — SUP Launch',       lat:39.0226, lng:-120.1182, type:'launch', shore:'west',  desc:'Best west shore flat-water SUP · Calm & protected · Rentals on-site' },
      { id:'fallen-leaf-sup',name:'Fallen Leaf Lake SUP',       lat:38.8980, lng:-120.0540, type:'launch', shore:'south', desc:'Mirror-flat · No motorized boats · Best flat-water in the area' },
      { id:'sand-harbor-sup',name:'Sand Harbor SUP',            lat:39.1989, lng:-119.9316, type:'launch', shore:'east',  desc:'70ft+ visibility · No motors in swim area · Calm daily', fee:'$10 park fee' },
      { id:'kings-sup',    name:'Kings Beach SUP Rentals',      lat:39.2362, lng:-120.0198, type:'rental', shore:'north', desc:'Most social north shore launch · Flat mornings before noon · Rentals' },
      { id:'tahoe-paddle', name:'Tahoe Paddle & Oar — Kings Beach', lat:39.2360, lng:-120.0230, type:'rental', shore:'north', desc:'SUP · Kayak · Pontoon rentals · North shore hub', url:'https://tahoepaddle.com' },
      { id:'pope-sup',     name:'Pope Beach — SUP Launch',       lat:38.9302, lng:-120.0642, type:'launch', shore:'south', desc:'Wide sandy launch · Minimal boat traffic · Easy entry' },
      { id:'zephyr-sup',   name:'Zephyr Cove SUP',               lat:38.9940, lng:-119.9385, type:'rental', shore:'east',  desc:'Rentals available · Marina access · East shore' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  backpacking: {
    id: 'backpacking', label: 'Backpacking', icon: '🌲', color: '#4ABC78',
    center: [38.95, -120.08], zoom: 11,
    desc: 'Desolation Wilderness and Spooner Backcountry — permit-required alpine routes.',
    pins: [
      { id:'glen-alpine-bp',name:'Glen Alpine Trailhead',        lat:38.8932, lng:-120.0724, type:'trailhead', shore:'south', desc:'Most popular Desolation entry · Permit required · Gilmore & Susie Lakes', url:'https://www.recreation.gov', note:'Day-use & overnight permit required' },
      { id:'echo-lake-bp',  name:'Echo Lake Trailhead',          lat:38.8305, lng:-120.0408, type:'trailhead', shore:'south', desc:'PCT junction · Water taxi option · Lake Aloha', url:'https://www.recreation.gov', note:'Overnight permit required' },
      { id:'bayview-bp',    name:'Bayview Trailhead',             lat:38.9413, lng:-120.1055, type:'trailhead', shore:'west',  desc:'Granite Lake · Quick Desolation entry · 4mi RT to lake', note:'Day permit recommended' },
      { id:'spooner-bp',    name:'Spooner Backcountry',           lat:39.1020, lng:-119.9080, type:'trailhead', shore:'east',  desc:'NO permit required · 3 primitive camps · Flume Trail access', url:'https://parks.nv.gov/parks/spooner-lake', note:'No permit — first-come' },
      { id:'five-lakes-bp', name:'Five Lakes — Granite Chief',    lat:39.1908, lng:-120.2260, type:'trailhead', shore:'north', desc:'Granite Chief Wilderness · Less crowded than Desolation · No permit', note:'No permit required' },
      { id:'dicks-peak-bp', name:"Dick's Peak via Velma Lakes",   lat:38.9318, lng:-120.1056, type:'trailhead', shore:'west',  desc:'Expert · 18mi · 3,800ft gain · Multi-day loop · Desolation permit', difficulty:'Expert', note:'Overnight permit required' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  wildlife: {
    id: 'wildlife', label: 'Wildlife Watching', icon: '🦅', color: '#E07070',
    center: [39.00, -120.04], zoom: 11,
    desc: 'Black bears, bald eagles, osprey, mule deer, and the kokanee salmon run.',
    pins: [
      { id:'taylor-wl',    name:'Taylor Creek Visitor Center',   lat:38.9402, lng:-120.0438, type:'viewpoint', shore:'south', desc:'October kokanee salmon run · Bears & eagles · Viewing platform · Free', url:'https://www.fs.usda.gov/ltbmu' },
      { id:'dlbliss-wl',   name:'D.L. Bliss — Bear Territory',  lat:38.9695, lng:-120.1035, type:'viewpoint', shore:'west',  desc:'Black bears most active at dusk · Bear boxes required · Osprey nesting' },
      { id:'spooner-wl',   name:'Spooner Lake Wildlife',         lat:39.1020, lng:-119.9080, type:'viewpoint', shore:'east',  desc:'Osprey · Waterfowl · Mule deer · 2mi interpretive loop', url:'https://parks.nv.gov/parks/spooner-lake' },
      { id:'sand-harbor-wl',name:'Sand Harbor — Shorebirds',    lat:39.1989, lng:-119.9316, type:'viewpoint', shore:'east',  desc:'Yellow-legged frogs · Great blue heron · Waterfowl · Morning best' },
      { id:'eagle-point-wl',name:'Eagle Point — Osprey Zone',   lat:38.9540, lng:-120.1060, type:'viewpoint', shore:'west',  desc:'Bald eagle nesting area · Osprey fishing · Spring best' },
      { id:'fallen-leaf-wl',name:'Fallen Leaf Lake — Deer',     lat:38.8980, lng:-120.0540, type:'viewpoint', shore:'south', desc:'Mule deer at meadow edges · Osprey & mergansers · Quiet' },
      { id:'burton-wl',    name:'Burton Creek — Bear Habitat',  lat:39.1900, lng:-120.1355, type:'viewpoint', shore:'north', desc:'North shore bear habitat · Coyotes & deer · Dawn & dusk best' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  snowshoeing: {
    id: 'snowshoeing', label: 'Snowshoeing', icon: '🏔️', color: '#8BB8E8',
    center: [39.05, -120.08], zoom: 11,
    desc: 'Groomed networks and backcountry routes — available Dec through Apr.',
    pins: [
      { id:'tahoe-donner-ss',name:'Tahoe Donner Nordic — Snowshoe', lat:39.3505, lng:-120.2290, type:'trailhead', shore:'north', desc:'100km groomed network · Day passes · All levels · Best organized area', url:'https://www.tahoedonner.com', fee:'Day use fee' },
      { id:'spooner-nordic', name:'Spooner Lake Nordic Center',   lat:39.1020, lng:-119.9080, type:'trailhead', shore:'east',  desc:'Groomed trails · East shore · Marlette/Flume access in winter', fee:'Day pass' },
      { id:'tahoe-meadows-ss',name:'Tahoe Meadows Snowshoe',      lat:39.2980, lng:-119.9070, type:'trailhead', shore:'east',  desc:'Flat boardwalk & meadow routes · Family-friendly · Hwy 431', difficulty:'Easy' },
      { id:'ellis-peak-ss',  name:'Ellis Peak Snowshoe',           lat:39.1048, lng:-120.1482, type:'trailhead', shore:'west',  desc:'Best west shore snowshoe · 6mi · 1,800ft · 360° summit views', difficulty:'Strenuous' },
      { id:'angora-ss',      name:'Angora Lakes Snowshoe',         lat:38.9053, lng:-120.0500, type:'trailhead', shore:'south', desc:'Easy · Family-friendly · South shore · Lake views on ridge', difficulty:'Easy' },
      { id:'blackwood-ss',   name:'Blackwood Canyon Snowshoe',    lat:39.1050, lng:-120.1622, type:'trailhead', shore:'west',  desc:'Beginner option · Paved canyon road · Quiet & scenic' },
      { id:'castle-peak-ss', name:'Castle Peak Snowshoe',          lat:39.3738, lng:-120.3620, type:'trailhead', shore:'north', desc:'Advanced · Summit views · Near Truckee · Requires navigation', difficulty:'Strenuous' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  climbing: {
    id: 'climbing', label: 'Rock Climbing', icon: '🧗', color: '#E0B85C',
    center: [38.95, -120.05], zoom: 11,
    desc: 'World-class granite crags — sport, trad, and bouldering within an hour of the lake.',
    pins: [
      // ── Sport & Trad Crags ────────────────────────────────────────────────
      { id:'lovers-leap',    name:"Lovers Leap Crag",              lat:38.7943, lng:-120.0388, type:'trailhead', shore:'south', desc:'California classic crag · 100+ routes · 5.5–5.13c · Granite sport & trad · Roadside · Best May–Oct · 45min from SLT', difficulty:'All levels — 5.5 to 5.13', url:'https://www.mountainproject.com/area/105907562/lovers-leap' },
      { id:'luther-spires',  name:'Luther Spires',                 lat:38.7980, lng:-119.9620, type:'trailhead', shore:'south', desc:'Bolt-protected sport climbing · Short 10min approaches · Beginner-friendly · Multiple sunny south-facing walls · Year-round', difficulty:'Beginner–Intermediate 5.6–5.11' },
      { id:'phantom-spires', name:'Phantom Spires',                lat:38.8862, lng:-120.0478, type:'trailhead', shore:'south', desc:'South shore hidden gem sport crag · Quality granite · Bolted routes · 30min from SLT · Quieter than Lovers Leap', difficulty:'Intermediate 5.8–5.11' },
      { id:'eagle-creek',    name:'Eagle Creek Canyon',            lat:38.9538, lng:-120.1093, type:'trailhead', shore:'west',  desc:'Multi-pitch granite trad & sport · West shore · Near Eagle Falls · Longer adventure routes · Moderate to hard', difficulty:'Intermediate–Expert 5.7–5.12' },
      { id:'donner-summit',  name:'Donner Summit Crags',           lat:39.3212, lng:-120.3280, type:'trailhead', shore:'north', desc:'Historic California granite · Routes from 1930s · All grades · 200+ routes · Best Tahoe-area cragging · 30min from Tahoe City', difficulty:'All levels — 5.4 to 5.13', url:'https://www.mountainproject.com/area/105833381/donner-summit' },
      { id:'tahoe-crags',    name:'Tahoe Crags — North Shore',     lat:39.2540, lng:-120.0330, type:'trailhead', shore:'north', desc:'North shore granite sport crag · Bolted routes · Moderate grades · Short approaches · Summit views of lake', difficulty:'Moderate 5.7–5.11' },
      // ── Volcanic / Unique ─────────────────────────────────────────────────
      { id:'cave-rock',      name:'Cave Rock — Volcanic Tuff',     lat:39.0332, lng:-119.9592, type:'trailhead', shore:'east',  desc:'Unique volcanic tuff climbing · Overhanging pocket routes · East shore lakeshore · 5.11–5.13 · Culturally sensitive area', difficulty:'Hard — 5.11–5.13', note:'Tribal cultural site — please respect closures', url:'https://www.mountainproject.com/area/105800649/cave-rock' },
      // ── Bouldering ────────────────────────────────────────────────────────
      { id:'dlbliss-boulders',name:'D.L. Bliss Bouldering',        lat:38.9695, lng:-120.1030, type:'spot',     shore:'west',  desc:'Roadside granite boulders · Beach access · Warm up area · V0–V6 · Free · No approach needed', difficulty:'V0–V6' },
      { id:'tunnel-rock',    name:'Tunnel Rock Bouldering',        lat:39.3200, lng:-120.3200, type:'spot',     shore:'north', desc:'Roadside granite bouldering near Donner · V0–V8 · Easy access · Good variety of problems', difficulty:'V0–V8' },
      { id:'shakespeare-rock',name:'Shakespeare Rock',             lat:38.8050, lng:-120.0600, type:'trailhead', shore:'south', desc:'Beginner-friendly top-rope area · South shore · Solid granite · Good for learning leaders', difficulty:'Beginner 5.5–5.9' },
      // ── Gear Shops ────────────────────────────────────────────────────────
      { id:'alpenglow-climb', name:'Alpenglow Sports — Gear',      lat:39.3275, lng:-120.1837, type:'rental',   shore:'north', desc:'Climbing gear · Shoes · Harnesses · Chalk · Guidebooks · Truckee location · Expert staff', url:'https://alpenglowsports.com' },
      { id:'rei-climb',       name:'REI — South Lake Tahoe',       lat:38.9310, lng:-119.9780, type:'rental',   shore:'south', desc:'Climbing gear · Rentals · Expert advice · Full outfitter · South shore', url:'https://www.rei.com' },
    ],
  },
};
