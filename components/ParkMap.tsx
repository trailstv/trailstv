'use client';
// ParkMap — lightweight Leaflet map for national park pages.
// Accepts simple park data types without requiring Tahoe-specific fields.
// Used by: parks/[park]/trails, camping, map pages.

import { useEffect, useRef } from 'react';

export interface ParkTrail {
  id:          string;
  name:        string;
  lat:         number;
  lng:         number;
  difficulty:  string;
  distanceMi?: number;
  elevGainFt?: number;
  desc:        string;
  note?:       string;
  url?:        string;
}

export interface ParkCampsite {
  id:          string;
  name:        string;
  lat:         number;
  lng:         number;
  sites:       number;
  fee:         number;
  hookups:     boolean;
  res:         boolean;
  desc:        string;
  url:         string;
  system:      string;
  facilityId?: string;
  note?:       string;
  available?:  number;
  full?:       boolean;
  limited?:    boolean;
}

export interface ParkAmenity {
  id:     string;
  name:   string;
  lat:    number;
  lng:    number;
  type:   string;
  shore?: string;
  desc:   string;
  url?:   string;
}

export type ParkPin = ParkTrail | ParkCampsite | ParkAmenity;

const DIFF_COLORS: Record<string, string> = {
  Easy: '#4ABC78', Moderate: '#4AADBC', Strenuous: '#E0B85C', Expert: '#E05050',
};

const TYPE_COLORS: Record<string, string> = {
  viewpoint: '#4AADBC', spot: '#D4A853', rental: '#4ABC78', marina: '#A78BFA',
};

type Mode = 'trails' | 'camping' | 'amenities';

interface Props {
  pins:      ParkPin[];
  mode:      Mode;
  center:    [number, number];
  zoom:      number;
  selected:  ParkPin | null;
  onSelect:  (p: ParkPin | null) => void;
  parkColor?: string;
}

function makePopup(pin: ParkPin, mode: Mode): string {
  if (mode === 'trails') {
    const t = pin as ParkTrail;
    const color = DIFF_COLORS[t.difficulty] ?? '#8B9EA8';
    return `
      <div style="font-family:Inter,sans-serif;padding:3px;max-width:240px">
        <div style="font-weight:700;font-size:.86rem;margin-bottom:3px;color:#0D1B2A">${t.name}</div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px">
          <span style="background:${color}22;color:${color};border-radius:4px;padding:1px 7px;font-size:.68rem;font-weight:700">${t.difficulty}</span>
          ${t.distanceMi ? `<span style="font-size:.7rem;color:#666">${t.distanceMi} mi</span>` : ''}
          ${t.elevGainFt ? `<span style="font-size:.7rem;color:#666">+${t.elevGainFt.toLocaleString()} ft</span>` : ''}
        </div>
        <div style="font-size:.74rem;color:#444;line-height:1.55;margin-bottom:4px">${t.desc.slice(0, 100)}…</div>
        ${t.note ? `<div style="font-size:.68rem;color:#E0B85C;margin-bottom:3px">⚠ ${t.note}</div>` : ''}
        ${t.url ? `<a href="${t.url}" target="_blank" style="font-size:.7rem;color:#4AADBC;font-weight:600">Info & permits →</a>` : ''}
      </div>`;
  }
  if (mode === 'camping') {
    const c = pin as ParkCampsite;
    const avail = c.available;
    const statusColor = c.full ? '#E05050' : c.limited ? '#E0B85C' : '#4ABC78';
    const statusLabel = avail === undefined ? '' : c.full ? '● Full' : c.limited ? `● ${avail} left` : '● Available';
    return `
      <div style="font-family:Inter,sans-serif;padding:3px;max-width:240px">
        <div style="font-weight:700;font-size:.86rem;margin-bottom:3px;color:#0D1B2A">${c.name}</div>
        <div style="font-size:.72rem;color:#666;margin-bottom:4px">${c.sites} sites · ${c.res ? 'Reservable' : 'First-come'} · $${c.fee}/night</div>
        ${statusLabel ? `<div style="font-size:.72rem;color:${statusColor};margin-bottom:4px;font-weight:600">${statusLabel}</div>` : ''}
        <div style="font-size:.74rem;color:#444;line-height:1.55;margin-bottom:4px">${c.desc.slice(0, 80)}…</div>
        <a href="${c.url}" target="_blank" style="font-size:.7rem;color:#4AADBC;font-weight:600">Book / Info →</a>
      </div>`;
  }
  // amenities
  const a = pin as ParkAmenity;
  return `
    <div style="font-family:Inter,sans-serif;padding:3px;max-width:240px">
      <div style="font-weight:700;font-size:.86rem;margin-bottom:3px;color:#0D1B2A">${a.name}</div>
      <div style="font-size:.74rem;color:#444;line-height:1.55;margin-bottom:4px">${a.desc}</div>
      ${a.url ? `<a href="${a.url}" target="_blank" style="font-size:.7rem;color:#4AADBC;font-weight:600">More info →</a>` : ''}
    </div>`;
}

