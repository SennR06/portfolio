document.addEventListener('DOMContentLoaded', () => {
    const scrollTarget = document.scrollingElement || document.documentElement;
    const projectCards = document.querySelectorAll('.project');

    function updateProjectsParallax() {
        if (!projectCards.length) return;

        const maxOffset = 200;
        const scrollRange =
            document.body.scrollWidth - window.innerWidth || 1;
        const scrollProgress = scrollTarget.scrollLeft / scrollRange;

        projectCards.forEach((card) => {
            const depth = parseFloat(card.dataset.depth || '1');
            const offsetX = (scrollProgress - 0.7) * maxOffset * depth;
            card.style.transform = `translateX(${-offsetX}px)`;
        });
    }

    window.addEventListener('scroll', updateProjectsParallax);
    updateProjectsParallax();
});