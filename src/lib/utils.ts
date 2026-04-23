import type { Member, Meeting } from '@/types';

export const SECTORS = [
  'Formation & Management',
  'Comptabilité & Finance',
  'Juridique & Droit',
  'Immobilier',
  'Informatique & Digital',
  'Communication & Marketing',
  'Santé & Bien-être',
  'Bâtiment & Construction',
  'Plomberie & Chauffage',
  'Électricité',
  'Commerce & Vente',
  'Transport & Logistique',
  'Restauration & Hôtellerie',
  'Assurance',
  'Ressources Humaines',
  "Artisanat & Métiers d'art",
  'Autre',
];

export const AVATAR_COLORS: Record<string, string> = {
  'Formation & Management': '#7C3AED',
  'Comptabilité & Finance': '#10B981',
  'Juridique & Droit': '#8B5CF6',
  'Immobilier': '#EF4444',
  'Informatique & Digital': '#06B6D4',
  'Communication & Marketing': '#DB2777',
  'Santé & Bien-être': '#EC4899',
  'Bâtiment & Construction': '#92400E',
  'Plomberie & Chauffage': '#3B82F6',
  'Électricité': '#F59E0B',
  'Commerce & Vente': '#F97316',
  'Transport & Logistique': '#6366F1',
  'Restauration & Hôtellerie': '#D97706',
  'Assurance': '#059669',
  'Ressources Humaines': '#A21CAF',
  "Artisanat & Métiers d'art": '#B45309',
  'Autre': '#6B7280',
};

export function getInitials(prenom: string, nom: string): string {
  return ((prenom?.[0] || '') + (nom?.[0] || '')).toUpperCase();
}

export function getAvatarColor(secteur: string): string {
  return AVATAR_COLORS[secteur] || '#E8392A';
}

export function generateVCard(member: Member): string {
  const tel = member.tel.replace(/\s/g, '');
  return `BEGIN:VCARD\r\nVERSION:3.0\r\nN:${member.nom};${member.prenom};;;\r\nFN:${member.prenom} ${member.nom}\r\nORG:${member.entreprise}\r\nTITLE:${member.secteur}\r\nTEL;TYPE=CELL:${tel}\r\nEMAIL:${member.email}\r\nADR;TYPE=WORK:;;${member.ville};;;;FR\r\nNOTE:Adhérent Dynabuy Réseau\r\nEND:VCARD`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getDateParts(dateStr: string): { day: number; month: string } {
  const d = new Date(dateStr + 'T12:00:00');
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }),
  };
}

export function getFormatLabel(meeting: Meeting): string {
  if (meeting.format === 'Repas') return 'Repas';
  const [h, min] = (meeting.fin || '12h00').split('h').map(Number);
  const finMin = h * 60 + (min || 0);
  if (finMin <= 12 * 60) return 'Matinale';
  if (finMin <= 17 * 60 + 30) return 'Après-midi';
  return 'After Work';
}
