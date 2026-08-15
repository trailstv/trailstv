export const GRSM_CAMPGROUNDS = [
  { id:'elkmont',     name:'Elkmont Campground',    lat:35.6596, lng:-83.5826, facilityId:'232489', sites:220, hookups:false, res:true,  fee:25, desc:'Most popular campground. On the Little River. Open Mar–Nov.', url:'https://www.recreation.gov/camping/campgrounds/232489', system:'Recreation.gov' },
  { id:'cades-cove',  name:'Cades Cove Campground', lat:35.5929, lng:-83.8366, facilityId:'232491', sites:159, hookups:false, res:true,  fee:25, desc:'Wildlife-rich Cades Cove valley. Open year-round.', url:'https://www.recreation.gov/camping/campgrounds/232491', system:'Recreation.gov' },
  { id:'smokemont',   name:'Smokemont Campground',  lat:35.5560, lng:-83.2980, facilityId:'232492', sites:142, hookups:false, res:true,  fee:25, desc:'North Carolina entrance. On Oconaluftee River. Year-round.', url:'https://www.recreation.gov/camping/campgrounds/232492', system:'Recreation.gov' },
  { id:'cosby',       name:'Cosby Campground',      lat:35.7515, lng:-83.2088, facilityId:'232493', sites:157, hookups:false, res:true,  fee:17, desc:'Quieter campground. Less crowded. Good access to Mt. Cammerer trail.', url:'https://www.recreation.gov/camping/campgrounds/232493', system:'Recreation.gov' },
  { id:'cataloochee', name:'Cataloochee Campground',lat:35.6276, lng:-83.0823, facilityId:'10099505',sites:27, hookups:false, res:true,  fee:25, desc:'Remote elk reintroduction valley. Elk viewing at dawn and dusk.', url:'https://www.recreation.gov/camping/campgrounds/10099505', system:'Recreation.gov' },
];
export const GRSM_TRAILS = [
  { id:'alum-cave',    name:'Alum Cave Bluffs',        lat:35.6454, lng:-83.4424, difficulty:'Moderate', distanceMi:4.6,  elevGainFt:1400, desc:'Most popular hike in GRSM. Passes Arch Rock and massive alum bluffs.' },
  { id:'clingmans',    name:'Clingmans Dome Trail',    lat:35.5629, lng:-83.4983, difficulty:'Easy',     distanceMi:1.0,  elevGainFt:330,  desc:'Paved but steep 0.5 mi to the highest point in the Smokies at 6,643 ft. Road closed Dec 1–Mar 31.' },
  { id:'laurel-falls', name:'Laurel Falls Trail',      lat:35.6825, lng:-83.5640, difficulty:'Easy',     distanceMi:2.6,  elevGainFt:320,  desc:'Most visited waterfall trail. Paved 2.6 mi RT to a 75 ft cascade.' },
  { id:'appalachian',  name:'Appalachian Trail',       lat:35.6118, lng:-83.4265, difficulty:'Moderate', distanceMi:8.0,  elevGainFt:1600, desc:'71 miles of AT pass through GRSM. Newfound Gap is the most popular access point.' },
  { id:'charlies-bunion',name:"Charlie's Bunion",      lat:35.6118, lng:-83.4265, difficulty:'Strenuous', distanceMi:8.1, elevGainFt:1600, desc:'Classic ridge hike to a dramatic exposed rock outcrop. Outstanding views on clear days.' },
  { id:'abrams-falls', name:'Abrams Falls Trail',      lat:35.5945, lng:-83.8350, difficulty:'Moderate', distanceMi:5.0,  elevGainFt:550,  desc:'Best waterfall hike in Cades Cove area. 5 mi RT. Bears frequent this trail.', note:'Bears frequent this trail — make noise' },
];
export const GRSM_AMENITIES = [
  { id:'sugarlands-vc', name:'Sugarlands Visitor Center',      lat:35.6838, lng:-83.5382, type:'viewpoint' as const, shore:'north' as const, desc:'Main Tennessee entrance · Maps · Exhibits · Ranger programs' },
  { id:'oconaluftee-vc',name:'Oconaluftee Visitor Center (NC)',lat:35.5159, lng:-83.3088, type:'viewpoint' as const, shore:'south' as const, desc:'North Carolina entrance · Mountain Farm Museum · Elk viewing' },
  { id:'cades-cove-store',name:'Cades Cove Camp Store',        lat:35.5929, lng:-83.8366, type:'spot'      as const, shore:'west'  as const, desc:'Bike rentals · Basic supplies · Restrooms · Loop road access' },
  { id:'leconte-lodge', name:'LeConte Lodge',                  lat:35.6543, lng:-83.4382, type:'spot'      as const, shore:'north' as const, desc:'Only in-park lodging — trail access only. Meals included. Book 12+ months ahead.', url:'https://www.lecontelodge.com' },
];
