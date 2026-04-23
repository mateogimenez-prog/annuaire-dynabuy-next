'use client';

import { useState } from 'react';
import type { Member } from '@/types';
import { SECTORS } from '@/lib/utils';
import MemberCardVisual from './MemberCardVisual';
import PersonalQR from './PersonalQR';
import SuccessBox from './SuccessBox';

interface Fields {
  prenom: string; nom: string; entreprise: string;
  secteur: string; secteurLibre: string;
  ville: string; email: string; tel: string;
}

interface Errors {
  prenom?: string; nom?: string; entreprise?: string;
  secteur?: string; ville?: string; email?: string; tel?: string;
  global?: string;
}

export default function RegistrationForm() {
  const [fields, setFields] = useState<Fields>({
    prenom: '', nom: '', entreprise: '', secteur: '', secteurLibre: '',
    ville: '', email: '', tel: '',
  });
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
    const secteur = fields.secteur === 'Autres activités' ? fields.secteurLibre.trim() : fields.secteur;
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

    const secteur = fields.secteur === 'Autres activités' ? fields.secteurLibre.trim() : fields.secteur;

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: fields.prenom, nom: fields.nom, entreprise: fields.entreprise,
          secteur, ville: fields.ville, email: fields.email, tel: fields.tel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'EMAIL_EXISTS') setErrors({ email: 'Cet email est déjà dans l\'annuaire.' });
        else setErrors({ global: 'Une erreur est survenue. Réessayez.' });
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
        <MemberCardVisual member={member} />
        <PersonalQR member={member} />
      </>
    );
  }

  const err = (k: keyof Errors) => errors[k] ? <span className="error-msg">{errors[k]}</span> : null;

  return (
    <div className="form-card">
      <div className="form-title">Créer mon profil Dynabuy</div>
      {errors.global && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.9rem' }}>{errors.global}</div>}
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
              <option value="">– Choisir un secteur –</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {fields.secteur === 'Autres activités' && (
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
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={submitting}>
          {submitting ? 'Création en cours…' : 'Rejoindre l\'annuaire →'}
        </button>
      </form>
    </div>
  );
}
