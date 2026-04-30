// js/vertical-infinite-projects.js

document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".all-projects");
  const scrollContainer = document.querySelector("body.project-page main");

  if (!list || !scrollContainer) return;

  // Dubbel init voorkomen
  if (list.dataset.infiniteInitialized === "true") return;
  list.dataset.infiniteInitialized = "true";

  const originalItems = Array.from(list.children);
  if (!originalItems.length) return;

  // Maak 3 sets onder elkaar: [SET 0][SET 1][SET 2]
  const REPEAT = 3;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < REPEAT; i++) {
    originalItems.forEach((item) => {
      fragment.appendChild(item.cloneNode(true));
    });
  }

  list.innerHTML = "";
  list.appendChild(fragment);

  // Wachten tot layout staat, daarna hoogte meten en loop activeren
  requestAnimationFrame(() => {
    const totalHeight = list.scrollHeight;
    const singleSetHeight = totalHeight / REPEAT;

    if (!singleSetHeight || !isFinite(singleSetHeight)) return;

    // Start in het midden (SET 1), zodat je direct beide kanten op kunt
    scrollContainer.scrollTop = singleSetHeight;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        let y = scrollContainer.scrollTop;

        // Beneden voorbij SET 1 + SET 2? -> 1 set omhoog
        if (y >= singleSetHeight * 2) {
          scrollContainer.scrollTop = y - singleSetHeight;
        }
        // Boven voorbij SET 0? -> 1 set omlaag
        else if (y <= 0) {
          scrollContainer.scrollTop = y + singleSetHeight;
        }

        ticking = false;
      });
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
  });
});