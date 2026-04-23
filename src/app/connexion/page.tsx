import LoginForm from '@/components/auth/LoginForm';

export default function ConnexionPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>Connexion</h1>
          <p>Accédez à votre profil Dynabuy</p>
        </div>
      </div>
      <div style={{ maxWidth: 480, margin: '40px auto', padding: '0 16px' }}>
        <LoginForm />
      </div>
    </>
  );
}
