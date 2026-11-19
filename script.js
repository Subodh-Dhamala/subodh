/**
 * Subodh Dhamala — Personal Developer Portfolio v2
 * Features: Theme toggle, mobile nav, scroll-spy, project filters,
 * mini-projects toggle, CV modal, email copy, hero particle background,
 * scroll animations, keyboard shortcuts, architecture explorer.
 */

import * as d3 from 'https://esm.run/d3@7';

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initTheme();
  initMobileMenu();
  initProjectFilters();
  initMiniProjectsToggle();
  initPdfModal();
  initCopyEmail();
  initScrollSpy();
  initBackToTop();
  initKeyboardShortcuts();
  initCurrentYear();
  initHeroParticleBackground();
  initScrollReveal();
  initProjectExpandables();
  initArchitectureExplorer();
  initTechStackGraph();
  initMiniProjectFilters();
  initPhilosophySection();
  initGitHubActivity();
  initLazySections();
});

// --------------------------------------------------------------------
// GLOBAL UTILITIES
// --------------------------------------------------------------------
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initCurrentYear() {
  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
}

// --------------------------------------------------------------------
// THEME & UI
// --------------------------------------------------------------------
function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', saved);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  initIcons();
}

// --------------------------------------------------------------------
// MOBILE NAVIGATION
// --------------------------------------------------------------------
function initMobileMenu() {
  const btn = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-item-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
}

// --------------------------------------------------------------------
// PROJECT CARDS & EXPANDABLES
// --------------------------------------------------------------------
function initProjectExpandables() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    const expandBtn = card.querySelector('.project-expand-btn');
    const details = card.querySelector('.project-details');

    if (!expandBtn || !details) return;

    const icon = expandBtn.querySelector('i');

    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      const isExpanded = card.getAttribute('data-expanded') === 'true';

      card.setAttribute('data-expanded', !isExpanded);
      expandBtn.setAttribute('aria-expanded', (!isExpanded).toString());

      if (!isExpanded) {
        details.style.maxHeight = details.scrollHeight + 'px';
        details.style.opacity = '1';
        details.style.marginTop = '16px';
      } else {
        details.style.maxHeight = '';
        details.style.opacity = '';
        details.style.marginTop = '';
      }

      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
      }

      initIcons();
    });
  });
}

// --------------------------------------------------------------------
// PROJECT FILTERS
// --------------------------------------------------------------------
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });

      setTimeout(() => {
        initProjectExpandables();
      }, 100);
    });
  });
}

// --------------------------------------------------------------------
// MINI PROJECTS TOGGLE & FILTERS
// --------------------------------------------------------------------
function initMiniProjectsToggle() {
  const btn = document.getElementById('toggle-mini-btn');
  const btnText = document.getElementById('mini-toggle-text');
  const grid = document.getElementById('mini-grid');

  if (!btn || !grid) return;

  const allCards = Array.from(grid.querySelectorAll('.mini-card'));
  const total = allCards.length;

  allCards.forEach((card, i) => {
    if (i >= 4) {
      card.classList.add('mini-hidden');
    }
  });

  if (total <= 4) {
    btn.style.display = 'none';
    return;
  }

  let expanded = false;

  btn.addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
      expandAllMiniCards();
    } else {
      allCards.forEach((card, i) => {
        if (i >= 4) {
          card.classList.remove('mini-reveal');
          card.classList.add('mini-hidden');
        }
      });
      btn.classList.remove('expanded');
      if (btnText) btnText.textContent = `View All (${total})`;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

function expandAllMiniCards() {
  const btn = document.getElementById('toggle-mini-btn');
  const btnText = document.getElementById('mini-toggle-text');
  const grid = document.getElementById('mini-grid');
  if (!grid) return;

  const allCards = Array.from(grid.querySelectorAll('.mini-card'));
  let delay = 0;

  allCards.forEach((card, i) => {
    if (i >= 4) {
      card.classList.remove('mini-hidden');
      card.style.animationDelay = `${delay}ms`;
      card.classList.add('mini-reveal');
      delay += 40;
    }
  });

  if (btn) {
    btn.classList.add('expanded');
    btn.setAttribute('aria-expanded', 'true');
  }
  if (btnText) btnText.textContent = 'Show Less';
}

function initMiniProjectFilters() {
  const filterBtns = document.querySelectorAll('.mini-filter-btn');
  const miniCards = document.querySelectorAll('.mini-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      miniCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.animation = 'miniCardIn 0.3s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// --------------------------------------------------------------------
// MODAL FUNCTIONS
// --------------------------------------------------------------------
function initPdfModal() {
  const modal = document.getElementById('cv-modal');
  const openBtns = document.querySelectorAll('[data-open-cv]');
  const closeBtn = document.getElementById('cv-modal-close');

  if (!modal) return;

  function open() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    initIcons();
  }

  function close() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  }));

  if (closeBtn) closeBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });
}

