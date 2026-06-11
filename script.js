// ── CURSOR ──
const cd=document.getElementById('cd'),cr=document.getElementById('cr');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px';});
(function ar(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;cr.style.left=rx+'px';cr.style.top=ry+'px';requestAnimationFrame(ar);})();
document.querySelectorAll('a,button,.pcard,.panel:not(.active),.sname').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('ch'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('ch'));
});

// ── PANELS ──
const panelIds=['hero','projects','timeline','skills','contact'];
let cur=0,transitioning=false;

function goTo(idx){
  if(idx<0||idx>=panelIds.length||transitioning)return;
  transitioning=true; cur=idx;
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+panelIds[idx]).classList.add('active');
  document.querySelectorAll('.pdot').forEach((d,i)=>d.classList.toggle('on',i===idx));
  const sh=document.querySelector('.scroll-hint');
  if(sh) sh.style.opacity=idx===0?'':0;
  applyFx();
  showSecCmd(panelIds[idx]);
  if(panelIds[idx]==='timeline'){
    setTimeout(()=>{
      document.querySelectorAll('#tw .titem').forEach((it,i)=>{
        it.classList.remove('vis');
        setTimeout(()=>it.classList.add('vis'),i*130);
      });
    },300);
  }
  setTimeout(()=>transitioning=false,900);
}
window.goTo=goTo;

// click idle panel
document.querySelectorAll('.panel').forEach(p=>{
  p.addEventListener('click',()=>{
    if(!p.classList.contains('active')) goTo(panelIds.indexOf(p.dataset.panel));
  });
});

// ── PROGRESS DOTS ──
const progEl=document.getElementById('prog');
panelIds.forEach((_,i)=>{
  const d=document.createElement('span');
  d.className='pdot'+(i===0?' on':'');
  d.addEventListener('click',()=>goTo(i));
  d.addEventListener('mouseenter',()=>document.body.classList.add('ch'));
  d.addEventListener('mouseleave',()=>document.body.classList.remove('ch'));
  progEl.appendChild(d);
});

// ── SCROLL / KEYBOARD / TOUCH ──
let wAcc=0,wTimer=null,lastW=0;
window.addEventListener('wheel',e=>{
  const pc=document.querySelector('.panel.active .pcontent');
  if(pc&&pc.classList.contains('scrollable')){
    const atTop=pc.scrollTop<=2,atBot=pc.scrollTop+pc.clientHeight>=pc.scrollHeight-6;
    if((e.deltaY<0&&!atTop)||(e.deltaY>0&&!atBot))return;
  }
  e.preventDefault();
  const now=Date.now();
  if(now-lastW<1000)return;
  wAcc+=e.deltaY;
  clearTimeout(wTimer);
  wTimer=setTimeout(()=>{
    if(wAcc>180){lastW=Date.now();goTo(cur+1);}
    else if(wAcc<-180){lastW=Date.now();goTo(cur-1);}
    wAcc=0;
  },80);
},{passive:false});

let ty=0;
window.addEventListener('touchstart',e=>{ty=e.touches[0].clientY;},{passive:true});
window.addEventListener('touchend',e=>{const dy=ty-e.changedTouches[0].clientY;if(Math.abs(dy)>50)goTo(dy>0?cur+1:cur-1);});

// ── TYPEWRITER ──
(function(){
  const el=document.getElementById('heroName');
  const cursor=document.getElementById('twc');
  const lines=[{t:'Building',g:false},{t:'digital',g:true},{t:'things.',g:false}];
  const spans=lines.map((l,i)=>{
    const s=document.createElement('span');
    if(l.g)s.classList.add('gw');
    el.insertBefore(s,cursor);
    if(i<lines.length-1)el.insertBefore(document.createElement('br'),cursor);
    return s;
  });
  let li=0,ci=0;
  function type(){
    if(li>=lines.length)return;
    if(ci<lines[li].t.length){spans[li].textContent+=lines[li].t[ci++];setTimeout(type,65);}
    else{li++;ci=0;if(li<lines.length)setTimeout(type,220);else setTimeout(()=>{cursor.style.transition='opacity .6s';cursor.style.opacity='0';},1400);}
  }
  setTimeout(type,500);
})();

