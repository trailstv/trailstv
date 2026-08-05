'use client';
import { useEffect, useRef } from 'react';
import type { ActivityPin } from '@/lib/activityLocations';

const TYPE_ICONS: Record<string, string> = {
  trailhead: '▲',
  launch:    '◆',
  rental:    '●',
  resort:    '★',
  beach:     '◉',
  marina:    '⚓',
  campsite:  '⛺',
  spot:      '●',
  viewpoint: '◉',
};

interface Props {
  pins:     ActivityPin[];
  color:    string;
  center:   [number, number];
  zoom:     number;
  selected: ActivityPin | null;
  onSelect: (p: ActivityPin | null) => void;
}

export default function ActivityMap({ pins, color, center, zoom, selected, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<Record<string, any>>({});

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

      const map = L.map(containerRef.current, { center, zoom });

      // Standard OpenStreetMap tiles — consistent with all other maps
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
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
      if (!mapRef.current) return;
      Object.values(markersRef.current).forEach((m: any) => m.remove());
      markersRef.current = {};
      addMarkers(L, mapRef.current, pins);
    });
  }, [pins]);

  useEffect(() => {
    if (!selected || !mapRef.current) return;
    const marker = markersRef.current[selected.id];
    if (marker) {
      mapRef.current.setView([selected.lat, selected.lng], 13, { animate: true });
      setTimeout(() => marker.openPopup(), 350);
    }
  }, [selected]);

  function addMarkers(L: any, map: any, list: ActivityPin[]) {
    list.forEach(pin => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 28px; height: 28px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: ${color};
          border: 2px solid #0D1B2A;
          box-shadow: 0 2px 6px rgba(0,0,0,.45);
          display: flex; align-items: center; justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 9px; color: #0D1B2A; font-weight: 800; line-height: 1">
            ${TYPE_ICONS[pin.type] || '●'}
          </span>
        </div>`,
        iconSize:   [28, 28],
        iconAnchor: [14, 28],
        popupAnchor:[0, -30],
      });

      const diffBadge = pin.difficulty
        ? `<span style="background:${color}22;color:${color};border-radius:4px;padding:1px 6px;font-size:.67rem;font-weight:700">${pin.difficulty}</span>`
        : '';
      const feeBadge = pin.fee
        ? `<span style="font-size:.67rem;color:#666">💰 ${pin.fee}</span>`
        : '';
      const noteBadge = pin.note
        ? `<div style="font-size:.67rem;color:#E0B85C;margin-top:3px;padding:2px 6px;background:rgba(224,184,92,.08);border-radius:4px">⚠ ${pin.note}</div>`
        : '';
      const linkBtn = pin.url
        ? `<a href="${pin.url}" target="_blank" rel="noopener" style="font-size:.72rem;color:#4AADBC;font-weight:600;text-decoration:none;display:inline-block;margin-top:4px">More info →</a>`
        : '';

      const popup = L.popup({ maxWidth: 260 }).setContent(`
        <div style="font-family:Inter,system-ui,sans-serif;padding:4px 2px">
          <div style="font-weight:700;font-size:.88rem;margin-bottom:3px;color:#0D1B2A;line-height:1.3">${pin.name}</div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px;align-items:center">
            ${diffBadge}${feeBadge}
          </div>
          <div style="font-size:.76rem;color:#444;line-height:1.55;margin-bottom:4px">${pin.desc}</div>
          ${noteBadge}
          ${linkBtn}
        </div>
      `);

      const marker = L.marker([pin.lat, pin.lng], { icon, title: pin.name })
        .addTo(map)
        .bindPopup(popup);

      marker.on('click', () => onSelect(pin));
      markersRef.current[pin.id] = marker;
    });
  }

  return (
    <div
      ref={containerRef}
      style={{ height: 520, width: '100%', borderRadius: 12, background: 'rgba(13,27,42,.6)' }}
    />
  );
}
