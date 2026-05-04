document.addEventListener('DOMContentLoaded', () => {
    const scrollTarget = document.scrollingElement || document.documentElement;

    const headingLinksGrp = document.querySelector('.heading-links-grp');
    const projects = document.querySelector('.projects');
    const header = document.querySelector('header');

    let headerTimeout = null;

    let lastMouseOffsetX = 0;
    let lastMouseOffsetY = 0;

    function updateBackground() {
        const gridUp = document.body.classList.contains('up');

        if (gridUp) {
            const backgroundPosX = -370 + lastMouseOffsetX;
            const backgroundPosY = -370 + lastMouseOffsetY;
            document.body.style.backgroundPosition = `${backgroundPosX}px ${backgroundPosY}px`;
        } else {
            const backgroundPosX = lastMouseOffsetX;
            const backgroundPosY = lastMouseOffsetY;
            document.body.style.backgroundPosition = `${backgroundPosX}px ${backgroundPosY}px`;
        }
    }

    // Gedeelde scroll-logica in aparte functie
    function handleScroll() {
        if (window.scrollX > 0) {
            if (headerTimeout !== null) {
                clearTimeout(headerTimeout);
                headerTimeout = null;
            }

            if (headingLinksGrp) headingLinksGrp.classList.add('up');
            document.body.classList.add('up');
            if (projects) projects.classList.add('up');

            if (header) {
                headerTimeout = setTimeout(() => {
                    header.style.transform = 'translateY(0)';
                }, 300);
            }
        } else {
            if (headerTimeout !== null) {
                clearTimeout(headerTimeout);
                headerTimeout = null;
            }
            if (headingLinksGrp) headingLinksGrp.classList.remove('up');
            document.body.classList.remove('up');
            if (projects) projects.classList.remove('up');
            if (header) header.style.transform = 'translateY(-100%)';
        }

        const scrollDelta = window.scrollX;
        const scrollFactor = 0.2;
        lastMouseOffsetX += (-scrollDelta * scrollFactor - lastMouseOffsetX) * 0.1;

        updateBackground();
    }

    // Background bewegen op basis van horizontale scroll
    window.addEventListener('scroll', handleScroll);

    // Direct bij load de juiste state zetten op basis van bestaande scrollX
    handleScroll();

    // Background bewegen op basis van muis
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        lastMouseOffsetX = deltaX * 50;
        lastMouseOffsetY = deltaY * 50;

        updateBackground();
    });
});