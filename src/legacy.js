// Ported from the static site's script.js — runs once after the DOM mounts.
// Globe/COBE init intentionally omitted; Timeline panel shows a static placeholder.
export default function initLegacy() {
// ── LIVE CONFIG — fill these in to make the portfolio dynamic ──
const LIVE = {
  github: "birajkhatiwada",
  lastfm: { user: "", key: "" },
  gist: "38cd787092c9322d819632935627ae96",
};

// ── CURSOR ──
const cd = document.getElementById("cd"),
  cr = document.getElementById("cr");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cd.style.left = mx + "px";
  cd.style.top = my + "px";
});
(function ar() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cr.style.left = rx + "px";
  cr.style.top = ry + "px";
  requestAnimationFrame(ar);
})();
document
  .querySelectorAll("a,button,.pcard,.panel:not(.active),.sname")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("ch"));
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("ch")
    );
  });

// ── MAGNET ──
document.querySelectorAll("a:not(.no-magnet), button:not(.no-magnet)").forEach((el) => {
  let leaveTimer = null;
  el.addEventListener("mouseenter", () => {
    clearTimeout(leaveTimer);
    el.style.transition = "transform 0.08s linear";
  });
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transform = "";
    leaveTimer = setTimeout(() => { el.style.transition = ""; }, 600);
  });
});

// ── PANELS ──
const panelIds = ["hero", "projects", "timeline", "skills", "contact"];
let cur = 0,
  transitioning = false;

function goTo(idx) {
  if (idx < 0 || idx >= panelIds.length || transitioning) return;
  transitioning = true;
  cur = idx;
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("panel-" + panelIds[idx]).classList.add("active");
  const sh = document.querySelector(".scroll-hint");
  if (sh) sh.style.opacity = idx === 0 ? "" : 0;
  applyFx();
  showSecCmd(panelIds[idx]);
  setTimeout(() => (transitioning = false), 900);
}
window.goTo = goTo;

// click idle panel
document.querySelectorAll(".panel").forEach((p) => {
  p.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    if (!p.classList.contains("active"))
      goTo(panelIds.indexOf(p.dataset.panel));
  });
});


// ── SCROLL / KEYBOARD / TOUCH ──
let wAcc = 0,
  wTimer = null,
  lastW = 0;

let ty = 0;
window.addEventListener(
  "touchstart",
  (e) => {
    ty = e.touches[0].clientY;
  },
  { passive: true }
);
window.addEventListener("touchend", (e) => {
  const dy = ty - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 50) goTo(dy > 0 ? cur + 1 : cur - 1);
});

// ── TYPEWRITER ──
(function () {
  const el = document.getElementById("heroName");
  const cursor = document.getElementById("twc");
  const lines = [
    { t: "Building", g: false },
    { t: "digital", g: true },
    { t: "things.", g: false },
  ];
  const spans = lines.map((l, i) => {
    const s = document.createElement("span");
    if (l.g) s.classList.add("gw");
    el.insertBefore(s, cursor);
    if (i < lines.length - 1)
      el.insertBefore(document.createElement("br"), cursor);
    return s;
  });
  let li = 0,
    ci = 0;
  function type() {
    if (li >= lines.length) return;
    if (ci < lines[li].t.length) {
      spans[li].textContent += lines[li].t[ci++];
      setTimeout(type, 65);
    } else {
      li++;
      ci = 0;
      if (li < lines.length) setTimeout(type, 220);
      else
        setTimeout(() => {
          cursor.style.transition = "opacity .6s";
          cursor.style.opacity = "0";
        }, 1400);
    }
  }
  setTimeout(type, 500);
})();

// ── PROJECT CARD GLOW ──
document.querySelectorAll(".pcard").forEach((c) => {
  c.addEventListener("mousemove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    c.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
  });
});

// ── CLOCK ──
function tick() {
  const pt = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );
  document.getElementById("sbClk").textContent =
    String(pt.getHours()).padStart(2, "0") +
    ":" +
    String(pt.getMinutes()).padStart(2, "0") +
    ":" +
    String(pt.getSeconds()).padStart(2, "0") +
    " PT";
}
tick();
setInterval(tick, 1000);

