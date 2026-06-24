export default function Projects() {
  return (
    <div className="panel" id="panel-projects" data-panel="projects">
      <div className="plabel">
        <span className="plabel-num">02</span>
        <span className="plabel-name">Projects</span>
      </div>
      <div className="pcontent centered-content">
        <div className="sec-tag">Selected Work</div>
        <div className="sec-title">Recent <em>Projects</em></div>
        <div className="pgrid">
          <div className="pcard feat">
            <div>
              <div className="pnum">01 — Featured</div>
              <div className="ptitle">Accountabilibuddy</div>
              <p className="pdesc">
                Accountability app where you team up with friends, set weekly goals, and put real
                money on the line — miss your goals and your contribution goes into a shared pot.
                Hit them all and the group goes out together. Includes per-user goal graphs and
                group-wide progress tracking across sessions.
              </p>
              <div className="ptags">
                <span className="tag">React</span>
                <span className="tag">Next.js</span>
                <span className="tag">Vercel</span>
              </div>
              <div className="plinks">
                <a href="https://accountabilibuddy-ten.vercel.app" className="plink" target="_blank" rel="noreferrer">Live Site</a>
                <a href="https://github.com/birajkhatiwada/accountabilibuddy" className="plink plink--ghost" target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
            <div className="pvis">
              <pre>{`// weekly session
goals.add({ title: "Run 3x", pot: 20 })
goals.add({ title: "Read 50p", pot: 10 })

// end of week
→ completed: 1/2
→ pot += $10
→ group total: $47
→ "time to go out?"`}</pre>
            </div>
          </div>
          <div className="pcard">
            <div className="pnum">02</div>
            <div className="ptitle">Scream Reel</div>
            <p className="pdesc">
              Horror movie tracker for groups — watch, rate, and see which scary film your crew
              loves most. Notifies members when someone logs a movie so everyone stays in sync.
              Each member picks their personal top 3 favorites.
            </p>
            <div className="ptags">
              <span className="tag">React</span>
              <span className="tag">Node.js</span>
              <span className="tag">Firebase</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
