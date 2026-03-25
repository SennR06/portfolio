document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.querySelector('.projects');
    const contactSection = document.getElementById('contact');
    const projectsBtnHeader = document.getElementById('projects-btn-header');
    const contactBtnHeader = document.getElementById('contact-btn-header');
    const headerLinks = document.querySelector('.heading.links.header');

    if (!projectsSection || !contactSection || !headerLinks) return;

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

                if (target === contactSection && contactBtnHeader) {
                    if (entry.isIntersecting) {
                        contactBtnHeader.style.display = 'none';
                    } else {
                        contactBtnHeader.style.display = '';
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
    observer.observe(contactSection);
});