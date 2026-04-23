document.addEventListener('DOMContentLoaded', () => {
    const scrollTarget = document.scrollingElement || document.documentElement;
    const scrollContainer = document.getElementById('section-scroll-container');

    // Muiswiel: verticaal -> horizontaal
    window.addEventListener(
        'wheel',
        function (e) {
            if (!scrollTarget) return;

            const isInContainer =
                scrollContainer && scrollContainer.contains(e.target);

            const horizLeft = scrollTarget.scrollLeft;
            const horizRightEdge = horizLeft + window.innerWidth;
            const horizMax = scrollTarget.scrollWidth;
            // ruimere marge, zodat "einde" niet te vroeg triggert
            const atHorizontalEnd = horizRightEdge >= horizMax - 50;

            if (isInContainer && scrollContainer) {
                const deltaY = e.deltaY;
                const atTop = scrollContainer.scrollTop <= 1;
                const atBottom =
                    scrollContainer.scrollTop + scrollContainer.clientHeight >=
                    scrollContainer.scrollHeight - 1;

                // Zolang we nog niet aan het horizontale einde zijn:
                // gebruik vertical wheel om horizontaal door de main te gaan
                if (!atHorizontalEnd) {
                    const horizontalDelta = e.deltaX + e.deltaY;
                    if (horizontalDelta !== 0) {
                        e.preventDefault();
                        scrollTarget.scrollLeft += horizontalDelta; // direct, snel
                    }
                    return;
                }

                // We ZIJN aan het einde van de main:
                // - naar boven én aan top container -> horizontaal terug
                // - anders: gewoon verticaal scrollen in de container (default gedrag)
                if (deltaY < 0 && atTop) {
                    e.preventDefault();
                    scrollTarget.scrollLeft += deltaY;
                    return;
                }

                // deltaY > 0 of niet aan top: laat browser gewoon de container verticaal scrollen
                return;
            }

            // Buiten de container: main horizontaal scrollen met wiel
            if (scrollTarget.scrollWidth <= window.innerWidth) return;

            const horizontalDelta = e.deltaX + e.deltaY;

            if (horizontalDelta !== 0) {
                e.preventDefault();
                scrollTarget.scrollLeft += horizontalDelta;
            }
        },
        { passive: false }
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