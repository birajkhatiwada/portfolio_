export default function Contact() {
  return (
    <div className="panel" id="panel-contact" data-panel="contact">
      <div className="plabel">
        <span className="plabel-num">05</span>
        <span className="plabel-name">Contact</span>
      </div>
      <div className="pcontent centered-content">
        <div className="contact-wrap">
          <div className="sec-tag">Let's Talk</div>
          <div className="sec-title">Get in <em>Touch</em></div>
          <div className="c-tagline">
            Have a project in mind? <strong>Let's build something great</strong> together.
          </div>
          <p className="c-blurb">
            Whether it's a startup idea, open-source collab, or just a technical chat — my inbox
            is open. I typically respond within 24 hours.
          </p>
          <a href="mailto:khatiwadabiraj10@gmail.com" className="c-email no-magnet">
            khatiwadabiraj10@gmail.com →
          </a>
          <div className="cform">
            <div className="frow">
              <div className="fg">
                <label className="flabel">Name</label>
                <input className="finput" type="text" placeholder="Your name" />
              </div>
              <div className="fg">
                <label className="flabel">Email</label>
                <input className="finput" type="email" placeholder="you@company.com" />
              </div>
            </div>
            <div className="fg">
              <label className="flabel">Message</label>
              <textarea className="ftextarea" placeholder="Tell me about your project..."></textarea>
            </div>
            <button className="fsub">
              <span>Send Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