function makeIcon(L: any, pin: ParkPin, mode: Mode, isSelected: boolean, parkColor: string) {
  if (mode === 'trails') {
    const t = pin as ParkTrail;
    const color = DIFF_COLORS[t.difficulty] ?? parkColor;
    const s = isSelected ? 20 : 14;
    return L.divIcon({
      className: '',
      html: `<div style="width:0;height:0;border-left:${s/1.5}px solid transparent;border-right:${s/1.5}px solid transparent;border-bottom:${s}px solid ${color};filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))${isSelected ? ';transform:scale(1.3)' : ''}"></div>`,
      iconSize: [s, s], iconAnchor: [s / 1.5, s], popupAnchor: [0, -s],
    });
  }
  if (mode === 'camping') {
    const c = pin as ParkCampsite;
    const color = c.full ? '#E05050' : c.limited ? '#E0B85C' : '#4ABC78';
    const s = isSelected ? 18 : 12;
    return L.divIcon({
      className: '',
      html: `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${color};border:${isSelected ? '3px solid #fff' : '2px solid #0D1B2A'};box-shadow:${isSelected ? `0 0 0 2px ${color},0 2px 8px rgba(0,0,0,.5)` : 'none'}"></div>`,
      iconSize: [s, s], iconAnchor: [s / 2, s / 2], popupAnchor: [0, -(s / 2) - 4],
    });
  }
  // amenities
  const a = pin as ParkAmenity;
  const color = TYPE_COLORS[a.type] ?? parkColor;
  const s = isSelected ? 18 : 12;
  return L.divIcon({
    className: '',
    html: `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${color};border:${isSelected ? '3px solid #fff' : '2px solid #0D1B2A'};box-shadow:${isSelected ? `0 0 0 2px ${color},0 2px 8px rgba(0,0,0,.5)` : 'none'}"></div>`,
    iconSize: [s, s], iconAnchor: [s / 2, s / 2], popupAnchor: [0, -(s / 2) - 4],
  });
}

export default function ParkMap({ pins, mode, center, zoom, selected, onSelect, parkColor = '#4AADBC' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import('leaflet').then(L => {
      if (!containerRef.current || mapRef.current) return;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      const map = L.map(containerRef.current, { center, zoom });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      addMarkers(L, map, pins);
    });
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(L => {
      Object.values(markersRef.current).forEach((m: any) => m.remove());
      markersRef.current = {};
      addMarkers(L, mapRef.current, pins);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins]);

  useEffect(() => {
    if (!selected || !mapRef.current) return;
    import('leaflet').then(L => {
      // Update all marker icons to reflect selection state
      pins.forEach(pin => {
        const m = markersRef.current[pin.id];
        if (m) m.setIcon(makeIcon(L, pin, mode, pin.id === selected.id, parkColor));
      });
      const marker = markersRef.current[selected.id];
      if (marker) {
        mapRef.current.setView([selected.lat, selected.lng], Math.max(zoom, 13), { animate: true });
        setTimeout(() => marker.openPopup(), 350);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function addMarkers(L: any, map: any, list: ParkPin[]) {
    list.forEach(pin => {
      const isSel  = selected?.id === pin.id;
      const icon   = makeIcon(L, pin, mode, isSel, parkColor);
      const popup  = L.popup({ maxWidth: 260 }).setContent(makePopup(pin, mode));
      const marker = L.marker([pin.lat, pin.lng], { icon, title: pin.name })
        .addTo(map)
        .bindPopup(popup);
      marker.on('click', () => onSelect(pin));
      markersRef.current[pin.id] = marker;
    });
  }

  return (
    <div ref={containerRef}
      className="map-container"
      style={{ height: '100%', minHeight: 300, width: '100%' }}
    />
  );
}
