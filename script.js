/**
 * Subodh Dhamala — Personal Developer Portfolio Scripts
 * Minimal, Fast, Polished
 */

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initTheme();
  initMobileMenu();
  initPdfModal();
  initCopyEmail();
  initScrollSpy();
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
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      initIcons();
    });
  });
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

/* ScrollSpy for Minimal Navbar */
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
          link.style.color = 'var(--text-primary)';
          link.style.background = 'var(--bg-card)';
        } else {
          link.style.color = '';
          link.style.background = '';
        }
      }
    });
  }, { passive: true });
}