// ── PROJECT CARD GLOW ──
document.querySelectorAll('.pcard').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect();
    c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

// ── TIMELINE TABS ──
function switchTab(id,btn){
  document.querySelectorAll('.tsec').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.ttab').forEach(t=>t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  document.getElementById(id).querySelectorAll('.titem').forEach((it,i)=>{
    it.classList.remove('vis');
    setTimeout(()=>it.classList.add('vis'),i*120);
  });
}
window.switchTab=switchTab;
setTimeout(()=>document.querySelectorAll('#tw .titem').forEach((it,i)=>setTimeout(()=>it.classList.add('vis'),i*140)),600);

// ── CLOCK ──
function tick(){
  const pt=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'}));
  document.getElementById('sbClk').textContent=
    String(pt.getHours()).padStart(2,'0')+':'+String(pt.getMinutes()).padStart(2,'0')+':'+String(pt.getSeconds()).padStart(2,'0')+' PT';
}
tick(); setInterval(tick,1000);

// ── WEATHER ──
(async function(){
  try{
    const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.77&longitude=-122.41&current_weather=true&temperature_unit=fahrenheit');
    const d=await r.json();
    const t=Math.round(d.current_weather.temperature);
    const c=d.current_weather.weathercode;
    document.getElementById('sbWx').textContent=(c===0?'☀':c<=3?'⛅':c<=67?'🌧':'⛅')+' '+t+'°F  Bay Area';
  }catch(e){}
})();

// ── TICKER ──
const sigs=[
  {l:'now playing',v:'✦  Tame Impala — Let It Happen'},
  {l:'building',v:'a Q-learning agent in Python'},
  {l:'location',v:'Bay Area, California 🌉'},
  {l:'availability',v:'open to work — DM me anytime'},
  {l:'status',v:'deep focus mode  ▮'},
];
let ti=0;
const tLbl=document.getElementById('tLbl'),tVal=document.getElementById('tVal');
tLbl.textContent=sigs[0].l; tVal.textContent=sigs[0].v;
setInterval(()=>{
  tVal.classList.add('out');
  setTimeout(()=>{
    ti=(ti+1)%sigs.length;
    tLbl.textContent=sigs[ti].l; tVal.textContent=sigs[ti].v;
    tVal.classList.remove('out'); tVal.classList.add('in');
    tVal.getBoundingClientRect(); tVal.style.cssText='';
    requestAnimationFrame(()=>tVal.classList.remove('in'));
  },350);
},4000);

// ── FX CANVASES ──
const cvRain=document.getElementById('cvRain');
const cvParts=document.getElementById('cvParts');
let activeFx='rain';
function applyFx(){
  const on=document.getElementById('panel-hero').classList.contains('active');
  cvRain.style.opacity=(on&&activeFx==='rain')?'1':'0';
  cvParts.style.opacity=(on&&activeFx==='parts')?'1':'0';
}
document.getElementById('fxToggles').addEventListener('click',e=>{
  const btn=e.target.closest('.fx-btn');
  if(!btn)return;
  e.stopPropagation();
  const fx=btn.dataset.fx;
  activeFx=(activeFx===fx)?null:fx;
  document.querySelectorAll('.fx-btn').forEach(b=>b.classList.toggle('active',b.dataset.fx===activeFx));
  applyFx();
});

function fitCv(cv){const p=cv.parentElement;cv.width=p.offsetWidth||800;cv.height=p.offsetHeight||600;}
window.addEventListener('resize',()=>{fitCv(cvRain);fitCv(cvParts);});

