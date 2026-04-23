import type { Meeting } from '@/types';
import { getDateParts, getFormatLabel } from '@/lib/utils';

export default function MeetingList({ meetings }: { meetings: Meeting[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = meetings.filter(m => new Date(m.date + 'T23:59:59') >= today);

  if (upcoming.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📅</div>
        <h3>Aucune réunion à venir</h3>
        <p>Consultez <a href="https://www.rencontres-dirigeants.com/nos-rencontres" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>rencontres-dirigeants.com</a> pour les prochaines dates.</p>
      </div>
    );
  }

  const byMonth: Record<string, Meeting[]> = {};
  upcoming.forEach(m => {
    const d = new Date(m.date + 'T12:00:00');
    const key = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(m);
  });

  return (
    <>
      {Object.entries(byMonth).map(([month, items]) => (
        <div key={month} className="month-group">
          <div className="month-label">{month}</div>
          <div className="meeting-list">
            {items.map(m => {
              const { day, month: mo } = getDateParts(m.date);
              const label = getFormatLabel(m);
              const fmtClass = 'fmt-' + label.replace(' ', '-');
              return (
                <div key={m.id} className="card meeting-card">
                  <div className="meeting-date-box">
                    <span className="meeting-date-day">{day}</span>
                    <span className="meeting-date-month">{mo}</span>
                  </div>
                  <div className="meeting-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <div className="meeting-title" style={{ margin: 0 }}>{m.titre}</div>
                      <span className={`format-badge ${fmtClass}`}>{label}</span>
                    </div>
                    <div className="meeting-meta">
                      <span>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {m.heure} – {m.fin}
                      </span>
                      <span>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {m.lieu}
                      </span>
                    </div>
                    <div className="meeting-footer">
                      <div className="meeting-referent">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {m.animateur}
                      </div>
                      <div className="meeting-prix">{m.prix}</div>
                      <a href={m.lien} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                        S&apos;inscrire →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
