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

/* ── Scroll reveal (Intersection Observer) ── */
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
      if (ci < 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 520);
        return;
      }
    } else {
      tw.textContent = phrase.substring(0, ci++);
      if (ci > phrase.length) {
        del = true;
        setTimeout(tick, 2200);
        return;
      }
    }
    setTimeout(tick, del ? 38 : 62);
  }
  setTimeout(tick, 900);
}

/* ── Animated counters (hero stats) ── */
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1600;
  const step = target / (duration / 16);
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
        const val = parseFloat(el.dataset.count);
        const suf = el.dataset.suffix || '';
        animateCounter(el, val, suf);
      });
      once.disconnect();
    }
  }, { threshold: 0.5 });
  once.observe(statsSection);
}

/* ── Scroll listeners ── */
window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
}, { passive: true });

/* ── Init ── */
updateNav();
setActiveLink();