// CODE RAIN
(function(){
  const ctx=cvRain.getContext('2d'); fitCv(cvRain);
  const FS=13,CHARS='ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01{}[]()<>/=+-*&^%$#@!?';
  let drops=[];
  function init(){fitCv(cvRain);drops=Array.from({length:Math.floor(cvRain.width/FS)},()=>Math.random()*-cvRain.height/FS);}
  init(); window.addEventListener('resize',init);
  (function loop(){
    const{width:W,height:H}=cvRain;
    ctx.fillStyle='rgba(8,12,9,0.08)';ctx.fillRect(0,0,W,H);
    ctx.font=FS+'px "DM Mono",monospace';
    for(let i=0;i<drops.length;i++){
      ctx.fillStyle='rgba(74,222,128,0.22)';
      ctx.fillText(CHARS[Math.floor(Math.random()*CHARS.length)],i*FS,drops[i]*FS);
      if(drops[i]*FS>H&&Math.random()>.975)drops[i]=0;
      drops[i]+=0.45;
    }
    requestAnimationFrame(loop);
  })();
})();

// PARTICLES
(function(){
  const ctx=cvParts.getContext('2d'); fitCv(cvParts);
  const N=55,CD=110;
  let pts=[],mox=-999,moy=-999;
  function mkP(){return{x:Math.random()*(cvParts.width||800),y:Math.random()*(cvParts.height||600),vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.6+.8};}
  function init(){fitCv(cvParts);pts=Array.from({length:N},mkP);}
  init(); window.addEventListener('resize',init);
  document.getElementById('panel-hero').addEventListener('mousemove',e=>{const r=cvParts.getBoundingClientRect();mox=e.clientX-r.left;moy=e.clientY-r.top;});
  document.getElementById('panel-hero').addEventListener('mouseleave',()=>{mox=-999;moy=-999;});
  (function loop(){
    const{width:W,height:H}=cvParts;
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;});
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<CD){ctx.beginPath();ctx.strokeStyle=`rgba(74,222,128,${(1-d/CD)*.07})`;ctx.lineWidth=.6;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
      }
      const dm=Math.sqrt((pts[i].x-mox)**2+(pts[i].y-moy)**2);
      if(dm<CD*1.4){ctx.beginPath();ctx.strokeStyle=`rgba(74,222,128,${(1-dm/(CD*1.4))*.18})`;ctx.lineWidth=.8;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(mox,moy);ctx.stroke();}
      ctx.beginPath();ctx.arc(pts[i].x,pts[i].y,pts[i].r,0,Math.PI*2);ctx.fillStyle='rgba(74,222,128,0.18)';ctx.fill();
    }
    requestAnimationFrame(loop);
  })();
})();

// ── DOWNLOAD CV — plays inside floating terminal ──
function downloadCV(){
  var btn = document.getElementById('btnCV');
  btn.classList.add('compiling');

  ftermToggle(true);
  document.querySelector('.fterm-title').textContent = 'compiling resume.pdf';

  ftermOut.innerHTML = '';

  var steps = [
    [80,  '<span style="color:var(--muted)">$</span> <span style="color:var(--green)">init</span> biraj_khatiwada_cv'],
    [400, '<span style="color:var(--muted)">›</span> loading experience.json &nbsp;<span style="color:var(--green)">✓</span>'],
    [700, '<span style="color:var(--muted)">›</span> compiling skills.ts &nbsp;<span style="color:var(--green)">✓</span>'],
    [1000,'<span style="color:var(--muted)">›</span> bundling projects/* &nbsp;<span style="color:var(--green)">✓</span>'],
    [1300,'<span style="color:var(--muted)">›</span> optimizing output... &nbsp;<span style="color:var(--green)">✓</span>'],
    [1700,'<span style="color:var(--green)">✦ biraj_khatiwada_cv.pdf — ready</span>'],
  ];

  steps.forEach(function(s){
    setTimeout(function(){ ftermLine(s[1]); }, s[0]);
  });

  setTimeout(function(){
    var a = document.createElement('a');
    a.href = '#'; // replace with real CV path
    a.download = 'biraj_khatiwada_cv.pdf';
    a.click();
    btn.classList.remove('compiling');
    setTimeout(function(){
      document.querySelector('.fterm-title').textContent = 'biraj@portfolio: ~';
    }, 1200);
  }, 2300);
}
window.downloadCV=downloadCV;

