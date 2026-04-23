'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Member } from '@/types';
import { SECTORS } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { getInitials, getAvatarColor, generateVCard } from '@/lib/utils';
import QRCanvas from '@/components/ui/QRCanvas';
import MemberCardVisual from '@/components/inscription/MemberCardVisual';

type Tab = 'profil' | 'qr' | 'carte';

export default function ProfilePanel() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('profil');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [form, setForm] = useState<Partial<Member>>({});

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/connexion'); return; }

      const { data } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (data) { setMember(data); setForm(data); }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    const res = await fetch(`/api/members/${member.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setMember(updated);
      setForm(updated);
      setEditing(false);
      setSaveMsg('Profil mis à jour !');
      setTimeout(() => setSaveMsg(''), 3000);
    }
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 16px', color: 'var(--muted)' }}>Chargement…</div>;

  if (!member) return (
    <div style={{ textAlign: 'center', padding: '60px 16px' }}>
      <div style={{ fontSize: '1.1rem', marginBottom: 16 }}>Aucun profil trouvé pour votre compte.</div>
      <a href="/inscription" className="btn btn-primary">Créer mon profil</a>
    </div>
  );

  const initials = getInitials(member.prenom, member.nom);
  const color = getAvatarColor(member.secteur);
  const set = (k: keyof Member) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>

      {/* Header profil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{member.prenom} {member.nom}</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{member.entreprise} · {member.ville}</div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline btn-sm">Déconnexion</button>
      </div>

      {saveMsg && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px 16px', borderRadius: 8, marginBottom: 20 }}>{saveMsg}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '2px solid #e5e7eb' }}>
        {(['profil', 'qr', 'carte'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: tab === t ? 700 : 400, color: tab === t ? 'var(--red)' : 'var(--muted)', borderBottom: tab === t ? '2px solid var(--red)' : '2px solid transparent', marginBottom: -2, fontSize: '0.95rem' }}>
            {t === 'profil' ? 'Mes infos' : t === 'qr' ? 'Mon QR Code' : 'Ma carte'}
          </button>
        ))}
      </div>

      {/* TAB PROFIL */}
      {tab === 'profil' && (
        <div className="card" style={{ padding: 28 }}>
          {!editing ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {[
                  ['Prénom', member.prenom], ['Nom', member.nom],
                  ['Entreprise', member.entreprise], ['Secteur', member.secteur],
                  ['Ville', member.ville], ['Téléphone', member.tel],
                  ['Email', member.email],
                ].map(([label, value]) => (
                  <div key={label} style={{ gridColumn: label === 'Email' || label === 'Secteur' || label === 'Entreprise' ? '1 / -1' : 'auto' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>Modifier mon profil</button>
            </>
          ) : (
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Prénom</label>
                  <input className="form-input" value={form.prenom || ''} onChange={set('prenom')} required />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input className="form-input" value={form.nom || ''} onChange={set('nom')} required />
                </div>
                <div className="form-group full">
                  <label>Entreprise</label>
                  <input className="form-input" value={form.entreprise || ''} onChange={set('entreprise')} required />
                </div>
                <div className="form-group full">
                  <label>Secteur</label>
                  <select className="form-select" value={form.secteur || ''} onChange={set('secteur')}>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ville</label>
                  <input className="form-input" value={form.ville || ''} onChange={set('ville')} required />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input className="form-input" value={form.tel || ''} onChange={set('tel')} required />
                </div>
                <div className="form-group full">
                  <label>Email</label>
                  <input className="form-input" type="email" value={form.email || ''} onChange={set('email')} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditing(false); setForm(member); }}>Annuler</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB QR */}
      {tab === 'qr' && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ background: 'white', display: 'inline-block', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: 20 }}>
            <QRCanvas value={generateVCard(member)} size={260} />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Scannez ce code pour ajouter mes coordonnées dans vos contacts</p>
          <div style={{ marginTop: 12, fontSize: '0.88rem', color: 'var(--muted)' }}>
            <div>📧 {member.email}</div>
            <div>📞 {member.tel}</div>
          </div>
        </div>
      )}

      {/* TAB CARTE */}
      {tab === 'carte' && (
        <div>
          <MemberCardVisual member={member} />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Imprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
