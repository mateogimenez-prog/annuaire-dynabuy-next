'use client';

import { useState, useEffect } from 'react';
import type { Member } from '@/types';
import MemberGrid from './MemberGrid';

export default function AnnuaireGate({ members }: { members: Member[] }) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('annuaire_unlocked') === '1') setUnlocked(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    setError('');
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
    <div style={{ maxWidth: 400, margin: '60px auto', padding: '40px 32px', background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔒</div>
      <div style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: 8, color: 'var(--dark)' }}>Accès réservé</div>
      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: 24 }}>
        L&apos;annuaire est réservé aux adhérents Dynabuy.<br />Entrez votre code d&apos;accès pour continuer.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Code d'accès"
          style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${error ? '#fca5a5' : '#ddd'}`, borderRadius: 8, fontSize: '1rem', marginBottom: 12, boxSizing: 'border-box', textAlign: 'center', letterSpacing: 2 }}
          autoFocus
        />
        {error && <div style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: 10 }}>{error}</div>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={checking}>
          {checking ? 'Vérification…' : 'Accéder à l\'annuaire →'}
        </button>
      </form>
    </div>
  );
}
