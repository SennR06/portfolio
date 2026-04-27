document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.querySelector('.projects');
    const aboutMeSection = document.getElementById('about-me');
    const projectsBtnHeader = document.getElementById('projects-btn-header');
    const aboutMeBtnHeader = document.getElementById('about-me-btn-header');
    const backBtnHeader = document.getElementById('back-btn-header');
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

                if (target === projectsSection) {
                    if (projectsBtnHeader) {
                        projectsBtnHeader.style.display = entry.isIntersecting ? 'none' : '';
                    }

                    // "VIEW ALL PROJECTS" alleen tonen als de projecten-sectie in beeld is
                    if (backBtnHeader) {
                        backBtnHeader.style.display = entry.isIntersecting ? '' : 'none';
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
});