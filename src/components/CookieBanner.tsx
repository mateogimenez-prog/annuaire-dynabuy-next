'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_ok')) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem('cookie_ok', '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: 640,
      background: 'white',
      borderRadius: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
      border: '1px solid #e5e7eb',
      padding: '18px 20px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
    }}>
      <div style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: 2 }}>🍪</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4, color: 'var(--dark)' }}>
          Ce site utilise des cookies
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
          Nous utilisons uniquement des cookies techniques nécessaires au bon fonctionnement du site (session, sécurité). Aucun cookie publicitaire ou de tracking.{' '}
          <Link href="/confidentialite" style={{ color: 'var(--red)', fontWeight: 600, textDecoration: 'underline' }}>
            En savoir plus
          </Link>
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginTop: 2 }}>
        <button
          onClick={dismiss}
          style={{
            background: 'var(--red)', color: 'white', border: 'none',
            borderRadius: 8, padding: '7px 16px', fontWeight: 700,
            fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          J'accepte
        </button>
        <button
          onClick={dismiss}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#999', fontSize: '1.2rem', lineHeight: 1, padding: 4,
          }}
          title="Fermer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
