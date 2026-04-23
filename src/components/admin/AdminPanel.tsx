'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Meeting, Member } from '@/types';

const FORMATS = ['Présentiel', 'Repas', 'Soirée', 'Évènementiel', 'After Work'];

type AdminTab = 'reunions' | 'membres';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<AdminTab>('membres');

  // Meetings state
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loadingMeet, setLoadingMeet] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [msgMeet, setMsgMeet] = useState('');
  const [form, setForm] = useState({
    titre: '', date: '', heure: '09h00', fin: '11h30',
    lieu: '', format: 'Présentiel', animateur: '', prix: '', lien: '',
  });

  // Members state
  const [members, setMembers] = useState<Member[]>([]);
  const [msgMember, setMsgMember] = useState('');
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState({ prenom: '', nom: '', entreprise: '', secteur: '', ville: '', email: '', tel: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-admin-password': password,
  }), [password]);

  const loadMeetings = useCallback(async () => {
    const res = await fetch('/api/reunions');
    if (res.ok) setMeetings(await res.json());
  }, []);

  const loadMembers = useCallback(async () => {
    const res = await fetch('/api/admin/members', { headers: headers() });
    if (res.ok) setMembers(await res.json());
  }, [headers]);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) { setPassword(saved); setAuth(true); }
  }, []);

  useEffect(() => {
    if (auth) { loadMeetings(); loadMembers(); }
  }, [auth, loadMeetings, loadMembers]);

  function login() {
    if (!password.trim()) return;
    fetch('/api/admin/members', { headers: { 'Content-Type': 'application/json', 'x-admin-password': password } })
      .then(r => {
        if (r.status === 401) { setAuthError('Mot de passe incorrect'); return; }
        sessionStorage.setItem('admin_pw', password);
        setAuth(true);
        setAuthError('');
      });
  }

  async function handleDeleteMeeting(id: string) {
    if (!confirm('Supprimer cette réunion ?')) return;
    await fetch('/api/admin/meetings', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id }) });
    await loadMeetings();
  }

  function openEdit(m: Member) {
    setEditMember(m);
    setEditForm({ prenom: m.prenom, nom: m.nom, entreprise: m.entreprise, secteur: m.secteur, ville: m.ville, email: m.email, tel: m.tel });
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editMember) return;
    setSavingEdit(true);
    const res = await fetch(`/api/admin/members/${editMember.id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(editForm),
    });
    setSavingEdit(false);
    if (res.ok) {
      setMsgMember('Membre mis à jour.');
      setTimeout(() => setMsgMember(''), 3000);
      setEditMember(null);
      await loadMembers();
    } else {
      setMsgMember('Erreur lors de la mise à jour.');
    }
  }

  async function handleDeleteMember(id: string, name: string) {
    if (!confirm(`Supprimer ${name} de l'annuaire ?`)) return;
    const res = await fetch('/api/admin/members', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id }) });
    if (res.ok) {
      setMsgMember(`${name} supprimé.`);
      setTimeout(() => setMsgMember(''), 3000);
      await loadMembers();
    }
  }

  async function handleAddMeeting(e: React.FormEvent) {
    e.preventDefault();
    setLoadingMeet(true);
    const res = await fetch('/api/admin/meetings', { method: 'POST', headers: headers(), body: JSON.stringify(form) });
    if (res.ok) {
      setMsgMeet('Réunion ajoutée !');
      setForm({ titre: '', date: '', heure: '09h00', fin: '11h30', lieu: '', format: 'Présentiel', animateur: '', prix: '', lien: '' });
      await loadMeetings();
    } else {
      const d = await res.json();
      setMsgMeet('Erreur : ' + d.error);
    }
    setLoadingMeet(false);
    setTimeout(() => setMsgMeet(''), 3000);
  }

  async function handleSeed() {
    if (!confirm('Importer les 16 réunions existantes dans Supabase ?')) return;
    setSeeding(true);
    const res = await fetch('/api/admin/seed', { method: 'POST', headers: headers() });
    const d = await res.json();
    setMsgMeet(res.ok ? `✓ ${d.count} réunions importées` : 'Erreur : ' + d.error);
    setSeeding(false);
    await loadMeetings();
    setTimeout(() => setMsgMeet(''), 4000);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.6rem' }}>Administration</h1>
        <button onClick={() => { sessionStorage.removeItem('admin_pw'); setAuth(false); }} className="btn btn-outline btn-sm">Déconnexion</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '2px solid #e5e7eb' }}>
        {(['membres', 'reunions'] as AdminTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 24px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: tab === t ? 700 : 400, color: tab === t ? 'var(--red)' : 'var(--muted)', borderBottom: tab === t ? '2px solid var(--red)' : '2px solid transparent', marginBottom: -2, fontSize: '0.95rem' }}>
            {t === 'membres' ? `Membres (${members.length})` : `Réunions (${meetings.length})`}
          </button>
        ))}
      </div>

      {/* ── MEMBRES ── */}
      {tab === 'membres' && (
        <>
          {msgMember && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 16px', borderRadius: 8, marginBottom: 20 }}>{msgMember}</div>}
          {members.length === 0 ? (
            <div className="empty-state"><p>Aucun membre dans l&apos;annuaire.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {members.map(m => (
                <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.prenom} {m.nom}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{m.entreprise} · {m.ville} · {m.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => openEdit(m)}
                      style={{ background: 'none', border: '1.5px solid #93c5fd', color: '#2563eb', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteMember(m.id, `${m.prenom} ${m.nom}`)}
                      style={{ background: 'none', border: '1.5px solid #fca5a5', color: '#dc2626', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── RÉUNIONS ── */}
      {tab === 'reunions' && (
        <>
          {msgMeet && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px 16px', borderRadius: 8, marginBottom: 20 }}>{msgMeet}</div>}

          <div className="card" style={{ marginBottom: 28, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700 }}>Ajouter une réunion</h2>
              <button onClick={handleSeed} disabled={seeding} className="btn btn-outline btn-sm">
                {seeding ? 'Import…' : 'Importer les 16 existantes'}
              </button>
            </div>
            <form onSubmit={handleAddMeeting}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Titre *</label>
                  <input className="form-input" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} placeholder="Rencontre dirigeants – Bordeaux" required />
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
              <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }} disabled={loadingMeet}>
                {loadingMeet ? 'Ajout…' : '+ Ajouter la réunion'}
              </button>
            </form>
          </div>

          <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Réunions ({meetings.length})</h2>
          {meetings.length === 0 ? (
            <div className="empty-state"><p>Aucune réunion. Cliquez sur &quot;Importer les 16 existantes&quot; pour commencer.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {meetings.map(m => (
                <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.titre}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{m.date} · {m.heure} · {m.lieu}</div>
                  </div>
                  <button onClick={() => handleDeleteMeeting(m.id)} style={{ background: 'none', border: '1.5px solid #fca5a5', color: '#dc2626', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* MODALE ÉDITION MEMBRE */}
      {editMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => { if (e.target === e.currentTarget) setEditMember(null); }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 520, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>Modifier le membre</h2>
              <button onClick={() => setEditMember(null)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#999' }}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {([
                  { label: 'Prénom', key: 'prenom', full: false },
                  { label: 'Nom', key: 'nom', full: false },
                  { label: 'Entreprise', key: 'entreprise', full: true },
                  { label: "Secteur d'activité", key: 'secteur', full: true },
                  { label: 'Ville', key: 'ville', full: false },
                  { label: 'Email', key: 'email', full: false },
                  { label: 'Téléphone', key: 'tel', full: true },
                ] as { label: string; key: keyof typeof editForm; full: boolean }[]).map(({ label, key, full }) => (
                  <div key={key} style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
                    <label style={{ fontSize: '0.83rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
                    <input
                      className="form-input"
                      value={editForm[key]}
                      onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={savingEdit}>
                  {savingEdit ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button type="button" onClick={() => setEditMember(null)} className="btn btn-outline">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
