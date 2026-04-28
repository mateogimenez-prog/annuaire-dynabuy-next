export default function MentionsLegalesPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 16px 64px' }}>
      <h1 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: 8 }}>Mentions légales</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 40 }}>Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.</p>

      <Section title="Éditeur du site">
        <Row label="Société" value="OXYCOM" />
        <Row label="Dirigeant" value="Michaël GIMENEZ" />
        <Row label="SIRET" value="829 456 094 00012" />
        <Row label="Code APE" value="8299Z" />
        <Row label="Siège social" value="Blanquefort (33290), France" />
        <Row label="Email" value="mgimenez@dynabuy-oxycom.fr" />
      </Section>

      <Section title="Hébergement">
        <Row label="Hébergeur" value="Vercel Inc." />
        <Row label="Adresse" value="340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis" />
        <Row label="Site" value="vercel.com" />
      </Section>

      <Section title="Propriété intellectuelle">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)' }}>
          L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive d'OXYCOM, sauf mention contraire. Toute reproduction, même partielle, est interdite sans autorisation préalable.
        </p>
      </Section>

      <Section title="Responsabilité">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)' }}>
          OXYCOM s'efforce de maintenir les informations publiées sur ce site à jour et exactes. Toutefois, la société ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées. L'utilisation du site se fait sous la responsabilité exclusive de l'utilisateur.
        </p>
      </Section>

      <Section title="Droit applicable">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)' }}>
          Le présent site et ses contenus sont soumis au droit français. Tout litige relatif à l'utilisation du site sera soumis à la compétence exclusive des tribunaux français.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 14, paddingBottom: 8, borderBottom: '2px solid var(--red)', display: 'inline-block' }}>{title}</h2>
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #eef0f4', padding: '16px 20px' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontWeight: 600, minWidth: 140, color: 'var(--muted)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ color: 'var(--dark)', fontSize: '0.9rem' }}>{value}</span>
    </div>
  );
}
