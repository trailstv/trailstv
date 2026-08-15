export const ZION_CAMPGROUNDS = [
  { id:'watchman', name:'Watchman Campground', lat:37.1993, lng:-112.9878, facilityId:'232447', sites:164, hookups:true,  res:true,  fee:20, desc:'Largest campground, at canyon entrance. Electric hookups. Reservations required Mar–Nov.', url:'https://www.recreation.gov/camping/campgrounds/232447', system:'Recreation.gov' },
  { id:'south',    name:'South Campground',    lat:37.1962, lng:-112.9850, facilityId:'232449', sites:117, hookups:false, res:false, fee:20, desc:'Tent-only, first-come first-served. Walk to visitor center. Fills by 8am in summer.',        url:'https://www.recreation.gov/camping/campgrounds/232449', system:'First-Come' },
  { id:'lava-point',name:'Lava Point Campground',lat:37.3883,lng:-113.0645,facilityId:'10099505',sites:6, hookups:false, res:false, fee:0,  desc:'Primitive camping at 7,890 ft. Vault toilet only. Road open June–October.',                  url:'https://www.recreation.gov/camping/campgrounds/10099505', system:'First-Come' },
];
export const ZION_TRAILS = [
  { id:'angels-landing',  name:'Angels Landing',           lat:37.2697, lng:-112.9481, difficulty:'Expert',   distanceMi:5.4,  elevGainFt:1488, desc:'The most famous hike in Zion — chains route along a razor-edge ridge. 5.4 mi RT, 1,488 ft gain.', note:'Permit required — lottery at recreation.gov', url:'https://www.recreation.gov/permits/445860' },
  { id:'narrows',         name:'The Narrows — Bottom Up',  lat:37.2936, lng:-112.9504, difficulty:'Moderate', distanceMi:9.4,  elevGainFt:334,  desc:'Wade the Virgin River through towering canyon walls. Check flood forecast before entering.' },
  { id:'emerald-pools',   name:'Emerald Pools Trailhead',  lat:37.2534, lng:-112.9590, difficulty:'Easy',     distanceMi:1.2,  elevGainFt:69,   desc:'Three tiered pools on a shaded path. Lower Pool is paved and accessible.' },
  { id:'canyon-overlook', name:'Canyon Overlook Trail',    lat:37.2136, lng:-112.9455, difficulty:'Easy',     distanceMi:1.0,  elevGainFt:163,  desc:'Best canyon views for the least effort. 1 mile RT from the east tunnel.' },
  { id:'watchman-trail',  name:'Watchman Trail',           lat:37.2001, lng:-112.9876, difficulty:'Moderate', distanceMi:3.3,  elevGainFt:368,  desc:'Panoramic views over Springdale and Zion Canyon entrance. Great sunset hike.' },
  { id:'subway',          name:'The Subway',               lat:37.3665, lng:-113.1302, difficulty:'Expert',   distanceMi:9.5,  elevGainFt:650,  desc:'Technical slot canyon carved by flowing water. Day-use permit required.', note:'Day permit required — lottery 3 months ahead' },
];
export const ZION_AMENITIES = [
  { id:'zion-vc',       name:'Zion Canyon Visitor Center', lat:37.1993, lng:-112.9880, type:'viewpoint' as const, shore:'south' as const, desc:'Main visitor center · Shuttle stop · Maps · Ranger programs' },
  { id:'zion-lodge',    name:'Zion Lodge',                 lat:37.2516, lng:-112.9510, type:'spot'      as const, shore:'south' as const, desc:'Only in-park lodging · Restaurant · Gift shop · Book 13 months ahead', url:'https://www.zionlodge.com' },
  { id:'springdale-gear',name:'Zion Outfitter',            lat:37.1882, lng:-112.9980, type:'rental'    as const, shore:'south' as const, desc:'Wetsuit & boot rentals for Narrows · Hiking poles · Gear', url:'https://www.zionoutfitter.com' },
];
