'use client';
import { useEffect, useRef } from 'react';
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

  // ── Initialise map once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then(L => {
      if (!containerRef.current || mapRef.current) return;

      // Fix broken default icon paths in bundled environments
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, {
        center:      [39.05, -120.02],
        zoom:        11,
        minZoom:     10,
        maxZoom:     16,
        zoomControl: true,
      });

      // Primary: OpenTopoMap — shows elevation contours, trail lines
      const topoLayer = L.tileLayer(
        'https://tile.opentopomap.org/{z}/{x}/{y}.png',
        {
          attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a> · © <a href="https://openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 16,
          // Fallback handled by error event below
        }
      );

      // Fallback: standard OSM — always available
      const osmLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 19,
        }
      );

      // Try topo first — if tiles fail, swap to OSM
      topoLayer.addTo(map);
      let topoFailed = 0;
      topoLayer.on('tileerror', () => {
        topoFailed++;
        // After 3 tile errors, switch to OSM
        if (topoFailed === 3) {
          map.removeLayer(topoLayer);
          osmLayer.addTo(map);
        }
      });

      // Layer control so user can switch manually
      L.control.layers(
        { 'Topo (OpenTopoMap)': topoLayer, 'Street (OpenStreetMap)': osmLayer },
        {}
      ).addTo(map);

      mapRef.current = map;

      // Place initial markers immediately after map is ready
      addMarkers(L, map, trailheads);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once — marker updates handled in next effect

  // ── Update markers when trailheads prop changes ────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(L => {
      if (!mapRef.current) return;
      // Remove all existing markers
      Object.values(markersRef.current).forEach((m: any) => m.remove());
      markersRef.current = {};
      // Re-add with current data
      addMarkers(L, mapRef.current, trailheads);
    });
  }, [trailheads]);

  // ── Pan to selected trailhead ──────────────────────────────────────────────
  useEffect(() => {
    if (!selected || !mapRef.current) return;
    const marker = markersRef.current[selected.id];
    if (marker) {
      mapRef.current.setView([selected.lat, selected.lng], 13, { animate: true });
      setTimeout(() => marker.openPopup(), 350); // wait for pan to complete
    }
  }, [selected]);

  // ── Add markers to map ────────────────────────────────────────────────────
  function addMarkers(L: any, map: any, list: Trailhead[]) {
    list.forEach(t => {
      const color = DIFFICULTY_COLOR[t.difficulty];
      const label = DIFFICULTY_LABEL[t.difficulty];

      // Triangle trailhead marker — points down like a location pin
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          pointer-events:none;
        ">
          <div style="
            width:0;height:0;
            border-left:9px solid transparent;
            border-right:9px solid transparent;
            border-top:16px solid ${color};
            filter:drop-shadow(0 2px 4px rgba(0,0,0,.55));
          "></div>
          <div style="
            width:6px;height:6px;
            border-radius:50%;
            background:${color};
            margin-top:1px;
            box-shadow:0 1px 3px rgba(0,0,0,.5);
          "></div>
        </div>`,
        iconSize:   [18, 24],
        iconAnchor: [9, 24],
        popupAnchor:[0, -26],
      });

      const permitNote = t.permit
        ? `<div style="color:#E0B85C;font-size:.68rem;margin-top:4px;padding:3px 7px;background:rgba(224,184,92,.1);border-radius:4px">⚠ Wilderness permit required</div>`
        : '';

      const useIcons = t.use.map(u =>
        u === 'hiking'    ? '🥾' :
        u === 'mtb'       ? '🚵' :
        u === 'equestrian'? '🐴' : '🏃'
      ).join(' ');

      const popup = L.popup({ maxWidth: 260, className: 'trail-popup' }).setContent(`
        <div style="font-family:Inter,system-ui,sans-serif;padding:4px 2px">
          <div style="font-weight:700;font-size:.88rem;margin-bottom:2px;color:#0D1B2A;line-height:1.3">${t.name}</div>
          <div style="font-size:.72rem;color:#555;margin-bottom:6px">${t.trail}</div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px;align-items:center">
            <span style="background:${color}22;color:${color};border-radius:4px;padding:2px 7px;font-size:.68rem;font-weight:700">${label}</span>
            ${t.distanceMi > 0 ? `<span style="font-size:.7rem;color:#666">${t.distanceMi} mi</span>` : ''}
            ${t.elevGainFt > 0 ? `<span style="font-size:.7rem;color:#666">+${t.elevGainFt.toLocaleString()} ft</span>` : ''}
            <span style="font-size:.7rem;color:#666">${useIcons}</span>
          </div>
          <div style="font-size:.72rem;color:#444;line-height:1.55;margin-bottom:5px">${t.desc.substring(0, 100)}…</div>
          <div style="font-size:.68rem;color:#666;margin-bottom:2px">🅿️ ${t.parking}</div>
          <div style="font-size:.68rem;color:#666;margin-bottom:5px">📅 ${t.season} · ${t.dogs ? '🐕 Dogs OK' : '🚫 No dogs'}</div>
          ${permitNote}
          <a href="${t.moreInfoUrl}" target="_blank" rel="noopener" style="font-size:.72rem;color:#4AADBC;font-weight:600;text-decoration:none;display:inline-block;margin-top:4px">Trail info & maps →</a>
        </div>
      `);

      const marker = L.marker([t.lat, t.lng], { icon, title: t.name })
        .addTo(map)
        .bindPopup(popup);

      marker.on('click', () => onSelect(t));
      markersRef.current[t.id] = marker;
    });
  }

  return (
    // Explicit pixel height — never '100%' which reads as 0 before parent paints
    <div
      ref={containerRef}
      style={{
        height:       560,
        width:        '100%',
        borderRadius: 12,
        background:   'rgba(13,27,42,.6)', // visible while tiles load
      }}
    />
  );
}
