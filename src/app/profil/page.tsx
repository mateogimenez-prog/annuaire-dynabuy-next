import ProfilePanel from '@/components/profil/ProfilePanel';

export default function ProfilPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>Mon profil</h1>
          <p>Gérez vos informations et accédez à votre QR code personnel</p>
        </div>
      </div>
      <ProfilePanel />
    </>
  );
}
