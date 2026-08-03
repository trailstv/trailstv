// lib/narrative.ts
// Smart template engine for personalized Tahoe trip narratives.
// Zero API calls, zero cost, loads instantly.
// Assembles from user's actual answers: name, activities, shore, season, group, length.

export interface NarrativeInput {
  name?:       string;
  activities:  string[];   // e.g. ['Kayaking','Hiking','Camping']
  shores:      string[];   // e.g. ['west','east']
  season:      string;     // e.g. 'Summer (Jun – Sep)'
  group?:      string;     // e.g. 'Family with Kids'
  length?:     string;     // e.g. 'Weekend (2–3 days)'
  tier?:       string;     // 'free' | 'basic'
}

// ── Season context ────────────────────────────────────────────────────────────
const SEASON_CONTEXT: Record<string, string> = {
  'Spring (Mar – May)':
    'Spring brings snowmelt waterfalls, wildflower meadows, and far fewer crowds than summer. Trails above 7,000 ft may still have snow through May — check conditions before heading into the backcountry. Water temps are cold (45–55°F) so full wetsuits are recommended for paddling.',
  'Summer (Jun – Sep)':
    'Summer is peak season — parking at popular trailheads fills by 9am on weekends and campsite competition is fierce. The payoff: water temperatures reach 65–70°F, all trails are snow-free above 8,000 ft, and the lake is at its most spectacular. Book campsites the moment the 6-month window opens.',
  'Fall (Oct – Nov)':
    "Fall is Tahoe's best-kept secret. Crowds drop sharply after Labor Day, campsites open up, and the aspens turn gold in mid-October. Water stays warm into October (60–65°F). Trails are uncrowded and the light is extraordinary. Some facilities close after Columbus Day — check ahead.",
  'Winter (Dec – Feb)':
    'Winter transforms the basin into one of North America\'s premier ski destinations. Snowpack averages 450 inches annually. Expect road closures on I-80 and Hwy 50 during storm cycles — carry chains. Non-ski trails at lower elevations stay accessible for snowshoeing.',
};

// ── Shore-specific opening lines ──────────────────────────────────────────────
const SHORE_OPENER: Record<string, string> = {
  west:  "The West Shore is Tahoe's most dramatic — granite cliffs, Emerald Bay, and D.L. Bliss make this the area most people picture when they think of Lake Tahoe.",
  east:  "The East Shore offers the clearest water in the basin — Sand Harbor regularly exceeds 70 feet of visibility — and the legendary Flume Trail ridge above it.",
  south: "The South Shore is the most accessible and most developed part of the basin — the most rental options, the most campground variety, and direct access to Desolation Wilderness.",
  north: "The North Shore has a more relaxed, less crowded feel than the south. Tahoe City is the hub, with easy access to the TRT, Kings Beach, and the Martis Valley trail network.",
};