// ── BOOT SEQUENCE ──
(function(){
  const steps=[
    {id:'bl0',delay:100},{id:'bl1',delay:400},{id:'bl2',delay:650},{id:'bl3',delay:850},
    {id:'bl4',delay:1000},{id:'bl5',delay:1850},{id:'bl6',delay:2050},
    {id:'bl7',delay:2250},{id:'bl8',delay:2400},{id:'bl9',delay:2550},
  ];
  steps.forEach(s=>setTimeout(()=>{const el=document.getElementById(s.id);if(el)el.classList.add('show');},s.delay));
  setTimeout(()=>{
    const bar=document.getElementById('bootBar'); let pct=0;
    const iv=setInterval(()=>{pct+=2;bar.style.width=pct+'%';if(pct>=100)clearInterval(iv);},16);
  },1050);
  setTimeout(()=>{
    const boot=document.getElementById('boot');
    boot.classList.add('hide');
    setTimeout(()=>boot.remove(),900);
  },3100);
})();

// ── SECTION TRANSITION CMD ──
const secNames={hero:'~ cd home',projects:'~ ls ./projects',timeline:'~ cat timeline.log',skills:'~ ls ./skills',contact:'~ ssh contact@biraj.dev'};
function showSecCmd(id){
  const el=document.getElementById('secCmd');
  if(!el)return;
  el.textContent=secNames[id]||'';
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),1400);
}

// ── FLOATING TERMINAL ──
var ftermEl    = document.getElementById('fterm');
var ftermInput = document.getElementById('ftermInput');
var ftermOut   = document.getElementById('ftermOutput');
var ftermOpen  = false;
var cmdHistory = [];
var histIdx    = -1;

function ftermToggle(force) {
  ftermOpen = (force !== undefined) ? Boolean(force) : !ftermOpen;
  if (ftermOpen) {
    ftermEl.classList.add('open');
    setTimeout(function(){ ftermInput.focus(); }, 80);
    if (ftermOut.children.length === 0) ftermWelcome();
  } else {
    ftermEl.classList.remove('open');
  }
}
window.ftermToggle=ftermToggle;

function ftermLine(content, cls) {
  var d = document.createElement('div');
  d.className = 'fterm-line' + (cls ? ' ' + cls : '');
  d.innerHTML = content;
  ftermOut.appendChild(d);
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ d.classList.add('vis'); });
  });
  ftermOut.scrollTop = ftermOut.scrollHeight;
}

function ftermWelcome() {
  ftermLine('<span style="color:var(--green)">biraj@portfolio</span> <span style="color:var(--muted)">—  interactive terminal</span>');
  ftermLine('<span style="color:var(--muted)">────────────────────────────────</span>');
  ftermLine('Type <span style="color:var(--green)">help</span> to see available commands.');
  ftermLine('');
}

