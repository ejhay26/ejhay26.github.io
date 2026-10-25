/**
 * EMMANUEL JOHN PEREZ (terajaki) — PORTFOLIO CONTROLLER
 * Rigid-rotation sky transition, random starfield and meteor, zero-jitter scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  initSecurityAndSelection();
  initHeroAnimations();
  initZeroJitterScroll();
  initProjectFilters();
  initCelestialOrbitCycle(initStarfield());
  initTerminal();
});

/* ==========================================================================
   1. DISABLE RIGHT-CLICK & DRAG
   ========================================================================== */
function initSecurityAndSelection() {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());
}

/* ==========================================================================
   2. HERO ENTRANCE CHOREOGRAPHY (ANIME.JS)
   ========================================================================== */
function initHeroAnimations() {
  if (typeof anime === 'undefined') return;

  anime({
    targets: '.hero-line',
    translateY: [-50, 0],
    opacity: [0, 1],
    delay: anime.stagger(140, { start: 100 }),
    duration: 900,
    easing: 'easeOutElastic(1, .7)'
  });

  anime({
    targets: '.sticker-pill',
    scale: [0.3, 1],
    rotate: (el) => parseFloat(el.getAttribute('data-rotate')) || 0,
    opacity: [0, 1],
    delay: anime.stagger(120, { start: 350 }),
    duration: 850,
    easing: 'easeOutBack'
  });

  anime({
    targets: ['.hero-tagline-box', '.hero-actions'],
    translateY: [35, 0],
    opacity: [0, 1],
    delay: anime.stagger(150, { start: 500 }),
    duration: 750,
    easing: 'easeOutCubic'
  });

  anime({
    targets: '.spec-card',
    translateX: [60, 0],
    opacity: [0, 1],
    duration: 900,
    delay: 550,
    easing: 'easeOutExpo'
  });

  anime({
    targets: '.spec-row',
    opacity: [0, 1],
    translateX: [15, 0],
    delay: anime.stagger(70, { start: 750 }),
    duration: 500,
    easing: 'easeOutQuad'
  });

  // Mouse parallax on the spec card, one update per animation frame
  const heroCard = document.querySelector('.spec-card');
  if (heroCard && !window.matchMedia('(pointer: coarse)').matches) {
    let frameId = 0;
    let dx = 0;
    let dy = 0;
    document.addEventListener('mousemove', (e) => {
      dx = (e.clientX / window.innerWidth - 0.5) * 8;
      dy = (e.clientY / window.innerHeight - 0.5) * 8;
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        heroCard.style.transform = `translate(${dx}px, ${dy}px)`;
        frameId = 0;
      });
    });
  }
}

/* ==========================================================================
   3. ZERO-JITTER SCROLL REVEAL
   ========================================================================== */
function initZeroJitterScroll() {
  const scrollCards = document.querySelectorAll('.scroll-card');
  if (!('IntersectionObserver' in window)) {
    scrollCards.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      const stamp = el.querySelector('.contact-stamp, .stamp-badge');

      if (entry.isIntersecting && entry.intersectionRatio > 0.05) {
        el.classList.add('is-visible');
        if (stamp && !stamp._animated) {
          stamp._animated = true;
          if (typeof anime !== 'undefined') {
            anime({
              targets: stamp,
              rotate: [0, parseFloat(stamp.getAttribute('data-rotate')) || 0],
              scale: [0.8, 1],
              duration: 700,
              delay: 100,
              easing: 'easeOutElastic(1, .6)'
            });
          }
        }
      } else if (!entry.isIntersecting && entry.intersectionRatio === 0) {
        // Reset only when fully outside the viewport to avoid edge jitter
        el.classList.remove('is-visible');
        if (stamp) stamp._animated = false;
      }
    });
  }, { threshold: [0, 0.15], rootMargin: '0px 0px -30px 0px' });

  scrollCards.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. PROJECT FILTER
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      if (typeof anime !== 'undefined') {
        anime({ targets: btn, scale: [0.9, 1], duration: 250, easing: 'easeOutBack' });
      }

      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('is-visible'), 20);
        } else {
          card.style.display = 'none';
          card.classList.remove('is-visible');
        }
      });
    });
  });
}