// --------------------------------------------------------------------
// COPY EMAIL & TOAST
// --------------------------------------------------------------------
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = 'subodhdhamala@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('subodhdhamala@gmail.com copied to clipboard');
    }).catch(() => {
      showToast('subodhdhamala@gmail.com');
    });
  });
}

function showToast(msg) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i data-lucide="check"></i> <span>${msg}</span>`;
  initIcons();
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// --------------------------------------------------------------------
// SCROLL SPY & ACTIVE NAVIGATION
// --------------------------------------------------------------------
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');

  if (!sections.length || !navLinks.length) return;

  let ticking = false;
  function updateActive() {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        if (href === `#${current}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateActive);
      ticking = true;
    }
  }, { passive: true });
}

// --------------------------------------------------------------------
// BACK TO TOP BUTTON
// --------------------------------------------------------------------
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      if (window.scrollY > 400) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
      ticking = false;
    }
    ticking = true;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --------------------------------------------------------------------
// KEYBOARD SHORTCUTS
// --------------------------------------------------------------------
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 't' || e.key === 'T') {
      toggleTheme();
    }
  });
}

// --------------------------------------------------------------------
// HERO PARTICLE BACKGROUND (Canvas)
// --------------------------------------------------------------------
function initHeroParticleBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 30 : 50;
  const connectionDistance = isMobile ? 120 : 180;
  const baseOpacity = isMobile ? 0.25 : 0.4;

  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.8 + 0.8;
      this.baseOpacity = Math.random() * 0.3 + 0.1;
      this.hue = 240; // Indigo hue
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      this.x = Math.max(0, Math.min(width, this.x));
      this.y = Math.max(0, Math.min(height, this.y));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 60%, 65%, ${this.baseOpacity + 0.1})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let mouse = { x: null, y: null };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let animationId;
  function animate() {
    if (isReducedMotion) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      p.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * baseOpacity;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - dist / 180)})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();

  canvas.style.visibility = 'visible';
  canvas.style.display = 'block';
}

// --------------------------------------------------------------------
// SCROLL REVEAL EFFECT
// --------------------------------------------------------------------
function initScrollReveal() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  sections.forEach(section => {
    observer.observe(section);
  });
}

