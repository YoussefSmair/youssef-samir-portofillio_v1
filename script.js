/* ═══════════════════════════════════════════════════════════════
   YOUSSEF SAMIR — PORTFOLIO V9 — script.js
   Features:
   · J.A.R.V.I.S / F.R.I.D.A.Y HUD Hologram Interface (Enlarged Profile Photo Core)
   · 100% Transparent Background Layer (Fixed, stays on scroll)
   · High-Ascent Rising Particles System (Cyan & Orange ascending up to 80%-85% screen height)
   · Live GitHub Repos count (36)
   · Preserved 100% of V3 functions for Navbar, Typed text, Scroll reveal, Skill bars, Form, Cursor glow
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const GITHUB_USER = 'YoussefSmair';

/* ════════════════════════════════════════════════════════════════
   1. NAVBAR
   ════════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-links');
  const links   = document.querySelectorAll('.nav-link');
  const sects   = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    let cur = '';
    sects.forEach(s => { if (window.scrollY >= s.offsetTop - 110) cur = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${cur}`));
  }

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    navMenu.classList.toggle('open', !open);
  });
  links.forEach(l => l.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
  }));
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ════════════════════════════════════════════════════════════════
   2. J.A.R.V.I.S / F.R.I.D.A.Y HUD HOLOGRAM CANVAS (Enlarged with Profile Core)
   ════════════════════════════════════════════════════════════════ */
