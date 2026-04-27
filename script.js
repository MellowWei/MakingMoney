const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

function list(items){ return `<ul class="list">${items.map(x=>`<li>${x}</li>`).join('')}</ul>`; }
function tags(items){ return `<div class="tag-row">${items.map(x=>`<span class="tag">${x}</span>`).join('')}</div>`; }
function panel(title, body, cls=''){ return `<article class="panel ${cls}"><h3>${title}</h3>${body}</article>`; }

function renderNav(){
  $('#nav').innerHTML = HRP_NODES.nav.map(n=>`<a href="#${n.id}">${n.label}</a>`).join('');
}

function renderStack(){
  const stack = HRP_NODES.nav.slice(0,5);
  $('#stackCards').innerHTML = stack.map(n=>`<article class="card"><small>${n.type}</small><h3>${n.label}</h3><p>进入 HRP 的 ${n.type}。</p></article>`).join('');
}

function renderAiQ(){
  const d = HRP_NODES.aiq;
  $('#aiq').innerHTML = `
    <div class="node-header"><div><p class="eyebrow">01 · CORE ENGINE</p><h2>${d.name}</h2></div><div class="node-title-box"><h3>${d.title}</h3><p>${d.oneLine}</p><p class="quote">${d.narrative}</p></div></div>
    <div class="content-grid">
      ${panel('目标用户三层', list(d.audiences))}
      ${panel('差异化核心', list(d.differentiation))}
      ${panel('三阶发布策略', d.launch.map(x=>`<div class="mini"><b>${x.phase}</b><p>${x.action}</p>${x.target?`<span class="tag">${x.target}</span>`:''}${x.channels?`<span class="tag">${x.channels}</span>`:''}</div>`).join(''), 'full')}
      ${panel('增长飞轮设计', list(d.flywheel))}
      ${panel('收入与规模指标', tags(d.metrics))}
    </div>`;
}

function renderBCI(){
  const d = HRP_NODES.bci;
  $('#bci').innerHTML = `
    <div class="node-header"><div><p class="eyebrow">02 · HARDWARE LAYER</p><h2>${d.name}</h2></div><div class="node-title-box"><h3>${d.title}</h3><p>${d.oneLine}</p></div></div>
    <div class="content-grid">
      ${panel('C端直销路径', list(d.cPath))}
      ${panel('B端授权路径', list(d.bPath))}
      ${panel('第一家机构 POC：谈成逻辑', list(d.poc), 'full')}
      ${panel('硬件供应链现实路径', list(d.supply))}
      ${panel('年度收入目标', tags(d.revenue))}
    </div>`;
}

function renderDream(){
  const d = HRP_NODES.dream;
  $('#dream').innerHTML = `
    <div class="node-header"><div><p class="eyebrow">03 · HIGH ACCESS SERVICE</p><h2>${d.name}</h2></div><div class="node-title-box"><h3>${d.title}</h3><p>${d.oneLine}</p><p class="quote">${d.quote}</p></div></div>
    <div class="content-grid">
      ${panel('服务内容设计', list(d.service))}
      ${panel('客户画像：谁会付 ¥20万', list(d.customers))}
      ${panel('等待名单与申请机制', list(d.application), 'full')}
      ${panel('年度收入目标', tags(d.revenue), 'full')}
    </div>`;
}

function renderCandle(){
  const d = HRP_NODES.candle;
  $('#candle').innerHTML = `
    <div class="node-header"><div><p class="eyebrow">04 · RITUAL ANCHOR</p><h2>${d.name}</h2></div><div class="node-title-box"><h3>${d.title}</h3><p>${d.oneLine}</p></div></div>
    <div class="content-grid">
      ${panel('产品叙事重构', list(d.roles), 'full')}
      ${d.products.map(p=>panel(`${p.tier} · ${p.price}`, `<p>${p.desc}</p>`)).join('')}
      ${panel('企业礼品市场', list(d.enterprise), 'full')}
    </div>`;
}

function renderQDR(){
  const d = HRP_NODES.qdr;
  $('#qdr').innerHTML = `
    <div class="node-header"><div><p class="eyebrow">05 · COPYRIGHT ASSET</p><h2>${d.name}</h2></div><div class="node-title-box"><h3>${d.title}</h3><p>${d.oneLine}</p></div></div>
    <div class="content-grid">
      ${panel('五类型音乐库', d.genres.map(g=>`<div class="genre"><b>${g.name}</b><p>${g.function}</p></div>`).join(''))}
      ${panel('三种变现形式', list(d.monetization))}
      ${panel('IP 授权 · 高杠杆路径', list(d.ip), 'full')}
    </div>`;
}

function renderPricing(){
  const p = HRP_NODES.pricing;
  $('#pricingTable').innerHTML = `<tbody>${p.rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody>`;
  $('#revenueCards').innerHTML = p.total.map(x=>{ const [k,v] = x.split('：'); return `<div class="revenue"><span>${k}</span><b>${v||x}</b></div>`; }).join('');
}

function renderTimeline(){
  $('#timelineRail').innerHTML = HRP_NODES.timeline.map(t=>`
    <article class="time-node"><div class="month">${t.month}</div><div><h3>${t.title}</h3><p>${t.focus}</p></div><div class="rev">${t.revenue}</div></article>
  `).join('');
}

function renderRisks(){
  $('#riskGrid').innerHTML = HRP_NODES.risks.map(r=>`
    <article class="card"><span class="risk-level ${r.level}">${r.level}</span><h3>${r.risk}</h3><p>${r.counter}</p></article>
  `).join('');
}

function renderAll(){
  renderNav(); renderStack(); renderAiQ(); renderBCI(); renderDream(); renderCandle(); renderQDR(); renderPricing(); renderTimeline(); renderRisks();
}

function setupActiveNav(){
  const links = $$('#nav a');
  const map = new Map(links.map(a=>[a.getAttribute('href').slice(1), a]));
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ links.forEach(a=>a.classList.remove('active')); map.get(e.target.id)?.classList.add('active'); }
    });
  }, { rootMargin:'-42% 0px -52% 0px', threshold:0 });
  HRP_NODES.nav.forEach(n=>{ const el = document.getElementById(n.id); if(el) obs.observe(el); });
}

function setupMode(){
  $('#modeBtn').addEventListener('click',()=>document.body.classList.toggle('light'));
}

function setupParticles(){
  const canvas = $('#field'); const ctx = canvas.getContext('2d');
  let w,h,particles=[];
  function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;particles=Array.from({length:Math.min(180,Math.floor(innerWidth/7))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22*devicePixelRatio,vy:(Math.random()-.5)*.22*devicePixelRatio,r:(Math.random()*1.6+0.45)*devicePixelRatio,a:Math.random()*.65+.2}));}
  function draw(){ctx.clearRect(0,0,w,h);particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(220,240,255,${p.a})`;ctx.fill();for(let j=i+1;j<particles.length;j++){const q=particles[j];const dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d<120*devicePixelRatio){ctx.strokeStyle=`rgba(185,255,234,${(1-d/(120*devicePixelRatio))*0.12})`;ctx.lineWidth=devicePixelRatio*.5;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}});requestAnimationFrame(draw)}
  addEventListener('resize',resize); resize(); draw();
}

document.addEventListener('DOMContentLoaded',()=>{ renderAll(); setupActiveNav(); setupMode(); setupParticles(); });
