export const GRAND_CANYON_CAMPGROUNDS = [
  { id:'mather',      name:'Mather Campground',     lat:36.0516, lng:-112.1398, facilityId:'232489',  sites:327, hookups:false, res:true,  fee:18, desc:'Main South Rim campground. Open year-round. Walk to Rim Trail.', url:'https://www.recreation.gov/camping/campgrounds/232489', system:'Recreation.gov' },
  { id:'desert-view', name:'Desert View Campground', lat:36.0429, lng:-111.8265, facilityId:'10083440',sites:50,  hookups:false, res:false, fee:12, desc:'East entrance first-come campground. Open May–Oct.', url:'https://www.recreation.gov/camping/campgrounds/10083440', system:'First-Come' },
  { id:'north-rim',   name:'North Rim Campground',   lat:36.2071, lng:-112.0548, facilityId:'232493',  sites:84,  hookups:false, res:true,  fee:18, desc:'Open mid-May through mid-Oct. 1,000 ft higher, cooler than South Rim.', url:'https://www.recreation.gov/camping/campgrounds/232493', system:'Recreation.gov' },
  { id:'bright-angel',name:'Bright Angel Campground',lat:36.1049, lng:-112.0969, facilityId:'445650',  sites:33,  hookups:false, res:true,  fee:24, desc:'Inner canyon at Colorado River. Permit required. Accessible by trail only.', url:'https://www.recreation.gov/permits/445650', system:'Permit Required', note:'Overnight permit required' },
];
export const GRAND_CANYON_TRAILS = [
  { id:'rim-trail',    name:'South Rim Trail',       lat:36.0579, lng:-112.1421, difficulty:'Easy',     distanceMi:13.0, elevGainFt:200,  desc:'13 miles along the South Rim from Mather Point to Hermit Rest. Fully accessible.' },
  { id:'bright-angel', name:'Bright Angel Trail',    lat:36.0573, lng:-112.1434, difficulty:'Strenuous', distanceMi:9.5,  elevGainFt:3060, desc:'The most traveled corridor trail. Do NOT attempt river and back in one day in summer.', note:'Do NOT hike to river and back in one day in summer' },
  { id:'south-kaibab', name:'South Kaibab Trail',    lat:36.0571, lng:-112.0835, difficulty:'Strenuous', distanceMi:6.4,  elevGainFt:4780, desc:'Steepest corridor trail — exposed ridge, 270° views. No water on trail.', note:'No water on trail — carry everything you need' },
  { id:'north-kaibab', name:'North Kaibab Trail',    lat:36.2101, lng:-112.0545, difficulty:'Strenuous', distanceMi:14.0, elevGainFt:5761, desc:'Only maintained trail from North Rim. 14 miles to Colorado River.' },
  { id:'mather-point', name:'Mather Point Overlook', lat:36.0587, lng:-112.1065, difficulty:'Easy',     distanceMi:0.2,  elevGainFt:0,    desc:'First and most iconic viewpoint. Arrive at sunrise for the best light.' },
];
export const GRAND_CANYON_AMENITIES = [
  { id:'gc-vc',         name:'Grand Canyon Visitor Center', lat:36.0573, lng:-112.1071, type:'viewpoint' as const, shore:'south' as const, desc:'Main South Rim visitor center · IMAX · Shuttle hub · Ranger programs' },
  { id:'bright-angel-lodge',name:'Bright Angel Lodge',      lat:36.0572, lng:-112.1435, type:'spot'      as const, shore:'south' as const, desc:'Historic 1935 lodge at trailhead · Restaurant · Bar · Gift shop', url:'https://www.grandcanyonlodges.com' },
  { id:'phantom-ranch', name:'Phantom Ranch (Inner Canyon)',lat:36.1031, lng:-112.0940, type:'spot'      as const, shore:'south' as const, desc:'Only lodging below the rim · Book a year ahead · Trail access only', url:'https://www.grandcanyonlodges.com/lodging/phantom-ranch/' },
];