var ftermCmds = {
  help: function() {
    ftermLine('<span style="color:var(--green)">commands</span>');
    ftermLine('<span style="color:var(--muted)">────────────────────────────────────────</span>');
    [
      ['goto &lt;section&gt;', 'home | projects | timeline | skills | contact'],
      ['whoami',          'info about biraj'],
      ['ls',              'list sections'],
      ['cat about.txt',   'about blurb'],
      ['status',          'availability'],
      ['theme &lt;fx&gt;',     'rain | parts | off'],
      ['date',            'current time PT'],
      ['clear',           'clear terminal'],
      ['exit',            'close terminal'],
    ].forEach(function(row){
      ftermLine('<span style="color:var(--green);display:inline-block;min-width:170px">'+row[0]+'</span><span style="color:var(--muted)">'+row[1]+'</span>');
    });
  },
  whoami: function() {
    ftermLine('<span style="color:var(--green)">biraj khatiwada</span>');
    ftermLine('<span style="color:var(--muted)">role    </span> full-stack engineer');
    ftermLine('<span style="color:var(--muted)">location</span> bay area, ca');
    ftermLine('<span style="color:var(--muted)">email   </span> khatiwadabiraj10@gmail.com');
    ftermLine('<span style="color:var(--muted)">status  </span> <span style="color:var(--green)">● open to work</span>');
  },
  ls: function() { ftermLine('<span style="color:var(--green)">home/</span>  projects/  timeline/  skills/  contact/'); },
  status: function() { ftermLine('<span style="color:var(--green)">●</span> open to work — full-time &amp; freelance'); },
  pwd: function() { ftermLine('/home/visitor/portfolio'); },
  date: function() { ftermLine('<span style="color:var(--green)">'+new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})+' PT</span>'); },
  clear: function() { ftermOut.innerHTML=''; },
  exit: function() { ftermToggle(false); },
  goto: function(args) {
    var map={home:0,projects:1,timeline:2,skills:3,contact:4};
    var t=(args[0]||'').toLowerCase();
    if(map[t]!==undefined){ ftermLine('<span style="color:var(--green)">→</span> navigating to '+t+'...'); setTimeout(function(){goTo(map[t]);},500); }
    else ftermLine('<span style="color:#f87171">error:</span> try: home | projects | timeline | skills | contact');
  },
  theme: function(args) {
    var fx=(args[0]||'').toLowerCase();
    if(fx==='off'){ activeFx=null; document.querySelectorAll('.fx-btn').forEach(function(b){b.classList.remove('active');}); applyFx(); ftermLine('<span style="color:var(--green)">✓</span> fx off'); }
    else if(fx==='rain'||fx==='parts'){ activeFx=fx; document.querySelectorAll('.fx-btn').forEach(function(b){b.classList.toggle('active',b.dataset.fx===activeFx);}); applyFx(); ftermLine('<span style="color:var(--green)">✓</span> theme → '+fx); }
    else ftermLine('<span style="color:#f87171">usage:</span> theme rain | parts | off');
  },
};
ftermCmds['cat about.txt'] = function() {
  ftermLine('I build high-performance web experiences at the');
  ftermLine('intersection of engineering and design.');
  ftermLine('6+ years · 40+ projects · 12 happy clients.');
};

ftermInput.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  var raw = ftermInput.value.trim();
  if (!raw) return;
  ftermLine('<span style="color:var(--muted)">$</span> ' + raw, 'cmd-echo');
  cmdHistory.push(raw); histIdx = -1;
  ftermInput.value = '';
  var lraw = raw.toLowerCase();
  if (ftermCmds[lraw]) { ftermCmds[lraw]([]); return; }
  var parts = raw.trim().split(' ');
  var cmd = parts[0].toLowerCase();
  var args = parts.slice(1);
  if (ftermCmds[cmd]) ftermCmds[cmd](args);
  else ftermLine('<span style="color:#f87171">not found:</span> ' + cmd + ' &nbsp;—&nbsp; type <span style="color:var(--green)">help</span>');
});

// ── VISITOR COUNTER (easter egg) ──
var visitCount = parseInt(localStorage.getItem('bk_visits') || '0') + 1;
localStorage.setItem('bk_visits', visitCount);
var displayCount = 10482 + visitCount;
ftermCmds['cat visitors.txt'] = function() {
  ftermLine('<span style="color:var(--muted)"># visitors.txt</span>');
  ftermLine('<span style="color:var(--muted)">────────────────────────</span>');
  ftermLine('You are visitor <span style="color:var(--green);font-size:15px">#' + displayCount.toLocaleString() + '</span>');
  ftermLine('');
  ftermLine('<span style="color:var(--muted)">★ Welcome to my corner of the internet.</span>');
  ftermLine('<span style="color:var(--muted)">  Since 2024. Hand-crafted with ♥ in Bay Area.</span>');
  ftermLine('');
  ftermLine([
    '╔══════════════════════════╗',
    '║  You have been visited   ║',
    '║  ✦ ' + displayCount.toLocaleString().padStart(10) + ' times ✦  ║',
    '╚══════════════════════════╝',
  ].map(l=>'<span style="color:var(--green);opacity:.5">'+l+'</span>').join('<br>'));
};

