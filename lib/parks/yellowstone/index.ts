export const YELLOWSTONE_CAMPGROUNDS = [
  { id:'madison',    name:'Madison Campground',    lat:44.6456, lng:-110.8614, facilityId:'232493', sites:278, hookups:false, res:true,  fee:26, desc:'Central location near geysers. Open Apr–Oct.', url:'https://www.recreation.gov/camping/campgrounds/232493', system:'Recreation.gov' },
  { id:'canyon',     name:'Canyon Campground',      lat:44.7351, lng:-110.4951, facilityId:'232492', sites:272, hookups:false, res:true,  fee:26, desc:'Near Grand Canyon of Yellowstone. Open Jun–Sep.', url:'https://www.recreation.gov/camping/campgrounds/232492', system:'Recreation.gov' },
  { id:'bridge-bay', name:'Bridge Bay Campground',  lat:44.5319, lng:-110.4322, facilityId:'232491', sites:432, hookups:false, res:true,  fee:26, desc:'Largest campground, on Yellowstone Lake. Open May–Sep.', url:'https://www.recreation.gov/camping/campgrounds/232491', system:'Recreation.gov' },
  { id:'norris',     name:'Norris Campground',      lat:44.7316, lng:-110.7038, facilityId:'232496', sites:111, hookups:false, res:false, fee:20, desc:'First-come near hottest thermal basin. Open May–Sep.', url:'https://www.recreation.gov/camping/campgrounds/232496', system:'First-Come' },
  { id:'slough-creek',name:'Slough Creek Campground',lat:44.8978,lng:-110.3354, facilityId:'10105804',sites:16,hookups:false, res:true,  fee:15, desc:'Primitive campground in Lamar Valley. Wolves and bears.', url:'https://www.recreation.gov/camping/campgrounds/10105804', system:'Recreation.gov' },
];
export const YELLOWSTONE_TRAILS = [
  { id:'grand-prismatic', name:'Grand Prismatic Overlook', lat:44.5254, lng:-110.8383, difficulty:'Easy',     distanceMi:2.0,  elevGainFt:150,  desc:'Best view of the largest hot spring in the US. 2 mi RT. Best in morning.' },
  { id:'mount-washburn',  name:'Mt. Washburn',             lat:44.7980, lng:-110.4310, difficulty:'Moderate', distanceMi:6.2,  elevGainFt:1400, desc:'Summit hike with 360° views of the entire park. Grizzly habitat — carry bear spray.', note:'Grizzly habitat — carry bear spray' },
  { id:'lamar-valley',    name:'Lamar Valley Wildlife',    lat:44.8920, lng:-110.3660, difficulty:'Easy',     distanceMi:4.0,  elevGainFt:50,   desc:'Best wildlife viewing in any US national park. Bison, wolves, bears. Best at dawn/dusk.' },
  { id:'fairy-falls',     name:'Fairy Falls',              lat:44.5290, lng:-110.8680, difficulty:'Easy',     distanceMi:5.0,  elevGainFt:100,  desc:'197 ft waterfall through a meadow. Combine with Grand Prismatic overlook.' },
  { id:'artists-paintpots',name:'Artists Paintpots',       lat:44.6528, lng:-110.7642, difficulty:'Easy',     distanceMi:1.0,  elevGainFt:100,  desc:'Short loop through colorful hot springs, fumaroles, and mud pots.' },
];
export const YELLOWSTONE_AMENITIES = [
  { id:'old-faithful-vc', name:'Old Faithful Visitor Center', lat:44.4605, lng:-110.8281, type:'viewpoint' as const, shore:'south' as const, desc:'Geyser eruption predictions · Ranger talks · Thermal basin maps' },
  { id:'canyon-village',  name:'Canyon Village',              lat:44.7350, lng:-110.4960, type:'spot'      as const, shore:'east'  as const, desc:'Gas · Dining · General store · Canyon views' },
  { id:'mammoth-village', name:'Mammoth Hot Springs Village', lat:44.9777, lng:-110.7046, type:'spot'      as const, shore:'north' as const, desc:'Park headquarters · Gas · Lodging · Dining' },
];
