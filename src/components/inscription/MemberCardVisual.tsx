'use client';

import type { Member } from '@/types';
import { getInitials, getAvatarColor, generateVCard } from '@/lib/utils';
import QRCanvas from '@/components/ui/QRCanvas';

export default function MemberCardVisual({ member }: { member: Member }) {
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
          <div className="card-name">{member.prenom} {member.nom}</div>
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
