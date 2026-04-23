import RegistrationForm from '@/components/inscription/RegistrationForm';
import InscriptionQR from '@/components/inscription/InscriptionQR';

export default function InscriptionPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>Rejoindre l&apos;annuaire</h1>
          <p>Réservé aux adhérents Dynabuy — remplissez le formulaire pour apparaître dans l&apos;annuaire</p>
        </div>
      </div>
      <div className="page-layout">
        <RegistrationForm />
        <InscriptionQR />
      </div>
    </>
  );
}
