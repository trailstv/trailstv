// lib/tiers.ts — paywall tier definitions
import type { TierDef } from './types';

export const TIERS: TierDef[] = [
  {
    id:        'free',
    name:      'Free',
    price:     '$0',
    priceSub:  'forever · no card needed',
    highlight: false,
    cta:       'Get Started Free',
    features: [
      { label:'All park activity maps',             included: true  },
      { label:'Trail maps with difficulty ratings', included: true  },
      { label:'Campground locations & info',        included: true  },
      { label:'7-day weather forecast',             included: true  },
      { label:'Live fire restrictions (NPS)',       included: true  },
      { label:'NPS park alerts & closures',         included: true  },
      { label:'Snow & ski conditions',              included: true  },
      { label:'Live campsite availability',         included: false },
      { label:'Campsite opening alerts',            included: false },
      { label:'Permit lottery reminders',           included: false },
      { label:'Saved trips',                        included: false },
      { label:'Offline maps',                       included: false },
    ],
  },
  {
    id:        'explorer',
    name:      'Explorer',
    price:     '$4.99',
    priceSub:  'per month · cancel anytime',
    highlight: false,
    cta:       'Start Explorer',
    features: [
      { label:'Everything in Free',                included: true  },
      { label:'Live campsite availability',         included: true  },
      { label:'Campsite opening alerts (email)',    included: true  },
      { label:'Permit lottery reminders',          included: true  },
      { label:'Saved trips (up to 10)',            included: true  },
      { label:'Offline maps',                      included: false },
      { label:'All future parks',                  included: false },
    ],
  },
  {
    id:        'local',
    name:      'Local',
    price:     '$29.99',
    priceSub:  'one-time · yours forever',
    highlight: true,
    cta:       'Get Local — $29.99',
    features: [
      { label:'Everything in Explorer',            included: true  },
      { label:'Offline maps — all parks',          included: true  },
      { label:'Unlimited saved trips',             included: true  },
      { label:'All future parks included',         included: true  },
      { label:'One-time purchase, no subscription',included: true  },
    ],
  },
];

export const GATED_FEATURES: Record<string, ('explorer' | 'local')[]> = {
  'live-campsites':   ['explorer','local'],
  'campsite-alerts':  ['explorer','local'],
  'permit-reminders': ['explorer','local'],
  'saved-trips':      ['explorer','local'],
  'offline-maps':     ['local'],
};
