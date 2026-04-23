import type { Member } from '@/types';

const DEPARTMENTS = [
  { num: '79', name: 'Deux-Sèvres',           cx: 198, cy: 84,  d: 'M130,52 L210,42 L255,58 L258,108 L228,130 L190,118 L155,98 Z' },
  { num: '86', name: 'Vienne',                 cx: 300, cy: 105, d: 'M258,58 L330,52 L368,72 L370,120 L340,148 L285,148 L228,130 L255,108 Z' },
  { num: '23', name: 'Creuse',                 cx: 400, cy: 108, d: 'M368,72 L435,78 L445,138 L400,158 L365,145 L340,148 L370,120 Z' },
  { num: '87', name: 'Haute-Vienne',           cx: 330, cy: 195, d: 'M285,148 L340,148 L365,145 L400,158 L390,225 L345,248 L295,235 L278,198 Z' },
  { num: '19', name: 'Corrèze',                cx: 415, cy: 218, d: 'M400,158 L445,138 L455,210 L425,268 L385,268 L360,245 L390,225 Z' },
  { num: '16', name: 'Charente',               cx: 205, cy: 192, d: 'M155,162 L190,118 L228,130 L285,148 L278,198 L248,228 L200,238 L160,215 Z' },
  { num: '17', name: 'Charente-Maritime',      cx:  98, cy: 142, d: 'M35,95 L130,52 L155,98 L190,118 L155,162 L105,175 L42,155 Z' },
  { num: '24', name: 'Dordogne',               cx: 272, cy: 285, d: 'M200,238 L248,228 L278,198 L295,235 L345,248 L360,245 L355,310 L300,335 L242,325 L192,295 Z' },
  { num: '33', name: 'Gironde',                cx: 115, cy: 305, d: 'M42,155 L105,175 L160,215 L192,295 L188,348 L128,365 L55,325 L32,250 Z' },
  { num: '47', name: 'Lot-et-Garonne',         cx: 248, cy: 372, d: 'M192,295 L242,325 L300,335 L355,310 L345,375 L290,398 L225,395 L188,368 L188,348 Z' },
  { num: '40', name: 'Landes',                 cx: 105, cy: 415, d: 'M55,325 L128,365 L188,368 L188,420 L155,458 L88,462 L38,390 Z' },
  { num: '64', name: 'Pyrénées-Atlantiques',   cx: 192, cy: 488, d: 'M88,462 L155,458 L188,420 L225,395 L290,398 L285,462 L215,512 L128,512 Z' },
];

const CITY_TO_DEPT: Record<string, string> = {
  blanquefort: '33', bordeaux: '33', mérignac: '33', pessac: '33', talence: '33',
  libourne: '33', arcachon: '33', 'la teste-de-buch': '33',
  bayonne: '64', biarritz: '64', pau: '64', anglet: '64',
  'mont-de-marsan': '40', dax: '40', parentis: '40',
  agen: '47', marmande: '47', villeneuve: '47',
  périgueux: '24', bergerac: '24', sarlat: '24',
  limoges: '87',
  brive: '19', tulle: '19',
  poitiers: '86', châtellerault: '86',
  niort: '79', bressuire: '79',
  angoulême: '16', cognac: '16',
  'la rochelle': '17', rochefort: '17', saintes: '17', royan: '17',
  guéret: '23',
};

function getCountByDept(members: Member[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of members) {
    const key = m.ville.toLowerCase().trim();
    const dept = CITY_TO_DEPT[key];
    if (dept) counts[dept] = (counts[dept] || 0) + 1;
  }
  return counts;
}

export default function NAquitaineMap({ members }: { members: Member[] }) {
  const counts = getCountByDept(members);
  const hasAny = Object.keys(counts).length > 0;

  return (
    <div className="map-wrap">
      <svg viewBox="0 0 490 540" className="map-svg" aria-label="Carte Nouvelle-Aquitaine">
        <defs>
          <filter id="dept-shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.12)" />
          </filter>
        </defs>
        {DEPARTMENTS.map(dept => {
          const count = counts[dept.num] || 0;
          const active = count > 0;
          return (
            <g key={dept.num}>
              <path
                d={dept.d}
                fill={active ? '#fde8e6' : '#eef2f6'}
                stroke="white"
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter="url(#dept-shadow)"
              />
              <text x={dept.cx} y={dept.cy - 6} textAnchor="middle" fontSize="17" fontWeight="800" fill={active ? '#E8392A' : '#9aabb8'}>
                {dept.num}
              </text>
              <text x={dept.cx} y={dept.cy + 9} textAnchor="middle" fontSize="7.5" fontWeight="500" fill={active ? '#b5321f' : '#b0c0cc'}>
                {dept.name}
              </text>
              {active && (
                <>
                  <circle cx={dept.cx + 18} cy={dept.cy - 18} r="10" fill="#E8392A" />
                  <text x={dept.cx + 18} y={dept.cy - 14} textAnchor="middle" fontSize="9" fontWeight="800" fill="white">{count}</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      {!hasAny && (
        <p className="map-empty">Les membres apparaîtront sur la carte dès leur inscription.</p>
      )}
    </div>
  );
}
