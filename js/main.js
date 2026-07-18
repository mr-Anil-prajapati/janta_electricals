/* ============================================================
   JANTA ELECTRICALS — MAIN JAVASCRIPT
   Premium interactions: particles, counters, nav, animations
   ============================================================ */

/* ── Theme ── */
const body       = document.body;
const themeToggle = document.querySelector('#themeToggle');
const THEME_KEY  = 'jantaElectricalsTheme';

const applyTheme = (theme) => {
  body.classList.remove('dark-mode', 'light-mode');
  body.classList.add(theme === 'light' ? 'light-mode' : '');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'light'
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';
  }
  localStorage.setItem(THEME_KEY, theme);
};

const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = body.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(next);
  });
}

/* ── Page Loader ── */
const loader = document.getElementById('page-loader');
if (loader) {
  const hideLoader = () => loader.classList.add('hidden');
  // Hide after resources load (normal case)
  window.addEventListener('load', () => setTimeout(hideLoader, 900));
  // Fallback: always hide after 3 seconds max, so site is never stuck
  setTimeout(hideLoader, 3000);
}

/* ── Scroll Progress Bar ── */
const scrollBar = document.getElementById('scroll-progress');
const updateScrollProgress = () => {
  if (!scrollBar) return;
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ── Header Scroll Effect ── */
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 50);
  // Back to top
  const btt = document.getElementById('back-to-top');
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Mobile Nav ── */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
let navOverlay;

const openNav = () => {
  hamburger?.classList.add('open');
  navLinks?.classList.add('open');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:998;
      backdrop-filter:blur(4px);transition:opacity 0.3s;
    `;
    navOverlay.addEventListener('click', closeNav);
    document.body.appendChild(navOverlay);
  }
  requestAnimationFrame(() => navOverlay.style.opacity = '1');
};

const closeNav = () => {
  hamburger?.classList.remove('open');
  navLinks?.classList.remove('open');
  if (navOverlay) {
    navOverlay.style.opacity = '0';
    setTimeout(() => { navOverlay?.remove(); navOverlay = null; }, 300);
  }
};

hamburger?.addEventListener('click', () =>
  navLinks?.classList.contains('open') ? closeNav() : openNav()
);

// Close on nav link click
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

/* ── Particle Canvas Hero ── */
const initParticles = () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.r    = Math.random() * 1.5 + 0.5;
      this.alpha= Math.random() * 0.5 + 0.15;
      this.color= Math.random() > 0.6
        ? `rgba(0,168,255,${this.alpha})`
        : `rgba(245,166,35,${this.alpha * 0.6})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  const COUNT = Math.min(80, Math.floor((W * H) / 12000));
  const init = () => {
    particles = Array.from({ length: COUNT }, () => new Particle());
  };

  const LINK_DIST = 140;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    // Draw links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,168,255,${0.12 * (1 - d / LINK_DIST)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(draw);
  };

  resize();
  init();
  draw();

  const ro = new ResizeObserver(() => { cancelAnimationFrame(animId); resize(); init(); draw(); });
  ro.observe(canvas);
};

/* ── Animated Number Counters ── */
const animateCounter = (el) => {
  const target = parseFloat(el.dataset.target || el.textContent);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const val = target % 1 === 0
      ? Math.floor(eased * target)
      : (eased * target).toFixed(1);
    el.textContent = prefix + val + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const initCounters = () => {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
};

/* ── FAQ Accordion ── */
const initFAQ = () => {
  document.querySelectorAll('.faq-item button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
};

/* ── Project Filter ── */
const initFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category?.includes(filter);
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.animation = 'none';
          requestAnimationFrame(() => { card.style.animation = ''; });
        }
      });
    });
  });
};

/* ── Service Search ── */
const initSearch = () => {
  const search = document.querySelector('#serviceSearch');
  if (!search) return;
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    document.querySelectorAll('.service-card').forEach(card => {
      const label = card.querySelector('h3')?.textContent.toLowerCase() || '';
      card.closest('.card').style.display = label.includes(q) ? '' : 'none';
    });
  });
};