// ── Activity-specific tips (shore-aware) ─────────────────────────────────────
const ACT_TIPS: Record<string, Record<string, string>> = {
  Kayaking: {
    west:  'Launch from Meeks Bay before 9am — west shore mornings are glassy, afternoons get windy. Emerald Bay is the signature paddle but approach carefully; the no-wake zone is strictly enforced.',
    east:  'Sand Harbor is the clearest launch on the lake. Rent clear kayaks there for the full visibility experience — you can see the bottom in 40 feet of water.',
    south: 'Camp Richardson has rentals on-site — the most convenient south shore option. Fallen Leaf Lake is a quieter alternative with no motorized boats.',
    north: "Kings Beach is the most beginner-friendly launch. Tahoe Paddle & Oar at Kings Beach is the north shore's best outfitter.",
  },
  Hiking: {
    west:  'Start the Rubicon Trail from D.L. Bliss before 8am — the cliff-edge views are best in morning light and parking fills fast. Eagle Falls is the most rewarding short hike on the west shore.',
    east:  "The Flume Trail is the east shore's crown jewel — hike or ride the ridge 1,600 feet above the lake. Combine it with a descent to Spooner Lake for a full day.",
    south: "Mt. Tallac is the south shore's defining hike — 9.4 miles, 3,295 ft gain, and views across the entire basin from 9,735 ft. Start by 7am and bring layers.",
    north: "Stateline Lookout is the north shore's best bang-for-effort hike — 1.5 miles round-trip to panoramic basin views. The TRT segment from Tahoe City north offers more serious mileage.",
  },
  'Mountain Biking': {
    west:  "Mr. Toad's Wild Ride is the west shore's technical masterpiece — shuttle from Luther Pass for a 7-mile expert descent. Saxon Creek is a slightly more forgiving alternative.",
    east:  'The Flume Trail is the most famous MTB ride at Tahoe. Shuttle from Incline Village, ride the ridge, descend to Spooner. A half-day you will remember for years.',
    south: "South shore has the best shuttle logistics for Mr. Toad's. Several bike shops in South Lake Tahoe offer rentals and shuttle service.",
    north: "Tahoe City's Truckee River corridor and Burton Creek State Park give you 20+ miles of XC riding without the crowds of the south shore.",
  },
  Camping: {
    west:  'D.L. Bliss and Eagle Point book out within hours of the 6-month window opening at 8am Pacific on ReserveCalifornia. Set a calendar alert for exactly 6 months before your target date.',
    east:  'Nevada Beach is the best east shore campground — wide sandy beach, 54 sites, books on Recreation.gov. Zephyr Cove RV & Camp has full hookups if you need them.',
    south: "Fallen Leaf Lake is the south shore's best tent-camping experience — 206 sites in old-growth forest, 6 yurts, boat ramp. Fills fast on Recreation.gov.",
    north: 'William Kent is the best value USFS campground on the north shore — 95 sites, 2 miles south of Tahoe City, 3 yurts available. Books on Recreation.gov.',
  },
  Skiing: {
    west:  'Palisades Tahoe (6,000+ acres) and Alpine Meadows are the west shore anchors. Palisades has the most vertical and the most expert terrain in Tahoe.',
    east:  "Diamond Peak and Mt. Rose are the east shore's best resorts. Mt. Rose has the highest base elevation in Tahoe (8,260 ft) — meaning more reliable early and late season snow.",
    south: "Heavenly (4,800 acres) and Kirkwood are the south shore's anchors. Kirkwood consistently gets the deepest snowpack in the basin — 500+ inch seasons are common.",
    north: "Northstar California is the north shore's most family-friendly resort — excellent grooming, a village base area, and strong terrain park. Tahoe Donner is good for beginners.",
  },
  Snowshoeing: {
    west:  'Ellis Peak is the west shore\'s best snowshoe destination — 6 miles, 1,800 ft gain, 360° summit views. Blackwood Canyon is the beginner option.',
    east:  'Spooner Lake Nordic (maintained groomed trails, day passes) is the most organized snowshoe area in the basin. The Marlette/Flume corridor in winter is stunning.',
    south: 'Angora Lakes Road is the most accessible south shore snowshoe. The Fallen Leaf Lake loop is a beautiful flat alternative for families.',
    north: 'Tahoe Donner Nordic has 100km of groomed snowshoe trails — the largest network in the basin and good for all ability levels.',
  },
  Fishing: {
    west:  'West shore drop-offs hold the largest Mackinaw (lake trout). Charter boats depart from Tahoe City marina year-round. Spring and fall are peak seasons.',
    east:  'Spooner Lake is catch-and-keep (5-fish limit). Marlette Lake (July 15 – Sept 30) is catch-and-release artificial lures only. Both are excellent for cutthroat trout.',
    south: "Taylor Creek's October kokanee salmon run is one of the most spectacular wildlife events at Tahoe. Charter boats out of Camp Richardson marina for Mackinaw.",
    north: 'Charter boats out of Tahoe City marina specialize in deep-water Mackinaw trout, which can reach 37 lbs. Kings Beach has easy shore-fishing access.',
  },
  Paddleboarding: {
    west:  "Meeks Bay is the best SUP spot on the west shore — calm, protected, flat water. D.L. Bliss is glassy in the morning before the wind picks up.",
    east:  'Sand Harbor has 70+ ft of visibility — standing on a SUP board you can watch the bottom in open water. No motors in the swimming area means calm conditions all day.',
    south: "Fallen Leaf Lake is mirror-flat with no motorized boats — the best SUP experience in the basin. Pope Beach has easy launch access on the south shore.",
    north: 'Kings Beach is the most social north shore SUP spot. Flat water most mornings before noon. Multiple rental outfitters right on the beach.',
  },
  Swimming: {
    west:  "Calawee Cove at D.L. Bliss has the clearest west shore swimming — 70+ ft visibility. Vikingsholm Beach is the most dramatic setting but requires a hike in.",
    east:  'Sand Harbor is the most beautiful beach in the basin. Arrive before 9am in summer — the parking lot fills by 10am. Water is 65–70°F in peak summer.',
    south: "Pope Beach is the best organized south shore swim beach — wide, sandy, well-maintained. Baldwin Beach is shallower and better for young kids.",
    north: 'Kings Beach is the longest north shore beach and the most social. Water is typically warmer on the north and east shores by mid-summer.',
  },
  Backpacking: {
    west:  "Desolation Wilderness via the Bayview trailhead gives quick access to Granite Lake and the Velma Lakes basin. Day-use and overnight permits are required — apply at recreation.gov.",
    east:  "Spooner Backcountry has three primitive walk-in campgrounds with no permit required — the easiest introduction to Tahoe backcountry. The Marlette/Hobart circuit is a 2-night classic.",
    south: "Glen Alpine is the most popular Desolation entry point. Arrive early for trailhead parking on summer weekends. Gilmore, Susie, and Half Moon Lakes are all reachable in a day.",
    north: "The Granite Chief Wilderness north of Palisades Tahoe is less crowded than Desolation. The Five Lakes Trail is a 4-mile day hike or easy overnight.",
  },
};

