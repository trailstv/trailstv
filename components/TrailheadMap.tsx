'use client';
import { useEffect, useRef, useState } from 'react';
import { type Trailhead, DIFFICULTY_COLOR, DIFFICULTY_LABEL } from '@/lib/trailheads';

interface Props {
  trailheads: Trailhead[];
  selected:   Trailhead | null;
  onSelect:   (t: Trailhead | null) => void;
}

export default function TrailheadMap({ trailheads, selected, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<Record<string, any>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    import('leaflet').then(L => {
      if (!containerRef.current || mapRef.current) return;

      (L.Icon.Default.prototype as any)._getIconUrl = undefined;
      L.Icon.Default.mergeOptions({
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, {
        center:  [39.05, -120.02],
        zoom:    11,
        minZoom: 10,
        maxZoom: 16,
      });

      // Topo tile layer — much more useful for hiking than street map
      L.tileLayer(
        'https://tile.opentopomap.org/{z}/{x}/{y}.png',
        {
          attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a> · © <a href="https://openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 16,
        }
      ).addTo(map);

      mapRef.current = map;
      setLoaded(true);
      placeMarkers(L, map, trailheads);
    });

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // Re-place markers when trailheads change
  useEffect(() => {
    if (!mapRef.current || !loaded) return;
    import('leaflet').then(L => {
      Object.values(markersRef.current).forEach(m => m.remove());
      markersRef.current = {};
      placeMarkers(L, mapRef.current, trailheads);
    });
  }, [trailheads, loaded]);

  // Pan to + open popup for selected trailhead
  useEffect(() => {
    if (!selected || !mapRef.current) return;
    const marker = markersRef.current[selected.id];
    if (marker) {
      mapRef.current.setView([selected.lat, selected.lng], 13, { animate: true });
      marker.openPopup();
    }
  }, [selected]);

  function placeMarkers(L: any, map: any, list: Trailhead[]) {
    list.forEach(t => {
      const color = DIFFICULTY_COLOR[t.difficulty];
      const label = DIFFICULTY_LABEL[t.difficulty];

      // Custom trailhead marker — triangle shape
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            position:relative;
            width:0;height:0;
            border-left:8px solid transparent;
            border-right:8px solid transparent;
            border-bottom:14px solid ${color};
            filter:drop-shadow(0 1px 3px rgba(0,0,0,.5));
          ">
            <div style="
              position:absolute;top:14px;left:-4px;
              width:8px;height:8px;
              border-radius:50%;
              background:${color};
            "></div>
          </div>`,
        iconSize:   [16, 22],
        iconAnchor: [8, 22],
        popupAnchor:[0, -24],
      });

      const permitNote = t.permit
        ? `<div style="color:#E0B85C;font-size:.68rem;margin-top:3px">⚠ Wilderness permit required</div>`
        : '';
      const dogsNote = t.dogs
        ? `<span style="color:#4ABC78">🐕 Dogs OK</span>`
        : `<span style="color:#8B9EA8">🚫 No dogs</span>`;

      const popup = L.popup({ maxWidth: 280, className: 'trail-popup' }).setContent(`
        <div style="font-family:Inter,system-ui,sans-serif;padding:4px">
          <div style="font-weight:700;font-size:.88rem;margin-bottom:3px;color:#0D1B2A">${t.name}</div>
          <div style="font-size:.72rem;color:#555;margin-bottom:5px">${t.trail}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:5px">
            <span style="background:${color}22;color:${color};border-radius:4px;padding:1px 6px;font-size:.68rem;font-weight:700">${label}</span>
            ${t.distanceMi > 0 ? `<span style="font-size:.7rem;color:#555">${t.distanceMi} mi RT</span>` : ''}
            ${t.elevGainFt > 0 ? `<span style="font-size:.7rem;color:#555">+${t.elevGainFt.toLocaleString()} ft</span>` : ''}
          </div>
          <div style="font-size:.72rem;color:#444;line-height:1.5;margin-bottom:5px">${t.desc.substring(0, 120)}${t.desc.length > 120 ? '…' : ''}</div>
          <div style="font-size:.68rem;color:#666;margin-bottom:3px">🅿️ ${t.parking}</div>
          <div style="font-size:.68rem;margin-bottom:4px">${dogsNote} · 📅 ${t.season}</div>
          ${permitNote}
          <a href="${t.moreInfoUrl}" target="_blank" style="font-size:.7rem;color:#4AADBC;font-weight:600;text-decoration:none">More info →</a>
        </div>
      `);

      const marker = L.marker([t.lat, t.lng], { icon })
        .addTo(map)
        .bindPopup(popup);

      marker.on('click', () => onSelect(t));
      markersRef.current[t.id] = marker;
    });
  }

  return (
    <div ref={containerRef} style={{ height: '100%', width: '100%', borderRadius: 12 }} />
  );
}
