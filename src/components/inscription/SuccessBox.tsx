import Link from 'next/link';

export default function SuccessBox({ prenom }: { prenom: string }) {
  return (
    <div className="success-box" style={{ marginBottom: '24px' }}>
      <div className="success-icon">✓</div>
      <h2>Bienvenue {prenom} !</h2>
      <p style={{ marginBottom: '20px' }}>Votre fiche est maintenant visible dans l&apos;annuaire Dynabuy.</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/annuaire" className="btn btn-primary btn-sm">Voir l&apos;annuaire →</Link>
        <Link href="/reunions" className="btn btn-outline btn-sm">Voir les réunions →</Link>
      </div>
    </div>
  );
}
