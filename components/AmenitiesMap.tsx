'use client';
import { useEffect, useRef } from 'react';
import type { Amenity } from '@/lib/data';

const TYPE_COLORS: Record<string, string> = {
  bike:'#4AADBC', sport:'#D4A853', camp:'#4ABC78',
  grocery:'#E07070', gas:'#8B9EA8', rental:'#A78BFA',
};

interface Props { amenities: Amenity[]; }

export default function AmenitiesMap({ amenities }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<any[]>([]);

  useEffect(() => {
    import('leaflet').then(L => {
      if (!containerRef.current || mapRef.current) return;
      (L.Icon.Default.prototype as any)._getIconUrl = undefined;
      L.Icon.Default.mergeOptions({
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, { center:[39.02, -120.04], zoom:10 });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      }).addTo(map);
      mapRef.current = map;
      addMarkers(L, map, amenities);
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(L => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      addMarkers(L, mapRef.current, amenities);
    });
  }, [amenities]);

  function addMarkers(L: any, map: any, list: Amenity[]) {
    list.forEach(a => {
      const color = TYPE_COLORS[a.type] || '#8B9EA8';
      const icon  = L.divIcon({
        className: '',
        html:      `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #0D1B2A"></div>`,
        iconSize:  [12, 12], iconAnchor: [6, 6],
      });
      const m = L.marker([a.lat, a.lng], { icon })
        .addTo(map)
        .bindPopup(`<div style="font-family:Inter,sans-serif;font-size:.8rem"><strong>${a.name}</strong><br/><span style="color:#8B9EA8">${a.loc}</span><br/><span style="color:#4AADBC">${a.note}</span></div>`);
      markersRef.current.push(m);
    });
  }

  return <div ref={containerRef} className="map-container" style={{ height:460 }}/>;
}