// ── WEATHER ──
(function () {
  function hexToRgb(h) {
    var r = parseInt(h.slice(1, 3), 16),
      g = parseInt(h.slice(3, 5), 16),
      b = parseInt(h.slice(5, 7), 16);
    return r + "," + g + "," + b;
  }

  var T = {
    clear: {
      g: "#4ade80", gd: "#22c55e", gm: "#166534", bg: "#080c09", s: "#0d1410", s2: "#111a13",
      glow: "rgba(74,222,128,0.12)", glow2: "rgba(74,222,128,0.06)", b: "rgba(74,222,128,0.1)",
      rc: "rgba(74,222,128,0.22)", al: "#86efac", ri: "rgba(74,222,128,0.45)", rh: "rgba(74,222,128,0.2)",
      gs: "rgba(74,222,128,0.8)", gm2: "rgba(74,222,128,0.4)", ph: "#0f1a11", fx: "parts", icon: "☀",
    },
    cloudy: {
      g: "#6ee7b7", gd: "#34d399", gm: "#065f46", bg: "#060a08", s: "#0b1210", s2: "#0f1812",
      glow: "rgba(110,231,183,0.10)", glow2: "rgba(110,231,183,0.05)", b: "rgba(110,231,183,0.10)",
      rc: "rgba(110,231,183,0.18)", al: "#a7f3d0", ri: "rgba(110,231,183,0.45)", rh: "rgba(110,231,183,0.2)",
      gs: "rgba(110,231,183,0.75)", gm2: "rgba(110,231,183,0.35)", ph: "#0c1812", fx: null, icon: "⛅",
    },
    rain: {
      g: "#38bdf8", gd: "#0ea5e9", gm: "#0c4a6e", bg: "#04080f", s: "#070e18", s2: "#0a1420",
      glow: "rgba(56,189,248,0.12)", glow2: "rgba(56,189,248,0.06)", b: "rgba(56,189,248,0.10)",
      rc: "rgba(56,189,248,0.28)", al: "#7dd3fc", ri: "rgba(56,189,248,0.45)", rh: "rgba(56,189,248,0.2)",
      gs: "rgba(56,189,248,0.8)", gm2: "rgba(56,189,248,0.4)", ph: "#091520", fx: "rain", icon: "🌧",
    },
    snow: {
      g: "#bae6fd", gd: "#7dd3fc", gm: "#0c4a6e", bg: "#030710", s: "#060c1a", s2: "#081020",
      glow: "rgba(186,230,253,0.10)", glow2: "rgba(186,230,253,0.05)", b: "rgba(186,230,253,0.12)",
      rc: "rgba(186,230,253,0.20)", al: "#e0f2fe", ri: "rgba(186,230,253,0.45)", rh: "rgba(186,230,253,0.2)",
      gs: "rgba(186,230,253,0.7)", gm2: "rgba(186,230,253,0.3)", ph: "#07101e", fx: "snow", icon: "❄",
    },
    fog: {
      g: "#94a3b8", gd: "#64748b", gm: "#1e293b", bg: "#06080b", s: "#0b0e12", s2: "#0e1318",
      glow: "rgba(148,163,184,0.08)", glow2: "rgba(148,163,184,0.04)", b: "rgba(148,163,184,0.12)",
      rc: "rgba(148,163,184,0.15)", al: "#cbd5e1", ri: "rgba(148,163,184,0.45)", rh: "rgba(148,163,184,0.2)",
      gs: "rgba(148,163,184,0.65)", gm2: "rgba(148,163,184,0.3)", ph: "#0c1015", fx: null, icon: "🌫",
    },
    storm: {
      g: "#c084fc", gd: "#a855f7", gm: "#4c1d95", bg: "#03010a", s: "#060314", s2: "#09051c",
      glow: "rgba(192,132,252,0.12)", glow2: "rgba(192,132,252,0.06)", b: "rgba(192,132,252,0.12)",
      rc: "rgba(192,132,252,0.25)", al: "#d8b4fe", ri: "rgba(192,132,252,0.45)", rh: "rgba(192,132,252,0.2)",
      gs: "rgba(192,132,252,0.8)", gm2: "rgba(192,132,252,0.4)", ph: "#09031a", fx: "rain", icon: "⛈",
    },
  };

  function codeToType(c) {
    if (c === 0) return "clear";
    if (c <= 3) return "cloudy";
    if (c <= 48) return "fog";
    if (c <= 67) return "rain";
    if (c <= 77) return "snow";
    if (c <= 82) return "rain";
    if (c <= 86) return "snow";
    return "storm";
  }

  var _lastTemp = 72,
    _lastLoc = "Bay Area";
  window._testWeather = function (type) {
    applyTheme(type, _lastTemp, _lastLoc);
  };

  function applyTheme(type, temp, loc) {
    _lastTemp = temp;
    _lastLoc = loc;
    var t = T[type] || T.clear;
    var r = document.documentElement;
    r.style.setProperty("--green", t.g);
    r.style.setProperty("--green-dim", t.gd);
    r.style.setProperty("--green-muted", t.gm);
    r.style.setProperty("--bg", t.bg);
    r.style.setProperty("--surface", t.s);
    r.style.setProperty("--surface2", t.s2);
    r.style.setProperty("--glow", t.glow);
    r.style.setProperty("--glow2", t.glow2);
    r.style.setProperty("--border", t.b);
    r.style.setProperty("--accent-light", t.al);
    r.style.setProperty("--ring-color", t.ri);
    r.style.setProperty("--ring-hover", t.rh);
    r.style.setProperty("--glow-strong", t.gs);
    r.style.setProperty("--glow-mid", t.gm2);
    r.style.setProperty("--panel-hover", t.ph);
    window._rainColor = t.rc;
    window._accentRGB = hexToRgb(t.g);
    document.getElementById("sbWx").textContent =
      t.icon + " " + Math.round(temp) + "°F  " + loc;
    if (t.fx === "snow") {
      activeFx = "snow";
      document.querySelectorAll(".fx-btn").forEach(function (b) {
        b.classList.remove("active");
      });
    } else if (t.fx) {
      activeFx = t.fx;
      document.querySelectorAll(".fx-btn").forEach(function (b) {
        b.classList.toggle("active", b.dataset.fx === activeFx);
      });
    } else {
      activeFx = null;
      document.querySelectorAll(".fx-btn").forEach(function (b) {
        b.classList.remove("active");
      });
    }
    applyFx();
    if (type === "storm") startLightning();
    if (window._updateGlobe) setTimeout(window._updateGlobe, 80);
    if (typeof sigs !== "undefined") sigs[2].v = loc + " 🌍";
  }

  function doFetch(lat, lon, loc) {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" +
        lat +
        "&longitude=" +
        lon +
        "&current_weather=true&temperature_unit=fahrenheit"
    )
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        applyTheme(
          codeToType(d.current_weather.weathercode),
          d.current_weather.temperature,
          loc
        );
      })
      .catch(function () {});
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        doFetch(pos.coords.latitude, pos.coords.longitude, "your area");
      },
      function () {
        doFetch(37.77, -122.41, "Bay Area");
      }
    );
  } else {
    doFetch(37.77, -122.41, "Bay Area");
  }
})();

