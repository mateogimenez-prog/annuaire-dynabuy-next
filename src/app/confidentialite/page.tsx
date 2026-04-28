export default function ConfidentialitePage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 16px 64px' }}>
      <h1 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: 8 }}>Politique de confidentialité</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 40 }}>Dernière mise à jour : avril 2026</p>

      <Section title="Responsable du traitement">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)' }}>
          Le responsable du traitement des données personnelles collectées sur ce site est :<br />
          <strong>OXYCOM</strong> — Michaël GIMENEZ — SIRET 829 456 094 00012 — Blanquefort (33290)<br />
          Contact : <a href="mailto:mgimenez@dynabuy-oxycom.fr" style={{ color: 'var(--red)' }}>mgimenez@dynabuy-oxycom.fr</a>
        </p>
      </Section>

      <Section title="Données collectées">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)', marginBottom: 12 }}>
          Lors de l'inscription à l'annuaire Dynabuy, les données suivantes sont collectées :
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--dark)' }}>
          <li>Prénom et nom</li>
          <li>Nom de l'entreprise</li>
          <li>Secteur d'activité</li>
          <li>Ville</li>
          <li>Adresse email professionnelle</li>
          <li>Numéro de téléphone</li>
          <li>Présentation de l'activité (facultatif)</li>
          <li>URL du site web (facultatif)</li>
        </ul>
      </Section>

      <Section title="Finalité et base légale">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)' }}>
          Les données sont collectées sur la base du <strong>consentement explicite</strong> de l'utilisateur (art. 6.1.a du RGPD), dans le but de :
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--dark)', marginTop: 8 }}>
          <li>Afficher le profil professionnel dans l'annuaire réservé aux adhérents Dynabuy</li>
          <li>Permettre aux autres adhérents de prendre contact</li>
          <li>Faciliter les échanges commerciaux au sein du réseau</li>
        </ul>
      </Section>

      <Section title="Destinataires des données">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)' }}>
          Les données sont accessibles <strong>uniquement aux adhérents Dynabuy</strong> disposant d'un code d'accès. Elles ne sont ni vendues, ni transmises à des tiers, ni utilisées à des fins publicitaires.
        </p>
      </Section>

      <Section title="Durée de conservation">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)' }}>
          Les données sont conservées pendant la durée de l'adhésion au réseau Dynabuy. En cas de demande de suppression, les données sont effacées dans un délai de <strong>30 jours</strong>.
        </p>
      </Section>

      <Section title="Vos droits">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)', marginBottom: 12 }}>
          Conformément au RGPD, vous disposez des droits suivants sur vos données :
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--dark)' }}>
          <li><strong>Droit d'accès</strong> — obtenir une copie de vos données</li>
          <li><strong>Droit de rectification</strong> — corriger des données inexactes</li>
          <li><strong>Droit à l'effacement</strong> — demander la suppression de votre profil</li>
          <li><strong>Droit d'opposition</strong> — vous opposer au traitement</li>
          <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format lisible</li>
        </ul>
        <p style={{ lineHeight: 1.7, color: 'var(--dark)', marginTop: 12 }}>
          Pour exercer ces droits, contactez : <a href="mailto:mgimenez@dynabuy-oxycom.fr" style={{ color: 'var(--red)', fontWeight: 600 }}>mgimenez@dynabuy-oxycom.fr</a>
        </p>
        <p style={{ lineHeight: 1.7, color: 'var(--dark)', marginTop: 8 }}>
          En cas de litige, vous pouvez saisir la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>CNIL</a>.
        </p>
      </Section>

      <Section title="Cookies">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)' }}>
          Ce site utilise uniquement des cookies techniques nécessaires au bon fonctionnement de l'application (session, sécurité). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
        </p>
      </Section>

      <Section title="Hébergement des données">
        <p style={{ lineHeight: 1.7, color: 'var(--dark)' }}>
          Les données sont hébergées par <strong>Supabase Inc.</strong> (base de données) et <strong>Vercel Inc.</strong> (application web), deux prestataires conformes au RGPD et soumis au Data Privacy Framework UE–États-Unis.
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
