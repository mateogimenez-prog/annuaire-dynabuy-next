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
        <MeetingList meetings={meetings} />
      </div>
    </>
  );
}
