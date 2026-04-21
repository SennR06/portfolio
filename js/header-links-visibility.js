document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.querySelector('.projects');
    const aboutMeSection = document.getElementById('about-me');
    const projectsBtnHeader = document.getElementById('projects-btn-header');
    const aboutMeBtnHeader = document.getElementById('about-me-btn-header');
    const headerLinks = document.querySelector('.heading.links.header');

    if (!projectsSection || !aboutMeSection || !headerLinks) return;

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

            const anyIntersecting = entries.some((e) => e.isIntersecting);
            headerLinks.style.gap = anyIntersecting ? '0' : '50px';
        },
        {
            root: null,
            threshold: 0.1,
        }
    );

    observer.observe(projectsSection);
    observer.observe(aboutMeSection);
});