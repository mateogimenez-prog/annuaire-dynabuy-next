import Image from 'next/image';
import { getMeetings } from '@/lib/meetings';
import MeetingList from '@/components/reunions/MeetingList';

export default async function ReunionsPage() {
  const meetings = await getMeetings();

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>Prochaines réunions</h1>
          <p>16 rencontres à venir en Nouvelle-Aquitaine – inscription sur rencontres-dirigeants.com</p>
        </div>
      </div>
      <div className="reunions-banner-photo">
        <Image src="/photo-salle.jpg" alt="Réunion réseau Dynabuy" fill style={{ objectFit: 'cover', objectPosition: 'center 55%' }} sizes="100vw" priority />
      </div>
      <div className="section">
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '1.05rem', marginBottom: 32, maxWidth: 620, margin: '0 auto 32px' }}>
          Retrouvez-nous pour présenter votre activité, pitcher en 4 minutes et développer votre réseau de dirigeants en Nouvelle-Aquitaine.
        </p>
        <MeetingList meetings={meetings} />
      </div>
    </>
  );
}
