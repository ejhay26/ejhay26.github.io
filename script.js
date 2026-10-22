/**
 * EMMANUEL JOHN PEREZ (terajaki // teralabs) — PORTFOLIO CONTROLLER
 * Architectural Engine: Orbital Sky Sweep, Random Starfield & Meteor, Zero-Jitter Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  initSecurityAndSelection();
  initHeroAnimations();
  initZeroJitterScroll();
  initProjectFilters();
  initCelestialOrbitCycle();
  initDynamicStarfieldAndMeteor();
  initArchitectConsole();
});

/* ==========================================================================
   1. DISABLE RIGHT-CLICK & SELECTION
   ========================================================================== */
function initSecurityAndSelection() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });
}

/* ==========================================================================
   2. HERO ENTRANCE CHOREOGRAPHY (ANIME.JS)
   ========================================================================== */
function initHeroAnimations() {
  if (typeof anime === 'undefined') return;

  // Staggered Title Slam
  anime({
    targets: '.hero-line',
    translateY: [-50, 0],
    opacity: [0, 1],
    delay: anime.stagger(140, { start: 100 }),
    duration: 900,
    easing: 'easeOutElastic(1, .7)'
  });

  // Sticker Pills Drop & Spring
  anime({
    targets: '.sticker-pill',
    scale: [0.3, 1],
    rotate: (el) => parseFloat(el.getAttribute('data-rotate')) || 0,
    opacity: [0, 1],
    delay: anime.stagger(120, { start: 350 }),
    duration: 850,
    easing: 'easeOutBack'
  });

  // Tagline & Hero Actions Slide-Up
  anime({
    targets: ['.hero-tagline-box', '.hero-actions'],
    translateY: [35, 0],
    opacity: [0, 1],
    delay: anime.stagger(150, { start: 500 }),
    duration: 750,
    easing: 'easeOutCubic'
  });

  // Spec Card Pop-In from Right
  anime({
    targets: '.spec-card',
    translateX: [60, 0],
    opacity: [0, 1],
    duration: 900,
    delay: 550,
    easing: 'easeOutExpo'
  });

  // Spec Rows Stagger
  anime({
    targets: '.spec-row',
    opacity: [0, 1],
    translateX: [15, 0],
    delay: anime.stagger(70, { start: 750 }),
    duration: 500,
    easing: 'easeOutQuad'
  });

  // Parallax on spec card
  const heroCard = document.querySelector('.spec-card');
  if (heroCard) {
    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xOffset = (clientX / window.innerWidth - 0.5) * 8;
      const yOffset = (clientY / window.innerHeight - 0.5) * 8;
      heroCard.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
  }
}

/* ==========================================================================
   3. ZERO-JITTER SCROLL REVEAL (CSS HYSTERESIS PIPELINE)
   Eliminates infinite oscillation when stopping at 2-5% scroll threshold
   ========================================================================== */
