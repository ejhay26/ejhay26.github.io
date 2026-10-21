/**
 * EMMANUEL JOHN PEREZ (ejhay26) — PORTFOLIO CONTROLLER
 * Enhanced: Celestial Sun/Moon Orbital Cycle, Puffy Clouds & Night Starfield
 */

document.addEventListener('DOMContentLoaded', () => {
  initSecurityAndSelection();
  initHeroAnimations();
  initBidirectionalScroll();
  initProjectFilters();
  initCelestialCycle();
  initNightSkyCanvas();
  initTerminal();
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
    translateY: [-60, 0],
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

  // Interactive mouse parallax on hero spec card
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
   3. BIDIRECTIONAL SCROLL TRANSITIONS (ENTER & EXIT ON SCROLL UP/DOWN)
   ========================================================================== */
function initBidirectionalScroll() {
  if (typeof anime === 'undefined' || !('IntersectionObserver' in window)) return;

  const scrollElements = document.querySelectorAll('.scroll-card');
  let lastScrollY = window.scrollY;

  const observer = new IntersectionObserver((entries) => {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;

    entries.forEach(entry => {
      const el = entry.target;

      if (entry.isIntersecting) {
        const fromY = isScrollingDown ? 45 : -45;
        anime.remove(el);
        anime({
          targets: el,
          translateY: [fromY, 0],
          opacity: [0.15, 1],
          scale: [0.96, 1],
          duration: 650,
          easing: 'easeOutCubic'
        });

        const stamp = el.querySelector('.contact-stamp, .stamp-badge');
        if (stamp) {
          const rot = parseFloat(stamp.getAttribute('data-rotate')) || 0;
          anime({
            targets: stamp,
            rotate: [0, rot],
            scale: [0.75, 1],
            duration: 750,
            delay: 150,
            easing: 'easeOutElastic(1, .6)'
          });
        }
      } else {
        const toY = isScrollingDown ? -30 : 30;
        anime.remove(el);
        anime({
          targets: el,
          translateY: [0, toY],
          opacity: [1, 0.15],
          scale: [1, 0.97],
          duration: 450,
          easing: 'easeInQuad'
        });
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '-30px 0px -30px 0px'
  });

  scrollElements.forEach(el => {
    observer.observe(el);
  });
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
          duration: 280,
          easing: 'easeOutBack'
        });
      }

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        const matches = filterValue === 'all' || categories.includes(filterValue);

        if (matches) {
          card.style.display = 'flex';
          if (typeof anime !== 'undefined') {
            anime({
              targets: card,
              scale: [0.93, 1],
              opacity: [0, 1],
              duration: 400,
              easing: 'easeOutQuad'
            });
          } else {
            card.style.opacity = '1';
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. CELESTIAL ORBITAL CYCLE (SUN <-> MOON EXCHANGE)
   ========================================================================== */
function initCelestialCycle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const sunEl = document.getElementById('celestial-sun');
  const moonEl = document.getElementById('celestial-moon');
  const telemetryText = document.getElementById('telemetry-text');

  if (!toggleBtn) return;

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

  function applyThemeState(theme, animate) {
    document.body.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      themeLabel.textContent = 'DAY PAPER';
      themeIcon.textContent = '[D]';
      if (telemetryText) telemetryText.textContent = 'LUNAR // PHASE WAXING';

      if (animate && typeof anime !== 'undefined') {
        // Toggle button spin
        anime({
          targets: toggleBtn,
          rotate: '+=360deg',
          scale: [0.88, 1],
          duration: 500,
          easing: 'easeOutElastic(1, .6)'
        });

        // Sun sets below horizon
        anime({
          targets: sunEl,
          translateY: [0, 150],
          rotate: [0, 120],
          scale: [1, 0.4],
          opacity: [1, 0],
          duration: 600,
          easing: 'easeInBack'
        });

        // Moon rises from horizon
        anime({
          targets: moonEl,
          translateY: [150, 0],
          rotate: [-60, 0],
          scale: [0.4, 1],
          opacity: [0, 1],
          duration: 850,
          delay: 200,
          easing: 'easeOutElastic(1, .6)'
        });
      } else {
        // Instant layout
        sunEl.style.transform = 'translateY(150px) scale(0.4)';
        sunEl.style.opacity = '0';
        moonEl.style.transform = 'translateY(0px) scale(1)';
        moonEl.style.opacity = '1';
      }
    } else {
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

        // Moon sets below horizon
        anime({
          targets: moonEl,
          translateY: [0, 150],
          rotate: [0, 60],
          scale: [1, 0.4],
          opacity: [1, 0],
          duration: 600,
          easing: 'easeInBack'
        });

        // Sun rises with spinning rays
        anime({
          targets: sunEl,
          translateY: [150, 0],
          rotate: [-120, 0],
          scale: [0.4, 1],
          opacity: [0, 1],
          duration: 900,
          delay: 200,
          easing: 'easeOutElastic(1, .6)'
        });
      } else {
        moonEl.style.transform = 'translateY(150px) scale(0.4)';
        moonEl.style.opacity = '0';
        sunEl.style.transform = 'translateY(0px) scale(1)';
        sunEl.style.opacity = '1';
      }
    }
  }
}

/* ==========================================================================
   6. NIGHT SKY CANVAS: TWINKLING STARS
   ========================================================================== */
function initNightSkyCanvas() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  const starCount = 130;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: (Math.random() * 0.03 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        isCross: Math.random() > 0.85
      });
    }
  }

  resize();
  window.addEventListener('resize', resize);

  function render() {
    if (document.body.getAttribute('data-theme') === 'dark') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 0.95 || s.alpha < 0.2) {
          s.twinkleSpeed = -s.twinkleSpeed;
        }

        ctx.fillStyle = `rgba(248, 250, 252, ${s.alpha})`;

        if (s.isCross) {
          ctx.beginPath();
          const sz = s.size * 2.2;
          ctx.moveTo(s.x, s.y - sz);
          ctx.lineTo(s.x + sz * 0.3, s.y - sz * 0.3);
          ctx.lineTo(s.x + sz, s.y);
          ctx.lineTo(s.x + sz * 0.3, s.y + sz * 0.3);
          ctx.lineTo(s.x, s.y + sz);
          ctx.lineTo(s.x - sz * 0.3, s.y + sz * 0.3);
          ctx.lineTo(s.x - sz, s.y);
          ctx.lineTo(s.x - sz * 0.3, s.y - sz * 0.3);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(s.x, s.y, s.size, s.size);
        }
      });
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   7. INTERACTIVE TERMINAL: STREAMED TYPEWRITER + GPU TRAILING CURSOR
   ========================================================================== */
