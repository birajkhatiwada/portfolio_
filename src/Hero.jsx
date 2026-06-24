export default function Hero() {
  return (
    <div className="panel active" id="panel-hero" data-panel="hero">
      <canvas className="fx" id="cvRain" style={{ opacity: 1, zIndex: 1 }}></canvas>
      <canvas className="fx" id="cvParts" style={{ opacity: 0, zIndex: 2 }}></canvas>
      <canvas className="fx" id="cvSnow" style={{ opacity: 0, zIndex: 3 }}></canvas>
      <div id="fxToggles">
        <button className="fx-btn active" data-fx="rain" title="Code rain">&#9993;</button>
        <button className="fx-btn" data-fx="parts" title="Particles">&#10040;</button>
      </div>
      <div className="plabel">
        <span className="plabel-num">01</span>
        <span className="plabel-name">Home</span>
      </div>
      <div className="pcontent hero-content" id="heroContent">
        <div className="eyebrow">Available for work</div>
        <h1 className="hero-name" id="heroName">
          <span className="tw-cur" id="twc"></span>
        </h1>
        <p className="hero-role">Full-Stack Engineer &amp; Creative Technologist</p>
        <p className="hero-desc">
          I'm Biraj Khatiwada — I craft high-performance web experiences at the intersection of
          engineering and design. Currently open to full-time roles and freelance collaborations.
        </p>
        <div className="cta">
          <a href="#" className="btn-p" onClick={(e) => { e.preventDefault(); window.goTo(1); }}>
            View Work
          </a>
          <a href="#" className="btn-o" onClick={(e) => { e.preventDefault(); window.goTo(4); }}>
            Get in Touch
          </a>
          <button className="btn-cv" id="btnCV" onClick={() => window.downloadCV()}>
            ⬇ Download CV
          </button>
        </div>
        <div className="stats">
          <div className="stat"><div className="num">6+</div><div className="lbl">Years Exp.</div></div>
          <div className="stat"><div className="num">40+</div><div className="lbl">Projects</div></div>
          <div className="stat"><div className="num">12</div><div className="lbl">Clients</div></div>
        </div>
        <div className="watermark" aria-hidden="true">BK</div>
      </div>
      <div className="scroll-hint">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <span>scroll</span>
      </div>
    </div>
  );
}
