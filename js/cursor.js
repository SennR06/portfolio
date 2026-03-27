document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.top = `${y}px`;
        cursor.style.left = `${x}px`;
    }
});

const cursor = document.querySelector('.cursor');
const buttons = document.querySelectorAll('button');
const links = document.querySelectorAll('a');

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        console.log("Hovering over link: " + link.href);
    });

    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });

    button.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

window.addEventListener('mousemove', () => {
  cursor.style.display = 'block';
});

window.addEventListener('mouseout', (event) => {
  if (!event.relatedTarget && !event.toElement) {
    cursor.style.display = 'none';
  }
});