import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 60;

const BASE = 'https://www.rencontres-dirigeants.com';
const AGENCES = [110, 254, 274];
const ANIMATEURS = ['GIMENEZ', 'GRATAS', 'BARICAULT', 'BAUDET'];

const MOIS: Record<string, string> = {
  'janv': '01', 'janvier': '01', 'fevr': '02', 'fevrier': '02',
  'mars': '03', 'avr': '04', 'avril': '04', 'mai': '05', 'juin': '06',
  'juil': '07', 'juillet': '07', 'aout': '08', 'sept': '09',
  'septembre': '09', 'oct': '10', 'octobre': '10', 'nov': '11',
  'novembre': '11', 'dec': '12', 'decembre': '12',
};

function parseDateFr(str: string): string | null {
  let m = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const clean = str.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a');
  const m2 = clean.match(/(\d{1,2})\s+(\w+)\.?\s+(\d{4})/);
  if (!m2) return null;
  const [, day, mon, year] = m2;
  const month = MOIS[mon] || MOIS[mon.slice(0, 4)] || MOIS[mon.slice(0, 3)];
  if (!month) return null;
  return `${year}-${month}-${day.padStart(2, '0')}`;
}

function parseHeure(str: string): string | null {
  const m = str.match(/(\d{1,2})[h:](\d{2})(?:\s*(AM|PM))?/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  if (m[3]?.toUpperCase() === 'PM' && h < 12) h += 12;
  if (m[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}h${m[2]}`;
}

function formatPrix(str: string): string {
  if (/gratuit/i.test(str)) return 'Gratuit';
  const m = str.match(/([\d\s,]+)\s*€/);
  if (!m) return 'Voir site';
  const montant = m[1].trim().replace(/\s/g, '').replace('.', ',');
  return /HT|hors/i.test(str) ? `${montant} € HT` : `${montant} € (sur place)`;
}

function buildTitre(ville: string, format: string): string {
  if (format === 'Repas') return `Déjeuner réseau — ${ville}`;
  if (format === 'Soirée') return `Soirée réseau — ${ville}`;
  if (format === 'Évènementiel') return `Événement réseau — ${ville}`;
  return `Rencontre dirigeants — ${ville}`;
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractMeetingIds(html: string): number[] {
  const ids = new Set<number>();
  const re = /href=["'][^"']*\/nos-rencontres\/(\d{4,6})(?:[?#"'])/g;
  let m;
  while ((m = re.exec(html)) !== null) ids.add(parseInt(m[1]));
  return [...ids];
}

interface Meeting {
  id: string; titre: string; date: string; heure: string; fin: string;
  lieu: string; adresse?: string | null; format: string; animateur: string;
  prix: string; lien: string;
}

async function parseMeeting(meetingId: number, today: string): Promise<Meeting | null> {
  const html = await fetchHtml(`${BASE}/nos-rencontres/${meetingId}`);
  if (!html) return null;

  // JSON-LD
  const ldMatch = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  let ld: Record<string, unknown> | null = null;
  if (ldMatch) {
    try { ld = JSON.parse(ldMatch[1]); } catch {}
  }

  const bodyText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  // Date
  let date: string | null = null;
  if (ld?.startDate) date = parseDateFr(ld.startDate as string);
  if (!date) {
    const dm = bodyText.match(/\d{1,2}\s+\w+\.?\s+\d{4}/);
    if (dm) date = parseDateFr(dm[0]);
  }
  if (!date || date < today) return null;

  // Heures
  let heure: string | null = null;
  let fin: string | null = null;
  if (ld?.startDate) heure = parseHeure(((ld.startDate as string).split('T')[1]) || '');
  if (ld?.endDate) fin = parseHeure(((ld.endDate as string).split('T')[1]) || '');
  if (!heure || !fin) {
    const tm = bodyText.match(/(\d{1,2}h\d{2})\s*[à\-–]\s*(\d{1,2}h\d{2})/);
    if (tm) { heure = tm[1]; fin = tm[2]; }
  }

  // Ville
  let ville: string | null = null;
  if (ld?.location) {
    const loc = ld.location as Record<string, unknown>;
    ville = (loc.address as Record<string, string>)?.addressLocality
      || ((loc.name as string)?.split(',')[0]?.trim()) || null;
  }
  if (!ville) {
    const h1m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1 = h1m ? h1m[1].replace(/<[^>]+>/g, '').trim() : '';
    const vm = (h1 || bodyText).match(/[àa]\s+([A-ZÀ-Ÿ][A-Za-zÀ-ÿ\-' ]{2,}?)(?=\s*[,\n(])/);
    if (vm) ville = vm[1].trim();
  }
  if (!ville) return null;

  // Animateur
  let animateur: string | null = null;
  if ((ld?.organizer as Record<string, string>)?.name) {
    animateur = (ld!.organizer as Record<string, string>).name;
  }
  if (!animateur) {
    for (const nom of ANIMATEURS) {
      if (bodyText.toUpperCase().includes(nom)) {
        const am = bodyText.match(new RegExp(`([A-ZÀ-Ÿ][a-zà-ÿ]+\\s+${nom}|${nom}\\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)`, 'i'));
        animateur = am ? am[1] : nom;
        break;
      }
    }
  }
  if (!animateur || !ANIMATEURS.some(a => animateur!.toUpperCase().includes(a))) return null;

  // Prix
  let prix: string | null = null;
  const offers = ld?.offers as Record<string, unknown> | undefined;
  if (offers?.price != null) {
    prix = offers.price === 0 || offers.price === '0'
      ? 'Gratuit'
      : `${String(offers.price).replace('.', ',')} € HT`;
  }
  if (!prix) {
    const pm = bodyText.match(/([\d\s,.]+\s*€[^.]{0,30})/);
    if (pm) prix = formatPrix(pm[1]);
  }

  // Format
  let format = 'Présentiel';
  const txt = bodyText.toLowerCase();
  if (/repas|déjeuner|lunch/i.test(txt)) format = 'Repas';
  else if (/soirée|cocktail/i.test(txt)) format = 'Soirée';
  else if (/événement|conférence/i.test(txt)) format = 'Évènementiel';

  const animFinal = animateur.split(' ')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .replace(new RegExp(ANIMATEURS.join('|'), 'ig'), (w: string) => w.toUpperCase());

  return {
    id: `m${meetingId}`,
    titre: buildTitre(ville.trim(), format),
    date, heure: heure || '09h00', fin: fin || '11h30',
    lieu: ville.trim(), adresse: null, format,
    animateur: animFinal, prix: prix || 'Voir site',
    lien: `${BASE}/nos-rencontres/${meetingId}`,
  };
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const today = new Date().toISOString().slice(0, 10);
  const log: string[] = [];

  // 1. Récupérer les IDs de réunions pour chaque agence (en parallèle)
  const agencyPages = await Promise.all(
    AGENCES.map(id => fetchHtml(`${BASE}/nos-rencontres?agency=${id}`))
  );

  const allIds = new Set<number>();
  agencyPages.forEach((html, i) => {
    if (!html) { log.push(`Agence ${AGENCES[i]}: inaccessible`); return; }
    const ids = extractMeetingIds(html);
    log.push(`Agence ${AGENCES[i]}: ${ids.length} réunion(s)`);
    ids.forEach(id => allIds.add(id));
  });

  log.push(`Total IDs: ${allIds.size}`);

  // 2. Parser chaque réunion
  const sortedIds = [...allIds].sort((a, b) => b - a).slice(0, 80);
  const limitDate = new Date();
  limitDate.setMonth(limitDate.getMonth() + 12);
  const endDate = limitDate.toISOString().slice(0, 10);

  const meetings: Meeting[] = [];
  for (const id of sortedIds) {
    const m = await parseMeeting(id, today);
    if (m && m.date >= today && m.date <= endDate) {
      meetings.push(m);
      log.push(`✓ ${m.date} — ${m.titre}`);
    }
  }

  meetings.sort((a, b) => a.date.localeCompare(b.date));
  log.push(`${meetings.length} réunion(s) à upsert`);

  // 3. Upsert dans Supabase
  if (meetings.length > 0) {
    const { error } = await supabase.from('meetings').upsert(meetings, { onConflict: 'id' });
    if (error) return NextResponse.json({ ok: false, error: error.message, log }, { status: 500 });
    log.push('✓ Supabase upsert OK');
  }

  // 4. Supprimer les réunions passées
  const { count } = await supabase.from('meetings').delete({ count: 'exact' }).lt('date', today);
  log.push(`✓ ${count ?? 0} réunion(s) passée(s) supprimée(s)`);

  return NextResponse.json({ ok: true, meetings: meetings.length, log });
}
