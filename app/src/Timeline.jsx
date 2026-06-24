import { useState, useRef, useCallback } from "react";
import LocationMap from "./LocationMap.jsx";

const EVENTS = [
  {
    date: "2026 — Present",
    type: "edu",
    title: "Georgia Tech OMSCS",
    role: "M.S. Computer Science",
    markerId: "gatech",
    bullets: ["Online Master of Science in Computer Science — currently ongoing"],
  },
  {
    date: "Nov 2022 — Present",
    type: "work",
    title: "Odoo",
    role: "Software Engineer",
    markerId: "sf",
    bullets: [
      "Developed and maintained the Odoo ERP system — a comprehensive business management platform spanning finance, CRM, and inventory",
      "Built and shipped full-stack features across Python/Odoo ORM backend and OWL frontend framework",
    ],
  },
  {
    date: "Jan 2021 — Mar 2022",
    type: "work",
    title: "Tesla",
    role: "Autopilot Engineer",
    markerId: "sanmateo",
    bullets: [
      "Analyzed critical sensor & camera data to improve Autopilot neural network performance using a specialized software interface",
      "Collaborated with the Computer Vision Engineering team to identify and resolve software interface gaps",
      "Led weekly team syncs on quality standards and common annotation mistakes",
    ],
  },
  {
    date: "Aug 2018 — May 2020",
    type: "edu",
    title: "Sonoma State University",
    role: "B.S. Computer Science",
    markerId: "rohnertpark",
    bullets: [],
  },
  {
    date: "Aug 2016 — May 2018",
    type: "edu",
    title: "Santa Rosa Junior College",
    role: "Community College",
    markerId: "santarosa",
    bullets: ["Completed core CS curriculum before transferring to SSU"],
  },
  {
    date: "Jan 2016 — May 2016",
    type: "edu",
    title: "Upper Iowa University",
    role: "Computer Science",
    markerId: "iowa",
    bullets: ["One semester before transferring to Santa Rosa Junior College"],
  },
];

export default function Timeline() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const clearTimer = useRef(null);

  const handleEnter = useCallback((i) => {
    clearTimeout(clearTimer.current);
    setHoveredIndex(i);
    setActiveMarkerId(EVENTS[i].markerId);
  }, []);

  const handleLeave = useCallback(() => {
    // keep active state — clears only when another event is hovered
  }, []);

  const active = hoveredIndex !== null ? EVENTS[hoveredIndex] : null;

  return (
    <div className="panel" id="panel-timeline" data-panel="timeline">
      <div className="plabel">
        <span className="plabel-num">03</span>
        <span className="plabel-name">Timeline</span>
      </div>

      <div className="tl-layout">

        {/* LEFT — original scrollable event list */}
        <div className="tl-scroll">
          <div className="sec-tag">Career Path</div>
          <div className="sec-title">My <em>Journey</em></div>
          <div className="tl-track">
            {EVENTS.map((ev, i) => (
              <div
                key={i}
                className={`tl-event${hoveredIndex === i ? " tl-event--active" : ""}`}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={handleLeave}
              >
                <div className={`tl-dot tl-dot--${ev.type}`} />
                <div className="tl-date">{ev.date}</div>
                <div className="tl-title">{ev.title}</div>
                {ev.role && <div className="tl-role">{ev.role}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — map on top, description slides in below on hover */}
        <div className="tl-right">
          <LocationMap
            activeId={activeMarkerId}
            activeLabel={active?.title ?? null}
            activeSub={active?.role ?? null}
          />

          <div className={`tl-right-detail${active ? " tl-right-detail--open" : ""}`}>
            {active && (
              <>
                <div className="tl-date">{active.date}</div>
                <div className="tl-detail-title">{active.title}</div>
                {active.role && (
                  <div className={`tl-role${active.type === "edu" ? " tl-role--edu" : ""}`}>
                    {active.role}
                  </div>
                )}
                {active.bullets.length > 0 && (
                  <ul className="tl-detail-bullets">
                    {active.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
