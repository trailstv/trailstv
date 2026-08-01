'use client';
import { useEffect, useRef } from 'react';
import type { Camp } from '@/lib/data';
import { avSt } from '@/lib/data';

interface Props {
  camps:    Camp[];
  selected: Camp | null;
  onSelect: (c: Camp) => void;
}

export default function CampsiteMap({ camps, selected, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<Record<string, any>>({});

  useEffect(() => {
    // Dynamic Leaflet import — safe for SSR
    import('leaflet').then(L => {
      if (!containerRef.current || mapRef.current) return;

      // Fix default icon paths broken by webpack
      (L.Icon.Default.prototype as any)._getIconUrl = undefined;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, {
        center:    [38.98, -120.02],
        zoom:      11,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      addMarkers(L, map, camps);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  // Update markers when camps change
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(L => {
      // Clear existing
      Object.values(markersRef.current).forEach(m => m.remove());
      markersRef.current = {};
      addMarkers(L, mapRef.current, camps);
    });
  }, [camps]);

  // Highlight selected
  useEffect(() => {
    if (!selected || !markersRef.current[selected.id]) return;
    markersRef.current[selected.id].openPopup();
  }, [selected]);

  function addMarkers(L: any, map: any, campList: Camp[]) {
    campList.forEach(c => {
      const st      = avSt(c);
      const color   = st === 'open' ? '#4ABC78' : st === 'limited' ? '#E0B85C' : '#E05050';
      const icon    = L.divIcon({
        className:   '',
        html:        `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #0D1B2A;box-shadow:0 0 6px ${color}40"></div>`,
        iconSize:    [14, 14],
        iconAnchor:  [7, 7],
      });

      const avText  = st === 'open' ? `${c.available} open` : st === 'limited' ? `${c.available} left` : 'Full';
      const popup   = L.popup({ className:'camp-popup', maxWidth:240 }).setContent(`
        <div style="font-family:Inter,sans-serif;padding:4px">
          <div style="font-weight:700;margin-bottom:4px;font-size:.85rem">${c.name}</div>
          <div style="font-size:.72rem;color:#8B9EA8;margin-bottom:6px">${c.region} · $${c.fee}/night</div>
          <div style="font-size:.74rem;margin-bottom:6px;color:${color}">● ${avText}</div>
          <a href="${c.url}" target="_blank" style="font-size:.72rem;color:#4AADBC;font-weight:600">Book via ${c.bookSystem} →</a>
        </div>
      `);

      const marker = L.marker([c.lat, c.lng], { icon }).addTo(map).bindPopup(popup);
      marker.on('click', () => onSelect(c));
      markersRef.current[c.id] = marker;
    });
  }

  return <div ref={containerRef} className="map-container" style={{ height:440 }}/>;
}