/* ==========================================================================
   5. THEME TRANSITION: ONE RIGID ROTATION
   The whole sky rotates about a single pivot below the viewport, like a
   night timelapse. The sun/moon, every star and its trail ride the same
   circle, so each body travels one continuous arc: it rises from the
   bottom-left, peaks at its resting spot at the top-right, and the outgoing
   body keeps going down the far side. A curved wave edge (circle centred on
   the bottom-left corner) reveals the new page (header, cards, text) while
   the old look stays outside it. The sky layer is never frozen: stars, trails,
   sun and moon keep animating across the whole screen. Everything is driven
   by one anime.js timeline, and clicks are ignored while it runs.
   ========================================================================== */
function initCelestialOrbitCycle(sky) {
  const btn = document.getElementById('theme-toggle');
  const sun = document.getElementById('sky-sun');
  const moon = document.getElementById('sky-moon');
  const wash = document.getElementById('sky-wash');
  const ring = document.getElementById('sky-ring');
  const telemetry = document.getElementById('telemetry-text');
  if (!btn || !sun || !moon || !wash || !ring || typeof anime === 'undefined') return;

  const root = document.documentElement;
  const clouds = document.querySelectorAll('.sliding-cloud');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = 1800;
  const MARGIN = 160;
  let running = false;

  function restCenter(el) {
    el.style.transform = '';
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function moveTo(el, rest, pt) {
    el.style.transform = `translate(${pt.x - rest.x}px, ${pt.y - rest.y}px)`;
  }

  // Copies the running CSS animation phase (marquee, ribbon, birds) onto a clone
  function syncAnimations(source, clone) {
    const clones = clone.querySelectorAll('*');
    source.querySelectorAll('*').forEach((el, i) => {
      const target = clones[i].getAnimations();
      el.getAnimations().forEach((anim, k) => {
        if (target[k]) target[k].currentTime = anim.currentTime;
      });
    });
  }

  // Copy of the page content in its current (old) theme. It is shown only outside the
  // wave, while the live page underneath switches to the new theme immediately.
  function createThemeGhost() {
    const theme = document.body.getAttribute('data-theme');
    const marqueeHeight = document.querySelector('.top-marquee').offsetHeight;
    const ghost = document.createElement('div');
    ghost.className = 'theme-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.inert = true;

    const page = document.createElement('div');
    page.className = 'ghost-page';
    page.setAttribute('data-theme', theme);
    const stuckHeader = document.createElement('div');
    stuckHeader.className = 'ghost-page';
    stuckHeader.setAttribute('data-theme', theme);

    const pairs = [];
    const copyInto = (selector, parent, hidden) => {
      const source = document.querySelector(selector);
      const clone = source.cloneNode(true);
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
      if (hidden) clone.style.visibility = 'hidden';
      parent.appendChild(clone);
      pairs.push([source, clone]);
    };
    // The header keeps its place in the flow (hidden) and a second copy sticks to the viewport top
    ['.top-marquee', '.site-header', 'main', '.site-footer'].forEach((selector) => {
      copyInto(selector, page, selector === '.site-header');
    });
    copyInto('.site-header', stuckHeader, false);
    ghost.append(page, stuckHeader);

    function place() {
      page.style.transform = `translateY(${-window.scrollY}px)`;
      stuckHeader.style.top = `${Math.max(marqueeHeight - window.scrollY, 0)}px`;
    }
    place();
    window.addEventListener('scroll', place, { passive: true });
    document.body.appendChild(ghost);
    pairs.forEach(([source, clone]) => syncAnimations(source, clone));

    return {
      destroy() {
        window.removeEventListener('scroll', place);
        ghost.remove();
      }
    };
  }

  function applyTheme(theme) {
    const dark = theme === 'dark';
    document.body.setAttribute('data-theme', theme);
    btn.setAttribute('aria-checked', String(dark));
    if (telemetry) telemetry.textContent = dark ? 'LUNAR // PHASE WAXING' : 'SOL // ZENITH 12:00';
  }

  function showRestingBody(theme) {
    sun.classList.toggle('is-hidden', theme === 'dark');
    moon.classList.toggle('is-hidden', theme !== 'dark');
  }

  function transition(next) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const incoming = next === 'dark' ? moon : sun;
    const outgoing = next === 'dark' ? sun : moon;
    const rest = restCenter(incoming);
    outgoing.style.transform = '';

    // Circle whose apex is the resting spot and which reaches the bottom-left margin
    const a = rest.x + MARGIN;
    const b = H + MARGIN - rest.y;
    const radius = (a * a + b * b) / (2 * b);
    const sweep = Math.asin(Math.min(1, a / radius));
    const pivot = { x: rest.x, y: rest.y + radius };
    const onArc = (phi) => ({
      x: pivot.x + radius * Math.sin(phi),
      y: pivot.y - radius * Math.cos(phi)
    });

    running = true;
    const maxR = Math.hypot(W, H) + 12;
    const state = { rot: 0, wipe: 0 };
    const geo = { pivot, sweep };
    const starDir = next === 'dark' ? 'in' : 'out';
    // Freeze the old look first: a copy of the page (ghost) and the old background colour (wash)
    const ghost = createThemeGhost();
    const bodyStyle = getComputedStyle(document.body);
    wash.style.backgroundColor = bodyStyle.backgroundColor;
    wash.style.backgroundImage = bodyStyle.backgroundImage;
    wash.style.backgroundSize = bodyStyle.backgroundSize;
    root.style.setProperty('--wave-cy', `${H}px`);
    root.style.setProperty('--wave-r', '0px');
    root.classList.add('theme-switching');
    wash.style.visibility = 'visible';

    // The live page switches to the new theme at once. The incoming body starts
    // off-screen so it never shows at its resting spot.
    sky.warp(starDir, 0, geo);
    applyTheme(next);
    incoming.classList.remove('is-hidden');
    moveTo(incoming, rest, onArc(-sweep));

    function render() {
      moveTo(incoming, rest, onArc(-sweep * (1 - state.rot)));
      moveTo(outgoing, rest, onArc(sweep * state.rot));
      sky.warp(starDir, state.rot, geo);

      const r = maxR * state.wipe;
      root.style.setProperty('--wave-r', `${r}px`);
      ring.style.width = `${2 * r}px`;
      ring.style.height = `${2 * r}px`;
      ring.style.left = `${-r}px`;
      ring.style.top = `${H - r}px`;
      ring.style.visibility = r > 6 ? 'visible' : 'hidden';
    }

    function finish() {
      incoming.style.transform = '';
      outgoing.style.transform = '';
      outgoing.classList.add('is-hidden');
      btn.style.transform = '';
      clouds.forEach((c) => { c.style.transform = ''; });
      ring.style.visibility = 'hidden';
      wash.style.visibility = 'hidden';
      ghost.destroy();
      root.style.removeProperty('--wave-r');
      root.style.removeProperty('--wave-cy');
      root.classList.remove('theme-switching');
      sky.warp(null, 0, null);
      running = false;
    }

    anime.timeline({ duration: DURATION, easing: 'linear', update: render, complete: finish })
      .add({ targets: state, rot: 1, easing: 'easeInOutSine' }, 0)
      .add({ targets: state, wipe: 1, easing: 'easeInOutCubic' }, 0)
      .add({
        targets: clouds,
        translateX: next === 'light' ? [-W * 0.6, 0] : [0, W],
        delay: anime.stagger(120),
        easing: 'easeInOutCubic'
      }, 0)
      .add({ targets: btn, scale: [0.9, 1], duration: 450, easing: 'easeOutBack' }, 0);
  }

  function toggle() {
    if (running) return;
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('ejhay26_theme', next); } catch (_) { /* storage blocked */ }
    if (reduceMotion) {
      applyTheme(next);
      showRestingBody(next);
      sky.refresh();
      return;
    }
    transition(next);
  }

  let saved = 'light';
  try { saved = localStorage.getItem('ejhay26_theme') === 'dark' ? 'dark' : 'light'; } catch (_) { /* storage blocked */ }
  applyTheme(saved);
  showRestingBody(saved);
  sky.refresh();

  btn.addEventListener('click', toggle);
  sun.addEventListener('click', toggle);
  moon.addEventListener('click', toggle);
}