function initZeroJitterScroll() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.scroll-card').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const scrollCards = document.querySelectorAll('.scroll-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      // Trigger reveal when visible
      if (entry.isIntersecting && entry.intersectionRatio > 0.05) {
        el.classList.add('is-visible');

        // Stamp badge physics trigger once on enter
        const stamp = el.querySelector('.contact-stamp, .stamp-badge');
        if (stamp && !stamp._animated) {
          stamp._animated = true;
          const rot = parseFloat(stamp.getAttribute('data-rotate')) || 0;
          if (typeof anime !== 'undefined') {
            anime({
              targets: stamp,
              rotate: [0, rot],
              scale: [0.8, 1],
              duration: 700,
              delay: 100,
              easing: 'easeOutElastic(1, .6)'
            });
          }
        }
      } else if (!entry.isIntersecting && entry.intersectionRatio === 0) {
        // Only reset when completely outside viewport, preventing edge jitter
        el.classList.remove('is-visible');
        const stamp = el.querySelector('.contact-stamp, .stamp-badge');
        if (stamp) stamp._animated = false;
      }
    });
  }, {
    threshold: [0, 0.15],
    rootMargin: '0px 0px -30px 0px'
  });

  scrollCards.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. INTERACTIVE PROJECT FILTER
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      if (typeof anime !== 'undefined') {
        anime({
          targets: btn,
          scale: [0.9, 1],
          duration: 250,
          easing: 'easeOutBack'
        });
      }

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        const matches = filterValue === 'all' || categories.includes(filterValue);

        if (matches) {
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
   5. CELESTIAL HORIZON ORBIT CYCLE (FULL SCREEN-WIDE PLANET HORIZON SWEEP)
   Directly matched to GIF & requested celestial physics:
   - Moon exits to the right of the entire screen along the horizon arc.
   - Stars exit to the right with trails like speed of light.
   - Sun enters from very left side of viewport and curves up across horizon.
   - Puffy clouds slide in smoothly.
   - Reverse: Sun & clouds exit to right, Moon enters from very left and curves up,
     stars streak in from left with speed-of-light trails and settle into place.
   ========================================================================== */
function initCelestialOrbitCycle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const sunEl = document.getElementById('sky-sun');
  const moonEl = document.getElementById('sky-moon');
  const telemetryText = document.getElementById('telemetry-text');

  if (!toggleBtn || !sunEl || !moonEl) return;

  const themeLabel = toggleBtn.querySelector('.theme-label');
  const themeIcon = toggleBtn.querySelector('.theme-icon');

  const savedTheme = localStorage.getItem('ejhay26_theme') || 'light';
  applyThemeState(savedTheme, false);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyThemeState(nextTheme, true);
    localStorage.setItem('ejhay26_theme', nextTheme);
  });

  // Clicking directly on Sun or Moon in the sky also toggles the celestial cycle!
  sunEl.addEventListener('click', () => toggleBtn.click());
  moonEl.addEventListener('click', () => toggleBtn.click());

  function applyThemeState(theme, animate) {
    document.body.setAttribute('data-theme', theme);
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    if (theme === 'dark') {
      themeLabel.textContent = 'DAY PAPER';
      themeIcon.textContent = '[D]';
      if (telemetryText) telemetryText.textContent = 'LUNAR // PHASE WAXING';

      if (animate && typeof anime !== 'undefined') {
        // Toggle button tactile spin
        anime({
          targets: toggleBtn,
          rotate: '+=360deg',
          scale: [0.88, 1],
          duration: 500,
          easing: 'easeOutElastic(1, .6)'
        });

        // 1. Sun sets to the right of the entire screen along the downward orbital arc
        anime({
          targets: sunEl,
          translateX: [0, screenW * 0.35 + 300],
          translateY: [0, screenH * 0.45],
          rotate: [0, 40],
          scale: [1, 0.85],
          opacity: [1, 1, 0],
          duration: 1100,
          easing: 'cubicBezier(0.4, 0, 0.7, 0.2)',
          complete: () => {
            sunEl.style.opacity = '0';
          }
        });

        // 2. Daytime sliding clouds slide out to the right off-screen
        anime({
          targets: '.sliding-cloud',
          translateX: [0, screenW * 0.35 + 300],
          opacity: [1, 0],
          duration: 900,
          easing: 'cubicBezier(0.4, 0, 0.7, 0.2)'
        });

        // 3. Crescent Moon enters from the very left side of the viewport and curves up along horizon
        moonEl.style.opacity = '1';
        anime({
          targets: moonEl,
          translateX: [-(screenW * 0.75 + 350), 0],
          translateY: [screenH * 0.45, -35, 0],
          rotate: [-55, 0],
          scale: [0.85, 1.05, 1],
          opacity: [0, 1, 1],
          duration: 1250,
          delay: 80,
          easing: 'cubicBezier(0.2, 0.9, 0.3, 1)'
        });

        // 4. Stars streak in from the left with trails like speed of light
        if (window.starfieldController) {
          window.starfieldController.triggerWarpEnter();
        }
      } else {
        sunEl.style.transform = `translate(${screenW * 0.4 + 300}px, ${screenH * 0.5}px)`;
        sunEl.style.opacity = '0';
        moonEl.style.transform = 'translate(0px, 0px) scale(1)';
        moonEl.style.opacity = '1';
      }
    } else {
      // Switching to Day Paper
      themeLabel.textContent = 'NIGHT SKY';
      themeIcon.textContent = '[M]';
      if (telemetryText) telemetryText.textContent = 'SOL // ZENITH 12:00';

      if (animate && typeof anime !== 'undefined') {
        anime({
          targets: toggleBtn,
          rotate: '+=360deg',
          scale: [0.88, 1],
          duration: 500,
          easing: 'easeOutElastic(1, .6)'
        });

        // 1. Stars exit to the right with trails like speed of light!
        if (window.starfieldController) {
          window.starfieldController.triggerWarpExit();
        }

        // 2. Moon exits to the right of the entire screen along horizon arc
        anime({
          targets: moonEl,
          translateX: [0, screenW * 0.35 + 300],
          translateY: [0, screenH * 0.45],
          rotate: [0, 40],
          scale: [1, 0.85],
          opacity: [1, 1, 0],
          duration: 1100,
          easing: 'cubicBezier(0.4, 0, 0.7, 0.2)',
          complete: () => {
            moonEl.style.opacity = '0';
          }
        });

        // 3. Sun enters from the very left side of the viewport and arcs up across horizon
        sunEl.style.opacity = '1';
        anime({
          targets: sunEl,
          translateX: [-(screenW * 0.75 + 350), 0],
          translateY: [screenH * 0.45, -35, 0],
          rotate: [-55, 0],
          scale: [0.85, 1.05, 1],
          opacity: [0, 1, 1],
          duration: 1250,
          delay: 80,
          easing: 'cubicBezier(0.2, 0.9, 0.3, 1)'
        });

        // 4. Clouds slide in from the left
        anime({
          targets: '.sliding-cloud',
          translateX: [-350, 0],
          opacity: [0, 1],
          delay: anime.stagger(130, { start: 200 }),
          duration: 1000,
          easing: 'cubicBezier(0.2, 0.9, 0.3, 1)'
        });
      } else {
        moonEl.style.transform = `translate(${screenW * 0.4 + 300}px, ${screenH * 0.5}px)`;
        moonEl.style.opacity = '0';
        sunEl.style.transform = 'translate(0px, 0px) scale(1)';
        sunEl.style.opacity = '1';
      }
    }
  }
}

