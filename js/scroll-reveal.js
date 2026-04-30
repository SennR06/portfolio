// // js/scroll-effects.js

// document.addEventListener("DOMContentLoaded", () => {
//     // ===== 1. LINE-BY-LINE TEXT =====
//     const lineParagraphs = document.querySelectorAll(".reveal-lines");

//     lineParagraphs.forEach(p => {
//         // Split op <br> zodat jij zelf bepaalt waar een "regel" zit
//         const parts = p.innerHTML.split("<br>");
//         const wrapped = parts
//             .map(part => `<span class="reveal-lines-line">${part.trim()}</span>`)
//             .join("");

//         p.innerHTML = wrapped;
//     });

//     // IntersectionObserver om .in-view te zetten
//     const observerOptions = {
//         threshold: 0.15
//     };

//     const onIntersect = (entries, observer) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add("in-view");
//                 observer.unobserve(entry.target);
//             }
//         });
//     };

//     const textObserver = "IntersectionObserver" in window
//         ? new IntersectionObserver(onIntersect, observerOptions)
//         : null;

//     if (textObserver) {
//         lineParagraphs.forEach(p => textObserver.observe(p));
//     } else {
//         // Fallback: alles tonen
//         lineParagraphs.forEach(p => p.classList.add("in-view"));
//     }

//     // ===== 2. PARALLAX IMAGES =====
//     const parallaxImages = document.querySelectorAll(".parallax-image");
//     let lastScrollY = window.scrollY;
//     let ticking = false;

//     const updateParallax = () => {
//         const viewportHeight = window.innerHeight;

//         parallaxImages.forEach(img => {
//             const rect = img.getBoundingClientRect();
//             const imgCenter = rect.top + rect.height / 2;
//             const distanceFromCenter = imgCenter - viewportHeight / 2;

//             const speed = parseFloat(img.dataset.speed) || 0.2;
//             const translateY = -distanceFromCenter * speed * 0.1;

//             img.style.transform = `translateY(${translateY}px)`;
//         });

//         ticking = false;
//     };

//     const onScroll = () => {
//         lastScrollY = window.scrollY;

//         if (!ticking) {
//             window.requestAnimationFrame(updateParallax);
//             ticking = true;
//         }
//     };

//     window.addEventListener("scroll", onScroll, { passive: true });
//     updateParallax();
// });