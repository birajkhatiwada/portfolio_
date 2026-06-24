import { W, H, STATE_PATHS, STATE_MESH, NATION_PATH, MARKERS } from "./worldPaths.js";

const MMAP = Object.fromEntries(MARKERS.map((m) => [m.id, m]));

const ZOOM = {
  nepal:       1,
  gatech:      8,
  iowa:        8,
  santarosa:   28,
  rohnertpark: 28,
  sf:          28,
  emeryville:  28,
  sanmateo:    28,
};

export default function LocationMap({ activeId = null, activeLabel = null, activeSub = null }) {
  const s = (activeId && ZOOM[activeId]) || 1;
  const activeM = activeId && MMAP[activeId] && !MMAP[activeId].offMap
    ? MMAP[activeId]
    : null;
  const tx = activeM ? W / 2 - s * activeM.px : 0;
  const ty = activeM ? H / 2 - s * activeM.py : 0;
  const zoomTransform = `translate(${tx} ${ty}) scale(${s})`;

  return (
    <div id="journey-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id="map-clip">
            <rect width={W} height={H} />
          </clipPath>
        </defs>

        <rect width={W} height={H} fill="var(--bg)" />

        <g clipPath="url(#map-clip)" className="map-inner" transform={zoomTransform}>

          {/* state fills */}
          {STATE_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="var(--surface2)"
            />
          ))}

          {/* internal state borders */}
          <path
            d={STATE_MESH}
            fill="none"
            stroke="var(--green-muted)"
            strokeWidth={0.4 / s}
            strokeOpacity={0.5}
          />

          {/* outer nation border */}
          <path
            d={NATION_PATH}
            fill="none"
            stroke="var(--green-dim)"
            strokeWidth={0.8 / s}
            strokeOpacity={0.8}
          />

          {/* location markers */}
          {MARKERS.filter((m) => !m.offMap).map((m) => {
            const active = activeId === m.id;
            const anchor = m.ldx < 0 ? "end" : "start";
            return (
              <g key={m.id} transform={`translate(${m.px},${m.py})`}>
                {active && (
                  <circle r={10 / s} fill="var(--green)" fillOpacity={0.12} />
                )}
                <circle
                  r={(active ? 5 : 3) / s}
                  fill={active ? "var(--green)" : "var(--green-muted)"}
                  stroke="var(--bg)"
                  strokeWidth={1.2 / s}
                />
                {active && (
                  <>
                    <text
                      x={m.ldx / s} y={m.ldy / s}
                      textAnchor={anchor}
                      fontSize={22 / s}
                      fontFamily="DM Mono, monospace"
                      fill="var(--green)"
                      pointerEvents="none"
                    >
                      {activeLabel ?? m.label}
                    </text>
                    <text
                      x={m.ldx / s} y={(m.ldy + 18) / s}
                      textAnchor={anchor}
                      fontSize={17 / s}
                      fontFamily="DM Mono, monospace"
                      fill="var(--muted)"
                      pointerEvents="none"
                    >
                      {activeSub ?? m.sub}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>

      </svg>
    </div>
  );
}
