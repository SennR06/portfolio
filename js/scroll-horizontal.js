document.addEventListener('DOMContentLoaded', () => {
    const scrollTarget = document.scrollingElement || document.documentElement;
    const scrollContainer = document.getElementById('section-scroll-container');

    // Muiswiel: verticaal -> horizontaal
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
                const atTop = scrollContainer.scrollTop <= 0 + 1;
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

    // Ctrl/Cmd + +/- zoom blokkeren
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

    // Buttons voor scrollen (blijven smooth)
    const scrollTargetForButtons = scrollTarget;
    const aboutMeSection = document.getElementById('about-me');
    const contactSection = document.getElementById('contact');
    const howIWorkSection = document.getElementById('how-i-work');

    window.scrollToProjects = function () {
        scrollTargetForButtons.scrollTo({
            left: 6,
            behavior: 'smooth',
        });
    };

    window.scrollToAboutMe = function () {
        if (!aboutMeSection) return;
        aboutMeSection.scrollIntoView({
            behavior: 'smooth',
        });
    };

    window.scrollToContact = function () {
        if (!contactSection) return;
        contactSection.scrollIntoView({
            behavior: 'smooth',
        });
    };

    window.scrollToHowIWork = function () {
        if (!howIWorkSection) return;
        howIWorkSection.scrollIntoView({
            behavior: 'smooth',
        });
    };
});