/* ==========================================================================
   6. DYNAMIC STARFIELD & SPEED-OF-LIGHT WARP TRAILS
   ========================================================================== */
function initDynamicStarfieldAndMeteor() {
  const canvas = document.getElementById('sky-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  const starCount = 85;

  let meteor = null;
  let nextMeteorTime = Date.now() + 8000;

  let warpMode = 'none'; // 'none', 'exit', 'enter'
  let warpStartTime = 0;
  let warpDuration = 800;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  function createStar() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.72),
      targetX: 0,
      size: Math.random() * 2 + 1,
      alpha: 0,
      targetAlpha: Math.random() * 0.8 + 0.25,
      fadeSpeed: Math.random() * 0.02 + 0.008,
      state: 'fadeIn',
      holdTimer: Math.random() * 60 + 30,
      isDot: Math.random() > 0.3,
      vx: 0,
      trail: 0
    };
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      const s = createStar();
      s.alpha = Math.random() * s.targetAlpha;
      stars.push(s);
    }
  }

  resize();
  window.addEventListener('resize', resize);

  function triggerWarpExit(onComplete) {
    warpMode = 'exit';
    warpStartTime = performance.now();
    warpDuration = 750;
    meteor = null; // Clear meteors during hyperdrive

    // Give each existing star an initial velocity to the right
    stars.forEach(s => {
      s.vx = Math.random() * 8 + 6;
      s.trail = 20;
      s.alpha = Math.max(s.alpha, 0.7);
    });

    setTimeout(() => {
      warpMode = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (onComplete) onComplete();
    }, warpDuration);
  }

  function triggerWarpEnter() {
    warpMode = 'enter';
    warpStartTime = performance.now();
    warpDuration = 850;
    meteor = null;

    // Spawn stars bursting in from the left edge of the screen
    stars = [];
    for (let i = 0; i < starCount; i++) {
      const targetX = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.72);
      stars.push({
        x: -Math.random() * 350 - 50,
        y: y,
        targetX: targetX,
        size: Math.random() * 2 + 1,
        vx: Math.random() * 25 + 30,
        trail: 140,
        alpha: 1,
        targetAlpha: Math.random() * 0.8 + 0.25,
        fadeSpeed: Math.random() * 0.02 + 0.008,
        state: 'hold',
        holdTimer: Math.random() * 60 + 30,
        isDot: Math.random() > 0.3
      });
    }

    setTimeout(() => {
      warpMode = 'none';
      stars.forEach(s => {
        s.trail = 0;
        s.vx = 0;
        s.state = 'fadeIn';
      });
      nextMeteorTime = Date.now() + 6000;
    }, warpDuration);
  }

  // Expose to celestial cycle
  window.starfieldController = {
    triggerWarpExit,
    triggerWarpEnter
  };

  function spawnMeteor() {
    meteor = {
      x: Math.random() * (canvas.width * 0.6) + canvas.width * 0.2,
      y: Math.random() * (canvas.height * 0.3) + 20,
      len: Math.random() * 50 + 40,
      speed: Math.random() * 8 + 12,
      angle: (35 + Math.random() * 10) * (Math.PI / 180),
      alpha: 1,
      life: 0,
      maxLife: 35
    };
    nextMeteorTime = Date.now() + Math.random() * 12000 + 10000;
  }

  function render() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';

    if (warpMode === 'exit') {
      // Speed of light exit to the right!
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = performance.now() - warpStartTime;
      const progress = Math.min(1, elapsed / warpDuration);

      stars.forEach(s => {
        s.vx += 2.4;
        s.vx *= 1.08;
        s.x += s.vx;
        s.trail = Math.min(s.vx * 4.8, 550);

        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - progress * 0.85);

        // Blazing horizontal hyperdrive streak
        const grad = ctx.createLinearGradient(s.x - s.trail, s.y, s.x, s.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.5, 'rgba(96, 165, 250, 0.7)');
        grad.addColorStop(1, '#FFFFFF');

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(2, s.size * 1.5);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x - s.trail, s.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // White star core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    } else if (warpMode === 'enter') {
      // Speed of light entry from the left!
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = performance.now() - warpStartTime;
      const progress = Math.min(1, elapsed / warpDuration);

      stars.forEach(s => {
        const dx = s.targetX - s.x;
        s.x += dx * 0.14;
        s.trail = Math.max(0, dx * 0.45);

        ctx.save();
        ctx.globalAlpha = Math.min(1, progress * 1.3);

        if (s.trail > 4) {
          const grad = ctx.createLinearGradient(s.x - s.trail, s.y, s.x, s.y);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.6, 'rgba(147, 197, 253, 0.7)');
          grad.addColorStop(1, '#FFFFFF');

          ctx.strokeStyle = grad;
          ctx.lineWidth = Math.max(2, s.size * 1.5);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(s.x - s.trail, s.y);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    } else if (isDark) {
      // Normal Starfield in Night Mode: Twinkling / random respawning + occasional meteor
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s, idx) => {
        if (s.state === 'fadeIn') {
          s.alpha += s.fadeSpeed;
          if (s.alpha >= s.targetAlpha) {
            s.alpha = s.targetAlpha;
            s.state = 'hold';
          }
        } else if (s.state === 'hold') {
          s.holdTimer--;
          if (s.holdTimer <= 0) {
            s.state = 'fadeOut';
          }
        } else if (s.state === 'fadeOut') {
          s.alpha -= s.fadeSpeed;
          if (s.alpha <= 0) {
            stars[idx] = createStar();
          }
        }

        if (s.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));

          if (s.isDot) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
          } else {
            ctx.fillStyle = '#F8FAFC';
            ctx.fillRect(s.x, s.y, s.size * 1.5, s.size * 1.5);
          }
          ctx.restore();
        }
      });

      // Occasional tiny meteor
      if (!meteor && Date.now() > nextMeteorTime) {
        spawnMeteor();
      }

      if (meteor) {
        meteor.life++;
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.alpha = 1 - (meteor.life / meteor.maxLife);

        if (meteor.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = meteor.alpha;
          ctx.strokeStyle = '#FDE047';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(
            meteor.x - Math.cos(meteor.angle) * meteor.len,
            meteor.y - Math.sin(meteor.angle) * meteor.len
          );
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(meteor.x, meteor.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (meteor.life >= meteor.maxLife) {
          meteor = null;
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   7. INTERACTIVE ARCHITECT CONSOLE (TYPEWRITER STREAM + GHOSTTY CURSOR)
   ========================================================================== */
function initArchitectConsole() {
  const terminalScreen = document.getElementById('terminal-screen');
  const termForm = document.getElementById('term-form');
  const termInput = document.getElementById('term-input');
  const cursorTrail = document.getElementById('cursor-trail');
  const chips = document.querySelectorAll('.term-chip');
  const quickTermBtn = document.getElementById('quick-terminal-btn');

  let isTypingOutput = false;

  if (quickTermBtn) {
    quickTermBtn.addEventListener('click', () => {
      const termSection = document.getElementById('terminal');
      if (termSection) {
        termSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => termInput && termInput.focus(), 600);
      }
    });
  }

  // Metric measurement mirror for spring cursor
  const textRuler = document.createElement('span');
  textRuler.style.visibility = 'hidden';
  textRuler.style.position = 'absolute';
  textRuler.style.whiteSpace = 'pre';
  textRuler.style.fontFamily = "'JetBrains Mono', monospace";
  textRuler.style.fontSize = '0.9rem';
  document.body.appendChild(textRuler);

  function updateCursorTrail() {
    if (!termInput || !cursorTrail) return;
    const textBeforeCaret = termInput.value.substring(0, termInput.selectionStart || 0);
    textRuler.textContent = textBeforeCaret;
    const measuredWidth = textRuler.getBoundingClientRect().width;

    cursorTrail.style.transform = `translateX(${measuredWidth}px)`;
    cursorTrail.style.width = '12px';
    clearTimeout(cursorTrail._stretchTimer);
    cursorTrail._stretchTimer = setTimeout(() => {
      cursorTrail.style.width = '9px';
    }, 70);
  }

  if (termInput) {
    termInput.addEventListener('input', updateCursorTrail);
    termInput.addEventListener('keyup', updateCursorTrail);
    termInput.addEventListener('click', updateCursorTrail);
    termInput.addEventListener('focus', () => {
      if (cursorTrail) cursorTrail.style.opacity = '1';
      updateCursorTrail();
    });
    termInput.addEventListener('blur', () => {
      if (cursorTrail) cursorTrail.style.opacity = '0.5';
    });
  }

  // Command library reflecting authentic Systems Architecture persona
  const commands = {
    help: () => [
      `<span class="term-green">ARCHITECTURAL COMMANDS:</span>`,
      `  <span class="term-yellow">architect</span>        - Architectural mindset & methodology`,
      `  <span class="term-yellow">neofetch</span>         - System, persona & developer specs`,
      `  <span class="term-yellow">cat stack.json</span>   - Complete toolchain matrix`,
      `  <span class="term-yellow">capstone --stat</span>  - SINE MDRRMO production details`,
      `  <span class="term-yellow">philosophy</span>       - Core tenets: metal over bloat`,
      `  <span class="term-yellow">whoami</span>           - Identity coordinates (terajaki // teralabs)`,
      `  <span class="term-yellow">theme</span>            - Toggle celestial horizon cycle (Day/Night)`,
      `  <span class="term-yellow">contact</span>          - Direct transmission channel`,
      `  <span class="term-yellow">clear</span>            - Clear terminal output`
    ],

    theme: () => {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.click();
      return [`<span class="term-cyan">Executing orbital horizon sweep across viewport...</span>`];
    },

    mode: () => {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.click();
      return [`<span class="term-cyan">Executing orbital horizon sweep across viewport...</span>`];
    },

    architect: () => [
      `<span class="term-green">[+] ARCHITECTURAL PRINCIPLES:</span>`,
      `  1. <strong>First-Principles Evaluation:</strong> Deeply dissect problem constraints before writing code.`,
      `  2. <strong>Low-Level Execution:</strong> Prefer native Rust binaries, lean C/ASL kernel tables, and lightweight runtimes over heavy Electron memory hogs.`,
      `  3. <strong>Resilience & Air-Gap:</strong> Architect systems (like LAN-Drive & Gabay) to function flawlessly in zero-connectivity or air-gapped environments.`,
      `  4. <strong>Cross-Platform Mastery:</strong> Seamless orchestration across Linux (Wayland), macOS (OpenCore), Android, and Windows.`
    ],

    neofetch: () => [
      `<span class="term-cyan">     .---.      terajaki@niri-box (teralabs)</span>`,
      `<span class="term-cyan">    /     \\     ---------------------------</span>`,
      `<span class="term-cyan">   | () () |    Role: Systems & Software Architect</span>`,
      `<span class="term-cyan">    \\  _  /     OS: NixOS / Arch Linux (Wayland)</span>`,
      `<span class="term-cyan">     \`---\`      Compositors: Niri (scrollable) / Hyprland</span>`,
      `<span class="term-cyan">    /     \\     Location: Philippines</span>`,
      `<span class="term-cyan">   / |   | \\    Established: 2025</span>`,
      `<span class="term-pink">Persona:</span> Emmanuel John Perez (terajaki)`,
      `<span class="term-pink">Lab:</span> teralabs`,
      `<span class="term-pink">Shell:</span> zsh 5.9 + Starship prompt`,
      `<span class="term-pink">Editor:</span> Neovim + VSCode`,
      `<span class="term-pink">Core Toolchain:</span> Rust, Tauri v2, Laravel 13, Angular 20, Nix Flakes`
    ],

    'cat stack.json': () => [
      `<span class="term-yellow">{</span>`,
      `  <span class="term-cyan">"architecture"</span>: "First-principles systems & platform engineering",`,
      `  <span class="term-cyan">"desktop"</span>: ["Tauri v2", "Rust", "Capacitor 8"],`,
      `  <span class="term-cyan">"backend"</span>: ["Laravel 13", "Laravel Reverb (WebSockets)", "MariaDB", "Sanctum"],`,
      `  <span class="term-cyan">"frontend"</span>: ["Angular 20", "Ionic 8", "Pure Modern CSS"],`,
      `  <span class="term-cyan">"mobile"</span>: ["Kotlin", "Flutter / Dart", "Offline Vector GIS"],`,
      `  <span class="term-cyan">"systems"</span>: ["OpenCore EFI", "ACPI / ASL", "Nix Flakes", "Niri", "Hyprland"]`,
      `<span class="term-yellow">}</span>`
    ],

    'capstone --stat': () => [
      `<span class="term-green">[FLAGSHIP CAPSTONE] SINE MDRRMO PLATFORM:</span>`,
      `  [+] Version: <span class="term-yellow">v0.75.0</span> (Production-grade capstone)`,
      `  [+] Target: Municipal Disaster Risk Reduction and Management Office`,
      `  [+] Realtime Engine: Sub-second WebSocket dispatch via Laravel Reverb`,
      `  [+] Desktop Footprint: ~30MB native memory consumption via Tauri v2`,
      `  [+] Citizen Access: Dual-sided government ID verification & offline GPS queue`
    ],

    philosophy: () => [
      `<span class="term-cyan">ARCHITECTURE ETHOS:</span>`,
      `  1. <strong>Snappy Over Heavy:</strong> 30MB of Tauri/Rust beats 200MB of Electron every single day.`,
      `  2. <strong>Offline Resilient:</strong> Real-world software must work when cellular signals fail.`,
      `  3. <strong>Zero AI Slop:</strong> Intentional architecture, verified code, zero buzzword soup.`
    ],

    whoami: () => [
      `Emmanuel John Perez (terajaki // teralabs) · Systems & Software Architect · Philippines · EST. 2025`
    ],

    contact: () => [
      `Email: <a href="mailto:ejperez623@gmail.com" class="term-yellow" style="text-decoration: underline;">ejperez623@gmail.com</a>`,
      `GitHub: <a href="https://github.com/ejhay26" target="_blank" class="term-cyan" style="text-decoration: underline;">https://github.com/ejhay26</a>`
    ]
  };

  function streamLines(lines, onComplete) {
    let lineIndex = 0;

    function typeNextLine() {
      if (lineIndex >= lines.length) {
        isTypingOutput = false;
        if (onComplete) onComplete();
        return;
      }

      const rawHtml = lines[lineIndex];
      const lineDiv = document.createElement('div');
      lineDiv.className = 'term-line';
      terminalScreen.appendChild(lineDiv);

      lineDiv.innerHTML = rawHtml;

      if (typeof anime !== 'undefined') {
        anime({
          targets: lineDiv,
          opacity: [0, 1],
          translateX: [4, 0],
          duration: 110,
          easing: 'easeOutQuad'
        });
      }

      terminalScreen.scrollTop = terminalScreen.scrollHeight;
      lineIndex++;
      setTimeout(typeNextLine, 30);
    }

    typeNextLine();
  }

  function executeCommand(rawCmd) {
    if (isTypingOutput) return;
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const echoDiv = document.createElement('div');
    echoDiv.className = 'term-line';
    echoDiv.innerHTML = `<span class="term-green">terajaki@box:~$</span> <span style="color:#FFF;">${escapeHtml(rawCmd)}</span>`;
    terminalScreen.appendChild(echoDiv);

    if (cmd === 'clear') {
      terminalScreen.innerHTML = '';
      return;
    }

    isTypingOutput = true;
    const lines = commands[cmd] ? commands[cmd]() : [
      `<span class="term-dim">Command not found: "${escapeHtml(rawCmd)}". Type <span class="term-yellow">help</span> or <span class="term-yellow">architect</span>.</span>`
    ];

    streamLines(lines, () => {
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    });
  }

  if (termForm) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = termInput.value;
      termInput.value = '';
      updateCursorTrail();
      executeCommand(val);
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
      if (typeof anime !== 'undefined') {
        anime({
          targets: chip,
          scale: [0.88, 1],
          duration: 200,
          easing: 'easeOutBack'
        });
      }
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
