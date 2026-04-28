'use client';

import { useState, useMemo } from 'react';
import type { Member } from '@/types';
import { getInitials, getAvatarColor, generateVCard, getExpandedCities, getAliasedSectors } from '@/lib/utils';
import QRCanvas from '@/components/ui/QRCanvas';

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function MemberCardVisualInner({ member }: { member: Member }) {
  const initials = getInitials(member.prenom, member.nom);
  const color = getAvatarColor(member.secteur);
  return (
    <div className="member-card-visual">
      <div className="card-top">
        <div className="card-top-logo">
          <div className="logo-icon">D</div>
          Dynabuy Réseau
        </div>
        <div className="card-network-label">Carte Adhérent</div>
      </div>
      <div className="card-body">
        <div className="card-info">
          <div className="card-avatar" style={{ background: color }}>{initials}</div>
          <div className="card-name">{member.prenom} {member.nom.toUpperCase()}</div>
          <div className="card-company">{member.entreprise}</div>
          <div className="card-sector"><span className="sector-badge">{member.secteur}</span></div>
          <div className="card-contacts">
            <div className="card-contact-row">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {member.ville}
            </div>
            <div className="card-contact-row">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {member.email}
            </div>
            <div className="card-contact-row">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.128.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.61 5.61l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.572 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
              {member.tel}
            </div>
          </div>
        </div>
        <div className="card-qr">
          <QRCanvas value={generateVCard(member)} size={110} />
          <div className="card-qr-label">Scannez pour<br />ajouter le contact</div>
        </div>
      </div>
      <div className="card-footer">
        Membre du réseau <span>Dynabuy</span> – dynabuy.fr
      </div>
    </div>
  );
}