// --------------------------------------------------------------------
// ARCHITECTURE EXPLORER (D3.js)
// --------------------------------------------------------------------
function initArchitectureExplorer() {
  const archSection = document.getElementById('architecture-section');
  if (!archSection || !document.getElementById('arch-viz')) return;

  const archViz = document.getElementById('arch-viz');
  const archPanel = document.querySelector('.arch-panel');
  const archBtns = document.querySelectorAll('.arch-btn');

  // Architecture data - derived from existing project descriptions
  const architectureData = {
    'authentication': {
      title: 'Full-Stack Authentication System',
      nodes: [
        { id: 'user', label: 'User', type: 'entity', x: 0, y: 0 },
        { id: 'frontend', label: 'Next.js', type: 'frontend', x: 1, y: -1 },
        { id: 'api', label: 'API', type: 'backend', x: 2, y: 0 },
        { id: 'auth', label: 'Auth Service', type: 'backend', x: 3, y: -1 },
        { id: 'db', label: 'PostgreSQL', type: 'database', x: 4, y: 0 },
        { id: 'redis', label: 'Redis', type: 'cache', x: 5, y: -0.5 },
        { id: 'email', label: 'SendGrid', type: 'service', x: 6, y: 0 }
      ],
      edges: [
        { from: 'user', to: 'frontend' },
        { from: 'frontend', to: 'api' },
        { from: 'api', to: 'auth' },
        { from: 'auth', to: 'db' },
        { from: 'auth', to: 'redis' },
        { from: 'auth', to: 'email' }
      ],
      typeLabels: {
        'entity': 'User Entity',
        'frontend': 'Next.js + TypeScript UI',
        'backend': 'Express.js API',
        'database': 'PostgreSQL (Prisma ORM)',
        'cache': 'Redis Cache',
        'service': 'SendGrid Email'
      }
    },
    'sanolink': {
      title: 'Sanolink — Fast URL Shortener',
      nodes: [
        { id: 'user', label: 'User', type: 'entity', x: 0, y: 0 },
        { id: 'frontend', label: 'Frontend', type: 'frontend', x: 1, y: -1 },
        { id: 'api', label: 'API', type: 'backend', x: 2, y: 0 },
        { id: 'tsa', label: 'TSOA', type: 'controller', x: 3, y: -1 },
        { id: 'redis', label: 'Redis', type: 'cache', x: 4, y: 0 },
        { id: 'db', label: 'PostgreSQL', type: 'database', x: 5, y: -0.5 }
      ],
      edges: [
        { from: 'user', to: 'frontend' },
        { from: 'frontend', to: 'api' },
        { from: 'api', to: 'tsa' },
        { from: 'tsa', to: 'redis' },
        { from: 'tsa', to: 'db' },
        { from: 'api', to: 'redis' }
      ],
      typeLabels: {
        'entity': 'User Entity',
        'frontend': 'TS Client',
        'backend': 'Express.js Controller',
        'controller': 'TSOA API',
        'cache': 'Redis (sub-ms redirects)',
        'database': 'PostgreSQL'
      }
    },
    'greenbidu': {
      title: 'GreenBidu — Crop Disease Detection',
      nodes: [
        { id: 'leaf', label: 'Leaf Image', type: 'input', x: 0, y: 0 },
        { id: 'frontend', label: 'Frontend', type: 'frontend', x: 1, y: -1 },
        { id: 'node', label: 'Node/Express', type: 'backend', x: 2, y: 0 },
        { id: 'fastapi', label: 'FastAPI', type: 'backend', x: 3, y: -1 },
        { id: 'cnn', label: 'CNN (PyTorch)', type: 'ai', x: 4, y: 0 },
        { id: 'mongo', label: 'MongoDB', type: 'database', x: 5, y: -0.5 }
      ],
      edges: [
        { from: 'leaf', to: 'fastapi' },
        { from: 'fastapi', to: 'cnn' },
        { from: 'cnn', to: 'mongo' },
        { from: 'fastapi', to: 'node' },
        { from: 'node', to: 'frontend' },
        { from: 'frontend', to: 'node' }
      ],
      typeLabels: {
        'input': 'Leaf Image Input',
        'frontend': 'React UI (MERN)',
        'backend': 'Express.js API',
        'backend': 'FastAPI Server',
        'ai': 'CNN PyTorch Model',
        'database': 'MongoDB'
      }
    }
  };

  let currentProject = 'authentication';

  const colors = {
    'entity': '#6366f1',
    'frontend': '#10b981',
    'backend': '#3b82f6',
    'database': '#8b5cf6',
    'cache': '#f59e0b',
    'service': '#ef4444',
    'controller': '#14b8a6',
    'ai': '#a855f7',
    'input': '#ec4899'
  };

  const nodeRadius = {
    'entity': 10, 'frontend': 9, 'backend': 8, 'database': 10,
    'cache': 8, 'service': 8, 'controller': 8, 'ai': 9, 'input': 10
  };

  function renderProject(projectKey) {
    const data = architectureData[projectKey];
    if (!data) return;

    currentProject = projectKey;

    // Clear and recreate SVG
    const width = archViz.offsetWidth || 800;
    const height = archViz.offsetHeight || 400;

    d3.select(archViz).select('svg').remove();

    const svg = d3.select(archViz)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g');

    // Create node positions
    const xScale = d3.scaleLinear().domain([0, 6]).range([60, width - 60]);
    const yScale = d3.scaleLinear().domain([-2, 2]).range([height - 60, 60]);

    data.nodes.forEach(node => {
      node.x = xScale(node.x);
      node.y = yScale(node.y);
    });

    // Draw edges
    const links = g.selectAll('path')
      .data(data.edges)
      .enter()
      .append('path')
      .attr('d', d => {
        const from = data.nodes.find(n => n.id === d.from);
        const to = data.nodes.find(n => n.id === d.to);
        return `M${from.x},${from.y} L${to.x},${to.y}`;
      })
      .attr('stroke', '#64748b')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 1.5);

    // Draw nodes
    const nodes = g.selectAll('g.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).raise();
        d3.select(this).select('circle').transition().duration(200).attr('r', nodeRadius[d.type] * 1.4);
        showTooltip(event, d, data.typeLabels[d.type]);
        highlightNode(d, true);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).select('circle').transition().duration(200).attr('r', nodeRadius[d.type]);
        hideTooltip();
        highlightNode(d, false);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        const panelContent = `Details for <strong>${d.label}</strong> (${data.typeLabels[d.type]})<br><br>Project: ${data.title}<br>Part of the ${projectKey.replace('-', ' ')} architecture.`;
        archPanel.innerHTML = panelContent;
        archPanel.classList.add('visible');
      });

    nodes.append('circle')
      .attr('r', d => nodeRadius[d.type])
      .attr('fill', d => colors[d.type] || '#64748b')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    nodes.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '0.75rem')
      .attr('fill', '#ffffff')
      .attr('font-weight', '600')
      .style('pointer-events', 'none');

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'viz-tooltip')
      .style('opacity', 0);

    function showTooltip(event, d, typeLabel) {
      tooltip.html(`<div class="tooltip-title">${d.label}</div><div class="tooltip-sub">${typeLabel}</div>`)
        .style('left', (event.pageX + 12) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .style('opacity', 1);
    }

    function hideTooltip() {
      tooltip.style('opacity', 0);
    }

    function highlightNode(node, highlight) {
      links.transition().duration(300).attr('stroke-opacity', d => {
        const connected = d.from === node.id || d.to === node.id;
        return highlight ? (connected ? 0.7 : 0.1) : 0.3;
      }).attr('stroke-width', d => {
        const connected = d.from === node.id || d.to === node.id;
        return highlight ? (connected ? 2.5 : 1) : 1.5;
      });

      nodes.transition().duration(300).attr('opacity', d => {
        const connected = data.edges.some(e => e.from === d.id || e.to === d.id);
        return highlight ? (connected || d.id === node.id ? 1 : 0.3) : 1;
      });
    }

    // Resize handler
    window.removeEventListener('resize', renderProject);
    window.addEventListener('resize', () => {
      if (archViz.offsetWidth > 0 && archViz.offsetHeight > 0) {
        renderProject(projectKey);
      }
    });
  }

  // Set up button event listeners
  archBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      archBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProject(btn.getAttribute('data-project'));
      if (archPanel) {
        archPanel.classList.remove('visible');
      }
    });
  });

  // Initial render
  renderProject('authentication');
}

