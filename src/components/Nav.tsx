'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const link = (href: string, label: string, btn?: boolean) => (
    <Link
      href={href}
      className={`nav-link${path === href ? ' active' : ''}${btn ? ' btn-nav' : ''}`}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/logo-dynabuy.png" alt="Dynabuy" width={120} height={40} style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', borderLeft: '1px solid #ddd', paddingLeft: 10 }}>Annuaire</span>
        </Link>
        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className={`nav-links${open ? ' open' : ''}`}>
          {link('/', 'Accueil')}
          {link('/annuaire', 'Annuaire')}
          {link('/reunions', 'Réunions')}
          {link('/inscription', "Rejoindre l'annuaire", true)}
        </div>
      </div>
    </nav>
  );
}
