(function () {
  const data = window.HRP_NODES || {};

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function renderStack() {
    const root = document.getElementById("stack-grid");
    if (!root) return;
    root.innerHTML = "";
    data.stack.forEach((item) => {
      const card = el("article", "card", `
        <span class="badge">${item.badge}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      `);
      root.appendChild(card);
    });
  }

  function renderSprint() {
    const root = document.getElementById("sprint-list");
    if (!root) return;
    root.innerHTML = "";
    data.sprint.forEach((item) => {
      const card = el("article", "sprint-card", `
        <div class="day">${item.day}</div>
        <h3>${item.title}</h3>
        <ul>${item.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      `);
      root.appendChild(card);
    });
  }

  function renderMoney() {
    const root = document.getElementById("money-grid");
    if (!root) return;
    root.innerHTML = "";
    data.money.forEach((item) => {
      const card = el("article", "card", `
        <span class="value">${item.value}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      `);
      root.appendChild(card);
    });
  }

  function renderMusic() {
    const root = document.getElementById("music-grid");
    if (!root) return;
    root.innerHTML = "";
    data.music.forEach((item, index) => {
      const card = el("article", "card interactive", `
        <span class="badge">0${index + 1} · QDR</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      `);
      card.addEventListener("click", () => {
        document.body.style.setProperty("--glow-a", item.colorA);
        document.body.style.setProperty("--glow-b", item.colorB);
        document.body.style.setProperty("--glow-c", item.colorC);
        document.body.style.setProperty("--active-shadow", item.shadow);
        document.querySelectorAll("#music-grid .card").forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
      });
      root.appendChild(card);
      if (index === 0) card.classList.add("active");
    });
  }

  function renderTimeline() {
    const root = document.getElementById("timeline-list");
    if (!root) return;
    root.innerHTML = "";
    data.timeline.forEach((item) => {
      const row = el("article", "timeline-item", `
        <div class="month-name">${item.month}</div>
        <div>
          <h3>${item.title}</h3>
          <ul>${item.points.map((p) => `<li>${p}</li>`).join("")}</ul>
        </div>
        <div class="month-money">${item.money}</div>
      `);
      root.appendChild(row);
    });
  }

  function renderRisks() {
    const root = document.getElementById("risk-grid");
    if (!root) return;
    root.innerHTML = "";
    data.risks.forEach((item) => {
      const card = el("article", "risk-card", `
        <span class="risk-level">${item.level}</span>
        <h3>${item.title}</h3>
        <p>${item.answer}</p>
      `);
      root.appendChild(card);
    });
  }

  function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];
    let mouse = { x: 0, y: 0, active: false };

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = width < 760 ? 90 : 170;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .28,
        vy: (Math.random() - .5) * .28,
        r: Math.random() * 1.8 + .4,
        hue: Math.random() < .55 ? 170 : (Math.random() < .75 ? 268 : 38),
        alpha: Math.random() * .55 + .15
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(width * .5, height * .38, 0, width * .5, height * .38, Math.max(width, height) * .72);
      gradient.addColorStop(0, "rgba(255,255,255,.035)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            p.x += (dx / dist) * .22;
            p.y += (dy / dist) * .22;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 76%, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, .55)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 118) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(190, 255, 240, ${(1 - dist / 118) * .13})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    });
    window.addEventListener("mouseleave", () => {
      mouse.active = false;
    });

    resize();
    draw();
  }

  renderStack();
  renderSprint();
  renderMoney();
  renderMusic();
  renderTimeline();
  renderRisks();
  initParticles();
})();
