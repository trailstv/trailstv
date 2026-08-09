'use client';
import { useEffect, useRef } from 'react';
import type { Amenity } from '@/lib/data';

const TYPE_COLORS: Record<string, string> = {
  bike:    '#4AADBC',
  sport:   '#D4A853',
  camp:    '#4ABC78',
  grocery: '#E07070',
  gas:     '#8B9EA8',
  rental:  '#A78BFA',
};

interface Props {
  amenities: Amenity[];
  selected:  Amenity | null;
  onSelect:  (a: Amenity | null) => void;
}

export default function AmenitiesMap({ amenities, selected, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<Record<string, any>>({});

  // ── Initialise map once ─────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    import('leaflet').then(L => {
      if (!containerRef.current || mapRef.current) return;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      const map = L.map(containerRef.current, { center:[39.02, -120.04], zoom:10 });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      addMarkers(L, map, amenities);
    });
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-place markers when amenities change ──────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(L => {
      if (!mapRef.current) return;
      Object.values(markersRef.current).forEach((m: any) => m.remove());
      markersRef.current = {};
      addMarkers(L, mapRef.current, amenities);
    });
  }, [amenities]);

  // ── Highlight selected pin + pan map ───────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(L => {
      // Reset all markers to normal size
      Object.entries(markersRef.current).forEach(([name, m]: [string, any]) => {
        const a     = amenities.find(x => x.name === name);
        const color = a ? TYPE_COLORS[a.type] || '#8B9EA8' : '#8B9EA8';
        const isSelected = selected?.name === name;
        m.setIcon(makeIcon(L, color, isSelected));
      });

      // Pan to selected
      if (selected) {
        const marker = markersRef.current[selected.name];
        if (marker) {
          mapRef.current.setView([selected.lat, selected.lng], 13, { animate: true });
          setTimeout(() => marker.openPopup(), 350);
        }
      }
    });
  }, [selected, amenities]);

  function makeIcon(L: any, color: string, isSelected: boolean) {
    const size = isSelected ? 18 : 12;
    const border = isSelected ? `3px solid #fff` : `2px solid #0D1B2A`;
    const shadow = isSelected ? `0 0 0 2px ${color}, 0 2px 8px rgba(0,0,0,.5)` : 'none';
    return L.divIcon({
      className: '',
      html: `<div style="
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:${color};
        border:${border};
        box-shadow:${shadow};
        transition:all .2s;
      "></div>`,
      iconSize:   [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor:[0, -(size / 2) - 4],
    });
  }

  function addMarkers(L: any, map: any, list: Amenity[]) {
    list.forEach(a => {
      const color     = TYPE_COLORS[a.type] || '#8B9EA8';
      const isSelected = selected?.name === a.name;
      const icon      = makeIcon(L, color, isSelected);

      const popup = L.popup({ maxWidth: 240 }).setContent(`
        <div style="font-family:Inter,sans-serif;padding:3px 2px">
          <div style="font-weight:700;font-size:.85rem;margin-bottom:2px;color:#0D1B2A">${a.name}</div>
          <div style="font-size:.72rem;color:#666;margin-bottom:3px">${a.loc}</div>
          <div style="font-size:.72rem;color:#4AADBC">${a.note}</div>
        </div>
      `);

      const marker = L.marker([a.lat, a.lng], { icon, title: a.name })
        .addTo(map)
        .bindPopup(popup);

      marker.on('click', () => onSelect(a));
      markersRef.current[a.name] = marker;
    });
  }

  return <div ref={containerRef} className="map-container" style={{ height:'100%', minHeight:260 }}/>;
}
