import AdminPanel from '@/components/admin/AdminPanel';

export default function AdminPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>Administration</h1>
          <p>Gestion des réunions Dynabuy</p>
        </div>
      </div>
      <AdminPanel />
    </>
  );
}
