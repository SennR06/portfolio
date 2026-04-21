document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.querySelector('.projects');
    const aboutMeSection = document.getElementById('about-me');
    const projectsBtnHeader = document.getElementById('projects-btn-header');
    const aboutMeBtnHeader = document.getElementById('about-me-btn-header');
    const headerLinks = document.querySelector('.heading.links.header');

    if (!projectsSection || !aboutMeSection || !headerLinks) return;

    const updateGap = () => {
        const buttons = [projectsBtnHeader, aboutMeBtnHeader].filter(Boolean);

        // Tel alleen knoppen waarvan display niet 'none' is
        const visibleButtonsCount = buttons.filter(
            (btn) => btn.style.display !== 'none'
        ).length;

        headerLinks.style.gap = visibleButtonsCount > 1 ? '50px' : '0';
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const target = entry.target;

                if (target === projectsSection && projectsBtnHeader) {
                    if (entry.isIntersecting) {
                        projectsBtnHeader.style.display = 'none';
                    } else {
                        projectsBtnHeader.style.display = '';
                    }
                }

                if (target === aboutMeSection && aboutMeBtnHeader) {
                    if (entry.isIntersecting) {
                        aboutMeBtnHeader.style.display = 'none';
                    } else {
                        aboutMeBtnHeader.style.display = '';
                    }
                }
            });

            // Na het updaten van de knoppen, altijd de gap herberekenen
            updateGap();
        },
        {
            root: null,
            threshold: 0.1,
        }
    );

    observer.observe(projectsSection);
    observer.observe(aboutMeSection);

    // Initiele gap instellen op basis van huidige zichtbaarheid
    updateGap();
});