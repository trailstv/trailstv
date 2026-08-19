import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPark } from '@/lib/parks';

const PERMIT_GUIDES: Record<string, { title:string; permits:{ name:string; required:boolean; how:string; when:string; url:string; note?:string }[] }> = {
  zion: {
    title:'Zion requires permits for its most popular routes — plan early.',
    permits:[
      { name:'Angels Landing Permit', required:true, how:'Lottery at recreation.gov — seasonal (3 months ahead) and day-before lotteries.', when:'Seasonal: apply 3 months ahead. Day-before: results at 5pm the prior day.', url:'https://www.recreation.gov/permits/445860', note:'Only required for the final 0.5 miles with chains — below is open to all' },
      { name:'Subway Day Permit',     required:true, how:'Lottery at recreation.gov. Very competitive.', when:'Lottery opens 3 months in advance.', url:'https://www.recreation.gov/permits/445555' },
      { name:'Narrows Overnight',     required:true, how:'Lottery for top-down. Bottom-up day hike is permit-free.', when:'Apply well in advance for summer dates.', url:'https://www.recreation.gov/permits/445558' },
      { name:'Entrance Fee',          required:true, how:'$35/vehicle at the gate. America the Beautiful pass accepted.', when:'Upon entry.', url:'https://www.nps.gov/zion/planyourvisit/fees.htm' },
    ],
  },
  yosemite: {
    title:"Yosemite requires a valley reservation Mar–Nov and a permit for Half Dome's cables.",
    permits:[
      { name:'Yosemite Day Reservation', required:true, how:'Book at recreation.gov up to 2 weeks in advance at 8am PT.', when:'Opens daily for dates 2 weeks out.', url:'https://www.recreation.gov/timed-entry/10084745', note:'America the Beautiful pass holders still need a reservation' },
      { name:'Half Dome Cables Permit',  required:true, how:'Preseason lottery (March) and daily lottery (2 days before). 300 permits/day.', when:'Preseason: March. Daily: 2 days before.', url:'https://www.recreation.gov/permits/445561' },
      { name:'Wilderness Permit',        required:true, how:'60% lottery, 40% walk-up. Trailhead quotas enforced.', when:'Lottery opens in March for quota season (May–Nov).', url:'https://www.recreation.gov/permits/445558' },
    ],
  },
  'grand-canyon': {
    title:'Overnight hikes below the rim require a permit. Day hiking is permit-free.',
    permits:[
      { name:'Inner Canyon Overnight',  required:true, how:'Lottery at recreation.gov. Apply 4 months in advance on the 1st of the month at midnight MST.', when:'Lottery opens 4 months before entry month.', url:'https://www.recreation.gov/permits/445650', note:'Day hiking below the rim is permit-free — no permit needed for turnaround hikes' },
      { name:'Entrance Fee',            required:true, how:'$35/vehicle at gate. America the Beautiful pass accepted.', when:'Upon entry.', url:'https://www.nps.gov/grca/planyourvisit/fees.htm' },
      { name:'Havasupai Falls',         required:true, how:'Separate tribal permit — NOT through NPS. Apply through Havasupai Tribe website.', when:'Lottery opens February. Books out almost immediately.', url:'https://www.havasupaitribe.com', note:'Havasupai is tribal land — entirely separate from NPS permit system' },
    ],
  },
  yellowstone: {
    title:"Yellowstone has no day-use permits — just book campsites and lodging 6+ months ahead.",
    permits:[
      { name:'Campsite Reservations',   required:false, how:'Book at recreation.gov up to 6 months in advance. Books out within hours of opening.', when:'6 months in advance — set a calendar alert.', url:'https://www.recreation.gov' },
      { name:'Backcountry Permit',      required:true,  how:'Required for all overnight backcountry camping. Apply online or at a visitor center.', when:'Online reservations open April 1.', url:'https://www.nps.gov/yell/planyourvisit/backcountry.htm' },
      { name:'Fishing Permit',          required:true,  how:'Yellowstone-specific permit — a state license is not valid. Purchase at visitor centers.', when:'Required any time you fish in the park.', url:'https://www.nps.gov/yell/planyourvisit/fishing.htm' },
    ],
  },
  'lake-tahoe': {
    title: 'Lake Tahoe has no entrance fee but several wilderness and boating permits to know about.',
    permits: [
      { name:'Desolation Wilderness Permit', required:true,  how:'Self-issue at trailheads for day use. Overnight permits required — book at recreation.gov. Quota applies Jun 15 – Sep 15.', when:'Overnight permits: book at recreation.gov starting April 1.', url:'https://www.recreation.gov/permits/233260', note:'Day hikers must still self-register at the trailhead kiosk — it is free' },
      { name:'Boat Inspection (AIS)', required:true, how:'All motorized watercraft must be inspected at Meyers, Spooner Summit, or Alpine Meadows station before launching. Mandatory decontamination fee $30.', when:'Stations open May 1 – Sep 30 · 8:30am – 5:30pm. Book appointment at TahoeBoatInspections.com.', url:'https://tahoeboatinspections.com/appt', note:'Mandatory for every motorized boat — no exceptions. Knowingly transporting AIS: $5,000 minimum penalty' },
      { name:'No Entrance Fee', required:false, how:'Lake Tahoe Basin has no entrance fee. State park campgrounds (D.L. Bliss, Emerald Bay, Sugar Pine) charge camping fees but no day-use gate fee.', when:'Always open.', url:'https://www.fs.usda.gov/ltbmu' },
      { name:'Campfire Permits', required:true, how:'Free campfire permit required for any open fire outside a developed campground. Download at CAFire.ca.gov (California) or NVFireSafe.com (Nevada).', when:'Required year-round · Fire restrictions often in effect July–October.', url:'https://www.readyforwildfire.org/permits/campfire-permit/' },
    ],
  },

  'lake-tahoe': {
    title: 'Lake Tahoe has no entrance fee, but boats require inspection and the backcountry requires a permit.',
    permits: [
      { name:'Boat AIS Inspection', required:true, how:'All motorized watercraft must stop at one of three inspection stations before launching. Mandatory decontamination fee: $30. Book an appointment at TahoeBoatInspections.com.', when:'Required every launch. Stations open May 1–Sep 30, 8:30am–5:30pm. Last inspection 4:30pm.', url:'https://tahoeboatinspections.com/appt', note:'Green seal = Fallen Leaf Lake · Yellow seal = Echo Lakes · Intact Tahoe seal = skip line' },
      { name:'Desolation Wilderness Permit', required:true, how:'Day use permit (free, self-issue at trailhead). Overnight permit required — apply at recreation.gov. Quota enforced June 15 through Labor Day.', when:'Overnight permits: book at recreation.gov up to 2 weeks in advance.', url:'https://www.recreation.gov/permits/233262', note:'Day hiking in Desolation is permit-free — just self-register at the trailhead kiosk' },
      { name:'Fire Restrictions', required:false, how:'Stage 1 and Stage 2 fire restrictions are common in summer. Check current restrictions before any campfire. No campfire = no campfire at any elevation.', when:'Check LakeTahoeInfo.com or USFS website before your trip.', url:'https://www.fs.usda.gov/ltbmu' },
      { name:'No Entrance Fee', required:false, how:'Lake Tahoe has no entrance fee — public access to all USFS land and beaches is free.', when:'Year-round. Some specific day use areas charge a parking fee.', url:'https://www.fs.usda.gov/ltbmu' },
    ],
  },
  'great-smoky-mountains': {
    title:"The Smokies are free to enter — the only major park with no entrance fee. Backcountry camping requires a permit.",
    permits:[
      { name:'No Entrance Fee',        required:false, how:'Great Smoky Mountains is free to all visitors — no pass required.', when:'No permit needed for day use.', url:'https://www.nps.gov/grsm/planyourvisit/fees.htm' },
      { name:'Backcountry Permit',     required:true,  how:'Required for all backcountry and shelter camping. Available at smokiespermits.nps.gov. $4/person/night.', when:'Book online up to 30 days in advance.', url:'https://smokiespermits.nps.gov', note:'Day hiking is free and unrestricted — no permit ever needed' },
    ],
  },
};

