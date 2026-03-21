document.addEventListener('DOMContentLoaded', function () {
    const scrollTarget = document.scrollingElement || document.documentElement;
    const scrollContainer = document.getElementById('section-scroll-container');

    window.addEventListener(
        'wheel',
        function (e) {
            const isInContainer =
                scrollContainer && scrollContainer.contains(e.target);

            const horizLeft = scrollTarget.scrollLeft;
            const horizRightEdge = horizLeft + window.innerWidth;
            const horizMax = scrollTarget.scrollWidth;
            const atHorizontalEnd = horizRightEdge >= horizMax - 1;

            if (isInContainer) {
                const deltaY = e.deltaY;
                const atTop =
                    scrollContainer.scrollTop <= 0 + 1;
                const atBottom =
                    scrollContainer.scrollTop +
                    scrollContainer.clientHeight >=
                    scrollContainer.scrollHeight - 1;

                if (!atHorizontalEnd) {
                    scrollContainer.style.overflowY = 'hidden';
                    const horizontalDelta = e.deltaX + e.deltaY;
                    if (horizontalDelta !== 0) {
                        e.preventDefault();
                        scrollTarget.scrollLeft += horizontalDelta;
                        this.setTimeout(() => {
                        scrollContainer.style.overflowY = 'auto';
                        }, 1);
                    }
                    return;
                }

                if (deltaY < 0 && atTop) {
                    e.preventDefault();
                    scrollTarget.scrollLeft += deltaY;
                    return;
                }

                return;
            }

            if (scrollTarget.scrollWidth <= window.innerWidth) return;

            const horizontalDelta = e.deltaX + e.deltaY;

            if (horizontalDelta !== 0) {
                e.preventDefault();
                scrollTarget.scrollLeft += horizontalDelta;
            }
        },
        { passive: false }
    );

    const headingLinksGrp = document.querySelector('.heading-links-grp');
    const projects = document.querySelector('.projects');
    const projectCards = document.querySelectorAll('.project');

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

    // NIEUW: parallax functie
    function updateProjectsParallax() {
        if (!projectCards.length) return;

        const maxOffset = 200; // hoe sterk de horizontale beweging is
        const scrollRange =
            document.body.scrollWidth - window.innerWidth || 1;
        const scrollProgress = scrollTarget.scrollLeft / scrollRange;

        projectCards.forEach((card) => {
            const depth = parseFloat(card.dataset.depth || '1');
            // grotere depth = grotere beweging
            const offsetX = (scrollProgress - 0.7) * maxOffset * depth;

            card.style.transform = `translateX(${-offsetX}px)`;
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollX > 0) {
            headingLinksGrp.classList.add('up');
            document.body.classList.add('up');
            projects.classList.add('up');
        } else {
            headingLinksGrp.classList.remove('up');
            document.body.classList.remove('up');
            projects.classList.remove('up');
        }

        const scrollDelta = window.scrollX;
        const scrollFactor = 0.2;
        lastMouseOffsetX += (-scrollDelta * scrollFactor - lastMouseOffsetX) * 0.1;

        updateBackground();
        updateProjectsParallax(); // NIEUW
    });

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

    const projectsBtn = document.getElementById('projects-btn');
    projectsBtn.addEventListener('click', () => {
        scrollTarget.scrollTo({
            left: 6,
            behavior: 'smooth',
        });
    });

    const contactBtn = document.getElementById('contact-btn');
    const contactSection = document.getElementById('contact');
    contactBtn.addEventListener('click', () => {
        contactSection.scrollIntoView({
            behavior: 'smooth',
        });
    });

    window.addEventListener(
        'keydown',
        function (e) {
            if (
                (e.ctrlKey || e.metaKey) &&
                (e.which === 61 ||
                    e.which === 107 ||
                    e.which === 173 ||
                    e.which === 109 ||
                    e.which === 187 ||
                    e.which === 189)
            ) {
                e.preventDefault();
            }
        },
        false
    );

    // Zorg dat de beginpositie direct goed staat
    updateProjectsParallax();
});