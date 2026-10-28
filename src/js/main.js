// Initialize Feather Icons
if (typeof feather !== 'undefined') {
  feather.replace();
}

// Active navigation link highlighting based on current path
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.navbar .menu a');

navLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (!href) return;

  if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
    link.classList.add('text-primary', 'font-semibold');
  }
});

// Smooth scroll observer for homepage sections with hash
const sections = document.querySelectorAll('section[id]');
const hashLinks = document.querySelectorAll('.navbar a[href^="/#"], .navbar a[href^="#"]');

if (sections.length > 0 && hashLinks.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && currentPath === '/') {
          hashLinks.forEach((link) => {
            const href = link.getAttribute('href').replace('/', '');
            link.classList.toggle(
              'text-primary',
              href === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Exclusively Dark Theme
document.documentElement.setAttribute('data-theme', 'dark');

// ── Typed.js Animations ────────────────────────────────────────────────
if (typeof Typed !== 'undefined') {
  // Helper to safely instantiate if element exists
  const initTyped = (selector, options) => {
    if (document.querySelector(selector)) {
      return new Typed(selector, options);
    }
  };

  // Helper to type section headers once when scrolled into view (strictly no backspace, no deletion)
  const initSectionHeaderTyped = (selector, text, speed = 45) => {
    const el = document.querySelector(selector);
    if (!el) return;

    const startTyping = () => {
      el.textContent = '';
      new Typed(el, {
        strings: [text],
        typeSpeed: speed,
        backSpeed: 0,
        loop: false,
        showCursor: true,
        cursorChar: '▋',
        onComplete: (self) => {
          setTimeout(() => {
            if (self.cursor) self.cursor.style.display = 'none';
          }, 1500);
        },
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              obs.disconnect();
              startTyping();
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
    } else {
      startTyping();
    }
  };







  // Section Headers — Typed once, strictly NO backspace, NO erasing to change
  initSectionHeaderTyped('#typed-skills-header', 'Specialized Tech Stack');
  initSectionHeaderTyped('#typed-projects-header', 'Selected Case Studies');
  initSectionHeaderTyped('#typed-blog-header', 'Engineering Logs & Technical Notes');
  initSectionHeaderTyped('#typed-projects-page-header', 'Full-Stack Engineering & Case Studies');
  initSectionHeaderTyped('#typed-blog-page-header', 'Technical Writing & Architecture Notes');
}

// ── Custom Alert & Toast Notification System (daisyUI alert component) ─
window.showCustomAlert = function (message, type = 'success', duration = 3500) {
  let container = document.getElementById('global-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'global-toast-container';
    container.className =
      'toast toast-bottom toast-end z-[999] pointer-events-none p-4 flex flex-col gap-2';
    document.body.appendChild(container);
  }

  const alertItem = document.createElement('div');
  alertItem.setAttribute('role', 'alert');

  let alertStyle = 'alert-success border-success/30';
  let iconName = 'check-circle';

  if (type === 'error') {
    alertStyle = 'alert-error border-error/30';
    iconName = 'alert-circle';
  } else if (type === 'warning') {
    alertStyle = 'alert-warning border-warning/30';
    iconName = 'alert-triangle';
  } else if (type === 'info') {
    alertStyle = 'alert-info border-info/30';
    iconName = 'info';
  }

  alertItem.className = `alert alert-soft ${alertStyle} shadow-2xl border font-mono text-xs sm:text-sm flex items-center gap-3 transition-all duration-300 transform translate-y-3 opacity-0 pointer-events-auto max-w-md bg-base-200/95 backdrop-blur-md`;
  alertItem.innerHTML = `
    <i data-feather="${iconName}" class="w-4 h-4 shrink-0"></i>
    <span class="flex-1">${message}</span>
    <button type="button" class="btn btn-ghost btn-xs btn-circle shrink-0" aria-label="Dismiss alert">✕</button>
  `;

  const dismissBtn = alertItem.querySelector('button');
  const dismiss = () => {
    alertItem.classList.remove('translate-y-0', 'opacity-100');
    alertItem.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => alertItem.remove(), 300);
  };

  dismissBtn.addEventListener('click', dismiss);
  container.appendChild(alertItem);

  if (typeof feather !== 'undefined') {
    feather.replace();
  }

  requestAnimationFrame(() => {
    alertItem.classList.remove('translate-y-3', 'opacity-0');
    alertItem.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(dismiss, duration);
};

// ── Article Share Modal & Actions ─────────────────────────────────────
window.openShareModal = function () {
  const modal = document.getElementById('share_modal');
  const input = document.getElementById('share-article-url');
  const xBtn = document.getElementById('share-x-btn');
  const linkedinBtn = document.getElementById('share-linkedin-btn');
  const currentUrl = window.location.href;
  const pageTitle = document.title;

  if (input) input.value = currentUrl;
  if (xBtn) {
    xBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(pageTitle)}`;
  }
  if (linkedinBtn) {
    linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`;
  }

  if (modal && typeof modal.showModal === 'function') {
    modal.showModal();
  }
};

window.copyShareUrl = function () {
  const currentUrl = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        window.showCustomAlert('Link copied to clipboard!', 'success');
      })
      .catch(() => {
        fallbackCopy(currentUrl);
      });
  } else {
    fallbackCopy(currentUrl);
  }
};

function fallbackCopy(text) {
  const input = document.getElementById('share-article-url');
  if (input) {
    input.select();
    document.execCommand('copy');
    window.showCustomAlert('Link copied to clipboard!', 'success');
  }
}
