import { getMembers } from '@/lib/members';
import AnnuaireGate from '@/components/members/AnnuaireGate';

export const revalidate = 60;

export default async function AnnuairePage() {
  const members = await getMembers();

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>Annuaire des adhérents</h1>
          <p>Trouvez le bon professionnel parmi les membres du réseau Dynabuy</p>
        </div>
      </div>
      <div className="section">
        <AnnuaireGate members={members} />
      </div>
    </>
  );
}
