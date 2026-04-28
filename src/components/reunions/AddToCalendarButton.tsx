'use client';
import { useState } from 'react';
import type { Meeting } from '@/types';

function parseHeure(h: string) {
  const [hh, mm] = h.toLowerCase().replace('h', ':').split(':');
  return { h: parseInt(hh), m: parseInt(mm) || 0 };
}

function toCalDate(date: string, heure: string) {
  const { h, m } = parseHeure(heure);
  const d = new Date(date + 'T12:00:00');
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, '0');
  const D = String(d.getDate()).padStart(2, '0');
  const HH = String(h).padStart(2, '0');
  const MM = String(m).padStart(2, '0');
  return `${Y}${M}${D}T${HH}${MM}00`;
}

export default function AddToCalendarButton({ meeting }: { meeting: Meeting }) {
  const [open, setOpen] = useState(false);

  const location = meeting.adresse ?? meeting.lieu;
  const start = toCalDate(meeting.date, meeting.heure);
  const end = toCalDate(meeting.date, meeting.fin);

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meeting.titre)}&dates=${start}/${end}&location=${encodeURIComponent(location)}&details=${encodeURIComponent('Réunion réseau Dynabuy — Animateur : ' + meeting.animateur)}`;

  function downloadICS() {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dynabuy//Reunions//FR',
      'BEGIN:VEVENT',
      `DTSTART;TZID=Europe/Paris:${start}`,
      `DTEND;TZID=Europe/Paris:${end}`,
      `SUMMARY:${meeting.titre}`,
      `LOCATION:${location}`,
      `DESCRIPTION:Réunion réseau Dynabuy\\nAnimateur : ${meeting.animateur}\\nPrix : ${meeting.prix}`,
      `URL:${meeting.lien}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dynabuy-${meeting.date}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="btn btn-sm btn-outline"
        onClick={() => setOpen(o => !o)}
        title="Ajouter à mon agenda"
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Agenda
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div style={{
            position: 'absolute',
            bottom: '110%',
            right: 0,
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 20,
            minWidth: 190,
            overflow: 'hidden',
          }}>
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', fontSize: '0.85rem',
                color: 'inherit', textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Google Agenda
            </a>
            <button
              onClick={downloadICS}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', fontSize: '0.85rem',
                color: 'inherit', background: 'none',
                border: 'none', cursor: 'pointer',
                width: '100%', textAlign: 'left',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Apple / Outlook (.ics)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
