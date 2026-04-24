'use client';

import { useState, useEffect } from 'react';
import type { Member } from '@/types';
import MemberGrid from './MemberGrid';

export default function AnnuaireGate({ members }: { members: Member[] }) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [engage, setEngage] = useState(false);
  const [error, setError] = useState('');
  const [engageError, setEngageError] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('annuaire_unlocked') === '1') setUnlocked(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let hasError = false;
    if (!code.trim()) { setError("Veuillez entrer votre code d'accès."); hasError = true; }
    if (!engage) { setEngageError('Vous devez cocher cette case pour accéder à l\'annuaire.'); hasError = true; }
    if (hasError) return;

    setChecking(true);
    setError('');
    setEngageError('');
    const res = await fetch('/api/auth/check-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim() }),
    });
    setChecking(false);
    if (res.ok) {
      sessionStorage.setItem('annuaire_unlocked', '1');
      setUnlocked(true);
    } else {
      setError('Code incorrect.');
    }
  }

  if (unlocked) return <MemberGrid initialMembers={members} />;

  return (
    <div style={{ maxWidth: 460, margin: '60px auto', padding: '40px 32px', background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
        <svg width="40" height="40" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.3rem', marginBottom: 8, color: 'var(--dark)' }}>Accès réservé</div>
      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.95rem', marginBottom: 24 }}>
        L&apos;annuaire est réservé aux adhérents Dynabuy.<br />Entrez votre code d&apos;accès pour continuer.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value); setError(''); }}
          placeholder="Code d'accès"
          style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${error ? '#fca5a5' : '#ddd'}`, borderRadius: 8, fontSize: '1rem', marginBottom: 4, boxSizing: 'border-box', textAlign: 'center', letterSpacing: 2 }}
          autoFocus
        />
        {error && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: 8 }}>{error}</div>}

        <div style={{ marginTop: 16, padding: '14px', background: '#f8fafc', borderRadius: 10, border: `1.5px solid ${engageError ? '#fca5a5' : '#e5e7eb'}` }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={engage}
              onChange={e => { setEngage(e.target.checked); setEngageError(''); }}
              style={{ marginTop: 3, width: 17, height: 17, flexShrink: 0, accentColor: 'var(--red)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--dark)', lineHeight: 1.5 }}>
              Je m&apos;engage à ne pas partager l&apos;accès à cet annuaire avec des personnes non adhérentes au réseau Dynabuy et à respecter les conditions d&apos;utilisation des données de ses membres.
            </span>
          </label>
          {engageError && <div style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: 8 }}>{engageError}</div>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} disabled={checking}>
          {checking ? 'Vérification…' : "Accéder à l'annuaire →"}
        </button>
      </form>
    </div>
  );
}