// ── TICKER ──
const sigs = [
  { l: "now playing", v: "✦  Tame Impala — Let It Happen" },
  { l: "building", v: "a Q-learning agent in Python" },
  { l: "location", v: "Bay Area, California 🌉" },
  { l: "availability", v: "open to work — DM me anytime" },
  { l: "status", v: "deep focus mode  ▮" },
];
let ti = 0;
const tLbl = document.getElementById("tLbl"),
  tVal = document.getElementById("tVal");
tLbl.textContent = sigs[0].l;
tVal.textContent = sigs[0].v;
setInterval(() => {
  tVal.classList.add("out");
  setTimeout(() => {
    ti = (ti + 1) % sigs.length;
    tLbl.textContent = sigs[ti].l;
    tVal.textContent = sigs[ti].v;
    tVal.classList.remove("out");
    tVal.classList.add("in");
    tVal.getBoundingClientRect();
    tVal.style.cssText = "";
    requestAnimationFrame(() => tVal.classList.remove("in"));
  }, 350);
}, 4000);

// ── FX CANVASES ──
const cvRain = document.getElementById("cvRain");
const cvParts = document.getElementById("cvParts");
const cvSnow = document.getElementById("cvSnow");
let activeFx = "rain";
function applyFx() {
  const on = document.getElementById("panel-hero").classList.contains("active");
  cvRain.style.opacity = on && activeFx === "rain" ? "1" : "0";
  cvParts.style.opacity = on && activeFx === "parts" ? "1" : "0";
  if (cvSnow) cvSnow.style.opacity = on && activeFx === "snow" ? "1" : "0";
}
document.getElementById("fxToggles").addEventListener("click", (e) => {
  const btn = e.target.closest(".fx-btn");
  if (!btn) return;
  e.stopPropagation();
  const fx = btn.dataset.fx;
  activeFx = activeFx === fx ? null : fx;
  document
    .querySelectorAll(".fx-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.fx === activeFx));
  applyFx();
});

function fitCv(cv) {
  const p = cv.parentElement;
  cv.width = p.offsetWidth || 800;
  cv.height = p.offsetHeight || 600;
}
window.addEventListener("resize", () => {
  fitCv(cvRain);
  fitCv(cvParts);
  if (cvSnow) fitCv(cvSnow);
});

// CODE RAIN
(function () {
  const ctx = cvRain.getContext("2d");
  fitCv(cvRain);
  const FS = 13,
    CHARS =
      "ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01{}[]()<>/=+-*&^%$#@!?";
  let drops = [];
  function init() {
    fitCv(cvRain);
    drops = Array.from(
      { length: Math.floor(cvRain.width / FS) },
      () => (Math.random() * -cvRain.height) / FS
    );
  }
  init();
  window.addEventListener("resize", init);
  (function loop() {
    const { width: W, height: H } = cvRain;
    ctx.fillStyle = "rgba(8,12,9,0.08)";
    ctx.fillRect(0, 0, W, H);
    ctx.font = FS + 'px "DM Mono",monospace';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillStyle = window._rainColor || "rgba(74,222,128,0.22)";
      ctx.fillText(
        CHARS[Math.floor(Math.random() * CHARS.length)],
        i * FS,
        drops[i] * FS
      );
      if (drops[i] * FS > H && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.45;
    }
    requestAnimationFrame(loop);
  })();
})();

// PARTICLES
(function () {
  const ctx = cvParts.getContext("2d");
  fitCv(cvParts);
  const N = 55,
    CD = 110;
  let pts = [],
    mox = -999,
    moy = -999;
  function mkP() {
    return {
      x: Math.random() * (cvParts.width || 800),
      y: Math.random() * (cvParts.height || 600),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8,
    };
  }
  function init() {
    fitCv(cvParts);
    pts = Array.from({ length: N }, mkP);
  }
  init();
  window.addEventListener("resize", init);
  document.getElementById("panel-hero").addEventListener("mousemove", (e) => {
    const r = cvParts.getBoundingClientRect();
    mox = e.clientX - r.left;
    moy = e.clientY - r.top;
  });
  document.getElementById("panel-hero").addEventListener("mouseleave", () => {
    mox = -999;
    moy = -999;
  });
  (function loop() {
    const { width: W, height: H } = cvParts;
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x,
          dy = pts[i].y - pts[j].y,
          d = Math.sqrt(dx * dx + dy * dy);
        const ac = window._accentRGB || "74,222,128";
        if (d < CD) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${ac},${(1 - d / CD) * 0.07})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      const dm = Math.sqrt((pts[i].x - mox) ** 2 + (pts[i].y - moy) ** 2);
      const ac2 = window._accentRGB || "74,222,128";
      if (dm < CD * 1.4) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${ac2},${(1 - dm / (CD * 1.4)) * 0.18})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(mox, moy);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, pts[i].r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ac2},0.18)`;
      ctx.fill();
    }
    requestAnimationFrame(loop);
  })();
})();

// SNOW
(function () {
  if (!cvSnow) return;
  const ctx = cvSnow.getContext("2d");
  fitCv(cvSnow);
  const N = 90;
  let flakes = [];
  function mkFlake() {
    return {
      x: Math.random() * (cvSnow.width || 800),
      y: Math.random() * (cvSnow.height || 600),
      r: Math.random() * 2.2 + 0.6,
      speed: Math.random() * 0.55 + 0.25,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.45 + 0.2,
    };
  }
  function init() {
    fitCv(cvSnow);
    flakes = Array.from({ length: N }, mkFlake);
  }
  init();
  window.addEventListener("resize", init);
  (function loop() {
    const { width: W, height: H } = cvSnow;
    ctx.clearRect(0, 0, W, H);
    flakes.forEach((f) => {
      f.y += f.speed;
      f.x += f.drift;
      if (f.y > H + 10) {
        f.y = -10;
        f.x = Math.random() * W;
      }
      if (f.x > W + 10) f.x = -10;
      if (f.x < -10) f.x = W + 10;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(186,230,253," + f.opacity + ")";
      ctx.fill();
    });
    requestAnimationFrame(loop);
  })();
})();

// LIGHTNING
function startLightning() {
  const el = document.getElementById("lightning");
  if (!el || el._started) return;
  el._started = true;
  function flash() {
    const heroActive = document
      .getElementById("panel-hero")
      .classList.contains("active");
    if (heroActive && activeFx === "rain") {
      el.style.opacity = "0.18";
      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => {
          el.style.opacity = "0.09";
          setTimeout(() => {
            el.style.opacity = "0";
          }, 70);
        }, 110);
      }, 55);
    }
    setTimeout(flash, 5000 + Math.random() * 9000);
  }
  setTimeout(flash, 3000 + Math.random() * 4000);
}

// ── DOWNLOAD CV — plays inside floating terminal ──
function downloadCV() {
  var btn = document.getElementById("btnCV");
  btn.classList.add("compiling");
  ftermToggle(true);
  document.querySelector(".fterm-title").textContent = "compiling resume.pdf";
  ftermOut.innerHTML = "";
  var steps = [
    [80, '<span style="color:var(--muted)">$</span> <span style="color:var(--green)">init</span> biraj_khatiwada_cv'],
    [400, '<span style="color:var(--muted)">›</span> loading experience.json &nbsp;<span style="color:var(--green)">✓</span>'],
    [700, '<span style="color:var(--muted)">›</span> compiling skills.ts &nbsp;<span style="color:var(--green)">✓</span>'],
    [1000, '<span style="color:var(--muted)">›</span> bundling projects/* &nbsp;<span style="color:var(--green)">✓</span>'],
    [1300, '<span style="color:var(--muted)">›</span> optimizing output... &nbsp;<span style="color:var(--green)">✓</span>'],
    [1700, '<span style="color:var(--green)">✦ biraj_khatiwada_cv.pdf — ready</span>'],
  ];
  steps.forEach(function (s) {
    setTimeout(function () {
      ftermLine(s[1]);
    }, s[0]);
  });
  setTimeout(function () {
    var a = document.createElement("a");
    a.href = "#";
    a.download = "biraj_khatiwada_cv.pdf";
    a.click();
    btn.classList.remove("compiling");
    setTimeout(function () {
      document.querySelector(".fterm-title").textContent = "biraj@portfolio: ~";
    }, 1200);
  }, 2300);
}
window.downloadCV = downloadCV;

// ── BOOT SEQUENCE ──
(function () {
  const steps = [
    { id: "bl0", delay: 100 },
    { id: "bl1", delay: 400 },
    { id: "bl2", delay: 650 },
    { id: "bl3", delay: 850 },
    { id: "bl4", delay: 1000 },
    { id: "bl5", delay: 1850 },
    { id: "bl6", delay: 2050 },
    { id: "bl7", delay: 2250 },
    { id: "bl8", delay: 2400 },
    { id: "bl9", delay: 2550 },
  ];
  steps.forEach((s) =>
    setTimeout(() => {
      const el = document.getElementById(s.id);
      if (el) el.classList.add("show");
    }, s.delay)
  );
  setTimeout(() => {
    const bar = document.getElementById("bootBar");
    let pct = 0;
    const iv = setInterval(() => {
      pct += 2;
      bar.style.width = pct + "%";
      if (pct >= 100) clearInterval(iv);
    }, 16);
  }, 1050);
  setTimeout(() => {
    const boot = document.getElementById("boot");
    boot.classList.add("hide");
    setTimeout(() => boot.remove(), 900);
  }, 3100);
})();

// ── SECTION TRANSITION CMD ──
const secNames = {
  hero: "~ cd home",
  projects: "~ ls ./projects",
  timeline: "~ cat timeline.log",
  skills: "~ ls ./skills",
  contact: "~ ssh contact@biraj.dev",
};
function showSecCmd(id) {
  const el = document.getElementById("secCmd");
  if (!el) return;
  el.textContent = secNames[id] || "";
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1400);
}

// ── FLOATING TERMINAL ──
var ftermEl = document.getElementById("fterm");
var ftermInput = document.getElementById("ftermInput");
var ftermOut = document.getElementById("ftermOutput");
var ftermOpen = false;
var cmdHistory = [];
var histIdx = -1;

function ftermToggle(force) {
  ftermOpen = force !== undefined ? Boolean(force) : !ftermOpen;
  if (ftermOpen) {
    ftermEl.classList.add("open");
    setTimeout(function () {
      ftermInput.focus();
    }, 80);
    if (ftermOut.children.length === 0) ftermWelcome();
  } else {
    ftermEl.classList.remove("open");
  }
}
window.ftermToggle = ftermToggle;

function ftermLine(content, cls) {
  var d = document.createElement("div");
  d.className = "fterm-line" + (cls ? " " + cls : "");
  d.innerHTML = content;
  ftermOut.appendChild(d);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      d.classList.add("vis");
    });
  });
  ftermOut.scrollTop = ftermOut.scrollHeight;
}

function ftermWelcome() {
  ftermLine(
    '<span style="color:var(--green)">biraj@portfolio</span> <span style="color:var(--muted)">—  interactive terminal</span>'
  );
  ftermLine(
    '<span style="color:var(--muted)">────────────────────────────────</span>'
  );
  ftermLine(
    'Type <span style="color:var(--green)">help</span> to see available commands.'
  );
  ftermLine("");
}

var ftermCmds = {
  help: function () {
    ftermLine('<span style="color:var(--green)">commands</span>');
    ftermLine(
      '<span style="color:var(--muted)">────────────────────────────────────────</span>'
    );
    [
      ["goto &lt;section&gt;", "home | projects | timeline | skills | contact"],
      ["whoami", "info about biraj"],
      ["ls", "list sections"],
      ["cat about.txt", "about blurb"],
      ["status", "availability"],
      ["theme &lt;fx&gt;", "rain | parts | off"],
      ["date", "current time PT"],
      ["clear", "clear terminal"],
      ["exit", "close terminal"],
    ].forEach(function (row) {
      ftermLine(
        '<span style="color:var(--green);display:inline-block;min-width:170px">' +
          row[0] +
          '</span><span style="color:var(--muted)">' +
          row[1] +
          "</span>"
      );
    });
  },
  whoami: function () {
    ftermLine('<span style="color:var(--green)">biraj khatiwada</span>');
    ftermLine(
      '<span style="color:var(--muted)">role    </span> full-stack engineer'
    );
    ftermLine('<span style="color:var(--muted)">location</span> bay area, ca');
    ftermLine(
      '<span style="color:var(--muted)">email   </span> khatiwadabiraj10@gmail.com'
    );
    ftermLine(
      '<span style="color:var(--muted)">status  </span> <span style="color:var(--green)">● open to work</span>'
    );
  },
  ls: function () {
    ftermLine(
      '<span style="color:var(--green)">home/</span>  projects/  timeline/  skills/  contact/'
    );
  },
  status: function () {
    ftermLine(
      '<span style="color:var(--green)">●</span> open to work — full-time &amp; freelance'
    );
  },
  pwd: function () {
    ftermLine("/home/visitor/portfolio");
  },
  date: function () {
    ftermLine(
      '<span style="color:var(--green)">' +
        new Date().toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
        }) +
        " PT</span>"
    );
  },
  clear: function () {
    ftermOut.innerHTML = "";
  },
  exit: function () {
    ftermToggle(false);
  },
  goto: function (args) {
    var map = { home: 0, projects: 1, timeline: 2, skills: 3, contact: 4 };
    var t = (args[0] || "").toLowerCase();
    if (map[t] !== undefined) {
      ftermLine(
        '<span style="color:var(--green)">→</span> navigating to ' + t + "..."
      );
      setTimeout(function () {
        goTo(map[t]);
      }, 500);
    } else
      ftermLine(
        '<span style="color:#f87171">error:</span> try: home | projects | timeline | skills | contact'
      );
  },
  theme: function (args) {
    var fx = (args[0] || "").toLowerCase();
    if (fx === "off") {
      activeFx = null;
      document.querySelectorAll(".fx-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      applyFx();
      ftermLine('<span style="color:var(--green)">✓</span> fx off');
    } else if (fx === "rain" || fx === "parts") {
      activeFx = fx;
      document.querySelectorAll(".fx-btn").forEach(function (b) {
        b.classList.toggle("active", b.dataset.fx === activeFx);
      });
      applyFx();
      ftermLine('<span style="color:var(--green)">✓</span> theme → ' + fx);
    } else
      ftermLine(
        '<span style="color:#f87171">usage:</span> theme rain | parts | off'
      );
  },
};
ftermCmds["cat about.txt"] = function () {
  ftermLine("I build high-performance web experiences at the");
  ftermLine("intersection of engineering and design.");
  ftermLine("6+ years · 40+ projects · 12 happy clients.");
};

ftermInput.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  var raw = ftermInput.value.trim();
  if (!raw) return;
  ftermLine('<span style="color:var(--muted)">$</span> ' + raw, "cmd-echo");
  cmdHistory.push(raw);
  histIdx = -1;
  ftermInput.value = "";
  var lraw = raw.toLowerCase();
  if (ftermCmds[lraw]) {
    ftermCmds[lraw]([]);
    return;
  }
  var parts = raw.trim().split(" ");
  var cmd = parts[0].toLowerCase();
  var args = parts.slice(1);
  if (ftermCmds[cmd]) ftermCmds[cmd](args);
  else
    ftermLine(
      '<span style="color:#f87171">not found:</span> ' +
        cmd +
        ' &nbsp;—&nbsp; type <span style="color:var(--green)">help</span>'
    );
});

// ── VISITOR COUNTER (easter egg) ──
var visitCount = parseInt(localStorage.getItem("bk_visits") || "0") + 1;
localStorage.setItem("bk_visits", visitCount);
var displayCount = 10482 + visitCount;
ftermCmds["cat visitors.txt"] = function () {
  ftermLine('<span style="color:var(--muted)"># visitors.txt</span>');
  ftermLine('<span style="color:var(--muted)">────────────────────────</span>');
  ftermLine(
    'You are visitor <span style="color:var(--green);font-size:15px">#' +
      displayCount.toLocaleString() +
      "</span>"
  );
  ftermLine("");
  ftermLine(
    '<span style="color:var(--muted)">★ Welcome to my corner of the internet.</span>'
  );
  ftermLine(
    '<span style="color:var(--muted)">  Since 2024. Hand-crafted with ♥ in Bay Area.</span>'
  );
  ftermLine("");
  ftermLine(
    [
      "╔══════════════════════════╗",
      "║  You have been visited   ║",
      "║  ✦ " + displayCount.toLocaleString().padStart(10) + " times ✦  ║",
      "╚══════════════════════════╝",
    ]
      .map(
        (l) => '<span style="color:var(--green);opacity:.5">' + l + "</span>"
      )
      .join("<br>")
  );
};

// Update help to include new commands
var _oldHelp = ftermCmds.help;
ftermCmds.help = function () {
  _oldHelp();
  ftermLine("");
  ftermLine(
    '<span style="color:var(--muted)">  cat visitors.txt &nbsp;&nbsp;secret visitor counter</span>'
  );
  ftermLine(
    '<span style="color:var(--muted)">  ask &lt;question&gt; &nbsp;&nbsp;&nbsp;ask biraj anything (AI)</span>'
  );
  ftermLine(
    '<span style="color:var(--muted)">  setkey &lt;sk-ant-...&gt; set Anthropic API key</span>'
  );
  if (LIVE.github) {
    ftermLine(
      '<span style="color:var(--muted)">  git log &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;live commits from GitHub</span>'
    );
    ftermLine(
      '<span style="color:var(--muted)">  github &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;github activity summary</span>'
    );
    ftermLine(
      '<span style="color:var(--muted)">  repos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;recent public repos</span>'
    );
  }
};

// ── ASK COMMAND (Claude API) ──
var _apiKey = sessionStorage.getItem("bk_apikey") || "";

ftermCmds["setkey"] = function (args) {
  var key = args[0] || "";
  if (!key || !key.startsWith("sk-ant-")) {
    ftermLine(
      '<span style="color:#f87171">invalid key</span> — should start with sk-ant-'
    );
    ftermLine(
      '<span style="color:var(--muted)">usage: setkey sk-ant-api03-...</span>'
    );
    return;
  }
  _apiKey = key;
  sessionStorage.setItem("bk_apikey", key);
  ftermLine(
    '<span style="color:var(--green)">✓</span> API key saved for this session.'
  );
  ftermLine(
    '<span style="color:var(--muted)">you can now use: ask &lt;question&gt;</span>'
  );
};

ftermCmds["ask"] = function (args) {
  var question = args.join(" ").trim();
  if (!question) {
    ftermLine(
      '<span style="color:#f87171">usage:</span> ask &lt;your question&gt;'
    );
    ftermLine(
      '<span style="color:var(--muted)">e.g.  ask what stack do you use?</span>'
    );
    return;
  }
  if (!_apiKey) {
    ftermLine(
      '<span style="color:#facc15">⚠ API key required to use ask.</span>'
    );
    ftermLine(
      '<span style="color:var(--muted)">run: <span style="color:var(--green)">setkey sk-ant-api03-...</span></span>'
    );
    ftermLine(
      '<span style="color:var(--muted)">get a key at console.anthropic.com</span>'
    );
    return;
  }
  ftermLine('<span style="color:var(--muted)">› thinking...</span>');
  var systemPrompt = [
    "You are Biraj Khatiwada portfolio assistant, answering questions on his behalf in first person.",
    "Keep answers short (2-4 sentences max), conversational and terminal-friendly (no markdown, no bullet points, no headers).",
    "About Biraj: Full-stack engineer based in Bay Area, CA. 6+ years experience.",
    "Stack: React, Next.js, TypeScript, Node.js, Go, Rust, PostgreSQL, Redis, Docker, AWS.",
    "Projects: Meridian Analytics (real-time data viz, 2M+ events/day), Fauna CMS (80+ publishers), Volta CLI (2k+ GitHub stars), Hollow UI (component library).",
    "Work: Senior SWE at Vercel (2022-present), Full-stack at Notion (2020-2022), Frontend at Stripe (2018-2020).",
    "Education: B.S. CS Carnegie Mellon University. Exchange at ETH Zurich.",
    "Status: Open to work. Email: khatiwadabiraj10@gmail.com.",
    "Hobbies: houseplants, Bay Area day trips, Q-learning side projects.",
    "If asked something unknown, be honest and friendly.",
  ].join(" ");
  fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": _apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      var lines = ftermOut.querySelectorAll(".fterm-line");
      var last = lines[lines.length - 1];
      if (last && last.textContent.includes("thinking")) last.remove();
      if (data.error) {
        ftermLine(
          '<span style="color:#f87171">API error:</span> ' + data.error.message
        );
        return;
      }
      var text =
        (data.content && data.content[0] && data.content[0].text) ||
        "No response.";
      var sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
      sentences.forEach(function (s, i) {
        setTimeout(function () {
          var trimmed = s.trim();
          if (trimmed)
            ftermLine('<span style="color:var(--text)">' + trimmed + "</span>");
        }, i * 200);
      });
    })
    .catch(function (err) {
      var lines = ftermOut.querySelectorAll(".fterm-line");
      var last = lines[lines.length - 1];
      if (last && last.textContent.includes("thinking")) last.remove();
      ftermLine(
        '<span style="color:#f87171">error:</span> ' +
          (err.message || "request failed")
      );
    });
};

// ── KONAMI CODE ──
var konamiSeq = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
var konamiIdx = 0;
var konamiActive = false;

function triggerKonami() {
  if (konamiActive) return;
  konamiActive = true;
  var overlay = document.getElementById("konamiOverlay");
  var flash = document.getElementById("konamiFlash");
  var logEl = document.getElementById("konamiLog");
  var granted = document.getElementById("konamiGranted");
  var subtitle = document.getElementById("konamiSubtitle");
  logEl.innerHTML = "";
  granted.classList.remove("vis");
  subtitle.classList.remove("vis");
  overlay.classList.remove("off");
  flash.classList.remove("pop");
  void flash.offsetWidth;
  flash.classList.add("pop");
  setTimeout(function () {
    overlay.classList.add("on");
  }, 60);
  function kLine(html, delay) {
    setTimeout(function () {
      var d = document.createElement("div");
      d.className = "konami-log-line";
      d.innerHTML = html;
      logEl.appendChild(d);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          d.classList.add("vis");
        });
      });
    }, delay);
  }
  kLine('<span class="k-dim">// system integrity check...</span>', 300);
  kLine(
    '<span class="k-dim">scanning </span><span class="k-bright">portfolio.img</span><span class="k-dim">................</span><span class="k-bright"> PASS</span>',
    500
  );
  kLine(
    '<span class="k-dim">verifying </span><span class="k-bright">konami.key</span><span class="k-dim">......................</span><span class="k-bright"> MATCH</span>',
    750
  );
  kLine('<span class="k-warn">⚠ elevated privileges detected</span>', 1000);
  kLine(
    '<span class="k-dim">bypassing </span><span class="k-bright">auth_layer_1</span><span class="k-dim">...................</span><span class="k-red"> OVERRIDE</span>',
    1200
  );
  kLine(
    '<span class="k-dim">bypassing </span><span class="k-bright">auth_layer_2</span><span class="k-dim">...................</span><span class="k-red"> OVERRIDE</span>',
    1380
  );
  kLine(
    '<span class="k-bright">root@portfolio:~#</span><span class="k-dim"> sudo unlock --all</span>',
    1600
  );
  kLine('<span class="k-warn">[ unlocking secrets... ]</span>', 1820);
  setTimeout(function () {
    granted.classList.add("vis");
  }, 2200);
  setTimeout(function () {
    subtitle.classList.add("vis");
  }, 2600);
  if (ftermOpen) {
    ftermLine(
      '<span style="color:var(--green)">✦</span> <span style="color:#facc15">KONAMI CODE ACTIVATED — root access granted</span>'
    );
  }
  function exitKonami() {
    overlay.classList.add("off");
    overlay.classList.remove("on");
    setTimeout(function () {
      overlay.classList.remove("off");
      konamiActive = false;
      konamiIdx = 0;
    }, 350);
    overlay.removeEventListener("click", exitKonami);
    document.removeEventListener("keydown", exitOnKey);
  }
  function exitOnKey(e) {
    if (konamiActive && e.key !== "ArrowUp" && e.key !== "ArrowDown")
      exitKonami();
  }
  setTimeout(function () {
    overlay.addEventListener("click", exitKonami);
    document.addEventListener("keydown", exitOnKey);
  }, 2700);
  setTimeout(function () {
    if (konamiActive) exitKonami();
  }, 9000);
}

// Single unified keydown handler
window.addEventListener(
  "keydown",
  function (e) {
    var activeEl = document.activeElement;
    var inFormField =
      activeEl &&
      (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") &&
      activeEl !== ftermInput;

    if (e.key === "`" && !inFormField) {
      e.preventDefault();
      e.stopImmediatePropagation();
      ftermToggle();
      return;
    }
    if (e.key === "Escape" && ftermOpen) {
      ftermToggle(false);
      return;
    }
    if (ftermOpen && activeEl === ftermInput) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (histIdx < cmdHistory.length - 1) {
          histIdx++;
          ftermInput.value = cmdHistory[cmdHistory.length - 1 - histIdx] || "";
        }
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx > 0) {
          histIdx--;
          ftermInput.value = cmdHistory[cmdHistory.length - 1 - histIdx] || "";
        } else {
          histIdx = -1;
          ftermInput.value = "";
        }
      }
      return;
    }
    if (!inFormField && !ftermOpen) {
      if (e.key === konamiSeq[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === konamiSeq.length) {
          triggerKonami();
          return;
        }
        if (konamiIdx > 0) {
          e.preventDefault();
          return;
        }
      } else {
        konamiIdx = e.key === konamiSeq[0] ? 1 : 0;
      }
    }
    if (konamiIdx === 0) {
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault();
        goTo(cur + 1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(cur - 1);
      }
    }
  },
  true
);

