import Image from 'next/image';
import { getMeetings } from '@/lib/meetings';
import MeetingList from '@/components/reunions/MeetingList';

export default async function ReunionsPage() {
  const meetings = await getMeetings();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcomingCount = meetings.filter(m => new Date(m.date + 'T23:59:59') >= today).length;

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>Prochaines réunions</h1>
          <p>{upcomingCount} événement{upcomingCount > 1 ? 's' : ''} à venir · Inscriptions en ligne</p>
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
