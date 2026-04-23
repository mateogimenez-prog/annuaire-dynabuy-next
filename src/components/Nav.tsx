'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const path = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setLoggedIn(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session));
    return () => subscription.unsubscribe();
  }, []);

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
          {loggedIn
            ? link('/profil', 'Mon Profil', true)
            : link('/inscription', "Rejoindre l'annuaire", true)
          }
        </div>
      </div>
    </nav>
  );
}
