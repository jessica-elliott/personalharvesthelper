// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');
  const overlay = document.querySelector('.overlay');

  if (toggle && nav) {
    function closeNav() {
      nav.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    }
    function openNav() {
      nav.classList.add('open');
      if (overlay) overlay.classList.add('open');
    }
    toggle.addEventListener('click', function() {
      nav.classList.contains('open') ? closeNav() : openNav();
    });
    if (overlay) overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeNav();
    });
  }
});