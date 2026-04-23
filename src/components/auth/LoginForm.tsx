'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError('Email ou mot de passe incorrect.');
      return;
    }
    router.push('/profil');
    router.refresh();
  }

  return (
    <div className="form-card">
      <div className="form-title">Se connecter</div>
      <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: '0.9rem' }}>
        Pas encore de compte ? <a href="/inscription" style={{ color: 'var(--red)', fontWeight: 600 }}>Créer mon profil</a>
      </p>
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.9rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.fr" required />
        </div>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Mot de passe</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Votre mot de passe" required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter →'}
        </button>
      </form>
    </div>
  );
}