// Drag terminal
(function () {
  var bar = document.getElementById("ftermBar");
  var dragging = false,
    ox = 0,
    oy = 0;
  bar.addEventListener("mousedown", function (e) {
    if (e.target.classList.contains("fterm-dot")) return;
    dragging = true;
    var r = ftermEl.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    ftermEl.style.transition = "none";
  });
  document.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    ftermEl.style.left = e.clientX - ox + "px";
    ftermEl.style.top = e.clientY - oy + "px";
    ftermEl.style.right = "auto";
    ftermEl.style.bottom = "auto";
  });
  document.addEventListener("mouseup", function () {
    dragging = false;
    ftermEl.style.transition = "";
  });
})();

// ── LIVE DATA ──
(function () {
  function relTime(iso) {
    var h = Math.round((Date.now() - new Date(iso)) / 3.6e6);
    return h < 1
      ? "just now"
      : h === 1
      ? "1h ago"
      : h < 24
      ? h + "h ago"
      : Math.round(h / 24) + "d ago";
  }
  function dim(s) {
    return '<span style="color:var(--muted)">' + s + "</span>";
  }
  function grn(s) {
    return '<span style="color:var(--green)">' + s + "</span>";
  }

  // ── GITHUB ──
  if (LIVE.github) {
    fetch("https://api.github.com/users/" + LIVE.github + "/events?per_page=50")
      .then(function (r) {
        return r.json();
      })
      .then(function (ev) {
        if (!Array.isArray(ev)) return;
        var pushes = ev.filter(function (e) {
          return e.type === "PushEvent";
        });
        if (!pushes.length) return;

        var lastRepo = pushes[0].repo.name.split("/")[1];
        var lastWhen = relTime(pushes[0].created_at);

        sigs[4].l = "last commit";
        sigs[4].v = lastWhen + " · " + lastRepo;

        var latestCommits = pushes[0].payload.commits || [];
        if (latestCommits.length) {
          var msg =
            latestCommits[latestCommits.length - 1].message.split("\n")[0];
          if (!LIVE.gist) sigs[1].v = lastRepo + " — " + msg;
        }

        var log = [];
        pushes.forEach(function (e) {
          var repo = e.repo.name.split("/")[1];
          var when = relTime(e.created_at);
          (e.payload.commits || [])
            .slice()
            .reverse()
            .forEach(function (c) {
              log.push({
                hash: c.sha.slice(0, 7),
                msg: c.message.split("\n")[0],
                repo: repo,
                when: when,
              });
            });
        });

        ftermCmds["git log"] = function () {
          ftermLine(
            grn("commit log") + " " + dim("— github.com/" + LIVE.github)
          );
          ftermLine(dim("────────────────────────────────────────────────"));
          log.slice(0, 12).forEach(function (l) {
            ftermLine(
              '<span style="color:var(--green);opacity:.65">' +
                l.hash +
                "</span>  " +
                dim(l.repo.padEnd(18)) +
                '<span style="color:var(--text)">' +
                l.msg.slice(0, 48) +
                (l.msg.length > 48 ? "…" : "") +
                "</span>  " +
                dim(l.when)
            );
          });
        };

        ftermCmds["git"] = function (args) {
          if ((args[0] || "").toLowerCase() === "log") ftermCmds["git log"]([]);
          else ftermLine(dim("usage: ") + grn("git log"));
        };

        ftermCmds["github"] = function () {
          ftermLine(grn("●") + " github.com/" + LIVE.github);
          ftermLine(dim("last push  ") + lastWhen + " on " + grn(lastRepo));
          ftermLine(dim("run ") + grn("git log") + dim(" to see commits"));
        };
      })
      .catch(function () {});

    fetch(
      "https://api.github.com/users/" +
        LIVE.github +
        "/repos?sort=updated&per_page=6"
    )
      .then(function (r) {
        return r.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;
        ftermCmds["repos"] = function () {
          ftermLine(grn("repos") + " " + dim("— recently updated"));
          ftermLine(dim("────────────────────────────────────────────────"));
          repos.forEach(function (r) {
            var stars =
              r.stargazers_count > 0
                ? " " + dim("★ " + r.stargazers_count)
                : "";
            var lang = r.language ? dim(" [" + r.language + "]") : "";
            ftermLine(grn(r.name) + lang + stars);
            if (r.description)
              ftermLine(dim("  " + r.description.slice(0, 60)));
          });
        };
      })
      .catch(function () {});
  }

  // ── LAST.FM ──
  if (LIVE.lastfm.user && LIVE.lastfm.key) {
    function fetchTrack() {
      fetch(
        "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks" +
          "&user=" +
          LIVE.lastfm.user +
          "&api_key=" +
          LIVE.lastfm.key +
          "&format=json&limit=1"
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (d) {
          var tracks = d.recenttracks && d.recenttracks.track;
          var track = Array.isArray(tracks) ? tracks[0] : tracks;
          if (!track) return;
          var isNow = track["@attr"] && track["@attr"].nowplaying === "true";
          var artist =
            (track.artist && (track.artist["#text"] || track.artist)) || "";
          var name = track.name || "";
          sigs[0].l = isNow ? "now playing" : "last played";
          sigs[0].v = (isNow ? "▶  " : "✦  ") + artist + " — " + name;
        })
        .catch(function () {});
    }
    fetchTrack();
    setInterval(fetchTrack, 30000);
  }

  // ── GIST STATUS ──
  if (LIVE.gist) {
    fetch("https://api.github.com/gists/" + LIVE.gist)
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        var files = d.files;
        if (!files) return;
        var content = files[Object.keys(files)[0]].content;
        var s = JSON.parse(content);
        if (s.building) {
          sigs[1].l = "building";
          sigs[1].v = s.building;
        }
        if (s.status) {
          sigs[4].l = "status";
          sigs[4].v = s.status + "  ▮";
        }
        if (s.availability) {
          sigs[3].l = "availability";
          sigs[3].v = s.availability;
        }
        if (s.song) {
          sigs[0].l = "now playing";
          sigs[0].v = "✦  " + s.song;
        }
      })
      .catch(function () {});
  }
})();
}
