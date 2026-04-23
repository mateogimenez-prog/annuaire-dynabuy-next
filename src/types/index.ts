export interface Member {
  id: string;
  user_id?: string;
  prenom: string;
  nom: string;
  entreprise: string;
  secteur: string;
  ville: string;
  email: string;
  tel: string;
  date: string;
  created_at?: string;
}

export interface Meeting {
  id: string;
  titre: string;
  date: string;
  heure: string;
  fin: string;
  lieu: string;
  format: string;
  animateur: string;
  prix: string;
  lien: string;
}
