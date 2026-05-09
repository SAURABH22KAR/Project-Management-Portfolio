/* ================================================
   SAURABH BAVISKAR — PORTFOLIO 2026 — JS
   ================================================ */

/* ── Scroll progress bar ── */
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  if (!progressBar) return;
  const s = document.documentElement;
  progressBar.style.width = ((s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100) + '%';
}

/* ── Nav scroll effect ── */
const navEl = document.querySelector('nav');
function updateNav() {
  if (!navEl) return;
  navEl.classList.toggle('scrolled', window.scrollY > 20);
}

/* ── Active nav link ── */
function setActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Burger menu ── */
const burger   = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    })
  );
}

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Typewriter effect ── */
const tw = document.querySelector('.hero-typewriter');
if (tw) {
  const phrases = [
    'React · TypeScript · Node.js',
    'Building AI Agents with LLMs',
    'Supabase · Vercel · CI/CD',
    'Full Stack · Open to Roles',
  ];
  let pi = 0, ci = 0, del = false;

  function tick() {
    const phrase = phrases[pi];
    if (del) {
      tw.textContent = phrase.substring(0, ci--);
      if (ci < 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 520); return; }
    } else {
      tw.textContent = phrase.substring(0, ci++);
      if (ci > phrase.length) { del = true; setTimeout(tick, 2200); return; }
    }
    setTimeout(tick, del ? 38 : 62);
  }
  setTimeout(tick, 900);
}

/* ── Animated counters ── */
function animateCounter(el, target, suffix) {
  let start = 0;
  const step = target / (1600 / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = (Number.isInteger(target) ? Math.floor(start) : start.toFixed(1)) + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const once = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        animateCounter(el, parseFloat(el.dataset.count), el.dataset.suffix || '');
      });
      once.disconnect();
    }
  }, { threshold: 0.5 });
  once.observe(statsSection);
}

/* ── Grain overlay ── */
const grain = document.createElement('div');
grain.className = 'grain';
document.body.appendChild(grain);

/* ── Custom cursor (non-touch only) ── */
const isTouch = window.matchMedia('(pointer: coarse)').matches;
if (!isTouch) {
  document.body.classList.add('custom-cursor');

  const cursorDot  = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className  = 'cursor-dot';
  cursorRing.className = 'cursor-ring';
  document.body.append(cursorDot, cursorRing);

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { mx = -200; my = -200; });

  document.querySelectorAll('a, button, .skill-tag, .project-card, .cert-card, .now-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('expanded'));
  });

  (function loop() {
    cursorDot.style.left  = mx + 'px';
    cursorDot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ── Mouse-follow glow + 3D tilt on cards ── */
document.querySelectorAll('.project-card, .cert-card, .edu-card, .now-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color 0.3s, box-shadow 0.3s';
  });
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const relX = e.clientX - r.left;
    const relY = e.clientY - r.top;
    const x = relX / r.width  - 0.5;
    const y = relY / r.height - 0.5;
    card.style.setProperty('--mx', relX + 'px');
    card.style.setProperty('--my', relY + 'px');
    card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = '';
    card.style.transform  = '';
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  });
});

/* ── Scroll-to-top button ── */
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Back to top');
scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
document.body.appendChild(scrollTopBtn);
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Page transition ── */
const pageTransition = document.createElement('div');
pageTransition.className = 'page-transition';
document.body.appendChild(pageTransition);

requestAnimationFrame(() => requestAnimationFrame(() => pageTransition.classList.add('out')));

document.querySelectorAll('a').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (
    href && href.trim() !== '' &&
    !href.startsWith('http') &&
    !href.startsWith('#') &&
    !href.startsWith('mailto') &&
    !a.hasAttribute('download') &&
    a.href !== window.location.href
  ) {
    a.addEventListener('click', e => {
      e.preventDefault();
      const dest = a.href;
      pageTransition.classList.remove('out');
      setTimeout(() => { window.location.href = dest; }, 300);
    });
  }
});

/* ── GitHub stats (index only) ── */
if (document.getElementById('gh-repos')) {
  fetch('https://api.github.com/users/SAURABH22KAR')
    .then(r => r.json())
    .then(d => {
      const el = document.getElementById('gh-repos');
      const fl = document.getElementById('gh-followers');
      if (el) el.textContent = d.public_repos;
      if (fl) fl.textContent = d.followers;
    })
    .catch(() => {});

  fetch('https://api.github.com/users/SAURABH22KAR/repos?per_page=100')
    .then(r => r.json())
    .then(repos => {
      if (!Array.isArray(repos)) return;
      const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      const el = document.getElementById('gh-stars');
      if (el) el.textContent = stars;
    })
    .catch(() => {});
}

/* ── Scroll listeners ── */
window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

/* ── Init ── */
updateNav();
setActiveLink();