function CardModal({ member, onClose }: { member: Member; onClose: () => void }) {
  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal modal-wide">
        <div className="modal-header">
          <div className="modal-title">Carte adhérent</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <MemberCardVisualInner member={member} />
        <div className="modal-actions">
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Imprimer la carte
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

function QRModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const color = getAvatarColor(member.secteur);
  const initials = getInitials(member.prenom, member.nom);
  return (
    <div className="modal-overlay open" style={{ background: 'rgba(10,10,10,0.92)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ textAlign: 'center', maxWidth: '340px', width: '100%', padding: '32px 24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '-8px', right: 0, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: '0 auto 14px' }}>{initials}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{member.prenom} {member.nom.toUpperCase()}</div>
        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', marginBottom: '20px' }}>{member.entreprise} · {member.ville}</div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', display: 'inline-block', marginBottom: '16px' }}>
          <QRCanvas value={generateVCard(member)} size={240} />
        </div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.5 }}>
          <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M14 17h3M17 14v3M20 14h.01M20 20h.01"/></svg>
          Scannez ce code pour ajouter<br />mes coordonnées dans vos contacts
        </div>
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>{member.email}</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.128.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.61 5.61l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.572 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
            <span>{member.tel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemberGrid({ initialMembers }: { initialMembers: Member[] }) {
  const [query, setQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cardMember, setCardMember] = useState<Member | null>(null);
  const [qrMember, setQrMember] = useState<Member | null>(null);

  const availableSectors = useMemo(
    () => [...new Set(initialMembers.map(m => m.secteur))].sort(),
    [initialMembers]
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    const nq = normalize(q);
    const expandedCities = q ? getExpandedCities(q) : [];
    const aliasedSectors = q ? getAliasedSectors(q) : [];

    return initialMembers.filter(m => {
      if (selectedSectors.size > 0 && !selectedSectors.has(m.secteur)) return false;
      if (!q) return true;

      const cityNorm = normalize(m.ville);
      const metroMatch = expandedCities.length > 0 &&
        expandedCities.some(c => normalize(c).includes(cityNorm) || cityNorm.includes(normalize(c)));

      const aliasMatch = aliasedSectors.length > 0 &&
        aliasedSectors.some(s => m.secteur.includes(s));

      return (
        normalize(m.prenom).includes(nq) ||
        normalize(m.nom).includes(nq) ||
        normalize(m.entreprise).includes(nq) ||
        cityNorm.includes(nq) ||
        normalize(m.secteur).includes(nq) ||
        (m.bio && normalize(m.bio).includes(nq)) ||
        metroMatch ||
        aliasMatch
      );
    });
  }, [initialMembers, query, selectedSectors]);

  function toggleSector(sector: string) {
    setSelectedSectors(prev => {
      const next = new Set(prev);
      if (next.has(sector)) next.delete(sector); else next.add(sector);
      return next;
    });
  }

  const activeCount = selectedSectors.size;

  return (
    <>
      {/* Search + filter toggle */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="search-input-wrap" style={{ flex: 1, minWidth: 220 }}>
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Nom, entreprise, ville, métier…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1rem', padding: 0 }}>✕</button>
          )}
        </div>
        <button
          onClick={() => setFiltersOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '0 18px', height: 46, borderRadius: 10,
            border: `1.5px solid ${filtersOpen || activeCount > 0 ? 'var(--red)' : '#ddd'}`,
            background: filtersOpen || activeCount > 0 ? 'var(--red-light)' : 'white',
            color: activeCount > 0 ? 'var(--red)' : 'var(--dark)',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filtres{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Secteurs d'activité</div>
            {activeCount > 0 && (
              <button onClick={() => setSelectedSectors(new Set())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: '0.85rem', fontWeight: 600 }}>
                Tout effacer
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px 24px' }}>
            {availableSectors.map(sector => (
              <label key={sector} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem', color: 'var(--dark)', padding: '4px 0' }}>
                <input
                  type="checkbox"
                  checked={selectedSectors.has(sector)}
                  onChange={() => toggleSector(sector)}
                  style={{ width: 16, height: 16, accentColor: 'var(--red)', cursor: 'pointer', flexShrink: 0 }}
                />
                {sector}
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500 }}>
                  {initialMembers.filter(m => m.secteur === sector).length}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Active filter tags */}
      {activeCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {[...selectedSectors].map(s => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--red-light)', color: 'var(--red)', borderRadius: 20, padding: '4px 12px', fontSize: '0.82rem', fontWeight: 600 }}>
              {s}
              <button onClick={() => toggleSector(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: 0, fontSize: '0.9rem', lineHeight: 1 }}>✕</button>
            </span>
          ))}
        </div>
      )}

      {/* Count + hint */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <p className="result-count" style={{ margin: 0 }}>
          <strong>{filtered.length}</strong> adhérent{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
        {query && (
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>
            Inclut les résultats de la zone géographique et du secteur associé
          </span>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="56" height="56" fill="none" stroke="var(--red)" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <h3>Aucun résultat</h3>
          <p>Essayez un autre terme ou réinitialisez les filtres.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map(m => {
            const initials = getInitials(m.prenom, m.nom);
            const color = getAvatarColor(m.secteur);
            return (
              <div key={m.id} className="card member-card">
                <div className="member-header">
                  <div className="member-avatar" style={{ background: color }}>{initials}</div>
                  <div>
                    <div className="member-name">{m.prenom} {m.nom.toUpperCase()}</div>
                    <div className="member-company">{m.entreprise}</div>
                  </div>
                </div>
                <div className="sector-badge">{m.secteur}</div>
                <div className="member-info">
                  <div className="member-info-row">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    {m.ville}
                  </div>
                  <div className="member-info-row">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <a href={`mailto:${m.email}`}>{m.email}</a>
                  </div>
                  <div className="member-info-row">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.128.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.61 5.61l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.572 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
                    <a href={`tel:${m.tel.replace(/\s/g, '')}`}>{m.tel}</a>
                  </div>
                  {m.site_web && (
                    <div className="member-info-row">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      <a href={m.site_web} target="_blank" rel="noopener noreferrer">{m.site_web.replace(/^https?:\/\//, '')}</a>
                    </div>
                  )}
                </div>
                {m.bio && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5, margin: '8px 0', fontStyle: 'italic', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                    &ldquo;{m.bio}&rdquo;
                  </div>
                )}
                <div className="member-actions">
                  <button className="btn btn-sm btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setQrMember(m)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M14 17h3M17 14v3M20 14h.01M20 20h.01"/></svg>
                    Mon QR Code
                  </button>
                  <button className="btn btn-sm btn-card" onClick={() => setCardMember(m)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    Carte
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cardMember && <CardModal member={cardMember} onClose={() => setCardMember(null)} />}
      {qrMember && <QRModal member={qrMember} onClose={() => setQrMember(null)} />}
    </>
  );
}
