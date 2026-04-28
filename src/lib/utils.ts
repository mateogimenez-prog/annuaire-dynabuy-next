import type { Member, Meeting } from '@/types';

export const METRO_AREAS: Record<string, string[]> = {
  'Bordeaux Métropole': [
    'bordeaux', 'merignac', 'mérignac', 'pessac', 'talence', 'begles', 'bègles',
    'villenave', 'gradignan', 'eysines', 'bruges', 'le bouscat', 'blanquefort',
    'floirac', 'cenon', 'lormont', 'bassens', 'ambares', 'ambarès', 'carbon-blanc',
    'saint-medard-en-jalles', 'saint medard', 'parempuyre', 'le haillan',
    'artigues', 'bouliac', 'carignan', 'cestas', 'martignas', 'caudéran', 'cauderan',
    'le taillan', 'saint-aubin', 'saint aubin',
  ],
  'Pays Basque': [
    'bayonne', 'anglet', 'biarritz', 'hendaye', 'saint-jean-de-luz', 'saint jean de luz',
    'bidart', 'guethary', 'guéthary', 'ustaritz', 'cambo', 'hasparren',
  ],
  'Pau Agglo': [
    'pau', 'billere', 'billère', 'lescar', 'gelos', 'jurancon', 'jurançon', 'lons', 'bizanos',
  ],
  'La Rochelle': [
    'la rochelle', 'lagord', 'perigny', 'périgny', 'puilboreau', 'aytre', 'aytré', 'chatelaillon',
  ],
  'Limoges': [
    'limoges', 'couzeix', 'isle', 'panazol',
  ],
  'Poitiers': [
    'poitiers', 'chasseneuil', 'mignaloux', 'buxerolles', 'biard',
  ],
  'Périgueux': [
    'perigueux', 'périgueux', 'coulounieix', 'chancelade', 'trelissac', 'trélissac',
  ],
  'Angoulême': [
    'angouleme', 'angoulême', 'soyaux', 'gond-pontouvre',
  ],
  'Dax-Mont-de-Marsan': [
    'dax', 'mont-de-marsan', 'mont de marsan', 'saint-paul-les-dax',
  ],
};

