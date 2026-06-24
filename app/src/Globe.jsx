import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const PLACES = [
  { id: "nepal",     location: [27.7172,  85.324],   size: 0.03 },
  { id: "iowa",      location: [41.5868, -93.625],   size: 0.03 },
  { id: "santarosa", location: [38.4404, -122.7141], size: 0.03 },
  { id: "sf",        location: [37.7749, -122.4194], size: 0.03 },
  { id: "sanmateo",  location: [37.563,  -122.3255], size: 0.03 },
];

const PLACE_LABEL = {
  nepal:     "Kathmandu, Nepal",
  iowa:      "Iowa City, IA",
  santarosa: "Santa Rosa, CA",
  sf:        "San Francisco, CA",
  sanmateo:  "San Mateo, CA",
};

export default function Globe({ activeId = null }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const activeIdRef = useRef(null);

  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let phi = 1.9;
    let theta = 0.2;
    let dragging = false;
    let lx = 0;
    let ly = 0;

    const dpr = window.devicePixelRatio || 1;
    const size = { S: Math.min(wrap.offsetWidth, wrap.offsetHeight) || 300 };

    canvas.width = size.S * dpr;
    canvas.height = size.S * dpr;
    canvas.style.width = size.S + "px";
    canvas.style.height = size.S + "px";

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size.S,
      height: size.S,
      phi,
      theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markerElevation: 0.06,
      markers: PLACES.map(({ id, location, size }) => ({ id, location, size })),
    });

    const panel = document.getElementById("panel-timeline");

    const getMarkers = () => PLACES.map(({ id, location, size }) => {
      const active = activeIdRef.current === id;
      return {
        id, location,
        size: active ? size * 3.5 : size,
        color: active ? [1, 1, 1] : undefined,
      };
    });

    let raf = null;
    const startLoop = () => {
      if (raf) return;
      const tick = () => {
        if (!dragging) phi += 0.0035;
        globe.update({ phi, theta, width: size.S, height: size.S, markers: getMarkers() });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => { cancelAnimationFrame(raf); raf = null; };

    const panelObserver = new MutationObserver(() => {
      if (panel.classList.contains("active")) {
        wrap.style.opacity = "1";
        startLoop();
      } else {
        wrap.style.opacity = "0";
        stopLoop();
      }
    });
    panelObserver.observe(panel, { attributes: true, attributeFilter: ["class"] });
    wrap.style.opacity = panel.classList.contains("active") ? "1" : "0";

    const resizeObserver = new ResizeObserver(() => {
      const s = Math.min(wrap.offsetWidth, wrap.offsetHeight);
      if (!s) return;
      size.S = s;
      canvas.width = s * dpr;
      canvas.height = s * dpr;
      canvas.style.width = s + "px";
      canvas.style.height = s + "px";
    });
    resizeObserver.observe(wrap);

    const onMouseDown = (e) => { dragging = true; lx = e.clientX; ly = e.clientY; wrap.style.cursor = "grabbing"; };
    const onMouseMove = (e) => {
      if (!dragging) return;
      phi += (e.clientX - lx) * 0.005;
      theta = Math.max(-0.85, Math.min(0.85, theta + (e.clientY - ly) * 0.005));
      lx = e.clientX; ly = e.clientY;
    };
    const onMouseUp = () => { dragging = false; wrap.style.cursor = "grab"; };

    wrap.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      stopLoop();
      panelObserver.disconnect();
      resizeObserver.disconnect();
      wrap.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      globe.destroy();
    };
  }, []);

  const label = activeId ? PLACE_LABEL[activeId] : null;

  return (
    <div id="tglobe-wrap" ref={wrapRef}>
      <canvas id="tglobe-canvas" ref={canvasRef}></canvas>
      <div id="tglobe-location" className={label ? "visible" : ""}>
        {label ?? ""}
      </div>
      <div id="tglobe-hint">drag to rotate &nbsp;·&nbsp; Nepal → Iowa → California</div>
    </div>
  );
}
