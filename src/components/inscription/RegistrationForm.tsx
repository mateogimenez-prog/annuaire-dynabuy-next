'use client';

import { useState } from 'react';
import type { Member } from '@/types';
import { SECTORS } from '@/lib/utils';
import MemberCardVisual from './MemberCardVisual';
import PersonalQR from './PersonalQR';
import SuccessBox from './SuccessBox';

const MAX_WORDS = 60;
function countWords(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

interface Fields {
  prenom: string; nom: string; entreprise: string;
  secteur: string; secteurLibre: string;
  ville: string; email: string; tel: string;
  code: string; bio: string;
}

interface Errors {
  prenom?: string; nom?: string; entreprise?: string;
  secteur?: string; ville?: string; email?: string; tel?: string;
  code?: string; rgpd?: string; global?: string;
}

export default function RegistrationForm() {
  const [fields, setFields] = useState<Fields>({
    prenom: '', nom: '', entreprise: '', secteur: '', secteurLibre: '',
    ville: '', email: '', tel: '', code: '', bio: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [rgpd, setRgpd] = useState(false);
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
    if (!fields.code.trim()) e.code = "Code d'accès requis";
    if (!rgpd) e.rgpd = 'Vous devez accepter les conditions pour vous inscrire';
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
          code: fields.code.trim(),
          ...(fields.bio.trim() ? { bio: fields.bio.trim() } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'INVALID_CODE') setErrors({ code: "Code d'accès incorrect." });
        else if (data.error === 'EMAIL_EXISTS') setErrors({ email: 'Cet email est déjà dans l\'annuaire.' });
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
          <div className="form-group full">
            <label>Présentation <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.85rem' }}>(facultatif)</span></label>
            <textarea
              className="form-input"
              style={{ resize: 'vertical', minHeight: 100, fontFamily: 'inherit', fontSize: '0.95rem' }}
              value={fields.bio}
              onChange={e => {
                const val = e.target.value;
                if (countWords(val) <= MAX_WORDS) setFields(f => ({ ...f, bio: val }));
              }}
              placeholder="Décrivez votre activité, votre expertise, ce que vous apportez au réseau…"
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: countWords(fields.bio) >= MAX_WORDS ? 'var(--red)' : 'var(--muted)', marginTop: 4 }}>
              {countWords(fields.bio)}/{MAX_WORDS} mots
            </div>
          </div>
          <div className={`form-group full${errors.code ? ' has-error' : ''}`}>
            <label>Code d&apos;accès <span className="req">*</span></label>
            <input className="form-input" value={fields.code} onChange={set('code')} placeholder="Code fourni par Dynabuy" />
            {err('code')}
          </div>
        </div>

        <div style={{ marginTop: 20, padding: '16px', background: '#f8fafc', borderRadius: 10, border: `1.5px solid ${errors.rgpd ? '#fca5a5' : '#e5e7eb'}` }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={rgpd}
              onChange={e => setRgpd(e.target.checked)}
              style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0, accentColor: 'var(--red)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.88rem', color: 'var(--dark)', lineHeight: 1.5 }}>
              J&apos;accepte que mes informations professionnelles (nom, entreprise, secteur, ville, email, téléphone) soient partagées <strong>uniquement avec les adhérents Dynabuy</strong>, dans le but de développer mon activité et de favoriser les échanges commerciaux au sein du réseau. Conformément au RGPD, je peux demander la suppression de mes données à tout moment en contactant l&apos;administrateur.
            </span>
          </label>
          {errors.rgpd && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: 8 }}>{errors.rgpd}</div>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} disabled={submitting}>
          {submitting ? 'Création en cours…' : "Rejoindre l'annuaire →"}
        </button>
      </form>
    </div>
  );
}
