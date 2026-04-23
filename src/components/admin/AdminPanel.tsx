'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Meeting } from '@/types';

const FORMATS = ['Présentiel', 'Repas', 'Soirée', 'Évènementiel', 'After Work'];

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const [authError, setAuthError] = useState('');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    titre: '', date: '', heure: '09h00', fin: '11h30',
    lieu: '', format: 'Présentiel', animateur: '', prix: '', lien: '',
  });

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': password };

  const loadMeetings = useCallback(async () => {
    const res = await fetch('/api/reunions');
    if (res.ok) setMeetings(await res.json());
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) { setPassword(saved); setAuth(true); }
  }, []);

  useEffect(() => {
    if (auth) loadMeetings();
  }, [auth, loadMeetings]);

  function login() {
    if (!password.trim()) return;
    fetch('/api/admin/meetings', { method: 'POST', headers, body: JSON.stringify({ titre: '_test', date: '2099-01-01', heure: '00h00', lieu: '_', lien: '_' }) })
      .then(r => {
        if (r.status === 401) { setAuthError('Mot de passe incorrect'); return; }
        sessionStorage.setItem('admin_pw', password);
        setAuth(true);
        setAuthError('');
      });
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette réunion ?')) return;
    await fetch('/api/admin/meetings', { method: 'DELETE', headers, body: JSON.stringify({ id }) });
    await loadMeetings();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/meetings', { method: 'POST', headers, body: JSON.stringify(form) });
    if (res.ok) {
      setMsg('Réunion ajoutée !');
      setForm({ titre: '', date: '', heure: '09h00', fin: '11h30', lieu: '', format: 'Présentiel', animateur: '', prix: '', lien: '' });
      await loadMeetings();
    } else {
      const d = await res.json();
      setMsg('Erreur : ' + d.error);
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function handleSeed() {
    if (!confirm('Importer les 16 réunions existantes dans Supabase ?')) return;
    setSeeding(true);
    const res = await fetch('/api/admin/seed', { method: 'POST', headers });
    const d = await res.json();
    setMsg(res.ok ? `✓ ${d.count} réunions importées` : 'Erreur : ' + d.error);
    setSeeding(false);
    await loadMeetings();
    setTimeout(() => setMsg(''), 4000);
  }

  if (!auth) return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: '32px', background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24, color: 'var(--red)' }}>Admin Dynabuy</div>
      <input
        type="password" placeholder="Mot de passe" value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && login()}
        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: '1rem', marginBottom: 12, boxSizing: 'border-box' }}
      />
      {authError && <div style={{ color: 'var(--red)', fontSize: '0.9rem', marginBottom: 8 }}>{authError}</div>}
      <button onClick={login} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Connexion</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.6rem' }}>Gestion des réunions</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSeed} disabled={seeding} className="btn btn-outline btn-sm">
            {seeding ? 'Import…' : 'Importer les réunions existantes'}
          </button>
          <button onClick={() => { sessionStorage.removeItem('admin_pw'); setAuth(false); }} className="btn btn-secondary btn-sm">Déconnexion</button>
        </div>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px 16px', borderRadius: 8, marginBottom: 24 }}>{msg}</div>}

      {/* FORM */}
      <div className="card" style={{ marginBottom: 32, padding: 24 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Ajouter une réunion</h2>
        <form onSubmit={handleAdd}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Titre *</label>
              <input className="form-input" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} placeholder="Rencontre réseau – Bordeaux" required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Date *</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Lieu *</label>
              <input className="form-input" value={form.lieu} onChange={e => setForm(f => ({ ...f, lieu: e.target.value }))} placeholder="Bordeaux" required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Début</label>
              <input className="form-input" value={form.heure} onChange={e => setForm(f => ({ ...f, heure: e.target.value }))} placeholder="09h00" />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Fin</label>
              <input className="form-input" value={form.fin} onChange={e => setForm(f => ({ ...f, fin: e.target.value }))} placeholder="11h30" />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Format</label>
              <select className="form-select" value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}>
                {FORMATS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Animateur</label>
              <input className="form-input" value={form.animateur} onChange={e => setForm(f => ({ ...f, animateur: e.target.value }))} placeholder="Michaël GIMENEZ" />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Prix</label>
              <input className="form-input" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} placeholder="10,00 € HT" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Lien d&apos;inscription *</label>
              <input className="form-input" value={form.lien} onChange={e => setForm(f => ({ ...f, lien: e.target.value }))} placeholder="https://www.rencontres-dirigeants.com/…" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }} disabled={loading}>
            {loading ? 'Ajout…' : '+ Ajouter la réunion'}
          </button>
        </form>
      </div>

      {/* LIST */}
      <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Réunions en base ({meetings.length})</h2>
      {meetings.length === 0 ? (
        <div className="empty-state"><p>Aucune réunion. Cliquez sur &quot;Importer les réunions existantes&quot; pour commencer.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {meetings.map(m => (
            <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{m.titre}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{m.date} · {m.heure} · {m.lieu}</div>
              </div>
              <button onClick={() => handleDelete(m.id)} style={{ background: 'none', border: '1.5px solid #fca5a5', color: '#dc2626', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
