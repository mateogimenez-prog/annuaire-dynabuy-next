import type { Member, Meeting } from '@/types';

export const SECTORS = [
  'Conseil, Formation, Coaching & Stratégie',
  'Services aux entreprises (B2B)',
  'Communication, Marketing, Digital & Création',
  'Informatique, IT, Data & Cybersécurité',
  'Finance, Gestion, Comptabilité & Assurance',
  'Juridique, Droit & Administratif',
  'Ressources Humaines, Recrutement & QVT',
  'Immobilier, Construction & Gestion de biens',
  'Commerce, Vente, Distribution & E-commerce',
  "Développement commercial & Apport d'affaires",
  'Événementiel, Audiovisuel & Animation',
  'Bâtiment, Travaux, Artisanat & Maintenance',
  'Industrie, Production & Ingénierie',
  'Transport, Logistique & Mobilité',
  'Restauration, Hôtellerie, Tourisme & Loisirs',
  'Santé, Bien-être, Sport & Thérapies',
  'Énergie, Environnement & RSE',
  'Agriculture, Viticulture & Agroalimentaire',
  'Services aux particuliers',
  'Art, Design, Création & Culture',
  'Luxe, Mode & Beauté',
  'Startups, Innovation & Nouvelles technologies',
  'Autres activités',
];

export const AVATAR_COLORS: Record<string, string> = {
  'Conseil, Formation, Coaching & Stratégie': '#7C3AED',
  'Services aux entreprises (B2B)': '#0EA5E9',
  'Communication, Marketing, Digital & Création': '#DB2777',
  'Informatique, IT, Data & Cybersécurité': '#06B6D4',
  'Finance, Gestion, Comptabilité & Assurance': '#10B981',
  'Juridique, Droit & Administratif': '#8B5CF6',
  'Ressources Humaines, Recrutement & QVT': '#A21CAF',
  'Immobilier, Construction & Gestion de biens': '#EF4444',
  'Commerce, Vente, Distribution & E-commerce': '#F97316',
  "Développement commercial & Apport d'affaires": '#E8392A',
  'Événementiel, Audiovisuel & Animation': '#EC4899',
  'Bâtiment, Travaux, Artisanat & Maintenance': '#92400E',
  'Industrie, Production & Ingénierie': '#475569',
  'Transport, Logistique & Mobilité': '#6366F1',
  'Restauration, Hôtellerie, Tourisme & Loisirs': '#D97706',
  'Santé, Bien-être, Sport & Thérapies': '#14B8A6',
  'Énergie, Environnement & RSE': '#16A34A',
  'Agriculture, Viticulture & Agroalimentaire': '#84CC16',
  'Services aux particuliers': '#F59E0B',
  'Art, Design, Création & Culture': '#C026D3',
  'Luxe, Mode & Beauté': '#BE123C',
  'Startups, Innovation & Nouvelles technologies': '#2563EB',
  'Autres activités': '#6B7280',
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
  if (meeting.format === 'Distanciel') return 'En ligne';
  if (meeting.format === 'Soirée' || meeting.format === 'Loisir') return 'Soirée';
  if (meeting.format === 'Évènementiel') return 'Évènement';
  const [h, min] = (meeting.fin || '12h00').split('h').map(Number);
  const finMin = h * 60 + (min || 0);
  if (finMin <= 12 * 60) return 'Matinale';
  if (finMin <= 17 * 60 + 30) return 'Après-midi';
  return 'After Work';
}