function initTerminal() {
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

  // --- GPU Trailing Cursor Metric Mirror ---
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

  // --- Terminal Command Library ---
  const commands = {
    help: () => [
      `<span class="term-green">AVAILABLE COMMANDS:</span>`,
      `  <span class="term-yellow">neofetch</span>        - Display system & developer specifications`,
      `  <span class="term-yellow">cat stack.json</span>  - Dump full toolchain & platform breakdown`,
      `  <span class="term-yellow">capstone --stat</span> - Show SINE MDRRMO flagship details`,
      `  <span class="term-yellow">celestial</span>       - Realtime astronomical & atmospheric status`,
      `  <span class="term-yellow">philosophy</span>      - Architecture tenets & craft ethos`,
      `  <span class="term-yellow">whoami</span>          - Identity coordinates`,
      `  <span class="term-yellow">contact</span>         - Direct transmission channel`,
      `  <span class="term-yellow">clear</span>           - Wipe terminal output`
    ],

    neofetch: () => [
      `<span class="term-cyan">     .---.      ejhay26@niri-box</span>`,
      `<span class="term-cyan">    /     \\     ----------------</span>`,
      `<span class="term-cyan">   | () () |    OS: NixOS / Arch Linux (Wayland)</span>`,
      `<span class="term-cyan">    \\  _  /     Compositor: Niri (scrollable) / Hyprland</span>`,
      `<span class="term-cyan">     \`---\`      Hardware: Custom OpenCore UEFI</span>`,
      `<span class="term-cyan">    /     \\     RAM Footprint: ~30MB (Tauri v2 Native)</span>`,
      `<span class="term-cyan">   / |   | \\    Git Commits: 1,150+ Verified</span>`,
      `<span class="term-pink">Host:</span> Emmanuel John Perez`,
      `<span class="term-pink">Uptime:</span> 4 years IT study & tinkering`,
      `<span class="term-pink">Shell:</span> zsh 5.9 + Starship prompt`,
      `<span class="term-pink">Terminal:</span> Foot / Alacritty`,
      `<span class="term-pink">Editor:</span> Neovim + VSCode`,
      `<span class="term-pink">Core Stack:</span> Rust, Laravel 13, Angular 20, Tauri v2`
    ],

    celestial: () => {
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      return [
        `<span class="term-green">ATMOSPHERIC TELEMETRY:</span>`,
        `  [+] State: <span class="term-yellow">${isDark ? 'NIGHT SKY (LUNAR)' : 'DAY PAPER (SOL)'}</span>`,
        `  [+] Celestial Body: ${isDark ? 'Crescent Moon + 130 Twinkling Stars' : 'Golden Rotating Sun + Gliding Birds'}`,
        `  [+] Cloud Formations: 3 Classic Childhood Multi-Dome Puffy Clouds`,
        `  [+] Orbit Status: Synchronous cycle driven by Anime.js timeline`
      ];
    },

    'cat stack.json': () => [
      `<span class="term-yellow">{</span>`,
      `  <span class="term-cyan">"desktop"</span>: ["Tauri v2", "Rust", "Capacitor 8"],`,
      `  <span class="term-cyan">"backend"</span>: ["Laravel 13", "Laravel Reverb (WebSockets)", "MariaDB", "Sanctum"],`,
      `  <span class="term-cyan">"frontend"</span>: ["Angular 20", "Ionic 8", "Anime.js", "Pure Modern CSS"],`,
      `  <span class="term-cyan">"mobile"</span>: ["Kotlin", "Android SDK", "Offline Vector GIS"],`,
      `  <span class="term-cyan">"lowlevel"</span>: ["OpenCore EFI", "ACPI/ASL Tables", "Nix Flakes"]`,
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
      `<span class="term-cyan">ENGINEERING ETHOS:</span>`,
      `  1. <strong>Snappy Over Heavy:</strong> Never load 200MB of Electron when 30MB of Tauri/Rust does it better.`,
      `  2. <strong>Offline Resilient:</strong> Real-world software must function when cellular connectivity fails.`,
      `  3. <strong>Zero AI Slop:</strong> Intentional typography, verified code, zero buzzword soup.`
    ],

    whoami: () => [
      `Emmanuel John Perez · Based in Nueva Ecija, Philippines · IT Student, Systems Tinkerer & Full-Stack Builder.`
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
          duration: 120,
          easing: 'easeOutQuad'
        });
      }

      terminalScreen.scrollTop = terminalScreen.scrollHeight;
      lineIndex++;
      setTimeout(typeNextLine, 35);
    }

    typeNextLine();
  }

  function executeCommand(rawCmd) {
    if (isTypingOutput) return;
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const echoDiv = document.createElement('div');
    echoDiv.className = 'term-line';
    echoDiv.innerHTML = `<span class="term-green">ejhay26@box:~$</span> <span style="color:#FFF;">${escapeHtml(rawCmd)}</span>`;
    terminalScreen.appendChild(echoDiv);

    if (cmd === 'clear') {
      terminalScreen.innerHTML = '';
      return;
    }

    isTypingOutput = true;
    const lines = commands[cmd] ? commands[cmd]() : [
      `<span class="term-dim">Command not found: "${escapeHtml(rawCmd)}". Type <span class="term-yellow">help</span> for valid commands.</span>`
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
