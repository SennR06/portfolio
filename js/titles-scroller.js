document.addEventListener('DOMContentLoaded', () => {
    const scrollers = document.querySelectorAll('.titles-scroller');

    scrollers.forEach((scroller) => {
        scroller.setAttribute('data-animated', 'true');
        const scrollerInner = scroller.querySelector('.scroller-inner');
        if (!scrollerInner) return;

        const scrollerContent = Array.from(scrollerInner.children);
        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute('aria-hidden', 'true');
            scrollerInner.appendChild(duplicatedItem);
        });
    });
});