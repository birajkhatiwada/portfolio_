export default function Skills() {
  return (
    <div className="panel" id="panel-skills" data-panel="skills">
      <div className="plabel">
        <span className="plabel-num">04</span>
        <span className="plabel-name">Skills</span>
      </div>
      <div className="pcontent centered-content">
        <div className="sec-tag">Capabilities</div>
        <div className="sec-title">Skills &amp; <em>Tools</em></div>
        <div className="sgrid">
          <div>
            <div className="scat-name">Frontend</div>
            <div className="snames">
              <span className="sname">React / Next.js</span>
              <span className="sname">TypeScript</span>
              <span className="sname">WebGL / Three.js</span>
              <span className="sname">CSS &amp; Animation</span>
              <span className="sname">Svelte</span>
              <span className="sname">Vue.js</span>
            </div>
          </div>
          <div>
            <div className="scat-name">Backend</div>
            <div className="snames">
              <span className="sname">Node.js</span>
              <span className="sname">Go</span>
              <span className="sname">Rust</span>
              <span className="sname">PostgreSQL</span>
              <span className="sname">Redis</span>
              <span className="sname">GraphQL</span>
            </div>
          </div>
          <div>
            <div className="scat-name">Infrastructure</div>
            <div className="snames">
              <span className="sname">Docker</span>
              <span className="sname">Kubernetes</span>
              <span className="sname">AWS</span>
              <span className="sname">Terraform</span>
              <span className="sname">CI/CD</span>
              <span className="sname">Linux</span>
            </div>
          </div>
          <div>
            <div className="scat-name">Tooling</div>
            <div className="snames">
              <span className="sname">Figma</span>
              <span className="sname">Git</span>
              <span className="sname">Storybook</span>
              <span className="sname">Jest / Playwright</span>
              <span className="sname">Electron</span>
              <span className="sname">WebSockets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
