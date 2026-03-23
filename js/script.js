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

        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.top = `${y}px`;
            cursor.style.left = `${x}px`;
        }
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

    const form = document.getElementById('form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const conformationMessage = document.getElementsByClassName('conformation-message')[0];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();


        if (!isValidEmail(email)) {
            alert("Vul een geldig e-mailadres in.");
            emailInput.focus();
            return;
        }

        const formData = new FormData(form);
        formData.append("access_key", "18bba8b1-f675-4f35-9b51-0000d6743cdb");

        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                conformationMessage.classList.add('visible');
                submitBtn.textContent = "Back to the form";
                submitBtn.disabled = false;

                submitBtn.onclick = () => {
                    conformationMessage.classList.remove('visible');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.onclick = null; // handler opruimen
                    console.log("Form reset, ready for new submission.");
                };
            } else {
                alert("Error: " + data.message);
            }

        } catch (error) {
            alert("Something went wrong. Please try again.");
        }
    });

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const scrollers = document.querySelectorAll(".titles-scroller");
    scrollers.forEach((scrollers) => {
        scrollers.setAttribute("data-animated", true);
        const scrollerInner = scrollers.querySelector(".scroller-inner");
        const scrollerContent = Array.from(scrollerInner.children);
        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
        });
    });
});