(function initHologram() {
  const canvas = document.getElementById('hologram-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SIZE = 800;
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  // Load User Profile Photo for Hologram Core
  const profileImg = new Image();
  profileImg.src = 'profile.jpg';
  let profileLoaded = false;
  profileImg.onload = () => { profileLoaded = true; };

  let t = 0;

  // Mouse tilt tracking
  let targetTiltX = 15, targetTiltY = -5;
  let currentTiltX = 15, currentTiltY = -5;

  const heroSec = document.getElementById('home');
  if (heroSec) {
    heroSec.addEventListener('mousemove', e => {
      const rect = heroSec.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltX = 15 - y * 14;
      targetTiltY = -5 + x * 14;
    });
    heroSec.addEventListener('mouseleave', () => {
      targetTiltX = 15;
      targetTiltY = -5;
    });
  }

  /* ── Drawing Helpers ─────────────────────────────────────────── */
  function drawCircle(r, strokeRgb, alpha, lw, blur) {
    ctx.beginPath();
    ctx.arc(CX, CY, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${strokeRgb}, ${alpha})`;
    ctx.lineWidth = lw;
    if (blur > 0) {
      ctx.shadowColor = `rgba(${strokeRgb}, 0.9)`;
      ctx.shadowBlur = blur;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawSegmentedArc(r, segs, rotAngle, colorRgb, alpha, lw, gapRatio, blur) {
    const arcLen = (Math.PI * 2) / segs;
    const gap = arcLen * gapRatio;
    ctx.shadowColor = `rgba(${colorRgb}, 0.9)`;
    ctx.shadowBlur = blur;

    for (let i = 0; i < segs; i++) {
      const a0 = rotAngle + i * arcLen + gap;
      const a1 = rotAngle + (i + 1) * arcLen - gap;

      ctx.beginPath();
      ctx.arc(CX, CY, r, a0, a1);
      ctx.strokeStyle = `rgba(${colorRgb}, ${alpha})`;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  function drawTickRing(r, count, rotAngle, colorRgb, alpha, majorEvery) {
    for (let i = 0; i < count; i++) {
      const a = rotAngle + (i / count) * Math.PI * 2;
      const isMajor = i % majorEvery === 0;
      const len = isMajor ? 16 : 8;
      const al = isMajor ? alpha : alpha * 0.4;
      const lw = isMajor ? 2.0 : 1.0;

      const x0 = CX + Math.cos(a) * r;
      const y0 = CY + Math.sin(a) * r;
      const x1 = CX + Math.cos(a) * (r - len);
      const y1 = CY + Math.sin(a) * (r - len);

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = `rgba(${colorRgb}, ${al})`;
      ctx.lineWidth = lw;
      if (isMajor) {
        ctx.shadowColor = `rgba(${colorRgb}, 0.8)`;
        ctx.shadowBlur = 6;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  function drawDotMatrix(r, count, rotAngle, colorRgb, alpha) {
    for (let i = 0; i < count; i++) {
      const a = rotAngle + (i / count) * Math.PI * 2;
      const px = CX + Math.cos(a) * r;
      const py = CY + Math.sin(a) * r;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorRgb}, ${alpha})`;
      ctx.fill();
    }
  }

  function drawProfileCore(r) {
    if (!profileLoaded) return;
    ctx.save();

    // Create circular clip path
    ctx.beginPath();
    ctx.arc(CX, CY, r, 0, Math.PI * 2);
    ctx.clip();

    // Draw user photo centered
    ctx.drawImage(profileImg, CX - r, CY - r, r * 2, r * 2);

    // Subtle holographic cyan tint overlay
    const overlayGrd = ctx.createRadialGradient(CX, CY, 0, CX, CY, r);
    overlayGrd.addColorStop(0, 'rgba(0, 200, 255, 0.05)');
    overlayGrd.addColorStop(0.7, 'rgba(0, 200, 255, 0.12)');
    overlayGrd.addColorStop(1, 'rgba(0, 200, 255, 0.3)');
    ctx.fillStyle = overlayGrd;
    ctx.fillRect(CX - r, CY - r, r * 2, r * 2);

    ctx.restore();
  }

  /* ── Main Render Loop ────────────────────────────────────────── */
  function render() {
    currentTiltX += (targetTiltX - currentTiltX) * 0.08;
    currentTiltY += (targetTiltY - currentTiltY) * 0.08;
    canvas.style.transform = `rotateX(${currentTiltX}deg) rotateZ(${currentTiltY}deg)`;

    ctx.clearRect(0, 0, SIZE, SIZE);

    const pulse = 0.8 + 0.2 * Math.sin(t * 2.5);

    // 1. Ambient Hologram Core Glow
    const bgGrd = ctx.createRadialGradient(CX, CY, 0, CX, CY, 370);
    bgGrd.addColorStop(0, `rgba(0, 200, 255, ${0.18 * pulse})`);
    bgGrd.addColorStop(0.5, 'rgba(0, 100, 200, 0.05)');
    bgGrd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bgGrd;
    ctx.beginPath();
    ctx.arc(CX, CY, 370, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outermost Thin HUD Orbit Ring (R=360)
    drawCircle(360, '0, 200, 255', 0.4, 1.2, 8);
    drawSegmentedArc(360, 4, t * 0.15, '0, 200, 255', 0.8, 3.5, 0.18, 12);

    // 3. Gold/Orange Secondary Arc (R=330)
    drawSegmentedArc(330, 8, -t * 0.25, '255, 155, 33', 0.65, 2.5, 0.2, 10);

    // 4. Tick Ring (R=300) — 60 Ticks
    drawTickRing(300, 60, t * 0.2, '0, 200, 255', 0.6, 5);

    // 5. Solid Glowing Ring (R=260)
    drawCircle(260, '0, 200, 255', 0.7, 2.2, 15);

    // 6. Dot Matrix Ring (R=230) — 40 Dots
    drawDotMatrix(230, 40, -t * 0.3, '0, 220, 255', 0.75);

    // 7. Middle Thick Segmented Ring (R=195)
    drawSegmentedArc(195, 6, t * 0.35, '0, 200, 255', 0.78, 4.5, 0.15, 15);

    // 8. Inner Tick Ring (R=160)
    drawTickRing(160, 36, -t * 0.4, '255, 155, 33', 0.58, 3);

    // 9. Profile Photo Center Core (R=115) & Dual Outer Rings
    drawProfileCore(115);
    drawCircle(115, '0, 220, 255', 0.95, 3.0, 20);
    drawCircle(122, '255, 155, 33', 0.8, 1.8, 12);

    t += 0.008;
    requestAnimationFrame(render);
  }

  render();
})();


/* ════════════════════════════════════════════════════════════════
   3. PARTICLES CANVAS — High-Ascent Particles (Cyan & Orange ascending up to 80%-85% screen height)
   ════════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const COUNT = 75;

  class Particle {
    constructor(init) { this.reset(init); }
    reset(init) {
      this.x = Math.random() * (W || window.innerWidth);
      this.minY = (H || window.innerHeight) * 0.18; // Ascends up to ~82% of screen height
      this.y = init ? Math.random() * ((H || window.innerHeight) - this.minY) + this.minY : (H || window.innerHeight) + 10;
      this.r = Math.random() * 2.3 + 0.6;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.vx = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.6 + 0.25;
      this.life = 0;
      this.maxLife = Math.random() * 320 + 200;
      this.gold = Math.random() < 0.35;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.y < this.minY || this.life > this.maxLife) {
        this.reset(false);
      }
    }

    draw() {
      const progress = (this.y - this.minY) / (H - this.minY);
      const fadeAlpha = Math.max(0, Math.min(1, progress)) * this.alpha;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(255, 155, 33, ${fadeAlpha.toFixed(3)})`
        : `rgba(0, 200, 255, ${fadeAlpha.toFixed(3)})`;

      ctx.shadowColor = this.gold ? 'rgba(255, 155, 33, 0.8)' : 'rgba(0, 200, 255, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  let particles = [];
  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle(true));
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 110) {
          const lineAlpha = (0.048 * (1 - d / 110)).toFixed(3);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 200, 255, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  init();
  loop();
  window.addEventListener('resize', init);
})();


/* ════════════════════════════════════════════════════════════════
   4. TYPED TEXT
   ════════════════════════════════════════════════════════════════ */
(function initTyped() {
  const el = document.getElementById('typed-title');
  if (!el) return;

  const strings = [
    'Web Design Trainee',
    'Data Analysis Trainee',
    'BIS Graduate',
    'HTML & CSS Contributor',
    'Power BI Developer',
  ];

  let si = 0, ci = 0, deleting = false, paused = false;
  const TYPE_MS   = 88;
  const DELETE_MS = 42;
  const PAUSE_MS  = 1900;

  function tick() {
    const cur = strings[si];
    if (deleting) {
      el.textContent = cur.slice(0, ci--);
      if (ci < 0) { deleting = false; si = (si + 1) % strings.length; ci = 0; }
      setTimeout(tick, DELETE_MS);
    } else {
      el.textContent = cur.slice(0, ci++);
      if (ci > cur.length) {
        if (paused) return;
        paused = true;
        setTimeout(() => { paused = false; deleting = true; tick(); }, PAUSE_MS);
        return;
      }
      setTimeout(tick, TYPE_MS);
    }
  }
  setTimeout(tick, 700);
})();


/* ════════════════════════════════════════════════════════════════
   5. SCROLL REVEAL (V3)
   ════════════════════════════════════════════════════════════════ */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal'));
      const idx      = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('visible'), idx * 110);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ════════════════════════════════════════════════════════════════
   6. SKILL BAR ANIMATION (V3)
   ════════════════════════════════════════════════════════════════ */
