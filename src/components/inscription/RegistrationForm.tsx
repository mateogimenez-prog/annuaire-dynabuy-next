'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Member } from '@/types';
import { SECTORS } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Fields {
  prenom: string; nom: string; entreprise: string;
  secteur: string; secteurLibre: string;
  ville: string; email: string; tel: string;
  password: string; passwordConfirm: string;
}

interface Errors {
  prenom?: string; nom?: string; entreprise?: string;
  secteur?: string; ville?: string; email?: string; tel?: string;
  password?: string; passwordConfirm?: string; global?: string;
}

export default function RegistrationForm() {
  const router = useRouter();
  const [fields, setFields] = useState<Fields>({
    prenom: '', nom: '', entreprise: '', secteur: '', secteurLibre: '',
    ville: '', email: '', tel: '', password: '', passwordConfirm: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

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
    if (!fields.password || fields.password.length < 6) e.password = 'Mot de passe : 6 caractères minimum';
    if (fields.password !== fields.passwordConfirm) e.passwordConfirm = 'Les mots de passe ne correspondent pas';
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
      // 1. Créer le compte (sans email de confirmation)
      const authRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fields.email.trim().toLowerCase(), password: fields.password }),
      });
      const authData = await authRes.json();

      if (!authRes.ok) {
        if (authData.error === 'EMAIL_EXISTS') {
          setErrors({ email: 'Cet email est déjà utilisé. Connectez-vous.' });
        } else {
          setErrors({ global: authData.error || 'Erreur lors de la création du compte.' });
        }
        return;
      }

      const user_id = authData.user_id;

      // 2. Connecter automatiquement l'utilisateur
      await supabase.auth.signInWithPassword({
        email: fields.email.trim().toLowerCase(),
        password: fields.password,
      });

      // 2. Créer le profil membre
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: fields.prenom, nom: fields.nom, entreprise: fields.entreprise,
          secteur, ville: fields.ville, email: fields.email, tel: fields.tel,
          user_id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'EMAIL_EXISTS') setErrors({ email: 'Cet email est déjà dans l\'annuaire.' });
        else setErrors({ global: 'Une erreur est survenue. Réessayez.' });
        return;
      }

      // 3. Rediriger vers le profil
      router.push('/profil');
    } finally {
      setSubmitting(false);
    }
  }

  const err = (k: keyof Errors) => errors[k] ? <span className="error-msg">{errors[k]}</span> : null;

  return (
    <div className="form-card">
      <div className="form-title">Créer mon profil Dynabuy</div>
      <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: '0.9rem' }}>
        Déjà inscrit ? <a href="/connexion" style={{ color: 'var(--red)', fontWeight: 600 }}>Se connecter</a>
      </p>
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
          <div className={`form-group${errors.password ? ' has-error' : ''}`}>
            <label>Mot de passe <span className="req">*</span></label>
            <input className="form-input" type="password" value={fields.password} onChange={set('password')} placeholder="6 caractères minimum" />
            {err('password')}
          </div>
          <div className={`form-group${errors.passwordConfirm ? ' has-error' : ''}`}>
            <label>Confirmer le mot de passe <span className="req">*</span></label>
            <input className="form-input" type="password" value={fields.passwordConfirm} onChange={set('passwordConfirm')} placeholder="Répétez le mot de passe" />
            {err('passwordConfirm')}
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={submitting}>
          {submitting ? 'Création en cours…' : 'Créer mon profil →'}
        </button>
      </form>
    </div>
  );
}
