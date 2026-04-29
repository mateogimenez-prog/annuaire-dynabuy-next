'use client';
import { useEffect, useRef } from 'react';
import type { Member } from '@/types';
import { getCityCoords, METRO_AREAS } from '@/lib/utils';

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function getMetroArea(ville: string): string | null {
  const nv = normalize(ville);
  for (const [area, cities] of Object.entries(METRO_AREAS)) {
    if (cities.some(c => normalize(c) === nv || nv.includes(normalize(c)) || normalize(c).includes(nv))) {
      return area;
    }
  }
  return null;
}

interface Props {
  members: Member[];
  onCityClick: (city: string) => void;
}

export default function MemberMap({ members, onCityClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;
    let L: typeof import('leaflet');

    import('leaflet').then(mod => {
      L = mod.default ?? mod;

      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [44.8, -0.6],
        zoom: 7,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      leafletRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      // Group members by city
      const byCity: Record<string, { coords: [number, number]; members: Member[] }> = {};
      for (const m of members) {
        const coords = getCityCoords(m.ville);
        if (!coords) continue;
        const key = normalize(m.ville);
        if (!byCity[key]) byCity[key] = { coords, members: [] };
        byCity[key].members.push(m);
      }

      for (const { coords, members: cityMembers } of Object.values(byCity)) {
        const count = cityMembers.length;
        const radius = 10 + count * 4;
        const city = cityMembers[0].ville;
        const metro = getMetroArea(city);

        const circle = L.circleMarker(coords, {
          radius,
          fillColor: '#E8392A',
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);

        circle.bindTooltip(
          `<strong>${city}</strong>${metro ? `<br><span style="font-size:0.8em;color:#666">${metro}</span>` : ''}<br>${count} adhérent${count > 1 ? 's' : ''}`,
          { direction: 'top', offset: [0, -8] }
        );

        circle.on('click', () => onCityClick(metro ?? city));
      }
    });

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: 320, width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }} />
      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6, textAlign: 'right' }}>
        Cliquez sur un point pour filtrer par zone
      </p>
    </>
  );
}
