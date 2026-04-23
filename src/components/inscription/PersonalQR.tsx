'use client';

import type { Member } from '@/types';
import { getInitials, getAvatarColor, generateVCard } from '@/lib/utils';
import QRCanvas from '@/components/ui/QRCanvas';

export default function PersonalQR({ member }: { member: Member }) {
  const initials = getInitials(member.prenom, member.nom);
  const color = getAvatarColor(member.secteur);

  return (
    <div style={{ background: '#1A1A2E', borderRadius: '16px', padding: '28px', textAlign: 'center', marginBottom: '24px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700, color: 'white', margin: '0 auto 12px' }}>{initials}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '2px' }}>{member.prenom} {member.nom}</div>
      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>{member.entreprise}</div>
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', display: 'inline-block', marginBottom: '12px' }}>
        <QRCanvas value={generateVCard(member)} size={220} />
      </div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.5 }}>
        📲 Montrez ce QR code en réunion pour<br />partager vos coordonnées instantanément
      </div>
    </div>
  );
}
