// js/page-transition.js

(function () {
  const TRANSITION_DURATION = 700;   // moet matchen CSS
  const MIN_LOADER_TIME = 1000;      // overlay minimaal 1s zichtbaar

  const scroller = document.querySelector('.titles-scroller');
  if (!scroller) return;

  const isProjectPage = document.body.classList.contains('project-page');

  // ENTER: pagina start full-screen (overlay in HTML) en sluit daarna
  window.addEventListener('DOMContentLoaded', () => {
    const startTime = performance.now();

    function runEnterAnimation() {
      const elapsed = performance.now() - startTime;
      const wait = Math.max(0, MIN_LOADER_TIME - elapsed);

      setTimeout(() => {
        if (isProjectPage) {
          // Project: van full overlay naar rechts uit beeld
          scroller.classList.add('hide-right');
          // overlay blijft staan, alleen transform schuift naar rechts
        } else {
          // Index: van full overlay naar smalle balk onderin
          scroller.classList.remove('overlay');
        }
      }, wait);
    }

    // Eén frame wachten zodat de overlay echt getekend is
    requestAnimationFrame(runEnterAnimation);
  });

  // EXIT: naar full overlay animeren en dan pas navigeren
  function startTransitionAndNavigate(href) {
    if (isProjectPage) {
      // als we op project al rechts buiten beeld staan, eerst terughalen
      scroller.classList.remove('hide-right');
    }

    scroller.classList.add('overlay');

    setTimeout(() => {
      window.location.href = href;
    }, TRANSITION_DURATION);
  }

  // Link-kliks onderscheppen
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    // Speciale links niet overriden
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

    // Onclick-scroll links (scrollTo...) met href "#" gewoon laten werken
    const hasOnClick = !!link.getAttribute('onclick');
    if (hasOnClick && (!href || href === '#')) {
      return;
    }

    const currentUrl = window.location.origin + window.location.pathname;
    const nextUrl = href.startsWith('http')
      ? href
      : new URL(href, window.location.href).href;

    if (nextUrl === currentUrl) return;

    e.preventDefault();
    startTransitionAndNavigate(href);
  });
})();

// Specifieke back-animatie op projectpagina's
function goBack() {
  const scroller = document.querySelector('.titles-scroller');
  if (!scroller) {
    history.back();
    return;
  }

  const TRANSITION_DURATION = 1000;
  const isProjectPage = document.body.classList.contains('project-page');

  if (!isProjectPage) {
    history.back();
    return;
  }

  // Zorg dat de overlay van rechts naar het midden komt
  scroller.classList.remove('hide-right');  // van rechts terug naar 0
  scroller.classList.add('overlay');        // full-screen

  setTimeout(() => {
    history.back();
  }, TRANSITION_DURATION);
}