// Update help to include new commands
var _oldHelp = ftermCmds.help;
ftermCmds.help = function() {
  _oldHelp();
  ftermLine('');
  ftermLine('<span style="color:var(--muted)">  cat visitors.txt &nbsp;&nbsp;secret visitor counter</span>');
  ftermLine('<span style="color:var(--muted)">  ask &lt;question&gt; &nbsp;&nbsp;&nbsp;ask biraj anything (AI)</span>');
  ftermLine('<span style="color:var(--muted)">  setkey &lt;sk-ant-...&gt; set Anthropic API key</span>');
};

// ── ASK COMMAND (Claude API with key prompt) ──
var _apiKey = sessionStorage.getItem('bk_apikey') || '';

ftermCmds['setkey'] = function(args) {
  var key = args[0] || '';
  if (!key || !key.startsWith('sk-ant-')) {
    ftermLine('<span style="color:#f87171">invalid key</span> — should start with sk-ant-');
    ftermLine('<span style="color:var(--muted)">usage: setkey sk-ant-api03-...</span>');
    return;
  }
  _apiKey = key;
  sessionStorage.setItem('bk_apikey', key);
  ftermLine('<span style="color:var(--green)">✓</span> API key saved for this session.');
  ftermLine('<span style="color:var(--muted)">you can now use: ask &lt;question&gt;</span>');
};

ftermCmds['ask'] = function(args) {
  var question = args.join(' ').trim();
  if (!question) {
    ftermLine('<span style="color:#f87171">usage:</span> ask &lt;your question&gt;');
    ftermLine('<span style="color:var(--muted)">e.g.  ask what stack do you use?</span>');
    return;
  }
  if (!_apiKey) {
    ftermLine('<span style="color:#facc15">⚠ API key required to use ask.</span>');
    ftermLine('<span style="color:var(--muted)">run: <span style="color:var(--green)">setkey sk-ant-api03-...</span></span>');
    ftermLine('<span style="color:var(--muted)">get a key at console.anthropic.com</span>');
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
    "If asked something unknown, be honest and friendly."
  ].join(' ');

  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': _apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }]
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(data) {
    var lines = ftermOut.querySelectorAll('.fterm-line');
    var last = lines[lines.length - 1];
    if (last && last.textContent.includes('thinking')) last.remove();
    if (data.error) {
      ftermLine('<span style="color:#f87171">API error:</span> ' + data.error.message);
      return;
    }
    var text = (data.content && data.content[0] && data.content[0].text) || 'No response.';
    var sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
    sentences.forEach(function(s, i) {
      setTimeout(function() {
        var trimmed = s.trim();
        if (trimmed) ftermLine('<span style="color:var(--text)">' + trimmed + '</span>');
      }, i * 200);
    });
  })
  .catch(function(err) {
    var lines = ftermOut.querySelectorAll('.fterm-line');
    var last = lines[lines.length - 1];
    if (last && last.textContent.includes('thinking')) last.remove();
    ftermLine('<span style="color:#f87171">error:</span> ' + (err.message || 'request failed'));
  });
};

// ── KONAMI CODE ──
var konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
var konamiIdx = 0;
var konamiActive = false;

