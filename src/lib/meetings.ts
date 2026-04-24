import type { Meeting } from '@/types';
import { supabase } from '@/lib/supabase';

export const SAMPLE_MEETINGS: Meeting[] = [
  { id: 'm1', titre: 'Rencontre dirigeants – Mont-de-Marsan', date: '2026-04-24', heure: '09h00', fin: '11h30', lieu: 'Mont-de-Marsan', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '13,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35534' },
  { id: 'm2', titre: 'Déjeuner réseau – Libourne', date: '2026-04-29', heure: '12h30', fin: '14h00', lieu: 'Libourne', adresse: 'Le Bistrot Maritime – 12 Quai Suchet, 33500 Libourne', format: 'Repas', animateur: 'Tanguy BARICAULT', prix: '~20 € (sur place)', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35696' },
  { id: 'm3', titre: 'Rencontre dirigeants – Bordeaux', date: '2026-04-30', heure: '15h00', fin: '17h30', lieu: 'Bordeaux', adresse: 'Golf Blue Green de Bordeaux Lac – Av de Pernon, 33300 Bordeaux', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '11,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35429' },
  { id: 'm4', titre: 'Rencontre dirigeants – Lons', date: '2026-05-05', heure: '09h00', fin: '11h30', lieu: 'Lons', adresse: 'Maison Paon – 55 Boulevard Charles de Gaulle, 64140 Lons', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '10,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35384' },
  { id: 'm5', titre: 'Rencontre dirigeants – Bordeaux', date: '2026-05-05', heure: '14h00', fin: '16h30', lieu: 'Bordeaux', adresse: 'Le Palais Gallien Hôtel & Spa – 144 Rue Abbé de l\'Épée, 33300 Bordeaux', format: 'Présentiel', animateur: 'Patricia GRATAS', prix: '12,50 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35603' },
  { id: 'm6', titre: 'Rencontre dirigeants – Dax', date: '2026-05-06', heure: '09h00', fin: '11h30', lieu: 'Dax', adresse: 'Pulseo – 1 Avenue de la Gare, 40100 Dax', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '8,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35510' },
  { id: 'm7', titre: 'Rencontre dirigeants – Arcachon', date: '2026-05-12', heure: '09h00', fin: '11h30', lieu: 'Arcachon', adresse: 'Hôtel Les Vagues – 9 Boulevard de l\'Océan, 33120 Arcachon', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '10,41 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35489' },
  { id: 'm8', titre: 'Déjeuner réseau – Blanquefort', date: '2026-05-20', heure: '12h30', fin: '14h00', lieu: 'Blanquefort', adresse: 'Côté Jardins – 105 Av du 11 Novembre, 33290 Blanquefort', format: 'Repas', animateur: 'Patricia GRATAS', prix: '~20 € (sur place)', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35636' },
  { id: 'm9', titre: 'Rencontre dirigeants – Mont-de-Marsan', date: '2026-05-21', heure: '14h00', fin: '16h30', lieu: 'Mont-de-Marsan', adresse: 'Maison d\'Augustin – 55 Rue Augustin Lesbazeilles, 40000 Mont-de-Marsan', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '13,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35537' },
  { id: 'm10', titre: 'Rencontre dirigeants – Biarritz', date: '2026-05-22', heure: '09h00', fin: '11h30', lieu: 'Biarritz', adresse: 'Mer et Golf Eugénie Biarritz – 56 Rue de Madrid, 64200 Biarritz', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '10,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35570' },
  { id: 'm11', titre: 'Rencontre dirigeants – Bordeaux', date: '2026-05-28', heure: '15h00', fin: '17h30', lieu: 'Bordeaux', adresse: 'Golf Blue Green de Bordeaux Lac – Av de Pernon, 33300 Bordeaux', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '11,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35432' },
  { id: 'm12', titre: 'Soirée réseau – Bordeaux', date: '2026-06-02', heure: '18h00', fin: '20h30', lieu: 'Bordeaux', adresse: 'Mama Shelter – 19 Rue Poquelin Molière, 33000 Bordeaux', format: 'Soirée', animateur: 'Patricia GRATAS', prix: '25,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35606' },
  { id: 'm13', titre: 'Rencontre dirigeants – Mont-de-Marsan', date: '2026-06-04', heure: '09h00', fin: '11h30', lieu: 'Mont-de-Marsan', adresse: 'La Maison d\'Augustin – 55 Rue Augustin Lesbazeilles, 40000 Mont-de-Marsan', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '13,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35513' },
  { id: 'm14', titre: 'Événement réseau – Monein', date: '2026-06-05', heure: '10h00', fin: '13h30', lieu: 'Monein', adresse: 'Domaine de Bayard – 30 Chemin Pierrette, 64360 Monein', format: 'Évènementiel', animateur: 'Michaël GIMENEZ', prix: '39,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35390' },
  { id: 'm15', titre: 'Rencontre dirigeants – Saint-Émilion', date: '2026-06-11', heure: '09h00', fin: '11h30', lieu: 'Saint-Émilion', adresse: 'Le Grand Barrail – 3343 Route de Libourne, 33330 Saint-Émilion', format: 'Présentiel', animateur: 'Tanguy BARICAULT', prix: '16,00 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35669' },
  { id: 'm16', titre: 'Rencontre dirigeants – Hendaye', date: '2026-06-12', heure: '09h00', fin: '11h30', lieu: 'Hendaye', adresse: 'Bi Ur Arte – 83 Boulevard de la Mer, 64700 Hendaye', format: 'Présentiel', animateur: 'Michaël GIMENEZ', prix: '8,50 € HT', lien: 'https://www.rencontres-dirigeants.com/nos-rencontres/35573' },
];

export async function getMeetings(): Promise<Meeting[]> {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .order('date', { ascending: true });

  if (error || !data || data.length === 0) return SAMPLE_MEETINGS;
  return data as Meeting[];
}
