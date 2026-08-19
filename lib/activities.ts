// lib/activities.ts — activity definitions used across the site
import type { ActivityDef } from './types';

export const ACTIVITIES: ActivityDef[] = [
  { slug:'hiking',      icon:'🥾', name:'Hiking',             color:'#4AADBC', desc:'Trailheads, distances, elevation gain, and permit requirements' },
  { slug:'mtb',         icon:'🚵', name:'Mountain Biking',     color:'#4ABC78', desc:'MTB-legal singletrack, flow trails, and bike parks' },
  { slug:'camping',     icon:'⛺', name:'Camping',             color:'#D4A853', desc:'Campgrounds with live Recreation.gov availability' },
  { slug:'boating',     icon:'🚤', name:'Boating',             color:'#4AADBC', desc:'Boat ramps, marinas, inspections, and regulations' },
  { slug:'kayaking',    icon:'🛶', name:'Kayaking & Paddling', color:'#4AADBC', desc:'Put-ins, take-outs, flatwater, and whitewater' },
  { slug:'climbing',    icon:'🧗', name:'Rock Climbing',       color:'#E0B85C', desc:'Sport, trad, bouldering, and gear shops' },
  { slug:'backpacking', icon:'🌲', name:'Backpacking',         color:'#4ABC78', desc:'Wilderness routes, permit systems, and camp spots' },
  { slug:'swimming',    icon:'🏊', name:'Swimming',            color:'#4AADBC', desc:'Swimming holes, beaches, and water conditions' },
  { slug:'wildlife',    icon:'🦅', name:'Wildlife Viewing',    color:'#D4A853', desc:'Prime viewing spots, best times, and species guides' },
  { slug:'skiing',      icon:'⛷️', name:'Skiing & Riding',    color:'#8BB8E8', desc:'Resorts, backcountry, snow conditions, and base depth' },
  { slug:'fishing',     icon:'🎣', name:'Fishing',             color:'#4ABC78', desc:'Lakes, rivers, permits, and catch reports' },
  { slug:'snowshoeing', icon:'🏔', name:'Snowshoeing',         color:'#8BB8E8', desc:'Snowshoe routes, conditions, and rental locations' },
];

export function getActivity(slug: string): ActivityDef | undefined {
  return ACTIVITIES.find(a => a.slug === slug);
}
