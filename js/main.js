
const themeToggle = document.querySelector('#themeToggle');
const body = document.body;

const applyTheme = (theme) => {
  body.classList.toggle('dark-mode', theme === 'dark');
  localStorage.setItem('jantaElectricalsTheme', theme);
};

const currentTheme = localStorage.getItem('jantaElectricalsTheme') || 'light';
applyTheme(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  if (window.gsap) {
    gsap.from('.hero-copy h1', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' });
    gsap.from('.hero-copy p, .hero-actions, .hero-badges', { opacity: 0, y: 25, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.2 });
  }

  const search = document.querySelector('#serviceSearch');
  const cards = document.querySelectorAll('.service-card');
  if (search && cards.length) {
    search.addEventListener('input', () => {
      const query = search.value.toLowerCase();
      cards.forEach(card => {
        const label = card.querySelector('h3').textContent.toLowerCase();
        card.parentElement.style.display = label.includes(query) ? 'grid' : 'none';
      });
    });
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projects.forEach(card => {
        card.style.display = filter === 'all' || card.dataset.category.includes(filter) ? 'block' : 'none';
      });
    });
  });

  const faqButtons = document.querySelectorAll('.faq-item button');
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const success = document.querySelector('.form-success');
      const formData = new FormData(contactForm);
      const message = [
        'Hello Janta Electricals, I would like to make an inquiry.',
        `Name: ${formData.get('name')}`,
        `Phone: ${formData.get('phone')}`,
        `Email: ${formData.get('email')}`,
        `Service needed: ${formData.get('service')}`,
        `Message: ${formData.get('message')}`
      ].join('\n');
      const whatsappUrl = `https://wa.me/919122407756?text=${encodeURIComponent(message)}`;
      if (success) {
        success.style.display = 'block';
        success.textContent = 'Opening WhatsApp with your inquiry…';
      }
      window.open(whatsappUrl, '_blank', 'noopener');
    });
  }

  const beforeAfter = document.querySelector('.before-after');
  if (beforeAfter) {
    const range = beforeAfter.querySelector('#imageRange');
    const overlay = beforeAfter.querySelector('.before-overlay');
    range.addEventListener('input', () => {
      overlay.style.width = `${range.value}%`;
    });
  }

  const projectGallery = document.querySelector('#projectGallery');
  if (projectGallery) {
    const albums = [
      { prefix: 'album-one', count: 149, label: 'Industrial automation project' },
      { prefix: 'album-two', count: 60, label: 'Industrial automation project' }
    ];
    const galleryItems = [];
    albums.forEach(album => {
      for (let number = 1; number <= album.count; number += 1) {
        const formattedNumber = String(number).padStart(3, '0');
        const item = document.createElement('div');
        item.className = 'image-card';
        item.innerHTML = `<img src="assets/images/projects/${album.prefix}-${formattedNumber}.jpg" alt="${album.label} ${number}" loading="lazy"><h3>${album.label} ${number}</h3>`;
        galleryItems.push(item);
      }
    });
    projectGallery.replaceChildren(...galleryItems);
  }

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('sw.js');
      } catch (err) {
        console.warn('Service Worker registration failed:', err);
      }
    }
  };
  registerServiceWorker();
});