function triggerKonami() {
  if (konamiActive) return;
  konamiActive = true;

  var overlay  = document.getElementById('konamiOverlay');
  var flash    = document.getElementById('konamiFlash');
  var logEl    = document.getElementById('konamiLog');
  var granted  = document.getElementById('konamiGranted');
  var subtitle = document.getElementById('konamiSubtitle');

  logEl.innerHTML = '';
  granted.classList.remove('vis');
  subtitle.classList.remove('vis');
  overlay.classList.remove('off');

  flash.classList.remove('pop');
  void flash.offsetWidth;
  flash.classList.add('pop');

  setTimeout(function() {
    overlay.classList.add('on');
  }, 60);

  function kLine(html, delay) {
    setTimeout(function() {
      var d = document.createElement('div');
      d.className = 'konami-log-line';
      d.innerHTML = html;
      logEl.appendChild(d);
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ d.classList.add('vis'); }); });
    }, delay);
  }

  kLine('<span class="k-dim">// system integrity check...</span>', 300);
  kLine('<span class="k-dim">scanning </span><span class="k-bright">portfolio.img</span><span class="k-dim">................</span><span class="k-bright"> PASS</span>', 500);
  kLine('<span class="k-dim">verifying </span><span class="k-bright">konami.key</span><span class="k-dim">......................</span><span class="k-bright"> MATCH</span>', 750);
  kLine('<span class="k-warn">⚠ elevated privileges detected</span>', 1000);
  kLine('<span class="k-dim">bypassing </span><span class="k-bright">auth_layer_1</span><span class="k-dim">...................</span><span class="k-red"> OVERRIDE</span>', 1200);
  kLine('<span class="k-dim">bypassing </span><span class="k-bright">auth_layer_2</span><span class="k-dim">...................</span><span class="k-red"> OVERRIDE</span>', 1380);
  kLine('<span class="k-bright">root@portfolio:~#</span><span class="k-dim"> sudo unlock --all</span>', 1600);
  kLine('<span class="k-warn">[ unlocking secrets... ]</span>', 1820);

  setTimeout(function() {
    granted.classList.add('vis');
  }, 2200);

  setTimeout(function() {
    subtitle.classList.add('vis');
  }, 2600);

  if (ftermOpen) {
    ftermLine('<span style="color:var(--green)">✦</span> <span style="color:#facc15">KONAMI CODE ACTIVATED — root access granted</span>');
  }

  function exitKonami() {
    overlay.classList.add('off');
    overlay.classList.remove('on');
    setTimeout(function() {
      overlay.classList.remove('off');
      konamiActive = false;
      konamiIdx = 0;
    }, 350);
    overlay.removeEventListener('click', exitKonami);
    document.removeEventListener('keydown', exitOnKey);
  }
  function exitOnKey(e) {
    if (konamiActive && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') exitKonami();
  }
  setTimeout(function() {
    overlay.addEventListener('click', exitKonami);
    document.addEventListener('keydown', exitOnKey);
  }, 2700);

  setTimeout(function() { if (konamiActive) exitKonami(); }, 9000);
}

// Single unified keydown handler
window.addEventListener('keydown', function(e) {
  var activeEl = document.activeElement;
  var inFormField = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && activeEl !== ftermInput;

  if (e.key === '`' && !inFormField) {
    e.preventDefault();
    e.stopImmediatePropagation();
    ftermToggle();
    return;
  }
  if (e.key === 'Escape' && ftermOpen) {
    ftermToggle(false);
    return;
  }
  if (ftermOpen && activeEl === ftermInput) {
    if (e.key === 'ArrowUp') { e.preventDefault(); if(histIdx<cmdHistory.length-1){histIdx++;ftermInput.value=cmdHistory[cmdHistory.length-1-histIdx]||'';} }
    if (e.key === 'ArrowDown') { e.preventDefault(); if(histIdx>0){histIdx--;ftermInput.value=cmdHistory[cmdHistory.length-1-histIdx]||'';}else{histIdx=-1;ftermInput.value='';} }
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
      konamiIdx = (e.key === konamiSeq[0]) ? 1 : 0;
    }
  }
  if (konamiIdx === 0) {
    if (['ArrowDown','ArrowRight','PageDown'].includes(e.key)) { e.preventDefault(); goTo(cur+1); }
    if (['ArrowUp','ArrowLeft','PageUp'].includes(e.key)) { e.preventDefault(); goTo(cur-1); }
  }
}, true);

// Drag terminal
(function(){
  var bar=document.getElementById('ftermBar');
  var dragging=false,ox=0,oy=0;
  bar.addEventListener('mousedown',function(e){
    if(e.target.classList.contains('fterm-dot'))return;
    dragging=true;
    var r=ftermEl.getBoundingClientRect();
    ox=e.clientX-r.left; oy=e.clientY-r.top;
    ftermEl.style.transition='none';
  });
  document.addEventListener('mousemove',function(e){
    if(!dragging)return;
    ftermEl.style.left=(e.clientX-ox)+'px';
    ftermEl.style.top=(e.clientY-oy)+'px';
    ftermEl.style.right='auto'; ftermEl.style.bottom='auto';
  });
  document.addEventListener('mouseup',function(){dragging=false;ftermEl.style.transition='';});
})();
