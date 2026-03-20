
// ─── STARS 
(function () {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }
  function initStars() {
    stars = [];
    const n = Math.floor((canvas.width * canvas.height) / 4000);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;
    stars.forEach((s) => {
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,240,200,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ─── SCROLL 
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.15 }
  );
  els.forEach((el) => obs.observe(el));
})();

// ─── PROGRESS BAR 
(function () {
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  });
})();

// ─── NAV 
(function () {
  const dots = document.querySelectorAll('.nav-dot');
  const ids = ['hero', 'greeting', 'lanterns', 'doa', 'tips', 'thr', 'closing'];
  const sections = ids.map((id) => document.getElementById(id));

  dots.forEach((d) => {
    d.addEventListener('click', () => {
      document.getElementById(d.dataset.target).scrollIntoView({ behavior: 'smooth' });
    });
  });

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          dots.forEach((d) => d.classList.remove('active'));
          const idx = sections.indexOf(e.target);
          if (idx >= 0) dots[idx].classList.add('active');
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => s && obs.observe(s));
})();


(function () {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('closing');
  let particles = [];
  let active = false;

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COLORS = ['#C9933A', '#E8BA5C', '#F5E080', '#fff7cc', '#ffd700', '#ff9d3f'];
  function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }

  function explode(x, y) {
    const n = 40 + Math.floor(Math.random() * 30);
    for (let i = 0; i < n; i++) {
      const angle = ((Math.PI * 2) / n) * i + Math.random() * 0.3;
      const speed = 1.5 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        r: Math.random() * 2.5 + 1,
        color: randomColor(),
        decay: 0.012 + Math.random() * 0.01,
      });
    }
  }

  function launchRandom() {
    explode(
      canvas.width * (0.2 + Math.random() * 0.6),
      canvas.height * (0.1 + Math.random() * 0.5)
    );
  }

  function loop() {
    if (!active) { requestAnimationFrame(loop); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.06;
      p.alpha -= p.decay;
      p.vx *= 0.98; p.vy *= 0.98;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    particles = particles.filter((p) => p.alpha > 0);
    requestAnimationFrame(loop);
  }
  loop();

  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => { active = e.isIntersecting; }),
    { threshold: 0.3 }
  );
  obs.observe(section);

  setInterval(() => {
    if (active) {
      launchRandom();
      setTimeout(launchRandom, 200);
      setTimeout(launchRandom, 450);
    }
  }, 1800);
})();




