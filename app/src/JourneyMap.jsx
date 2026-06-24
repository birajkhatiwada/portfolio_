const STOPS = [
  { id: "nepal",     city: "Kathmandu",     region: "Nepal",     cx: 55,  cy: 55  },
  { id: "iowa",      city: "Iowa City",     region: "Iowa, USA", cx: 112, cy: 158 },
  { id: "santarosa", city: "Santa Rosa",    region: "CA",        cx: 165, cy: 268 },
  { id: "sanmateo",  city: "San Mateo",     region: "CA",        cx: 208, cy: 366 },
  { id: "sf",        city: "San Francisco", region: "CA",        cx: 246, cy: 460 },
];

export default function JourneyMap({ activeId = null }) {
  return (
    <div id="journey-wrap">
      <svg viewBox="0 0 360 540" preserveAspectRatio="xMidYMid meet" className="jm-svg" aria-hidden="true">

        {/* dashed arcs between consecutive stops */}
        {STOPS.slice(0, -1).map((s, i) => {
          const t = STOPS[i + 1];
          const qx = (s.cx + t.cx) / 2 - 22;
          const qy = (s.cy + t.cy) / 2;
          const lit = activeId === s.id || activeId === t.id;
          return (
            <path
              key={i}
              d={`M ${s.cx} ${s.cy} Q ${qx} ${qy} ${t.cx} ${t.cy}`}
              className={lit ? "jm-arc jm-arc--lit" : "jm-arc"}
            />
          );
        })}

        {/* dots + labels */}
        {STOPS.map((s) => {
          const active = activeId === s.id;
          return (
            <g key={s.id} className={active ? "jm-stop jm-stop--active" : "jm-stop"}>
              <circle cx={s.cx} cy={s.cy} r="7" className="jm-halo" />
              <circle cx={s.cx} cy={s.cy} r="3.5" className="jm-dot" />
              <line x1={s.cx + 9} y1={s.cy} x2={s.cx + 16} y2={s.cy} className="jm-tick" />
              <text x={s.cx + 20} y={s.cy - 2} className="jm-city">{s.city}</text>
              <text x={s.cx + 20} y={s.cy + 12} className="jm-region">{s.region}</text>
            </g>
          );
        })}

      </svg>
    </div>
  );
}
