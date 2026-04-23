import Link from 'next/link';
import Image from 'next/image';
import { getMembers } from '@/lib/members';
import { getMeetings } from '@/lib/meetings';

export const revalidate = 60;

export default async function HomePage() {
  const [members, meetings] = await Promise.all([getMembers(), getMeetings()]);

  const sectors = new Set(members.map(m => m.secteur));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = meetings
    .filter(m => new Date(m.date + 'T00:00:00') >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextMeeting = upcoming[0];
  const daysUntilNext = nextMeeting
    ? Math.ceil((new Date(nextMeeting.date + 'T00:00:00').getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

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

      {/* PHOTO BANNER */}
      <div className="home-banner-photo">
        <Image src="/photo-lounge.jpg" alt="Rencontre dirigeants Dynabuy" fill style={{ objectFit: 'cover', objectPosition: 'center 35%' }} sizes="100vw" />
      </div>

      {/* STATS */}
      <section className="stats">
        <div className="stats-inner">
          <div>
            <div className="stat-value">{members.length}</div>
            <div className="stat-label">Adhérents dans l&apos;annuaire</div>
          </div>
          <div>
            <div className="stat-value">{sectors.size}</div>
            <div className="stat-label">Secteurs représentés</div>
          </div>
          <div>
            {daysUntilNext === 0 ? (
              <>
                <div className="stat-value">Aujourd&apos;hui</div>
                <div className="stat-label">Prochaine réunion</div>
              </>
            ) : daysUntilNext !== null ? (
              <>
                <div className="stat-value">J–{daysUntilNext}</div>
                <div className="stat-label">Prochaine réunion dans {daysUntilNext} jour{daysUntilNext > 1 ? 's' : ''}</div>
              </>
            ) : (
              <>
                <div className="stat-value">–</div>
                <div className="stat-label">Prochaine réunion</div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* NEXT MEETING BANNER */}
      {nextMeeting && (
        <section style={{ background: '#1a1a2e', padding: '28px 16px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: 'var(--red)', borderRadius: 12, padding: '10px 16px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ color: 'white', fontSize: '1.6rem', fontWeight: 900, lineHeight: 1 }}>
                  {new Date(nextMeeting.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit' })}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {new Date(nextMeeting.date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'short' })}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--red)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Prochain événement</div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2 }}>{nextMeeting.titre}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginTop: 4 }}>
                  📍 {nextMeeting.lieu}{nextMeeting.heure ? ` · ${nextMeeting.heure}` : ''}
                </div>
              </div>
            </div>
            <Link href="/reunions" style={{ background: 'var(--red)', color: 'white', fontWeight: 700, padding: '10px 22px', borderRadius: 10, textDecoration: 'none', fontSize: '0.95rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
              S&apos;inscrire →
            </Link>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="section">
        <h2 className="section-title">Trouvez ce qu&apos;il vous faut</h2>
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
            <p>Retrouvez votre carte adhérent et transmettez vos coordonnées en un scan lors de vos réunions.</p>
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
              <h3>1 – Inscrivez-vous</h3>
              <p>Remplissez le formulaire en ligne. Votre fiche apparaît immédiatement dans l&apos;annuaire partagé.</p>
            </div>
            <div className="how-card card">
              <div className="how-icon">🤝</div>
              <h3>2 – Échangez vos contacts</h3>
              <p>Chaque adhérent dispose d&apos;un QR code personnel. Scannez-le pour ajouter le contact directement dans votre téléphone.</p>
            </div>
            <div className="how-card card">
              <div className="how-icon">🚀</div>
              <h3>3 – Développez votre réseau</h3>
              <p>Participez aux déjeuners et événements pour renforcer vos relations et développer votre activité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <div className="home-gallery">
        <div className="home-gallery-item">
          <Image src="/photo-lounge.jpg" alt="Rencontre dirigeants Dynabuy" fill style={{ objectFit: 'cover', objectPosition: 'center 35%' }} sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div className="home-gallery-item">
          <Image src="/photo-atelier.jpg" alt="Atelier réseau Dynabuy" fill style={{ objectFit: 'cover', objectPosition: 'center bottom' }} sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      </div>

      {/* CTA */}
      <section className="cta-band">
        <h2>Rejoindre l&apos;annuaire</h2>
        <p>Trouvez le bon prestataire parmi nos adhérents ou inscrivez-vous pour vous faire connaître auprès de tous les entrepreneurs du réseau.</p>
        <Link href="/inscription" className="btn btn-white">
          Rejoindre l&apos;annuaire →
        </Link>
      </section>
    </>
  );
}
