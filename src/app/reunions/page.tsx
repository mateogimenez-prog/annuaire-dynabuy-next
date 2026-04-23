import Image from 'next/image';
import { getMeetings } from '@/lib/meetings';
import MeetingList from '@/components/reunions/MeetingList';

export default function ReunionsPage() {
  const meetings = getMeetings();

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>Prochaines réunions</h1>
          <p>16 rencontres à venir en Nouvelle-Aquitaine – inscription sur rencontres-dirigeants.com</p>
        </div>
      </div>
      <div className="reunions-photo">
        <Image src="/photo-salle.jpg" alt="Réunion réseau Dynabuy" fill style={{ objectFit: 'cover', objectPosition: 'center 60%' }} sizes="100vw" priority />
        <div className="reunions-photo-overlay">
          <span>Des rencontres qui créent de vraies opportunités</span>
        </div>
      </div>
      <div className="section">
        <MeetingList meetings={meetings} />
      </div>
    </>
  );
}
