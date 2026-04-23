import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-logo">
          <div className="logo-icon">D</div>
          Annuaire Dynabuy
        </div>
        <div className="footer-links">
          <Link href="/annuaire">Annuaire</Link>
          <Link href="/reunions">Réunions</Link>
          <Link href="/inscription">Inscription</Link>
          <a href="https://www.dynabuy.fr" target="_blank" rel="noopener noreferrer">dynabuy.fr</a>
        </div>
      </div>
      <p className="footer-copy">© 2026 Annuaire Dynabuy — Plateforme réservée aux adhérents</p>
    </footer>
  );
}
