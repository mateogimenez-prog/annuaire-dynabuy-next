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

      {/* DYNABUY EN CHIFFRES */}
      <section style={{ background: 'white', padding: '48px 16px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 className="section-title" style={{ marginBottom: 32 }}>Dynabuy en chiffres</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { icon: <svg width="32" height="32" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>, value: '+300 000', label: 'Entreprises bénéficient de la centrale d\'achats' },
              { icon: <svg width="32" height="32" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, value: '+260 000', label: 'Salariés bénéficiaires du CSE externalisé' },
              { icon: <svg width="32" height="32" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, value: '+120', label: 'Agences partout en France' },
              { icon: <svg width="32" height="32" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, value: 'Depuis 2009', label: 'Leader des réseaux d\'entrepreneurs' },
            ].map(({ icon, value, label }) => (
              <div key={label} style={{ background: 'white', borderRadius: 16, padding: '28px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eef0f4' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--dark)', marginBottom: 6, letterSpacing: '-0.5px' }}>{value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
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
                  <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>{nextMeeting.lieu}{nextMeeting.heure ? ` · ${nextMeeting.heure}` : ''}
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
      <section className="section" style={{ background: 'var(--blue-bg)', maxWidth: '100%' }}>
        <h2 className="section-title">Trouvez ce qu&apos;il vous faut</h2>
        <div className="feature-row">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3>Annuaire des membres</h3>
            <p>Recherchez un adhérent par nom, entreprise ou secteur d&apos;activité. Contactez directement par email ou téléphone.</p>
            <Link href="/annuaire">Accéder à l&apos;annuaire →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
            </div>
            <h3>Réunions & événements</h3>
            <p>Consultez les prochaines réunions réseau et inscrivez-vous en ligne. Ne manquez plus aucun événement.</p>
            <Link href="/reunions">Voir les réunions →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/></svg>
            </div>
            <h3>Carte & QR code</h3>
            <p>Retrouvez votre carte adhérent et transmettez vos coordonnées en un scan lors de vos réunions.</p>
            <Link href="/inscription">Rejoindre →</Link>
          </div>
        </div>
      </section>

      {/* AVANTAGES MEMBRES */}
      <section className="section">
        <h2 className="section-title">Vos avantages en tant qu&apos;adhérent</h2>
        <p className="section-sub">En rejoignant Dynabuy, vous accédez à bien plus qu&apos;un réseau d&apos;entrepreneurs.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eef0f4' }}>
            <div style={{ width: 48, height: 48, background: 'var(--red-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 8, color: 'var(--dark)' }}>CSE externalisé</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>Offrez à vos salariés tous les avantages d&apos;un grand CSE : réductions loisirs, vacances, culture, courses… jusqu&apos;à <strong>1 200 € d&apos;économies</strong> par an et par foyer.</p>
            <a href="https://www.avantages-prives.com/connexion" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: 'var(--red)', textDecoration: 'none' }}>
              Accéder à Avantages Privés →
            </a>
          </div>
          <div style={{ background: 'white', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eef0f4' }}>
            <div style={{ width: 48, height: 48, background: 'var(--red-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 8, color: 'var(--dark)' }}>CE – Avantages Entreprises</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>Accédez à la centrale d&apos;achats <strong>Avantages Entreprises</strong> : économies sur vos achats professionnels, énergie, téléphonie, fournitures et bien plus.</p>
            <a href="https://www.avantages-entreprises.com/connexion" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: 'var(--red)', textDecoration: 'none' }}>
              Accéder à Avantages Entreprises →
            </a>
          </div>
          <div style={{ background: 'white', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eef0f4' }}>
            <div style={{ width: 48, height: 48, background: 'var(--red-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 8, color: 'var(--dark)' }}>Parrainage – 10 %</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Recommandez Dynabuy à un confrère et bénéficiez d&apos;une <strong>remise de 10 %</strong> sur votre cotisation. Un réseau qui grandit, c&apos;est un réseau qui vous récompense.</p>
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
              <div className="how-icon">
              <svg width="26" height="26" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.5 18 5.5 22 1.5"/></svg>
            </div>
              <h3>1 – Inscrivez-vous</h3>
              <p>Remplissez le formulaire en ligne. Votre fiche apparaît immédiatement dans l&apos;annuaire partagé.</p>
            </div>
            <div className="how-card card">
              <div className="how-icon">
              <svg width="26" height="26" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"/><path d="M8 9h8"/><path d="M8 15h8"/><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
            </div>
              <h3>2 – Échangez vos contacts</h3>
              <p>Chaque adhérent dispose d&apos;un QR code personnel. Scannez-le pour ajouter le contact directement dans votre téléphone.</p>
            </div>
            <div className="how-card card">
              <div className="how-icon">
              <svg width="26" height="26" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
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

      {/* NOTRE ÉQUIPE */}
      <section className="section">
        <h2 className="section-title">Notre équipe</h2>
        <p className="section-sub">Une question ? Contactez directement l&apos;un de nos référents.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, maxWidth: 800, margin: '0 auto' }}>
          {[
            { prenom: 'Patricia', nom: 'GRATAS', email: 'pgratas@dynabuy-oxycom.fr', tel: '06.19.67.62.23', photo: '/team-patricia.png', pos: 'center 25%', linkedin: 'https://www.linkedin.com/in/patricia-gratas-oxycom/' },
            { prenom: 'Michaël', nom: 'GIMENEZ', email: 'mgimenez@dynabuy-oxycom.fr', tel: '06.61.45.23.56', photo: '/team-michael.png', pos: 'center 35%', linkedin: 'https://www.linkedin.com/in/micha%C3%ABl-gimenez-29719926b/' },
            { prenom: 'Tanguy', nom: 'BARICAULT', email: 'tbaricault@dynabuy-oxycom.fr', tel: '07.85.71.04.52', photo: '/team-tanguy.png', pos: 'center 20%', linkedin: 'https://www.linkedin.com/in/tanguy-baricault/' },
          ].map(({ prenom, nom, email, tel, photo, pos, linkedin }) => (
            <div key={nom} style={{ background: 'white', borderRadius: 16, padding: '32px 24px 24px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0' }}>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', boxShadow: '0 0 0 3px white, 0 0 0 5px var(--red)', cursor: 'pointer' }}>
                <Image src={photo} alt={`${prenom} ${nom}`} width={100} height={100} style={{ objectFit: 'cover', objectPosition: pos, width: '100%', height: '100%', transform: 'scale(1.35)', transformOrigin: pos }} />
              </a>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--dark)', marginBottom: 14, textDecoration: 'none', display: 'block' }}>{prenom} {nom}</a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.85rem', color: 'var(--red)', textDecoration: 'none', fontWeight: 500 }}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  {email}
                </a>
                <a href={`tel:${tel.replace(/\./g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.85rem', color: 'var(--red)', textDecoration: 'none', fontWeight: 500 }}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.128.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.61 5.61l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.572 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
                  {tel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

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
