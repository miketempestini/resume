// Gantry pages: motion and small interactions. Every part checks that its
// elements exist, so the product page, story and privacy policy share this file.
document.documentElement.classList.add('js');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Headline words rise in once fonts are ready (or after a short wait)
const markLoaded = () => setTimeout(() => document.body.classList.add('loaded'), 20);
if (document.fonts) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 600))]).then(markLoaded);
else markLoaded();
$$('.rise').forEach((el, i) => el.style.setProperty('--d', `${0.08 + i * 0.07}s`));

// Year in the footer
$$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// Top bar picks up a background once you scroll
const topbar = $('.topbar');
const onScrollBar = () => topbar && topbar.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScrollBar, { passive: true });
onScrollBar();

// ── Scroll reveal, with stagger inside [data-stagger] groups ──
$$('[data-stagger]').forEach(group => {
  const step = parseFloat(group.dataset.stagger) || 80;
  [...group.children].forEach((el, i) => el.style.setProperty('--d', `${i * step}ms`));
});
const revealer = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    target.classList.add('visible');
    if (target.dataset.count) countUp(target);
    revealer.unobserve(target);
  });
}, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
$$('.reveal, .loop, [data-count]').forEach(el => revealer.observe(el));

function countUp(el) {
  const to = parseFloat(el.dataset.count);
  if (reduceMotion) { el.textContent = to.toLocaleString(); return; }
  const start = performance.now();
  const dur = 1600;
  const tick = now => {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - t, 4))).toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── Cursor spotlight on cards ──
$$('.spot').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// ── Toast for links that aren't live yet ──
let toastTimer;
const toast = msg => {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
};
$$('[data-soon]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  toast(a.dataset.soon || 'Coming soon');
}));

// ── Hero film: tilts flat as it scrolls into place; autoplays muted ──
const film = $('.film');
if (film) {
  const video = $('video', film);
  const bar = $('.film-progress', film);
  if (!reduceMotion) {
    let ticking = false;
    const update = () => {
      const r = film.getBoundingClientRect();
      // 1 while the window's top sits low on screen, 0 once it has risen to ~15% of the viewport
      const t = Math.min(Math.max((r.top - innerHeight * 0.15) / (innerHeight * 0.55), 0), 1);
      film.style.setProperty('--tilt', t.toFixed(3));
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  } else {
    film.style.setProperty('--tilt', 0);
  }

  let userPaused = reduceMotion;
  const sync = () => {
    film.classList.toggle('paused', video.paused);
    film.classList.toggle('muted', video.muted);
    film.classList.toggle('idle', video.paused);
  };
  const tryPlay = () => video.play().catch(() => sync());
  ['play', 'pause', 'volumechange'].forEach(ev => video.addEventListener(ev, sync));
  video.addEventListener('timeupdate', () => bar && bar.style.setProperty('--p', (video.currentTime / video.duration || 0).toFixed(4)));
  $('[data-film="sound"]', film).addEventListener('click', () => {
    video.muted = !video.muted;
    if (!video.muted && video.currentTime > 0.5 && video.dataset.restarted !== '1') {
      // First unmute starts the film over so the sound lines up with the opening
      video.currentTime = 0;
      video.dataset.restarted = '1';
    }
    userPaused = false;
    tryPlay();
  });
  $('[data-film="toggle"]', film).addEventListener('click', () => {
    if (video.paused) { userPaused = false; tryPlay(); } else { userPaused = true; video.pause(); }
  });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !userPaused) tryPlay();
    else if (!e.isIntersecting && !video.paused) video.pause();
  }, { threshold: 0.3 }).observe(film);
  sync();
}

// ── Looping clips: play only while on screen and actually shown ──
const clipObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting && target.offsetParent !== null && !reduceMotion) target.play().catch(() => {});
    else if (!isIntersecting) target.pause();
  });
}, { threshold: 0.2 });
$$('video[data-loop]').forEach(v => clipObserver.observe(v));

// ── Features: the step in the middle of the screen drives the sticky video ──
const steps = $$('.step');
const stage = $('.stage');
if (steps.length && stage) {
  const vids = $$('video', stage);
  const dots = $$('.stage-dots button', stage);
  let current = -1;
  const show = i => {
    if (i === current) return;
    current = i;
    steps.forEach((s, j) => s.classList.toggle('active', j === i));
    dots.forEach((d, j) => { d.classList.toggle('on', j === i); d.setAttribute('aria-current', j === i ? 'true' : 'false'); });
    vids.forEach((v, j) => {
      const on = j === i;
      v.classList.toggle('on', on);
      if (on && !reduceMotion && getComputedStyle(stage).display !== 'none') { v.currentTime = 0; v.play().catch(() => {}); }
      else v.pause();
    });
  };
  const stepObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) show(steps.indexOf(e.target)); });
  }, { rootMargin: '-50% 0px -50% 0px' });
  steps.forEach(s => stepObserver.observe(s));
  dots.forEach((d, i) => d.addEventListener('click', () => steps[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })));
  show(0);
}

// ── Demo library: filter by category, open videos in a player ──
const filters = $('.filters');
if (filters) {
  const glider = $('.glider', filters);
  const buttons = $$('button', filters);
  const moveGlider = btn => {
    glider.style.width = btn.offsetWidth + 'px';
    glider.style.transform = `translateX(${btn.offsetLeft}px)`;
  };
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-pressed', b === btn); });
    moveGlider(btn);
    const cat = btn.dataset.filter;
    $$('.demo').forEach(d => {
      const show = cat === 'all' || d.dataset.cat === cat;
      d.classList.toggle('hide', !show);
      if (show && !reduceMotion) d.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    });
  }));
  const init = () => moveGlider($('button.on', filters));
  init();
  addEventListener('resize', init);
  if (document.fonts) document.fonts.ready.then(init);
}

const player = $('.player');
if (player) {
  const frame = $('.player-frame', player);
  const close = () => player.close();
  $$('.demo').forEach(card => card.addEventListener('click', () => {
    const id = card.dataset.youtube;
    const title = $('.demo-title', card).textContent;
    if (id) {
      // youtube-nocookie keeps YouTube from setting cookies until the video plays
      frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1" title="${title.replace(/"/g, '&quot;')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    } else {
      frame.innerHTML = `<div class="player-soon"><b>${title}</b><span>This walkthrough is being recorded. Check back soon.</span></div>`;
    }
    player.showModal();
  }));
  $('.player-close', player).addEventListener('click', close);
  player.addEventListener('click', e => { if (e.target === player) close(); });
  player.addEventListener('close', () => { frame.innerHTML = ''; });
}

// ── Article pages: reading progress and the current section in the contents ──
const progress = $('.progress i');
if (progress) {
  const article = $('.prose') || document.body;
  const update = () => {
    const r = article.getBoundingClientRect();
    const p = Math.min(Math.max(-r.top / (r.height - innerHeight * 0.6), 0), 1);
    progress.style.setProperty('--p', p.toFixed(4));
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}
const tocLinks = $$('.toc a');
if (tocLinks.length) {
  const heads = tocLinks.map(a => document.getElementById(a.getAttribute('href').slice(1)));
  const setToc = () => {
    const current = heads.filter(h => h && h.getBoundingClientRect().top < innerHeight * 0.3).pop() || heads[0];
    tocLinks.forEach((a, i) => a.classList.toggle('active', heads[i] === current));
  };
  addEventListener('scroll', setToc, { passive: true });
  setToc();
}