(function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animated'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.skill-fill').forEach(b => obs.observe(b));
})();


/* ════════════════════════════════════════════════════════════════
   7. GITHUB API — Repo count set to 36
   ════════════════════════════════════════════════════════════════ */
(function initGitHub() {
  const DEFAULT_REPOS = 36;

  function animCount(el, target) {
    const dur  = 1400;
    const t0   = performance.now();
    const step = now => {
      const p    = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setRepos(n) {
    const heroEl  = document.getElementById('stat-repos');
    const aboutEl = document.getElementById('github-repos-count');
    const finalCount = (typeof n === 'number' && n > 0) ? Math.max(n, DEFAULT_REPOS) : DEFAULT_REPOS;
    if (heroEl)  heroEl.textContent = finalCount;
    if (aboutEl) setTimeout(() => animCount(aboutEl, finalCount), 500);
  }

  fetch(`https://api.github.com/users/${GITHUB_USER}`)
    .then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(data => {
      const count = data.public_repos ?? DEFAULT_REPOS;
      setRepos(count);
    })
    .catch(() => {
      setRepos(DEFAULT_REPOS);
    });
})();


/* ════════════════════════════════════════════════════════════════
   8. CONTACT FORM — Mailto Handler (V3)
   ════════════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) { showStatus('⚠ Please fill in all fields.', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showStatus('⚠ Please enter a valid email address.', 'error'); return; }

    const subj = encodeURIComponent(`Portfolio Contact — ${name}`);
    const body = encodeURIComponent(`Name:  ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:ys506372@gmail.com?subject=${subj}&body=${body}`;
    showStatus('✓ Opening mail client…', 'success');
    form.reset();
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className   = `form-status ${type}`;
    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
  }
})();


/* ════════════════════════════════════════════════════════════════
   9. CUSTOM CURSOR GLOW (V3)
   ════════════════════════════════════════════════════════════════ */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = Object.assign(document.createElement('div'), { style: `
    position:fixed;pointer-events:none;z-index:9999;
    width:6px;height:6px;border-radius:50%;
    background:rgba(0,200,255,0.9);
    box-shadow:0 0 10px rgba(0,200,255,0.8),0 0 20px rgba(0,200,255,0.4);
    transform:translate(-50%,-50%);display:none;
  `});
  const ring = Object.assign(document.createElement('div'), { style: `
    position:fixed;pointer-events:none;z-index:9998;
    width:26px;height:26px;border-radius:50%;
    border:1px solid rgba(0,200,255,0.35);
    transform:translate(-50%,-50%);
    transition:left 0.1s ease-out,top 0.1s ease-out,width 0.2s,height 0.2s,border-color 0.2s;
    display:none;
  `});
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  document.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
    dot.style.left = ring.style.left = x + 'px';
    dot.style.top  = ring.style.top  = y + 'px';
    dot.style.display = ring.style.display = 'block';
  });
  document.addEventListener('mouseleave', () => {
    dot.style.display = ring.style.display = 'none';
  });

  document.querySelectorAll('a, button, .highlight-card, .tech-tag, .contact-method, .social-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = ring.style.height = '44px';
      ring.style.borderColor = 'rgba(255,155,33,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = ring.style.height = '26px';
      ring.style.borderColor = 'rgba(0,200,255,0.35)';
    });
  });
})();
