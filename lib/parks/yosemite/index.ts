export const YOSEMITE_CAMPGROUNDS = [
  { id:'upper-pines', name:'Upper Pines Campground',      lat:37.7329, lng:-119.5597, facilityId:'232447', sites:235, hookups:false, res:true,  fee:36, desc:'Largest valley campground. Year-round. Books 5 months in advance.', url:'https://www.recreation.gov/camping/campgrounds/232447', system:'Recreation.gov' },
  { id:'north-pines', name:'North Pines Campground',      lat:37.7390, lng:-119.5569, facilityId:'232449', sites:81,  hookups:false, res:true,  fee:36, desc:'Valley floor, near stables and Mirror Lake. Open April–October.', url:'https://www.recreation.gov/camping/campgrounds/232449', system:'Recreation.gov' },
  { id:'tuolumne',    name:'Tuolumne Meadows Campground', lat:37.8769, lng:-119.3607, facilityId:'232464', sites:304, hookups:false, res:true,  fee:26, desc:'High country at 8,600 ft. Open July–September. Bears active.', url:'https://www.recreation.gov/camping/campgrounds/232464', system:'Recreation.gov' },
  { id:'crane-flat',  name:'Crane Flat Campground',       lat:37.7473, lng:-119.8006, facilityId:'232462', sites:166, hookups:false, res:true,  fee:36, desc:'Big trees section near giant sequoias. Open June–October.', url:'https://www.recreation.gov/camping/campgrounds/232462', system:'Recreation.gov' },
];
export const YOSEMITE_TRAILS = [
  { id:'half-dome',      name:'Half Dome Cables',              lat:37.7271, lng:-119.5584, difficulty:'Expert',   distanceMi:16.0, elevGainFt:5000, desc:'16 miles RT, 5,000 ft gain, metal cables on the final dome.', note:'Permit required — preseason and daily lottery', url:'https://www.recreation.gov/permits/445561' },
  { id:'mist-trail',     name:'Mist Trail — Vernal & Nevada',  lat:37.7271, lng:-119.5584, difficulty:'Moderate', distanceMi:6.0,  elevGainFt:2000, desc:'Most iconic short hike. Spray of Vernal Fall soaks hikers. 6 mi RT.' },
  { id:'yosemite-falls', name:'Yosemite Falls Trail',          lat:37.7454, lng:-119.5973, difficulty:'Strenuous', distanceMi:7.2,  elevGainFt:2425, desc:"North America's tallest waterfall. 7.2 mi RT, 2,425 ft gain. Peak April–June." },
  { id:'glacier-point',  name:'Glacier Point Overlook',        lat:37.7268, lng:-119.5736, difficulty:'Easy',     distanceMi:0.5,  elevGainFt:50,   desc:'Best single view in Yosemite — Half Dome, falls, and full valley.' },
  { id:'mirror-lake',    name:'Mirror Lake Loop',              lat:37.7456, lng:-119.5487, difficulty:'Easy',     distanceMi:4.5,  elevGainFt:100,  desc:'Flat loop to a reflective seasonal lake at the base of Half Dome.' },
  { id:'clouds-rest',    name:'Clouds Rest',                   lat:37.8769, lng:-119.3607, difficulty:'Strenuous', distanceMi:14.0, elevGainFt:2300, desc:'Better views than Half Dome, lower crowds, no permit. From Tuolumne.' },
];
export const YOSEMITE_AMENITIES = [
  { id:'yosemite-vc',    name:'Valley Visitor Center',          lat:37.7489, lng:-119.5883, type:'viewpoint' as const, shore:'north' as const, desc:'Main visitor center · Exhibits · Shuttle hub · Ranger programs' },
  { id:'curry-village',  name:'Half Dome Village (Curry)',       lat:37.7361, lng:-119.5554, type:'spot'      as const, shore:'east'  as const, desc:'Bike rentals · Dining · Gear store · Tent cabins' },
  { id:'mtneering-school',name:'Yosemite Mountaineering School', lat:37.7361, lng:-119.5554, type:'rental'    as const, shore:'east'  as const, desc:'Rock climbing instruction · Guided climbs · Gear rentals', url:'https://www.travelyosemite.com/things-to-do/guided-climbs/' },
];
