// js/loader.js

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const body = document.body;

    if (!loader) return;

    // Zorg dat je CSS deze class gebruikt als “pagina is nog aan het opstarten”
    body.classList.add('page-transition-active');

    const startTime = performance.now();
    const minDuration = 1200; // minimaal 1.2s zichtbaar

    function isModelReady() {
        return window.modelReady === true;
    }

    function checkReady() {
        const elapsed = performance.now() - startTime;

        if (isModelReady() && elapsed >= minDuration) {
            hideLoader();
        } else {
            requestAnimationFrame(checkReady);
        }
    }

    requestAnimationFrame(checkReady);

    function hideLoader() {
        body.classList.remove('page-transition-active');
        loader.classList.add('loader-hidden'); // fade-out via CSS
        setTimeout(() => {
            loader.style.display = 'none';
        }, 600); // match met transition-duration in CSS
    }
});