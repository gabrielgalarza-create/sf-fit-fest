// Tappable programming cards: toggle .is-open
document.querySelectorAll('[data-card]').forEach((card) => {
  const open = () => card.classList.toggle('is-open');
  card.addEventListener('click', (e) => {
    // ignore clicks on links
    if (e.target.closest('a')) return;
    open();
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
