// =========================================================
// MOVERS RWANDA — interactions
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header shrink ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav a:not(.mobile-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('.mobile-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = toggle.getAttribute('data-target');
      const target = document.getElementById(targetId);
      const caret = toggle.querySelector('.mobile-toggle-caret');
      const isOpen = target.classList.toggle('is-open');
      caret.classList.toggle('is-open', isOpen);
    });
  });

  /* ---------- Quote form ---------- */
  const quoteForm = document.getElementById('quoteForm');
  const quoteConfirm = document.getElementById('quoteConfirm');

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }
    // No pricing is calculated here — this simply confirms receipt of the request.
    quoteConfirm.classList.add('is-visible');
    quoteConfirm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    quoteForm.reset();
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(open => {
        if (open !== item) {
          open.classList.remove('is-open');
          open.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('is-open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- How-it-works: activate step on scroll ---------- */
  const steps = document.querySelectorAll('.step');
  if (steps.length && 'IntersectionObserver' in window) {
    const stepIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-active');
      });
    }, { threshold: 0.5 });
    steps.forEach(s => stepIo.observe(s));
  }

  /* ---------- Reviews: drag-to-scroll on desktop ---------- */
  const track = document.querySelector('.reviews-track-wrap');
  if (track) {
    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(evt =>
      track.addEventListener(evt, () => { isDown = false; track.style.cursor = 'grab'; })
    );
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  }

  /* ---------- Prevent past dates in quote form ---------- */
  const dateInput = document.getElementById('moveDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

});
