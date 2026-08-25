/**
 * Subodh Dhamala — Personal Developer Portfolio Scripts
 * Minimal, Fast, High-Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initTheme();
  initMobileMenu();
  initProjectFilters();
  initPdfModal();
  initCopyEmail();
  initScrollSpy();
  initBackToTop();
  initKeyboardShortcuts();
});

/* Lucide Icons Initializer */
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* Theme Switcher */
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

/* Mobile Menu */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-item-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Close menu on link click or outside click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
    }
  });
}

/* Project Category Filter */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

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
    });
  });
}

/* In-Site PDF Viewer Modal */
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

/* Copy Email Helper */
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

/* ScrollSpy for Navbar Active States */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
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
  }, { passive: true });
}

/* Back to Top Button */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Keyboard Shortcuts */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Only if not focused on an input/textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 't' || e.key === 'T') {
      toggleTheme();
    }
  });
}
