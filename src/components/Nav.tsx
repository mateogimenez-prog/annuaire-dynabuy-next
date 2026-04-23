'use client';

import { useState } from 'react';
import Link from 'next/link';
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
        <Link href="/" className="nav-logo">
          <div className="logo-icon">D</div>
          <span>Annuaire Dynabuy</span>
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