// ── Group-specific tips ───────────────────────────────────────────────────────
const GROUP_TIPS: Record<string, string> = {
  'Solo':
    'Solo travel at Tahoe is excellent — early starts mean the trailheads to yourself and campsites are easier to secure as a single unit.',
  'Partner / Couple':
    'Couples have the most flexibility — single-unit campsites are easier to book, and a kayak tandem on Emerald Bay at sunrise is one of the best experiences at the lake.',
  'Family with Kids':
    "With kids, prioritize short wins first: Cascade Falls (1.6mi), Kings Beach swimming, and Sand Harbor are all easy half-days. D.L. Bliss campground has family sites close to the beach — book the moment the 6-month window opens.",
  'Friend Group':
    'Groups need to coordinate campsite bookings carefully — most sites have 6–8 person limits. Nevada Beach and Zephyr Cove have the best group-size sites on the east shore.',
  'Corporate / Team':
    'For team events, Camp Richardson and Zephyr Cove both have group facilities. Guided kayak tours from Emerald Bay Water Sports work well for mixed-ability groups.',
};

// ── Length-specific booking advice ───────────────────────────────────────────
const LENGTH_TIPS: Record<string, string> = {
  'Day trip':
    "Day trippers should aim to arrive before 9am — parking at Eagle Falls, Sand Harbor, and D.L. Bliss fills completely by mid-morning on summer weekends.",
  'Weekend (2–3 days)':
    'Weekend campsites are the most competitive. If your target dates are a summer weekend, book exactly 6 months out to the minute on ReserveCalifornia or Recreation.gov.',
  '4–7 days':
    "A 4–7 day trip lets you do the whole basin — spend 2 nights on the west shore (D.L. Bliss or Eagle Point), then move east (Nevada Beach or Zephyr Cove). Mix in a Desolation Wilderness day hike if conditions allow.",
  'A week or more':
    "A week-plus at Tahoe is the full experience. Consider the Tahoe Rim Trail for a multi-day backpacking segment, and leave time for a rest day at Sand Harbor — you'll want it.",
};

// ── Campsite booking urgency by shore ────────────────────────────────────────
const BOOKING_URGENCY: Record<string, string> = {
  west:  'West shore sites through ReserveCalifornia fill within minutes of the 6-month booking window opening at 8am Pacific. Set a calendar alarm.',
  east:  'Nevada Beach and Spooner fill fast on Recreation.gov. The 6-month window opens at 7am Mountain time — note the time zone difference from Pacific.',
  south: "South shore Recreation.gov sites fill within hours on summer weekends. Fallen Leaf Lake's yurts book out months in advance.",
  north: "North shore sites are slightly less competitive than the west but still fill fast on summer weekends. William Kent is your best bet on Recreation.gov.",
};

// ── Main narrative assembly function ─────────────────────────────────────────
export function buildNarrative(input: NarrativeInput): string {
  const {
    name       = 'Explorer',
    activities = [],
    shores     = ['west'],
    season     = 'Summer (Jun – Sep)',
    group,
    length,
  } = input;

  const firstName   = name.split(' ')[0];
  const primaryShore= shores.find(s => ['west','east','south','north'].includes(s)) || 'west';
  const shoreLabel  = primaryShore.charAt(0).toUpperCase() + primaryShore.slice(1) + ' Shore';
  const topActs     = activities.slice(0, 3);
  const actStr      = topActs.length > 1
    ? topActs.slice(0,-1).join(', ') + ' and ' + topActs[topActs.length-1]
    : topActs[0] || 'exploring the basin';

  // ── Paragraph 1: Personal opening ────────────────────────────────────────
  const opener = SHORE_OPENER[primaryShore] || SHORE_OPENER.west;
  const p1 = `${firstName}, your ${season.split(' ')[0].toLowerCase()} plan on the ${shoreLabel} is built around ${actStr}. ${opener}`;

  // ── Paragraph 2: Season + conditions context ──────────────────────────────
  const seasonCtx = SEASON_CONTEXT[season] || SEASON_CONTEXT['Summer (Jun – Sep)'];
  const groupTip  = group ? GROUP_TIPS[group] || '' : '';
  const p2 = `${seasonCtx}${groupTip ? ' ' + groupTip : ''}`;

  // ── Paragraph 3: Activity-specific tips (top 2 activities) ───────────────
  const actTips = topActs
    .slice(0, 2)
    .map(act => {
      const tipMap = ACT_TIPS[act];
      if (!tipMap) return null;
      return tipMap[primaryShore] || tipMap.west;
    })
    .filter(Boolean);

  const p3 = actTips.length > 0
    ? actTips.join(' ')
    : `The ${shoreLabel} is one of the finest areas in the basin for ${actStr}.`;

  // ── Paragraph 4: Booking + logistics ─────────────────────────────────────
  const bookingNote = BOOKING_URGENCY[primaryShore] || BOOKING_URGENCY.west;
  const lengthNote  = length ? LENGTH_TIPS[length] || '' : '';
  const p4 = `${bookingNote}${lengthNote ? ' ' + lengthNote : ''}`;

  return [p1, p2, p3, p4].join('\n\n');
}

// ── React-friendly version returning paragraph array ─────────────────────────
export function buildNarrativeParagraphs(input: NarrativeInput): string[] {
  return buildNarrative(input).split('\n\n').filter(Boolean);
}