/* ── Contact Form → WhatsApp ── */
const initContactForm = () => {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const lines = [
      '👋 Hello Janta Electricals, I would like to make an inquiry.',
      `📛 Name: ${fd.get('name')}`,
      `📞 Phone: ${fd.get('phone')}`,
      `📧 Email: ${fd.get('email') || 'N/A'}`,
      `🔧 Service: ${fd.get('service')}`,
      `💬 Message: ${fd.get('message')}`
    ];
    const url = `https://wa.me/919122407756?text=${encodeURIComponent(lines.join('\n'))}`;
    const success = document.querySelector('.form-success');
    if (success) {
      success.style.display = 'block';
      success.textContent = '✅ Opening WhatsApp with your inquiry…';
    }
    window.open(url, '_blank', 'noopener');
  });
};

/* ── Lightbox ── */
const initLightbox = () => {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML = `
      <img id="lb-img" src="" alt="Gallery image">
      <button class="lightbox-close" id="lb-close" aria-label="Close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(lb);
  }

  const lbImg   = lb.querySelector('#lb-img');
  const lbClose = lb.querySelector('#lb-close');

  const open  = (src, alt) => { lbImg.src = src; lbImg.alt = alt; lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  document.querySelectorAll('.image-card img, .project-card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(img.src, img.alt));
  });
};

/* ── Gallery Loader ── */
const initGallery = () => {
  const gallery = document.querySelector('#projectGallery');
  if (!gallery) return;

  const albums = [
    { prefix: 'album-one', count: 149, label: 'Industrial automation project' },
    { prefix: 'album-two', count: 60,  label: 'Industrial automation project' }
  ];

  const items = [];
  albums.forEach(album => {
    for (let n = 1; n <= album.count; n++) {
      const num  = String(n).padStart(3, '0');
      const card = document.createElement('div');
      card.className = 'image-card';
      card.innerHTML = `
        <img src="assets/images/projects/${album.prefix}-${num}.jpg"
             alt="${album.label} ${n}" loading="lazy">
        <div class="image-card-overlay"><h3>${album.label} ${n}</h3></div>
      `;
      items.push(card);
    }
  });
  gallery.replaceChildren(...items);

  // Lightbox for dynamically added images
  gallery.querySelectorAll('img').forEach(img => {
    img.style.cursor = 'zoom-in';
    const lb = document.getElementById('lightbox');
    if (lb) {
      const lbImg = lb.querySelector('#lb-img');
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }
  });
};

/* ── Back to Top ── */
const initBackToTop = () => {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

/* ── Service Worker ── */
const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('sw.js'); }
    catch (e) { console.warn('SW registration failed:', e); }
  }
};

/* ── GSAP Hero Entrance ── */
const initGSAP = () => {
  if (!window.gsap) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-eyebrow',  { opacity: 0, y: 20, duration: 0.7 }, 0.2)
    .from('.hero-copy h1',  { opacity: 0, y: 40, duration: 0.9 }, 0.4)
    .from('.hero-copy p',   { opacity: 0, y: 25, duration: 0.7 }, 0.7)
    .from('.hero-actions',  { opacity: 0, y: 20, duration: 0.6 }, 0.9)
    .from('.hero-trust',    { opacity: 0, y: 15, duration: 0.5 }, 1.1)
    .from('.hero-image-wrap', { opacity: 0, x: 40, duration: 0.9 }, 0.5)
    .from('.hero-badge-float', { opacity: 0, scale: 0.8, stagger: 0.2, duration: 0.5 }, 1.2);
};

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({
      duration: 750,
      once: true,
      easing: 'ease-out-cubic',
      offset: 60,
    });
  }

  initGSAP();
  initParticles();
  initCounters();
  initFAQ();
  initFilter();
  initSearch();
  initContactForm();
  initLightbox();
  initGallery();
  initBackToTop();
  registerSW();
});
