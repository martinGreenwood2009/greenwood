/* ═══════════════════════════════════════════════
   TecnoChaco — Main JS
   ═══════════════════════════════════════════════ */

/* ─── Navbar scroll effect ─── */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  navbar.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', window.scrollY > 400);
  updateActiveLink();
}, { passive: true });

/* ─── Back to top ─── */
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── Active nav link on scroll ─── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ─── Mobile menu ─── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── Smooth scroll for all anchors ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ─── Counter animation ─── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target));
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: .4 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ─── AOS (Animate on Scroll) ─── */
const aosObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

/* ─── Contact form ─── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const btn = document.getElementById('submitBtn');
    btn.querySelector('.btn-text').classList.add('hidden');
    btn.querySelector('.btn-loading').classList.remove('hidden');
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 1400));

    btn.querySelector('.btn-text').classList.remove('hidden');
    btn.querySelector('.btn-loading').classList.add('hidden');
    btn.disabled = false;

    form.reset();
    document.getElementById('formSuccess').classList.remove('hidden');
    setTimeout(() => document.getElementById('formSuccess').classList.add('hidden'), 6000);
  });

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
  });
}

function validateForm() {
  let valid = true;
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const mensaje = document.getElementById('mensaje');

  if (!nombre.value.trim() || nombre.value.trim().length < 2) {
    showError(nombre, 'err-nombre', 'Ingresá tu nombre completo.');
    valid = false;
  }
  if (!validateEmail(email.value)) {
    showError(email, 'err-email', 'Ingresá un email válido.');
    valid = false;
  }
  if (!mensaje.value.trim() || mensaje.value.trim().length < 10) {
    showError(mensaje, 'err-mensaje', 'El mensaje debe tener al menos 10 caracteres.');
    valid = false;
  }
  return valid;
}

function validateField(input) {
  if (input.required && !input.value.trim()) {
    const errId = `err-${input.id}`;
    if (document.getElementById(errId)) showError(input, errId, 'Este campo es requerido.');
  }
  if (input.type === 'email' && input.value && !validateEmail(input.value)) {
    showError(input, 'err-email', 'Ingresá un email válido.');
  }
}

function showError(input, errId, msg) {
  input.style.borderColor = 'var(--error)';
  const err = document.getElementById(errId);
  if (err) err.textContent = msg;
}

function clearError(input) {
  input.style.borderColor = '';
  const errId = `err-${input.id}`;
  const err = document.getElementById(errId);
  if (err) err.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
