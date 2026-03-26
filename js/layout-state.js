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

    // Background bewegen op basis van horizontale scroll
    window.addEventListener('scroll', () => {
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
    });

    // Background bewegen op basis van muis (zoals in je originele script)
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

    // Logging van Windows scaling
    const scale = window.devicePixelRatio;
    if (scale !== 1) {
        console.log('Windows scaling is actief: ' + scale);
    }

    const backButtons = document.querySelectorAll(".back-btn");

    backButtons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            goBack();
        });
    });

    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "index.html";
        }
    }
});