export const SEARCH_ALIASES: Array<{ keywords: string[]; sectors: string[] }> = [
  { keywords: ['comptable', 'expertise comptable', 'comptabilité', 'fiscal', 'fiscaliste', 'bilan', 'tva'], sectors: ['Finance, Gestion, Comptabilité & Assurance'] },
  { keywords: ['banque', 'credit', 'crédit', 'pret', 'prêt', 'financement', 'investissement'], sectors: ['Finance, Gestion, Comptabilité & Assurance'] },
  { keywords: ['assurance', 'assureur', 'mutuelle', 'courtier', 'prevoyance', 'prévoyance'], sectors: ['Finance, Gestion, Comptabilité & Assurance'] },
  { keywords: ['avocat', 'droit', 'notaire', 'juriste', 'juridique', 'huissier', 'contentieux', 'contrat'], sectors: ['Juridique, Droit & Administratif'] },
  { keywords: ['coach', 'coaching', 'consultant', 'consulting', 'conseil', 'strategie', 'stratégie', 'formation', 'formateur', 'accompagnement'], sectors: ['Conseil, Formation, Coaching & Stratégie'] },
  { keywords: ['informatique', 'développeur', 'developer', 'logiciel', 'erp', 'crm', 'application', 'programmeur', 'code'], sectors: ['Informatique, IT, Data & Cybersécurité'] },
  { keywords: ['web', 'site web', 'webmaster', 'digital', 'seo', 'referencement', 'ecommerce', 'e-commerce'], sectors: ['Informatique, IT, Data & Cybersécurité', 'Communication, Marketing, Digital & Création'] },
  { keywords: ['cybersecurite', 'cybersécurité', 'securite informatique', 'data', 'intelligence artificielle', 'ia', 'cloud'], sectors: ['Informatique, IT, Data & Cybersécurité'] },
  { keywords: ['communication', 'marketing', 'publicite', 'publicité', 'media', 'medias', 'relations presse', 'attaché de presse'], sectors: ['Communication, Marketing, Digital & Création'] },
  { keywords: ['graphiste', 'graphisme', 'designer', 'design', 'illustrateur', 'photographe', 'videaste', 'vidéaste', 'motion'], sectors: ['Communication, Marketing, Digital & Création'] },
  { keywords: ['rh', 'ressources humaines', 'recrutement', 'recruteur', 'drh', 'qvt', 'paie', 'formation professionnelle'], sectors: ['Ressources Humaines, Recrutement & QVT'] },
  { keywords: ['immobilier', 'agent immobilier', 'agence immobiliere', 'promoteur', 'foncier', 'gestion locative', 'syndic'], sectors: ['Immobilier, Construction & Gestion de biens'] },
  { keywords: ['artisan', 'batiment', 'bâtiment', 'travaux', 'plombier', 'electricien', 'électricien', 'macon', 'maçon', 'menuisier', 'peintre', 'couvreur', 'chauffagiste', 'renovation', 'rénovation', 'carreleur'], sectors: ['Bâtiment, Travaux, Artisanat & Maintenance'] },
  { keywords: ['transport', 'logistique', 'chauffeur', 'livraison', 'transitaire', 'fret', 'demenagement', 'déménagement', 'mobilite', 'mobilité'], sectors: ['Transport, Logistique & Mobilité'] },
  { keywords: ['medecin', 'médecin', 'kine', 'kiné', 'infirmier', 'pharmacien', 'dentiste', 'opticien', 'dieteticien', 'psychologue', 'therapeute', 'osteopathe', 'ostéopathe'], sectors: ['Santé, Bien-être, Sport & Thérapies'] },
  { keywords: ['sport', 'coach sportif', 'fitness', 'yoga', 'pilates', 'bien-etre', 'bien-être', 'naturopathe'], sectors: ['Santé, Bien-être, Sport & Thérapies'] },
  { keywords: ['restaurant', 'restauration', 'traiteur', 'hotel', 'hôtel', 'hebergement', 'hébergement', 'tourisme', 'loisirs', 'gite', 'gîte'], sectors: ['Restauration, Hôtellerie, Tourisme & Loisirs'] },
  { keywords: ['energie', 'énergie', 'solaire', 'photovoltaique', 'photovoltaïque', 'environnement', 'rse', 'developpement durable', 'transition energetique'], sectors: ['Énergie, Environnement & RSE'] },
  { keywords: ['agriculture', 'agriculteur', 'viticulteur', 'vigne', 'vin', 'viticulture', 'maraicher', 'eleveur', 'éleveur', 'agroalimentaire'], sectors: ['Agriculture, Viticulture & Agroalimentaire'] },
  { keywords: ['commerce', 'commercant', 'commerçant', 'distribution', 'grossiste', 'import', 'export', 'retail'], sectors: ['Commerce, Vente, Distribution & E-commerce'] },
  { keywords: ['commercial', 'developpement commercial', 'développement commercial', 'business developer', 'apport affaires', 'apporteur'], sectors: ["Développement commercial & Apport d'affaires"] },
  { keywords: ['evenementiel', 'événementiel', 'animation', 'dj', 'audiovisuel', 'sono', 'organisateur', 'evenement', 'événement'], sectors: ['Événementiel, Audiovisuel & Animation'] },
  { keywords: ['industrie', 'industriel', 'ingenieur', 'ingénieur', 'production', 'fabrication', 'mecanique', 'mécanique', 'usine'], sectors: ['Industrie, Production & Ingénierie'] },
  { keywords: ['startup', 'innovation', 'tech', 'technologie', 'numerique', 'numérique', 'fintech', 'edtech', 'saas'], sectors: ['Startups, Innovation & Nouvelles technologies'] },
  { keywords: ['luxe', 'mode', 'beaute', 'beauté', 'cosmetique', 'cosmétique', 'bijoux', 'joaillier'], sectors: ['Luxe, Mode & Beauté'] },
  { keywords: ['art', 'artiste', 'culture', 'galerie', 'peintre', 'sculpteur', 'createur', 'créateur'], sectors: ['Art, Design, Création & Culture'] },
];

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function getExpandedCities(q: string): string[] {
  const nq = normalize(q);
  for (const cities of Object.values(METRO_AREAS)) {
    if (cities.some(c => normalize(c).includes(nq) || nq.includes(normalize(c)))) {
      return cities;
    }
  }
  return [];
}

export function getAliasedSectors(q: string): string[] {
  const nq = normalize(q);
  const matched: string[] = [];
  for (const { keywords, sectors } of SEARCH_ALIASES) {
    if (keywords.some(k => normalize(k).includes(nq) || nq.includes(normalize(k)))) {
      matched.push(...sectors);
    }
  }
  return matched;
}

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
