'use client';

import { useEffect, useState } from 'react';
import QRCanvas from '@/components/ui/QRCanvas';

export default function InscriptionQR() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <div className="qr-sticky">
      <div className="qr-card">
        <div className="qr-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M14 17h3M17 14v3M20 14h.01M20 20h.01"/></svg>
          Rejoindre l&apos;annuaire
        </div>
        <div className="qr-card-sub">
          Scannez ce QR code pour accéder au formulaire d&apos;inscription depuis votre téléphone.
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          {url && <QRCanvas value={url} size={180} />}
        </div>
        {url && <div className="qr-url">{url}</div>}
        <div className="info-tip">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          Partagez ce QR code lors de vos réunions pour faciliter les inscriptions.
        </div>
      </div>
    </div>
  );
}
