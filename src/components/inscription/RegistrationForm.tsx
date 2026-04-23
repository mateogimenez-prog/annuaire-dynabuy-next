'use client';

import { useState } from 'react';
import type { Member } from '@/types';
import { SECTORS } from '@/lib/utils';
import SuccessBox from './SuccessBox';
import PersonalQR from './PersonalQR';
import MemberCardVisual from './MemberCardVisual';

interface Fields {
  prenom: string; nom: string; entreprise: string;
  secteur: string; secteurLibre: string;
  ville: string; email: string; tel: string;
}

interface Errors {
  prenom?: string; nom?: string; entreprise?: string;
  secteur?: string; ville?: string; email?: string; tel?: string;
}

export default function RegistrationForm() {
  const [fields, setFields] = useState<Fields>({ prenom: '', nom: '', entreprise: '', secteur: '', secteurLibre: '', ville: '', email: '', tel: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [member, setMember] = useState<Member | null>(null);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }));

  function validate(): Errors {
    const e: Errors = {};
    if (!fields.prenom.trim()) e.prenom = 'Prénom requis';
    if (!fields.nom.trim()) e.nom = 'Nom requis';
    if (!fields.entreprise.trim()) e.entreprise = 'Entreprise requise';
    const secteur = fields.secteur === 'Autre' ? fields.secteurLibre.trim() : fields.secteur;
    if (!secteur) e.secteur = "Secteur d'activité requis";
    if (!fields.ville.trim()) e.ville = 'Ville requise';
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Email invalide';
    if (!fields.tel.trim()) e.tel = 'Téléphone requis';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    const secteur = fields.secteur === 'Autre' ? fields.secteurLibre.trim() : fields.secteur;

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom: fields.prenom, nom: fields.nom, entreprise: fields.entreprise, secteur, ville: fields.ville, email: fields.email, tel: fields.tel }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'EMAIL_EXISTS') {
          setErrors({ email: 'Cet email est déjà inscrit dans l\'annuaire.' });
        } else {
          setErrors({ email: 'Une erreur est survenue. Réessayez.' });
        }
        return;
      }
      setMember(data);
    } finally {
      setSubmitting(false);
    }
  }

  if (member) {
    return (
      <>
        <SuccessBox prenom={member.prenom} />
        <PersonalQR member={member} />
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Votre carte adhérent</h3>
          <MemberCardVisual member={member} />
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Imprimer la carte
            </button>
          </div>
        </div>
      </>
    );
  }

  const err = (k: keyof Errors) => errors[k] ? <span className="error-msg">{errors[k]}</span> : null;

  return (
    <div className="form-card">
      <div className="form-title">Rejoindre l&apos;annuaire Dynabuy</div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className={`form-group${errors.prenom ? ' has-error' : ''}`}>
            <label>Prénom <span className="req">*</span></label>
            <input className="form-input" value={fields.prenom} onChange={set('prenom')} placeholder="Patricia" />
            {err('prenom')}
          </div>
          <div className={`form-group${errors.nom ? ' has-error' : ''}`}>
            <label>Nom <span className="req">*</span></label>
            <input className="form-input" value={fields.nom} onChange={set('nom')} placeholder="Dupont" />
            {err('nom')}
          </div>
          <div className={`form-group full${errors.entreprise ? ' has-error' : ''}`}>
            <label>Entreprise <span className="req">*</span></label>
            <input className="form-input" value={fields.entreprise} onChange={set('entreprise')} placeholder="Ma Société SARL" />
            {err('entreprise')}
          </div>
          <div className={`form-group full${errors.secteur ? ' has-error' : ''}`}>
            <label>Secteur d&apos;activité <span className="req">*</span></label>
            <select className="form-select" value={fields.secteur} onChange={set('secteur')}>
              <option value="">— Choisir un secteur —</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {fields.secteur === 'Autre' && (
              <input className="form-input" style={{ marginTop: '8px' }} value={fields.secteurLibre} onChange={set('secteurLibre')} placeholder="Précisez votre secteur…" />
            )}
            {err('secteur')}
          </div>
          <div className={`form-group${errors.ville ? ' has-error' : ''}`}>
            <label>Ville <span className="req">*</span></label>
            <input className="form-input" value={fields.ville} onChange={set('ville')} placeholder="Bordeaux" />
            {err('ville')}
          </div>
          <div className={`form-group${errors.email ? ' has-error' : ''}`}>
            <label>Email <span className="req">*</span></label>
            <input className="form-input" type="email" value={fields.email} onChange={set('email')} placeholder="vous@exemple.fr" />
            {err('email')}
          </div>
          <div className={`form-group full${errors.tel ? ' has-error' : ''}`}>
            <label>Téléphone <span className="req">*</span></label>
            <input className="form-input" type="tel" value={fields.tel} onChange={set('tel')} placeholder="06 12 34 56 78" />
            {err('tel')}
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
          {submitting ? 'Inscription en cours…' : "Rejoindre l'annuaire Dynabuy →"}
        </button>
      </form>
    </div>
  );
}
