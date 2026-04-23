import Link from 'next/link';
import { getMembers } from '@/lib/members';
import { getMeetings } from '@/lib/meetings';

export const revalidate = 60;

export default async function HomePage() {
  const [members, meetings] = await Promise.all([getMembers(), Promise.resolve(getMeetings())]);

  const sectors = new Set(members.map(m => m.secteur));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = meetings.filter(m => new Date(m.date + 'T23:59:59') >= today);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <h1>
            Le réseau des entrepreneurs<br />
            qui font bouger <span>votre business</span>
          </h1>
          <p>Retrouvez les adhérents Dynabuy de votre région, trouvez le bon partenaire et participez à nos prochaines réunions.</p>
          <div className="hero-actions">
            <Link href="/annuaire" className="btn btn-primary">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Trouver un adhérent
            </Link>
            <Link href="/reunions" className="btn btn-outline">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Nos prochaines réunions
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-inner">
          <div>
            <div className="stat-value">{members.length}</div>
            <div className="stat-label">Adhérents actifs</div>
          </div>
          <div>
            <div className="stat-value">{sectors.size}</div>
            <div className="stat-label">Secteurs représentés</div>
          </div>
          <div>
            <div className="stat-value">{upcoming.length}</div>
            <div className="stat-label">Réunions à venir</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <h2 className="section-title">Tout ce dont votre réseau a besoin</h2>
        <p className="section-sub">Une plateforme simple, pensée pour les adhérents Dynabuy.</p>
        <div className="feature-row">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Annuaire des membres</h3>
            <p>Recherchez un adhérent par nom, entreprise ou secteur d&apos;activité. Contactez directement par email ou téléphone.</p>
            <Link href="/annuaire">Accéder à l&apos;annuaire →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Réunions & événements</h3>
            <p>Consultez les prochaines réunions réseau et inscrivez-vous en ligne. Ne manquez plus aucun événement.</p>
            <Link href="/reunions">Voir les réunions →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Carte & QR code</h3>
            <p>Chaque adhérent reçoit sa carte personnelle avec QR code. Scannez-vous mutuellement en réunion pour échanger vos contacts.</p>
            <Link href="/inscription">Rejoindre →</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: 'var(--blue-bg)', padding: 0 }}>
        <div className="section">
          <h2 className="section-title">Comment ça marche ?</h2>
          <p className="section-sub">En 3 étapes pour intégrer et utiliser le réseau.</p>
          <div className="how-grid">
            <div className="how-card card">
              <div className="how-icon">📲</div>
              <h3>1 — Inscrivez-vous</h3>
              <p>Remplissez le formulaire en ligne. Votre fiche apparaît immédiatement dans l&apos;annuaire partagé.</p>
            </div>
            <div className="how-card card">
              <div className="how-icon">🤝</div>
              <h3>2 — Échangez vos contacts</h3>
              <p>Chaque adhérent dispose d&apos;un QR code personnel. Scannez-le pour ajouter le contact directement dans votre téléphone.</p>
            </div>
            <div className="how-card card">
              <div className="how-icon">🚀</div>
              <h3>3 — Développez votre réseau</h3>
              <p>Participez aux déjeuners et événements pour renforcer vos relations et développer votre activité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <h2>Pas encore dans l&apos;annuaire ?</h2>
        <p>Rejoignez le réseau Dynabuy en quelques minutes et recevez votre carte adhérent avec QR code.</p>
        <Link href="/inscription" className="btn btn-white">
          Rejoindre le réseau maintenant →
        </Link>
      </section>
    </>
  );
}
