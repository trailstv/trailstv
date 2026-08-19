// lib/types.ts — shared types for TrailsTV v2

export type ParkSlug =
  | 'grand-canyon'
  | 'great-smoky-mountains'
  | 'yellowstone'
  | 'yosemite'
  | 'zion'
  | 'rocky-mountain'
  | 'glacier'
  | 'olympic'
  | 'acadia'
  | 'shenandoah'
  | 'sequoia'
  | 'bryce-canyon'
  | 'arches'
  | 'canyonlands'
  | 'joshua-tree'
  | 'death-valley'
  | 'mount-rainier'
  | 'crater-lake';

export interface ParkMeta {
  slug:           ParkSlug;
  npsCode:        string;
  name:           string;
  shortName:      string;
  tagline:        string;
  state:          string;
  lat:            number;
  lng:            number;
  zoom:           number;
  acreage:        string;
  established:    number;
  annualVisits:   string;
  elevationFt:    { low: number; high: number };
  heroColor:      string;
  entranceFee:    string;
  permitRequired: boolean;
  website:        string;
  activities:     ActivitySlug[];
  highlights:     string[];
  warnings:       string[];
  seasons:        { name: string; desc: string }[];
}

export type ActivitySlug =
  | 'hiking'
  | 'mtb'
  | 'camping'
  | 'boating'
  | 'kayaking'
  | 'climbing'
  | 'backpacking'
  | 'swimming'
  | 'wildlife'
  | 'skiing'
  | 'snowshoeing'
  | 'fishing';

export interface ActivityDef {
  slug:   ActivitySlug;
  icon:   string;
  name:   string;
  desc:   string;
  color:  string;
}

export interface ParkPin {
  id:          string;
  name:        string;
  lat:         number;
  lng:         number;
  type:        string;
  desc:        string;
  difficulty?: string;
  distanceMi?: number;
  elevGainFt?: number;
  note?:       string;
  url?:        string;
  fee?:        number;
  facilityId?: string;
}

export type Tier = 'free' | 'explorer' | 'local';

export interface TierDef {
  id:          Tier;
  name:        string;
  price:       string;
  priceSub:    string;
  highlight:   boolean;
  cta:         string;
  features:    { label: string; included: boolean }[];
}
