// js/page-transition.js

(function () {
  const transitionEl = document.getElementById('page-transition');
  if (!transitionEl) return;

  const TRANSITION_DURATION = 700; // moet gelijk zijn aan CSS (0.7s)

  function activateOverlay() {
    transitionEl.classList.add('active');
  }

  function deactivateOverlay() {
    transitionEl.classList.remove('active');
  }

  function showTransitionAndNavigate(href) {
    activateOverlay();

    setTimeout(() => {
      window.location.href = href;
    }, TRANSITION_DURATION);
  }

  // Bij binnenkomst van de pagina: overlay staat al op .active (HTML),
  // we laten hem dus gewoon rustig uitfaden.
  window.addEventListener('load', () => {
    // kleine delay zodat de browser de beginstaat kan tekenen
    setTimeout(() => {
      deactivateOverlay();
    }, 50);
  });

  // Alle link-kliks onderscheppen voor smooth transition
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    // Links die we niet willen overriden
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      target === '_blank'
    ) {
      return;
    }

    // Interne scroll-links met onclick (zoals scrollToProjects()) met href "#" niet pakken
    const hasOnClick = !!link.getAttribute('onclick');
    if (hasOnClick && (!href || href === '#')) {
      return;
    }

    // Zelfde pagina? Geen transition
    const currentUrl = window.location.origin + window.location.pathname;
    const nextUrl = href.startsWith('http')
      ? href
      : new URL(href, window.location.href).href;

    if (nextUrl === currentUrl) {
      return;
    }

    e.preventDefault();
    showTransitionAndNavigate(href);
  });
})();