export default function ParkPermitsPage({ params }: { params: { park: string } }) {
  const park  = getPark(params.park);
  if (!park) notFound();
  const guide = PERMIT_GUIDES[params.park];

  return (
    <div className="sw" style={{ maxWidth:800, paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href="/parks" style={{ color:'var(--glacial)' }}>Parks</Link>
        {' → '}
        <Link href={`/parks/${params.park}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '} Permits
      </div>
      <div className="eye">Permits · {park.shortName}</div>
      <h1 className="stitle">Permit Guide</h1>
      {guide && <p className="ssub">{guide.title}</p>}

      {guide ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem', marginTop:'1.5rem' }}>
          {guide.permits.map(p => (
            <div key={p.name} style={{ background:'rgba(13,27,42,.65)', border:'1px solid var(--cborder)', borderRadius:12, padding:'1.25rem 1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem', marginBottom:'.5rem' }}>
                <h3 style={{ fontFamily:'var(--fd)', fontSize:'1rem', fontWeight:700 }}>{p.name}</h3>
                <span style={{ background:p.required?'rgba(224,92,92,.1)':'rgba(74,188,120,.1)',
                  color:p.required?'#E05050':'#4ABC78', borderRadius:5, padding:'2px 9px',
                  fontSize:'.7rem', fontWeight:700, flexShrink:0 }}>
                  {p.required ? 'Required' : 'Not required'}
                </span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'.5rem', fontSize:'.82rem', color:'rgba(242,245,247,.75)', lineHeight:1.75 }}>
                <div><strong style={{ color:'var(--glacial)' }}>How:</strong> {p.how}</div>
                <div><strong style={{ color:'var(--glacial)' }}>When:</strong> {p.when}</div>
              </div>
              {p.note && (
                <div style={{ background:'rgba(74,173,188,.07)', border:'1px solid rgba(74,173,188,.2)',
                  borderRadius:7, padding:'.5rem .85rem', fontSize:'.76rem', color:'var(--glacial)', marginTop:'.75rem' }}>
                  💡 {p.note}
                </div>
              )}
              <div style={{ marginTop:'.85rem' }}>
                <a href={p.url} target="_blank" rel="noopener" className="bp" style={{ textDecoration:'none' }}>
                  Apply / More Info →
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop:'1.5rem', background:'rgba(13,27,42,.5)', border:'1px solid var(--cborder)',
          borderRadius:12, padding:'2rem', textAlign:'center' }}>
          <a href={park.website} target="_blank" rel="noopener" className="bp" style={{ textDecoration:'none' }}>Visit NPS.gov →</a>
        </div>
      )}
      <div style={{ marginTop:'2rem' }}>
        <Link href={`/parks/${params.park}`} style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600 }}>← Back to {park.shortName}</Link>
      </div>
    </div>
  );
}