/* ==========================================================================
   6. STARFIELD: RANDOM BLINKING STARS, METEORS, ROTATING STAR TRAILS
   Idle night sky: stars fade in at random spots, hold, fade out and respawn
   elsewhere, with an occasional meteor. During a theme transition each star
   is rotated about the shared pivot, so its trail is a circular arc. The
   canvas always stays in the background layer, and the loop only runs while
   it has something to draw.
   ========================================================================== */
function initStarfield() {
  const canvas = document.getElementById('sky-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  if (!ctx) return { warp() {}, refresh() {} };

  const STAR_COUNT = 85;
  const INK = '#0E0F12';
  let w = 0;
  let h = 0;
  let stars = [];
  let meteor = null;
  let nextMeteorAt = performance.now() + 8000;
  let warpDir = null;
  let warpP = 0;
  let geo = null;
  let looping = false;

  function createStar(visible) {
    const targetAlpha = 0.35 + Math.random() * 0.65;
    return {
      x: Math.random() * w,
      y: Math.random() * h * 0.72,
      r: 1.5 + Math.random() * 2.5,
      dot: Math.random() > 0.3,
      alpha: visible ? Math.random() * targetAlpha : 0,
      targetAlpha,
      fadeSpeed: 0.008 + Math.random() * 0.02,
      state: 'fadeIn',
      hold: 30 + Math.random() * 60,
      reach: 60 + Math.random() * 200
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: STAR_COUNT }, () => createStar(true));
    kick();
  }

  function drawShape(x, y, s) {
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (s.dot) {
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
    } else {
      ctx.rect(x - s.r, y - s.r, s.r * 2, s.r * 2);
    }
    ctx.fill();
    ctx.stroke();
  }

  function rotateAbout(s, angle) {
    const dx = s.x - geo.pivot.x;
    const dy = s.y - geo.pivot.y;
    const c = Math.cos(angle);
    const n = Math.sin(angle);
    return { x: geo.pivot.x + dx * c - dy * n, y: geo.pivot.y + dx * n + dy * c };
  }

  function drawWarp() {
    const into = warpDir === 'in';
    const head = into ? -geo.sweep * (1 - warpP) : geo.sweep * warpP;
    const speed = into ? 1 - warpP : warpP;
    const fade = into ? Math.min(1, warpP * 8) : 1;

    for (const s of stars) {
      if (into) {
        s.alpha = s.targetAlpha;
        s.state = 'hold';
        s.hold = 30 + Math.random() * 60;
      }
      const span = geo.sweep * 0.18 * speed * (s.reach / 200);
      ctx.globalAlpha = s.targetAlpha * fade;

      if (span > 0.003) {
        ctx.beginPath();
        for (let i = 0; i <= 8; i++) {
          const pt = rotateAbout(s, head - span * (1 - i / 8));
          if (i) ctx.lineTo(pt.x, pt.y); else ctx.moveTo(pt.x, pt.y);
        }
        ctx.lineCap = 'butt';
        ctx.strokeStyle = INK;
        ctx.lineWidth = s.r * 2 + 5;
        ctx.stroke();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = s.r * 2;
        ctx.stroke();
      }
      const pos = rotateAbout(s, head);
      drawShape(pos.x, pos.y, s);
    }
    ctx.globalAlpha = 1;
  }

  function drawIdle(now) {
    stars.forEach((s, i) => {
      if (s.state === 'fadeIn') {
        s.alpha += s.fadeSpeed;
        if (s.alpha >= s.targetAlpha) {
          s.alpha = s.targetAlpha;
          s.state = 'hold';
        }
      } else if (s.state === 'hold') {
        s.hold -= 1;
        if (s.hold <= 0) s.state = 'fadeOut';
      } else {
        s.alpha -= s.fadeSpeed;
        if (s.alpha <= 0) {
          stars[i] = createStar(false);
          return;
        }
      }
      ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
      drawShape(s.x, s.y, s);
    });
    ctx.globalAlpha = 1;

    if (!meteor && now > nextMeteorAt) {
      meteor = {
        x: w * 0.2 + Math.random() * w * 0.6,
        y: 20 + Math.random() * h * 0.3,
        len: 40 + Math.random() * 50,
        speed: 12 + Math.random() * 8,
        angle: ((35 + Math.random() * 10) * Math.PI) / 180,
        life: 0
      };
      nextMeteorAt = now + 10000 + Math.random() * 12000;
    }
    if (!meteor) return;

    meteor.life += 1;
    meteor.x += Math.cos(meteor.angle) * meteor.speed;
    meteor.y += Math.sin(meteor.angle) * meteor.speed;
    const alpha = 1 - meteor.life / 35;
    if (alpha <= 0) {
      meteor = null;
      return;
    }
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(meteor.x - Math.cos(meteor.angle) * meteor.len, meteor.y - Math.sin(meteor.angle) * meteor.len);
    ctx.lineTo(meteor.x, meteor.y);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    ctx.clearRect(0, 0, w, h);
    const dark = document.body.getAttribute('data-theme') === 'dark';
    if (warpDir && geo) {
      drawWarp();
    } else if (dark) {
      drawIdle(now);
    }
    if (warpDir || dark) {
      requestAnimationFrame(frame);
    } else {
      looping = false;
    }
  }

  function kick() {
    if (looping) return;
    looping = true;
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);

  return {
    warp(dir, p, geometry) {
      if (dir && !warpDir) meteor = null;
      if (!dir && warpDir) nextMeteorAt = performance.now() + 6000;
      warpDir = dir;
      warpP = p;
      geo = geometry;
      kick();
    },
    refresh: kick
  };
}

