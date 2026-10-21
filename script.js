/**
 * EMMANUEL JOHN PEREZ (ejhay26) — PORTFOLIO CONTROLLER
 * Engineered with Anime.js for handcrafted Neobrutalist physics and motion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initScrollAnimations();
  initProjectFilters();
  initThemeToggle();
  initTerminal();
});

/* ==========================================================================
   1. HERO ENTRANCE CHOREOGRAPHY (ANIME.JS)
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
    scale: [0.4, 1],
    rotate: (el) => parseFloat(el.getAttribute('data-rotate')) || 0,
    opacity: [0, 1],
    delay: anime.stagger(120, { start: 400 }),
    duration: 800,
    easing: 'easeOutBack'
  });

  // Tagline & Hero Actions Slide-Up
  anime({
    targets: ['.hero-tagline-box', '.hero-actions'],
    translateY: [30, 0],
    opacity: [0, 1],
    delay: anime.stagger(150, { start: 500 }),
    duration: 700,
    easing: 'easeOutCubic'
  });

  // Spec Card Pop-In from Right
  anime({
    targets: '.spec-card',
    translateX: [50, 0],
    opacity: [0, 1],
    duration: 850,
    delay: 600,
    easing: 'easeOutExpo'
  });

  // Spec Rows Stagger
  anime({
    targets: '.spec-row',
    opacity: [0, 1],
    translateX: [15, 0],
    delay: anime.stagger(80, { start: 800 }),
    duration: 500,
    easing: 'easeOutQuad'
  });
}

/* ==========================================================================
   2. SCROLL-TRIGGERED REVEALS (INTERSECTION OBSERVER + ANIME.JS)
   ========================================================================== */