// --------------------------------------------------------------------
// TECH STACK VISUALIZATION (D3.js)
// --------------------------------------------------------------------
function initTechStackGraph() {
  const techSection = document.getElementById('tech-stack-section');
  if (!techSection || !document.getElementById('tech-stack-viz')) return;

  const techViz = document.getElementById('tech-stack-viz');

  const techData = {
    nodes: [
      { id: 'React', group: 'Frontend' },
      { id: 'Next.js', group: 'Frontend' },
      { id: 'TypeScript', group: 'Frontend' },
      { id: 'Tailwind CSS', group: 'Frontend' },
      { id: 'Node.js', group: 'Backend' },
      { id: 'Express.js', group: 'Backend' },
      { id: 'FastAPI', group: 'Backend' },
      { id: 'PostgreSQL', group: 'Database' },
      { id: 'MongoDB', group: 'Database' },
      { id: 'Redis', group: 'Cache' },
      { id: 'Prisma', group: 'Database' },
      { id: 'OAuth', group: 'Security' },
      { id: 'JWT', group: 'Security' },
      { id: 'TOTP', group: 'Security' },
      { id: 'RBAC', group: 'Security' },
      { id: 'Zod', group: 'Security' },
      { id: 'Python', group: 'AI/ML' },
      { id: 'PyTorch', group: 'AI/ML' },
      { id: 'CNN', group: 'AI/ML' },
      { id: 'Docker', group: 'DevOps' },
      { id: 'Git', group: 'DevOps' },
      { id: 'CI/CD', group: 'DevOps' }
    ],
    links: [
      { source: 'React', target: 'Next.js' },
      { source: 'React', target: 'TypeScript' },
      { source: 'Next.js', target: 'TypeScript' },
      { source: 'Node.js', target: 'Express.js' },
      { source: 'Node.js', target: 'FastAPI' },
      { source: 'PostgreSQL', target: 'Prisma' },
      { source: 'Redis', target: 'Node.js' },
      { source: 'OAuth', target: 'JWT' },
      { source: 'JWT', target: 'RBAC' },
      { source: 'TOTP', target: 'JWT' },
      { source: 'Zod', target: 'Express.js' },
      { source: 'Python', target: 'PyTorch' },
      { source: 'PyTorch', target: 'CNN' },
      { source: 'CNN', target: 'FastAPI' },
      { source: 'Docker', target: 'Node.js' },
      { source: 'Docker', target: 'FastAPI' },
      { source: 'Git', target: 'CI/CD' }
    ]
  };

  const width = techViz.offsetWidth || 800;
  const height = techViz.offsetHeight || 500;

  const svg = d3.select(techViz)
    .append('svg')
    .attr('width', '100%')
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg.append('g');

  const groupColors = {
    'Frontend': '#6366f1',
    'Backend': '#10b981',
    'Database': '#3b82f6',
    'Cache': '#f59e0b',
    'Security': '#ef4444',
    'AI/ML': '#8b5cf6',
    'DevOps': '#14b8a6'
  };

  const simulation = d3.forceSimulation(techData.nodes)
    .force('link', d3.forceLink(techData.links).id(d => d.id).distance(80).strength(0.6))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(18))
    .stop();

  for (let i = 0; i < 300; i++) simulation.tick();

  const link = g.append('g')
    .selectAll('line')
    .data(techData.links)
    .enter()
    .append('line')
    .attr('stroke', d => {
      const sourceGroup = techData.nodes.find(n => n.id === d.source).group;
      const targetGroup = techData.nodes.find(n => n.id === d.target).group;
      return sourceGroup === targetGroup ? groupColors[sourceGroup] : '#64748b';
    })
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5);

  const node = g.append('g')
    .selectAll('g')
    .data(techData.nodes)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      d3.select(this).transition().duration(200).style('scale', 1.2);
      showTooltip(event, d);
    })
    .on('mouseout', function(event, d) {
      d3.select(this).transition().duration(200).style('scale', 1);
      hideTooltip();
    })
    .on('click', (event, d) => {
      showTechProjects(d);
    });

  node.append('circle')
    .attr('r', 8)
    .attr('fill', d => groupColors[d.group] || '#64748b')
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2);

  node.append('text')
    .text(d => d.id)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', '0.7rem')
    .attr('fill', '#ffffff')
    .attr('font-weight', '600')
    .style('pointer-events', 'none');

  const tooltip = d3.select('body').append('div')
    .attr('class', 'viz-tooltip')
    .style('opacity', 0);

  function showTooltip(event, d) {
    tooltip.html(`<div class="tooltip-title">${d.id}</div><div>${d.group}</div>`)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px')
      .style('opacity', 1);
  }

  function hideTooltip() {
    tooltip.style('opacity', 0);
  }

  const projectMap = {
    'React': ['Mero Karma', 'MeroStore'],
    'Next.js': ['Full-Stack Authentication System', 'RoomFinder (Mero Room)', 'Mero Karma'],
    'TypeScript': ['Full-Stack Authentication System', 'Mero Karma'],
    'Node.js': ['Sanolink', 'GreenBidu', 'BuildersBase'],
    'Express.js': ['Sanolink'],
    'FastAPI': ['GreenBidu', 'Gemini AI Chatbot'],
    'PostgreSQL': ['Full-Stack Authentication System', 'Sanolink', 'BuildersBase'],
    'MongoDB': ['GreenBidu', 'RoomFinder'],
    'Redis': ['Sanolink'],
    'Prisma': ['Full-Stack Authentication System'],
    'OAuth': ['Full-Stack Authentication System', 'RoomFinder'],
    'JWT': ['Full-Stack Authentication System'],
    'TOTP': ['Full-Stack Authentication System'],
    'RBAC': ['Full-Stack Authentication System'],
    'Zod': ['Full-Stack Authentication System'],
    'Python': ['GreenBidu'],
    'PyTorch': ['GreenBidu'],
    'CNN': ['GreenBidu'],
    'Docker': ['Sanolink', 'GreenBidu'],
    'Git': ['All projects'],
    'CI/CD': ['Sanolink', 'GreenBidu']
  };

  function showTechProjects(d) {
    const projects = projectMap[d.id] || ['No specific projects'];
    const panel = document.querySelector('.tech-panel');
    if (panel) {
      panel.innerHTML = `<strong>Used in:</strong><ul>${projects.map(p => `<li>${p}</li>`).join('')}</ul>`;
      panel.classList.add('visible');
    }
  }

  window.addEventListener('resize', () => {
    if (techViz.offsetWidth > 0 && techViz.offsetHeight > 0) {
      simulation.force('center', d3.forceCenter(techViz.offsetWidth / 2, techViz.offsetHeight / 2));
      simulation.alpha(0.5).restart();
    }
  });
}

