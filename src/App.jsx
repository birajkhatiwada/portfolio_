import { useEffect, useState, useCallback } from "react";
import "./site.css";
import initLegacy from "./legacy.js";
import Hero from "./Hero.jsx";
import Projects from "./Projects.jsx";
import Timeline from "./Timeline.jsx";
import Skills from "./Skills.jsx";
import Contact from "./Contact.jsx";

const PANELS = [
  { id: "hero",     num: "01", name: "Home" },
  { id: "projects", num: "02", name: "Projects" },
  { id: "timeline", num: "03", name: "Timeline" },
  { id: "skills",   num: "04", name: "Skills" },
  { id: "contact",  num: "05", name: "Contact" },
];

const CONTENT = [Hero, Projects, Timeline, Skills, Contact];

function Panel({ id, num, name, isActive, onClick, children }) {
  return (
    <div
      className={`panel${isActive ? " active" : ""}`}
      id={`panel-${id}`}
      data-panel={id}
      onClick={onClick}
    >
      <div className="plabel">
        <span className="plabel-num">{num}</span>
        <span className="plabel-name">{name}</span>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(0);

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= PANELS.length) return;
    setActive(idx);
  }, []);

  useEffect(() => {
    window.goTo = goTo;
  }, [goTo]);

  useEffect(() => {
    if (window.__legacyInited) return;
    window.__legacyInited = true;
    initLegacy();
  }, []);

  return (
    <>
      <div className="c-dot" id="cd"></div>
      <div className="c-ring" id="cr"></div>

      {/* BOOT SCREEN */}
      <div id="boot">
        <div className="boot-inner">
          <div className="boot-line" id="bl0">
            <span className="g">BIOS v2.4.1</span> — Khatiwada Systems Inc.
          </div>
          <div className="boot-line" id="bl1">
            <span className="d">mem check:</span> <span className="g">16384MB OK</span>
          </div>
          <div className="boot-line" id="bl2">
            <span className="d">cpu:</span> <span className="g">Brain™ 6-core @ 3.2GHz</span>
          </div>
          <div className="boot-line" id="bl3">&nbsp;</div>
          <div className="boot-line" id="bl4">
            <span className="d">loading</span> <span className="g">portfolio.img</span>
            <span className="d">...</span>
          </div>
          <div className="boot-bar-wrap">
            <div className="boot-bar" id="bootBar"></div>
          </div>
          <div className="boot-line" id="bl5">
            <span className="d">mounting</span> <span className="g">/dev/projects</span>{" "}
            <span className="d">→ OK</span>
          </div>
          <div className="boot-line" id="bl6">
            <span className="d">mounting</span> <span className="g">/dev/skills</span>{" "}
            <span className="d">→ OK</span>
          </div>
          <div className="boot-line" id="bl7">
            <span className="d">starting</span> <span className="g">portfolio.service</span>
            <span className="d">...</span>
          </div>
          <div className="boot-line" id="bl8">&nbsp;</div>
          <div className="boot-line" id="bl9">
            <span className="w">[ OK ]</span> <span className="g">System ready.</span> Welcome, visitor.
          </div>
        </div>
      </div>

      <div className="stage">
        {PANELS.map((p, i) => {
          const Content = CONTENT[i];
          return (
            <Panel
              key={p.id}
              {...p}
              isActive={active === i}
              onClick={() => { if (active !== i) goTo(i); }}
            >
              <Content />
            </Panel>
          );
        })}
      </div>


      <div id="secOverlay">
        <div className="sec-cmd" id="secCmd"></div>
      </div>

      {/* STATUS BAR */}
      <div className="sbar">
        <div className="sb-l">
          <span className="sb-name">biraj khatiwada</span>
          <span className="sb-sep">|</span>
          <span className="sb-avail">
            <span className="avail-dot"></span>
            <span>open to work</span>
          </span>
        </div>
        <div className="sb-c">
          <div className="ticker">
            <span className="ticker-lbl" id="tLbl">now</span>
            <span className="ticker-val" id="tVal">...</span>
          </div>
        </div>
        <div className="sb-r">
          <span id="sbWx">☀ Bay Area, CA</span>
          <span className="sb-sep">|</span>
          <span id="sbClk">--:--:-- PT</span>
          <span className="sb-sep">|</span>
          <select
            id="wxPicker"
            title="Simulate weather"
            onChange={(e) => {
              if (e.target.value) window._testWeather(e.target.value);
            }}
          >
            <option value="">🌐 auto</option>
            <option value="clear">☀ clear</option>
            <option value="cloudy">⛅ cloudy</option>
            <option value="rain">🌧 rain</option>
            <option value="snow">❄ snow</option>
            <option value="fog">🌫 fog</option>
            <option value="storm">⛈ storm</option>
          </select>
          <span className="sb-sep">|</span>
          <span
            className="sb-term-badge"
            id="termBadge"
            title="Open terminal (` key)"
            onClick={() => window.ftermToggle()}
          >
            &#96; terminal
          </span>
        </div>
      </div>

{/* KONAMI OVERLAY */}
      <div id="konamiOverlay">
        <div className="konami-flash" id="konamiFlash"></div>
        <div className="konami-screen"></div>
        <div className="konami-scan"></div>
        <div className="konami-vignette"></div>
        <div className="konami-content" id="konamiContent">
          <div className="konami-log" id="konamiLog"></div>
          <div className="konami-granted" id="konamiGranted" data-text="ACCESS GRANTED">
            ACCESS GRANTED
          </div>
          <div className="konami-sub" id="konamiSubtitle">[ click anywhere to exit ]</div>
        </div>
      </div>

      {/* FLOATING TERMINAL */}
      <div className="fterm" id="fterm">
        <div className="fterm-bar" id="ftermBar">
          <div className="fterm-dots">
            <div className="fterm-dot close" id="ftermClose" onClick={() => window.ftermToggle(false)}></div>
            <div className="fterm-dot min"></div>
            <div className="fterm-dot max"></div>
          </div>
          <div className="fterm-title">biraj@portfolio: ~</div>
          <div className="fterm-shortcut">` to toggle</div>
        </div>
        <div className="fterm-output" id="ftermOutput"></div>
        <div className="fterm-input-row">
          <span className="fterm-prompt">biraj@portfolio:~$</span>
          <input
            className="fterm-input"
            id="ftermInput"
            type="text"
            placeholder="type a command..."
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>

      <div id="lightning"></div>
    </>
  );
}
