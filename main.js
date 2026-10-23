document.getElementById('year').textContent = new Date().getFullYear();

// ── Theme toggle ──
const root = document.documentElement;
document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const apply = () => {
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  };
  // Cross-fade where supported; otherwise (or with reduced motion) switch instantly
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
});

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Stagger: delay siblings so groups cascade in ──
const stagger = (sel, stepMs) => document.querySelectorAll(sel).forEach(group => {
  [...group.children].forEach((el, i) => el.style.setProperty('--d', `${i * stepMs}ms`));
});
stagger('.hero-copy', 80);
stagger('.cards-3', 90);
stagger('.edu-list', 90);
stagger('.projects', 100);
document.querySelectorAll('.reveal-chips .chip').forEach((el, i) => el.style.setProperty('--d', `${i * 18}ms`));

// ── Highlighter targets ──
document.querySelectorAll('.hero-lede strong, .about-summary strong, .bullets strong, .project-desc strong')
  .forEach(el => el.classList.add('hl'));
document.querySelectorAll('.impact').forEach(el => el.classList.add('anim'));

// ── Count-up ──
const countUp = (el) => {
  const to = parseFloat(el.textContent);
  const dec = (el.textContent.split('.')[1] || '').length;
  if (reduceMotion) return;
  const dur = 1200;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (to * eased).toFixed(dec);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// ── Scroll reveal: fade-ins, highlight sweeps, counters ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.classList.contains('fade-in')) el.classList.add('visible');
    if (el.classList.contains('hl') || el.classList.contains('anim')) el.classList.add('in');
    if (el.classList.contains('count')) countUp(el);
    observer.unobserve(el);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-in, .hl, .impact, .count').forEach(el => observer.observe(el));

// Once a card has faded in, drop the reveal delay so hover feels instant
document.querySelectorAll('.fade-in').forEach(el => {
  el.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'opacity' && el.classList.contains('visible')) el.classList.add('settled');
  });
});

// ── Showreel: autoplay muted while in view; poster + play button for reduced motion ──
const reel = document.querySelector('.reel');
const video = document.getElementById('reel-video');
if (reel && video) {
  video.controls = false;
  reel.classList.add('ready');
  let userPaused = false;
  let inView = false;
  const sync = () => {
    reel.classList.toggle('paused', video.paused);
    reel.querySelector('.reel-toggle').setAttribute('aria-label', video.paused ? 'Play showreel' : 'Pause showreel');
  };
  video.addEventListener('play', () => { reel.classList.remove('idle'); sync(); });
  video.addEventListener('pause', sync);
  const tryPlay = () => { video.play().catch(() => { reel.classList.add('idle'); }); };

  reel.querySelector('.reel-play').addEventListener('click', () => { userPaused = false; tryPlay(); });
  reel.querySelector('.reel-toggle').addEventListener('click', () => {
    if (video.paused) { userPaused = false; tryPlay(); }
    else { userPaused = true; video.pause(); }
  });

  if (reduceMotion) {
    reel.classList.add('idle');
    userPaused = true;
  }
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView && !userPaused) tryPlay();
    else if (!inView && !video.paused) video.pause();
  }, { threshold: 0.35 }).observe(reel);
  sync();
}

// ── Project card previews: loop muted while on screen; still frame for reduced motion ──
const previews = document.querySelectorAll('.project-media video');
if (!reduceMotion) {
  const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: 0.25 });
  previews.forEach(v => previewObserver.observe(v));
}

// ── Rotating word in hero ──
const rotator = document.querySelector('.rotator');
if (rotator) {
  const words = [...rotator.children];
  let i = 0;
  const fit = () => { rotator.style.width = words[i].offsetWidth + 'px'; };
  fit();
  window.addEventListener('resize', fit);
  if (document.fonts) document.fonts.ready.then(fit);
  if (!reduceMotion) {
    setInterval(() => {
      const prev = words[i];
      i = (i + 1) % words.length;
      prev.classList.remove('on');
      prev.classList.add('out');
      words[i].classList.remove('out');
      words[i].classList.add('on');
      fit();
      setTimeout(() => prev.classList.remove('out'), 500);
    }, 2400);
  }
}

// ── Nav: sliding highlight pill follows hover, rests on the current section ──
const navList = document.querySelector('.nav-links');
const navPill = document.querySelector('.nav-pill');
const navLinks = document.querySelectorAll('.nav-links a');
let activeLink = null;
const movePill = (link) => {
  navLinks.forEach(l => l.classList.toggle('lit', l === link));
  if (!link) { navPill.style.opacity = '0'; return; }
  const listBox = navList.getBoundingClientRect();
  const box = link.getBoundingClientRect();
  navPill.style.width = box.width + 'px';
  navPill.style.transform = `translateX(${box.left - listBox.left}px)`;
  navPill.style.opacity = '1';
};
if (reduceMotion) navPill.style.transition = 'none';
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => movePill(link));
  link.addEventListener('focus', () => movePill(link));
});
navList.addEventListener('mouseleave', () => movePill(activeLink));
navList.addEventListener('focusout', () => movePill(activeLink));

// Current section: the last one whose top is above 45% of the screen,
// or the last section once scrolled to the bottom (Contact is too short to get there)
const sections = [...document.querySelectorAll('section[id]')];
const setActive = () => {
  const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
  const current = atBottom ? sections[sections.length - 1]
    : sections.filter(s => s.getBoundingClientRect().top < innerHeight * 0.45).pop();
  const link = [...navLinks].find(l => l.getAttribute('href') === '#' + current?.id) || null;
  if (link === activeLink) return;
  activeLink = link;
  navLinks.forEach(l => l.classList.toggle('active', l === activeLink));
  if (!navList.matches(':hover')) movePill(activeLink);
};
window.addEventListener('scroll', setActive, { passive: true });
setActive();
window.addEventListener('resize', () => movePill(activeLink));
if (document.fonts) document.fonts.ready.then(() => movePill(activeLink));
