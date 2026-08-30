/* ==========================================================
   WanderLux — shared site behaviour
   Mobile nav toggle, scroll-reveal animations, rotating
   banner carousel, dynamic footer year.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initScrollReveal();
  initBanner();
  initFooterYear();
});

/* ---------- Mobile nav ---------- */
function initNavToggle(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if(!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is chosen (mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------- Rotating destinations banner (Home page) ---------- */
function initBanner(){
  const banner = document.querySelector('[data-banner]');
  if(!banner) return;

  const slides = Array.from(banner.querySelectorAll('.banner-slide'));
  const dotsWrap = banner.querySelector('.banner-dots');
  const prevBtn = banner.querySelector('.banner-arrow.prev');
  const nextBtn = banner.querySelector('.banner-arrow.next');
  let current = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show featured destination ${i + 1} of ${slides.length}`);
    if(i === 0) dot.setAttribute('aria-current', 'true');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index){
    slides[current].classList.remove('active');
    dotsWrap.children[current].removeAttribute('aria-current');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsWrap.children[current].setAttribute('aria-current', 'true');
  }

  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  function startAuto(){
    stopAuto();
    timer = setInterval(next, 5000);
  }
  function stopAuto(){ if(timer) clearInterval(timer); }

  nextBtn?.addEventListener('click', () => { next(); startAuto(); });
  prevBtn?.addEventListener('click', () => { prev(); startAuto(); });
  banner.addEventListener('mouseenter', stopAuto);
  banner.addEventListener('mouseleave', startAuto);
  banner.addEventListener('focusin', stopAuto);
  banner.addEventListener('focusout', startAuto);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReducedMotion){ startAuto(); }
}

/* ---------- Footer year ---------- */
function initFooterYear(){
  const el = document.getElementById('year');
  if(el) el.textContent = new Date().getFullYear();
}
