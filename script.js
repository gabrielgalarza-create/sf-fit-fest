// Tappable programming cards: toggle .is-open, fire Amplitude event on expand
document.querySelectorAll('[data-card]').forEach((card) => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const wasOpen = card.classList.contains('is-open');
    card.classList.toggle('is-open');
    if (!wasOpen && window.amplitude) {
      const title = card.querySelector('.card__title');
      window.amplitude.track('programming_card_expanded', {
        zone: title ? title.textContent.trim() : 'unknown'
      });
    }
  });
});

// Reveal-on-scroll for cards (subtle)
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .partner, .stat, .aud').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(14px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  io.observe(el);
});

// Custom Amplitude tracking for high-signal interactions
(function () {
  function track(name, props) {
    if (window.amplitude && typeof window.amplitude.track === 'function') {
      window.amplitude.track(name, props || {});
    }
  }

  // Pre-register CTA clicks (any of the pre-register buttons or links)
  document.querySelectorAll(
    '[data-rsvp-open], a[href="#register"], a[href*="overthetopxp.com/sffitfest"]'
  ).forEach((el) => {
    el.addEventListener('click', () => {
      const section = el.closest('section');
      track('cta_pre_register_clicked', {
        location: section ? section.id || 'unknown' : 'nav',
        text: el.textContent.trim()
      });
    });
  });

  // Nav link clicks (which sections people are jumping to)
  document.querySelectorAll('.nav__links a').forEach((el) => {
    el.addEventListener('click', () => {
      track('nav_link_clicked', { section: el.getAttribute('href') });
    });
  });

  // Hero secondary CTA
  const heroSee = document.querySelector('.hero__ctas a[href="#programming"]');
  if (heroSee) {
    heroSee.addEventListener('click', () => track('hero_see_programming_clicked'));
  }

  // Partner email link
  const sponsorEmail = document.querySelector('a[href^="mailto:gabrgalarza"]');
  if (sponsorEmail) {
    sponsorEmail.addEventListener('click', () => track('sponsor_email_clicked'));
  }
})();

// RSVP modal: open Sweatpals event page in an in-page popup
(function rsvpModal() {
  const modal = document.getElementById('rsvp-modal');
  if (!modal) return;
  const frame = modal.querySelector('.rsvp-modal__frame');
  const RSVP_URL = 'https://sweatpals.com/super-bowl-sf-fit-fest-31a';

  function open() {
    frame.src = RSVP_URL;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('rsvp-open');
  }

  function close() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    frame.src = 'about:blank';
    document.body.classList.remove('rsvp-open');
  }

  document.querySelectorAll('[data-rsvp-open]').forEach((el) => {
    el.addEventListener('click', (e) => {
      // Cmd/Ctrl/Shift/middle-click -> let the browser open in a new tab
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      open();
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-rsvp-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();
