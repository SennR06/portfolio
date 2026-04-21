// js/loader.js

(function () {
  const body = document.body;
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Check of dit de eerste keer is in deze tab
  const IS_FIRST_VISIT = !sessionStorage.getItem('hasVisited');
  const MAX_LOADER_TIME = 3000; // fallback

  function reallyRemoveLoader() {
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }

  function hideLoader() {
    if (!loader || loader.classList.contains('hidden')) return;

    loader.classList.add('hidden');
    body.classList.remove('loading');

    // Na fade-out element weghalen
    setTimeout(reallyRemoveLoader, 700);
  }

  if (IS_FIRST_VISIT) {
    // Eerste bezoek: loader tonen
    body.classList.add('loading');

    window.addEventListener('load', () => {
      // kleine delay voor een prettige animatie
      setTimeout(() => {
        hideLoader();
        sessionStorage.setItem('hasVisited', 'true');
      }, 600);
    });

    // Veiligheidsnet
    setTimeout(() => {
      hideLoader();
      sessionStorage.setItem('hasVisited', 'true');
    }, MAX_LOADER_TIME);
  } else {
    // Niet eerste bezoek: loader direct weg (ook bij terug naar home)
    loader.classList.add('hidden');
    body.classList.remove('loading');
    reallyRemoveLoader();
  }
})();