/* ==========================================================================
   7. INTERACTIVE TERMINAL
   ========================================================================== */
function initTerminal() {
  const screen = document.getElementById('terminal-screen');
  const form = document.getElementById('term-form');
  const input = document.getElementById('term-input');
  const cursorTrail = document.getElementById('cursor-trail');
  const chips = document.querySelectorAll('.term-chip');
  const quickBtn = document.getElementById('quick-terminal-btn');
  let busy = false;

  if (quickBtn) {
    quickBtn.addEventListener('click', () => {
      const section = document.getElementById('terminal');
      if (!section) return;
      section.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => input && input.focus(), 600);
    });
  }

  // Hidden mirror used to measure the caret position for the block cursor
  const ruler = document.createElement('span');
  ruler.style.cssText = "visibility:hidden;position:absolute;white-space:pre;font-family:'JetBrains Mono',monospace;font-size:0.9rem;";
  document.body.appendChild(ruler);

  function updateCursor() {
    if (!input || !cursorTrail) return;
    ruler.textContent = input.value.substring(0, input.selectionStart || 0);
    cursorTrail.style.transform = `translateX(${ruler.getBoundingClientRect().width}px)`;
    cursorTrail.style.width = '12px';
    clearTimeout(cursorTrail._stretchTimer);
    cursorTrail._stretchTimer = setTimeout(() => { cursorTrail.style.width = '9px'; }, 70);
  }

  if (input) {
    ['input', 'keyup', 'click'].forEach((evt) => input.addEventListener(evt, updateCursor));
    input.addEventListener('focus', () => {
      if (cursorTrail) cursorTrail.style.opacity = '1';
      updateCursor();
    });
    input.addEventListener('blur', () => {
      if (cursorTrail) cursorTrail.style.opacity = '0.5';
    });
  }

  const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const key = (label) => `<span class="term-pink">${label}</span>`;

  // NixOS logo and info rendered together in one <pre> so spacing is preserved
  function neofetch() {
    const art = String.raw`  \\  \\ //
 ==\\__\\/ //
   //   \\//
==//     //==
 //\\___//
// /\\  \\==
  // \\  \\`.split('\n');
    const info = [
      `<span class="term-green">terajaki</span>@<span class="term-green">nixos</span>`,
      '---------------',
      `${key('OS')}: NixOS (after Fedora, Arch)`,
      `${key('Shell')}: zsh`,
      `${key('Editor')}: Neovim, VS Code`,
      `${key('Languages')}: Rust, Go, PHP, Kotlin, Dart`,
      `${key('Backend')}: Go (Fiber), Laravel`,
      `${key('Data')}: PostgreSQL, MariaDB/MySQL, NoSQL`,
      `${key('Desktop')}: Tauri (Rust)`,
      `${key('Location')}: Philippines`
    ];
    const width = Math.max(...art.map((row) => row.length)) + 3;
    const rows = info.map((text, i) => {
      const left = (art[i] || '').padEnd(width);
      return `<span class="term-cyan">${left}</span>${text}`;
    });
    return [`<pre class="term-pre">${rows.join('\n')}</pre>`];
  }

  const commands = {
    help: () => [
      `<span class="term-green">COMMANDS:</span>`,
      `  <span class="term-yellow">about</span>            - How I like to build software`,
      `  <span class="term-yellow">neofetch</span>         - System and tool summary`,
      `  <span class="term-yellow">cat stack.json</span>   - Tools by area`,
      `  <span class="term-yellow">capstone --stat</span>  - San Isidro NE capstone details`,
      `  <span class="term-yellow">philosophy</span>       - What I optimise for`,
      `  <span class="term-yellow">whoami</span>           - Who I am`,
      `  <span class="term-yellow">theme</span>            - Switch day and night`,
      `  <span class="term-yellow">contact</span>          - Email and GitHub`,
      `  <span class="term-yellow">clear</span>            - Clear the screen`
    ],

    theme: () => {
      const toggleBtn = document.getElementById('theme-toggle');
      if (toggleBtn) toggleBtn.click();
      return [`<span class="term-cyan">Switching sky...</span>`];
    },

    about: () => [
      `<span class="term-green">[+] HOW I BUILD:</span>`,
      `  1. <strong>Close to the system:</strong> I prefer low-level languages because they run lighter and faster.`,
      `  2. <strong>Tauri over Electron:</strong> Electron is heavy and slow to load. Tauri (Rust) skips Chromium, so it starts fast and stays small.`,
      `  3. <strong>Scripting only where it fits:</strong> I use Python as a tool for automation and fetching data, not for core software.`,
      `  4. <strong>Linux:</strong> Fedora first, then Arch, now NixOS.`
    ],

    neofetch,

    'cat stack.json': () => [
      `<pre class="term-pre"><span class="term-yellow">{</span>
  <span class="term-cyan">"languages"</span>: ["Rust", "Go", "PHP", "Kotlin", "Dart", "Python (scripting)"],
  <span class="term-cyan">"backend"</span>: ["Go (Fiber)", "Laravel", "Laravel Reverb"],
  <span class="term-cyan">"databases"</span>: ["PostgreSQL", "MariaDB / MySQL", "NoSQL"],
  <span class="term-cyan">"desktop"</span>: ["Tauri v2"],
  <span class="term-cyan">"mobile"</span>: ["Ionic + Angular", "Kotlin", "Flutter"],
  <span class="term-cyan">"os"</span>: ["NixOS", "Arch Linux", "Fedora"],
  <span class="term-cyan">"next"</span>: ["Rust Dioxus", "Gin", "Java"]
<span class="term-yellow">}</span></pre>`
    ],

    'capstone --stat': () => [
      `<span class="term-green">[CAPSTONE] SAN ISIDRO NE PLATFORM:</span>`,
      `  [+] Version: <span class="term-yellow">v0.75.0</span>`,
      `  [+] For: Municipal Disaster Risk Reduction and Management Office, San Isidro`,
      `  [+] Realtime: WebSocket dispatch via Laravel Reverb`,
      `  [+] Desktop console: Tauri v2, about 30MB of RAM`,
      `  [+] Citizen app: dual-sided ID verification and an offline GPS queue`
    ],

    philosophy: () => [
      `<span class="term-cyan">WHAT I OPTIMISE FOR:</span>`,
      `  1. <strong>Light over heavy:</strong> small binaries, fast startup, low memory.`,
      `  2. <strong>Offline first:</strong> software should still work when the network does not.`,
      `  3. <strong>Right database for the job:</strong> PostgreSQL, MariaDB/MySQL, or NoSQL depending on the data.`,
      `  4. <strong>Readable code:</strong> plain naming, small modules, documented decisions.`
    ],

    whoami: () => [
      `Emmanuel John Perez (terajaki) · BSIT student, NEUST San Isidro Campus · Philippines`
    ],

    contact: () => [
      `Email: <a href="mailto:ejcp2005@gmail.com" class="term-yellow" style="text-decoration: underline;">ejcp2005@gmail.com</a>`,
      `GitHub: <a href="https://github.com/ejhay26" target="_blank" rel="noopener noreferrer" class="term-cyan" style="text-decoration: underline;">https://github.com/ejhay26</a>`
    ]
  };
  commands.mode = commands.theme;

  function streamLines(lines) {
    let index = 0;
    function next() {
      if (index >= lines.length) {
        busy = false;
        return;
      }
      const div = document.createElement('div');
      div.className = 'term-line';
      div.innerHTML = lines[index];
      screen.appendChild(div);
      if (typeof anime !== 'undefined') {
        anime({ targets: div, opacity: [0, 1], translateX: [4, 0], duration: 110, easing: 'easeOutQuad' });
      }
      screen.scrollTop = screen.scrollHeight;
      index += 1;
      setTimeout(next, 30);
    }
    next();
  }

  function run(rawCmd) {
    if (busy) return;
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const echo = document.createElement('div');
    echo.className = 'term-line';
    echo.innerHTML = `<span class="term-green">terajaki@box:~$</span> <span style="color:#FFF;">${escapeHtml(rawCmd)}</span>`;
    screen.appendChild(echo);

    if (cmd === 'clear') {
      screen.innerHTML = '';
      return;
    }

    busy = true;
    const handler = Object.prototype.hasOwnProperty.call(commands, cmd) ? commands[cmd] : null;
    streamLines(handler ? handler() : [
      `<span class="term-dim">Command not found: "${escapeHtml(rawCmd)}". Type <span class="term-yellow">help</span>.</span>`
    ]);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value;
      input.value = '';
      updateCursor();
      run(value);
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      run(chip.getAttribute('data-cmd'));
      if (typeof anime !== 'undefined') {
        anime({ targets: chip, scale: [0.88, 1], duration: 200, easing: 'easeOutBack' });
      }
    });
  });
}