function initScrollAnimations() {
  if (typeof anime === 'undefined' || !('IntersectionObserver' in window)) return;

  const observedCards = document.querySelectorAll('.project-card, .skill-category, .terminal-window, .contact-box');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;

        anime({
          targets: target,
          translateY: [40, 0],
          opacity: [0, 1],
          duration: 650,
          easing: 'easeOutCubic'
        });

        // Rotate child stamps/badges slightly if present
        const stamp = target.querySelector('.contact-stamp, .stamp-badge');
        if (stamp) {
          const rot = parseFloat(stamp.getAttribute('data-rotate')) || 0;
          anime({
            targets: stamp,
            rotate: [0, rot],
            scale: [0.8, 1],
            duration: 800,
            delay: 200,
            easing: 'easeOutElastic(1, .6)'
          });
        }

        obs.unobserve(target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  observedCards.forEach(card => {
    // Initial state before triggering
    card.style.opacity = '0';
    observer.observe(card);
  });
}

/* ==========================================================================
   3. INTERACTIVE PROJECT FILTER
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Animate filter button punch
      if (typeof anime !== 'undefined') {
        anime({
          targets: btn,
          scale: [0.92, 1],
          duration: 300,
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
              scale: [0.94, 1],
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
   4. THEME TOGGLE (LIGHT / DARK NEOBRUTALISM)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const themeLabel = toggleBtn.querySelector('.theme-label');
  const themeIcon = toggleBtn.querySelector('.theme-icon');

  // Check saved theme
  const savedTheme = localStorage.getItem('ejhay26_theme') || 'light';
  applyTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem('ejhay26_theme', nextTheme);

    if (typeof anime !== 'undefined') {
      anime({
        targets: toggleBtn,
        rotate: '+=360deg',
        scale: [0.9, 1],
        duration: 500,
        easing: 'easeOutElastic(1, .6)'
      });
    }
  });

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeLabel.textContent = 'LIGHT MODE';
      themeIcon.textContent = '☀️';
    } else {
      themeLabel.textContent = 'DARK MODE';
      themeIcon.textContent = '⚡';
    }
  }
}

/* ==========================================================================
   5. INTERACTIVE TINKER TERMINAL PLAYGROUND
   ========================================================================== */
function initTerminal() {
  const terminalScreen = document.getElementById('terminal-screen');
  const termForm = document.getElementById('term-form');
  const termInput = document.getElementById('term-input');
  const chips = document.querySelectorAll('.term-chip');
  const quickTermBtn = document.getElementById('quick-terminal-btn');

  if (quickTermBtn) {
    quickTermBtn.addEventListener('click', () => {
      const termSection = document.getElementById('terminal');
      if (termSection) {
        termSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => termInput && termInput.focus(), 600);
      }
    });
  }

  const commands = {
    help: () => `
<div class="term-line"><span class="term-green">AVAILABLE COMMANDS:</span></div>
<div class="term-line">  <span class="term-yellow">neofetch</span>        - Display system & developer specifications</div>
<div class="term-line">  <span class="term-yellow">cat stack.json</span>  - Dump full toolchain & platform breakdown</div>
<div class="term-line">  <span class="term-yellow">capstone --stat</span> - Show SINE MDRRMO flagship details</div>
<div class="term-line">  <span class="term-yellow">philosophy</span>      - Architecture tenets & craft ethos</div>
<div class="term-line">  <span class="term-yellow">whoami</span>          - Identity coordinates</div>
<div class="term-line">  <span class="term-yellow">contact</span>         - Get in touch directly</div>
<div class="term-line">  <span class="term-yellow">clear</span>           - Wipe terminal output</div>`,

    neofetch: () => `
<div class="term-line" style="display: flex; gap: 24px; flex-wrap: wrap;">
  <pre class="term-cyan" style="font-family: monospace; font-size: 0.75rem; line-height: 1.2;">
   .---.     
  /     \\    ejhay26@niri-box
 | () () |   ----------------
  \\  _  /    OS: NixOS / Arch Linux (Wayland)
   \`---\`     Compositor: Niri (scrollable) / Hyprland
  /     \\    Hardware: Custom OpenCore UEFI
 / |   | \\   RAM Usage: 30MB (Tauri v2 Native)
|  |   |  |  Git Commits: 1,150+
  </pre>
  <div>
    <div class="term-line"><span class="term-pink">Host:</span> Emmanuel John Perez</div>
    <div class="term-line"><span class="term-pink">Uptime:</span> 4 years IT study & tinkering</div>
    <div class="term-line"><span class="term-pink">Shell:</span> zsh 5.9 + Starship</div>
    <div class="term-line"><span class="term-pink">Terminal:</span> Foot / Alacritty</div>
    <div class="term-line"><span class="term-pink">Editor:</span> Neovim + VSCode</div>
    <div class="term-line"><span class="term-pink">Primary:</span> Rust, Laravel 13, Angular 20, Tauri v2</div>
  </div>
</div>`,

    'cat stack.json': () => `
<pre class="term-yellow" style="font-size: 0.8rem; line-height: 1.4;">
{
  "desktop": ["Tauri v2", "Rust", "Capacitor 8"],
  "backend": ["Laravel 13", "Laravel Reverb (WebSockets)", "MariaDB", "Sanctum"],
  "frontend": ["Angular 20", "Ionic 8", "Anime.js", "Pure Modern CSS"],
  "mobile": ["Kotlin", "Android SDK", "Offline Vector GIS"],
  "lowlevel": ["OpenCore EFI", "ACPI/ASL Tables", "Nix Flakes"]
}
</pre>`,

    'capstone --stat': () => `
<div class="term-line"><span class="term-green">★ PROJECT SINE MDRRMO STATUS:</span></div>
<div class="term-line">  • Version: <span class="term-yellow">v0.75.0</span> (Production-grade capstone)</div>
<div class="term-line">  • Target: Municipal Disaster Risk Reduction and Management Office</div>
<div class="term-line">  • Latency: Sub-second WebSocket dispatch via Laravel Reverb</div>
<div class="term-line">  • Desktop Footprint: ~30MB memory consumption via Tauri v2</div>
<div class="term-line">  • Resilience: Offline incident queues with dual-sided ID verification</div>`,

    philosophy: () => `
<div class="term-line"><span class="term-cyan">CRAFT ETHOS:</span></div>
<div class="term-line">  1. <strong>Snappy Over Heavy:</strong> Never load 200MB of Electron when 30MB of Tauri/Rust does it better.</div>
<div class="term-line">  2. <strong>Offline Resilient:</strong> Real-world software must work when cellular signals fail.</div>
<div class="term-line">  3. <strong>Zero AI Slop:</strong> Every line of CSS, every animation easing, and every DB query is intentional.</div>`,

    whoami: () => `
<div class="term-line">Emmanuel John Perez · Based in Nueva Ecija, Philippines · IT Student, Systems Tinkerer & Full-Stack Builder.</div>`,

    contact: () => `
<div class="term-line">Email: <a href="mailto:ejperez623@gmail.com" class="term-yellow" style="text-decoration: underline;">ejperez623@gmail.com</a></div>
<div class="term-line">GitHub: <a href="https://github.com/ejhay26" target="_blank" class="term-cyan" style="text-decoration: underline;">https://github.com/ejhay26</a></div>`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Echo command
    const echoDiv = document.createElement('div');
    echoDiv.className = 'term-line';
    echoDiv.innerHTML = `<span class="term-green">ejhay26@box:~$</span> <span style="color:#FFF;">${escapeHtml(rawCmd)}</span>`;
    terminalScreen.appendChild(echoDiv);

    if (cmd === 'clear') {
      terminalScreen.innerHTML = '';
      return;
    }

    const outputDiv = document.createElement('div');
    outputDiv.style.opacity = '0';

    if (commands[cmd]) {
      outputDiv.innerHTML = commands[cmd]();
    } else {
      outputDiv.innerHTML = `<div class="term-line term-dim">Command not found: "${escapeHtml(rawCmd)}". Type <span class="term-yellow">help</span> for a list of valid commands.</div>`;
    }

    terminalScreen.appendChild(outputDiv);

    if (typeof anime !== 'undefined') {
      anime({
        targets: outputDiv,
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 250,
        easing: 'easeOutQuad'
      });
    } else {
      outputDiv.style.opacity = '1';
    }

    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  if (termForm) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = termInput.value;
      termInput.value = '';
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