// --------------------------------------------------------------------
// ENGINEERING PHILOSOPHY SECTION
// --------------------------------------------------------------------
function initPhilosophySection() {
  const cards = document.querySelectorAll('.phil-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    observer.observe(card);
  });
}

// --------------------------------------------------------------------
// GITHUB ACTIVITY HEATMAP
// --------------------------------------------------------------------
function initGitHubActivity() {
  const placeholder = document.querySelector('.github-placeholder');
  if (!placeholder) return;

  // Show placeholder message for development
  placeholder.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 5.3 3.4 9.8 8.1 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.6-1.3-1.6-.9-.2.2-.7.2-.7 1.2.1 1.9 1.2 1.9 1.2.5 1.4 1.7 1.6 1.7 1.6 1.1.2 2-.2 2.5-.4.1-.5.4-.5.8-.6.3-.1.6-.3.8-.5.8-1.4 1.6-1.6 1.6-.5-.1-1-.4-1.5-.6-3 1-2 2-2 2-4.5 1.5-4 2 4 2 .5 1.9 2 2.5 2.4 1.6 1.6 2.9 3 2.9 6v.9c0 .4-.1.7-.4.9-.3.2-1.4.6-2.2.8-.4.1-.7-.2-.8-.4v-1.2c-.2-.2-.6-.4-.9-.4-.4 0-.7.1-1 .4-.8.3-2 .7-2.9 1.2-.3.1-.4-.2-.4-.5v-1.4c-.1-.2-.5-.5-.8-.5-.3 0-.6.1-.8.3-.3.2-1 .5-1.8.7-.3.1-.5-.2-.5-.5v-1.4c-.1-.2-.5-.5-.8-.5-1.5.8-2 1.6-1 1.6 0 .5.2 1 .3 1.3.3.1.4-.5.4-1.6v-1.6c0-1.4-.5-2.2-1.1-2.9-.4-.5-1-.8-1.8-.9-1.1-.2-2 .3-2.5 1-.1.3-.4.4-.4.7v1.8c0 .4-.3.6-.7.7-1.2.3-2.3.9-3 1.1-.5.1-.8.5-.8 1v2.3c0 .3.1.7.4 1 .6.4 1.9.8 3 .9.4.1.8-.1.9-.4v-6.1c0-.4.5-.7 1-1 .3-.1.8-.3 1.3-.5 1.2-.4 2.5-.8 4.1-.8 1.4 0 2.9.4 4.1.8 1 .2 1.5.6 1.8 1 .1.3.4.4.4.7v6.3c0 .3-.1.5-.4.6-.2.1-1 .5-1 .5v6.5c-.1.4-.4.7-.6.8-.4.2-1 .4-1 .4-.3 0-.6 0-.8-.1-.1-.2-1-.4-1.6-.5-.4-.1-.7-.2-.9-.4-.1-.2-.2-.5-.2-.8V12c0-.3.1-.5.4-.6 1.2-.4 2.5-.8 3.7-.8 1 .1 2 .4 2.9.8-.3.1-.4.2-.4.5v7.3c0 .4-.3.6-.7.7-1 .3-2 .7-2.8.8-.3.1-.6 0-.6-.4v-6.2c-.1-.4.5-.7 1-1.3 1.5-.6 1.9-.8 2-.8 1 .1 1.6.5 2.2.8.5.2.9.1.9-.3v-7.3c0-.4-.3-.7-.7-.8-1.1-.3-2-.6-3-.6-1 .1-1.8.4-2.5.7-.4.1-.7.5-.7 1.1v4c0 .3.4.7.8.9 1 .5 2.2.8 3.3.8.1-.1.2.1.2.2v-7.7c0-.3.5-.8 1.1-1.3 1.5-.6 1.8-1 2.6-1.8 3-.5.3-.7.1-.7-.4v-3c0-.4.5-.6 1-.7 1.2-.1.2 1 .4 1 .4v3c0 .3-.1.5-.3.7-.5.5-1.9 1.1-3.1 1.5-.3.1-.5 0-.5-.3v-4.3c0-.3.5-.7 1.1-1 .6-.2 1.7-.6 2.9-1 .2-.1.5-.2.7-.3.3-.1.5.1.5.4v3.4c0 .3-.3.5-.7.6-.7.2-1.8.6-2.8 1-.4.1-.6.5-.6.9v4.5c0 .4.2.6.6.7 1.3.4 2.9.8 4.3.8.1-.1.2.1.2.2v-7.5c0-.3.5-.7 1.1-1 .7-.5 1.8-1.2 2.6-2 .5-.1.9-.4 1.2-.7.2-.1.5 0 .5.3v4.1c0 .3-.2.5-.5.6-.5.1-1 .3-1.4.4-.4.1-.7-.1-.7-.4v-4c0-.3.5-.6 1-1 .6-.1 1-.3 1.5-.5.2-.1.5 0 .5.3v4.3c0 .3-.3.5-.5.6-.5.1-1.3.4-1.9.5-.2.1-.4 0-.4-.2v-4c0-.3.5-.5 1-.6.5-.1 1-.2 1.5-.3.1 0 .2 0 .3-.1v-4c0-.3.4-.4.8-.5.3-.1.8-.3 1.2-.4.2-.1.5 0 .5.3v4.1c0 .3-.3.5-.5.6-.2.1-.6.3-1 .4-.3.1-1 .3-1.5.4-.1.1-.2.1-.2.1-.1 0-.2 0-.2-.3v-4.1c0-.2.4-.4.8-.5.3-.1.6-.3 1-.4.2-.1.5 0 .5.3v4c0 .2-.1.4-.3.5-.1.1-.4.2-.6.3-1.2.4-2.4.8-3.4 1-.3.1-.6.1-.6.1-.3 0-.6 0-.8-.1l.8-.3z"></path>
    </svg>
    <p><strong>GitHub Activity Heatmap</strong></p>
    <p>Contribution visualization will be populated with real data.</p>
    <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 6px;">Add <code>assets/github-contrib.json</code> to display real contribution data.</p>
  `;

  // Show section when in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        section.style.display = 'block';
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.1 });

  const githubSection = document.getElementById('github-section');
  if (githubSection) observer.observe(githubSection);
}

// --------------------------------------------------------------------
// LAZY SECTION LOADER
// --------------------------------------------------------------------
function initLazySections() {
  const observers = {};

  // Architecture Section
  if (document.getElementById('architecture-section')) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          section.style.display = 'block';
          initArchitectureExplorer();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(document.getElementById('architecture-section'));
  }

  // Tech Stack Section
  if (document.getElementById('tech-stack-section')) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          section.style.display = 'block';
          initTechStackGraph();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(document.getElementById('tech-stack-section'));
  }

  // Philosophy Section
  if (document.getElementById('philosophy-section')) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initPhilosophySection();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(document.getElementById('philosophy-section'));
  }
}

// --------------------------------------------------------------------
// INIT HERO CANVAS VISIBILITY
// --------------------------------------------------------------------
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    canvas.style.opacity = '0.5';
    canvas.style.transition = 'opacity 0.8s ease';
  }
})();