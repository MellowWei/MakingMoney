const $ = (s)=>document.querySelector(s);
const data = window.HRP_NODES;

function card(html, interactive=false){
  const div=document.createElement('div');
  div.className='card'+(interactive?' interactive':'');
  div.innerHTML=html;
  return div;
}

function renderSprint(){
  const root=$('#sprintGrid');
  data.sprint.forEach(item=>{
    root.appendChild(card(`<span class="badge">${item.title}</span><h3>${item.desc}</h3><ul>${item.points.map(p=>`<li>${p}</li>`).join('')}</ul>`));
  });
}
function renderScript(){
  $('#videoScript').innerHTML=data.script.map(s=>`<div class="script-step"><div class="script-time">${s.time}</div><p>${s.text}</p></div>`).join('');
}
function renderBusiness(){
  $('#businessBullets').innerHTML=data.businessBullets.map(b=>`<li>${b}</li>`).join('');
}
function renderMusic(){
  const root=$('#musicGrid');
  data.music.forEach(m=>{
    const el=card(`<span class="badge">QDR PHASE</span><h3>${m.name}</h3><p>${m.role}</p>`, true);
    el.addEventListener('click',()=>{
      document.body.style.setProperty('--glow',m.color);
      document.querySelectorAll('#musicGrid .card').forEach(c=>c.style.borderColor='rgba(255,255,255,.13)');
      el.style.borderColor='rgba(255,255,255,.72)';
    });
    root.appendChild(el);
  });
}
function renderRevenue(){
  const root=$('#revenueGrid');
  data.revenue.forEach(r=>root.appendChild(card(`<div class="value">${r.value}</div><h3>${r.label}</h3><p>${r.desc}</p>`)));
}
function renderTimeline(){
  const root=$('#timelineList');
  data.timeline.forEach(t=>{
    const el=document.createElement('div');
    el.className='card month';
    el.innerHTML=`<div class="month-name">${t.month}</div><div><h3>${t.title}</h3><ul>${t.actions.map(a=>`<li>${a}</li>`).join('')}</ul></div><div class="money">${t.money}</div>`;
    root.appendChild(el);
  });
}
function starfield(){
  const c=$('#starfield'), ctx=c.getContext('2d');
  let w,h,stars=[];
  function resize(){w=c.width=innerWidth;h=c.height=innerHeight;stars=Array.from({length:160},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.8+.2,v:Math.random()*.35+.05}))}
  addEventListener('resize',resize); resize();
  function tick(){ctx.clearRect(0,0,w,h);ctx.fillStyle='rgba(255,255,255,.75)';stars.forEach(s=>{s.y+=s.v;if(s.y>h)s.y=0;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()});requestAnimationFrame(tick)}
  tick();
}

renderSprint();renderScript();renderBusiness();renderMusic();renderRevenue();renderTimeline();starfield();
