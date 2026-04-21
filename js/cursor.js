// js/cursor.js

const cursor = document.querySelector('.cursor');
const buttons = document.querySelectorAll('button');
const links = document.querySelectorAll('a');
const scrollContainer = document.getElementById('section-scroll-container');
const aboutSection = document.querySelector('.about-me');
const contactSection = document.querySelector('.contact');

// Klein labelelement in de cursor stoppen
const cursorLabel = document.createElement('span');
cursorLabel.className = 'cursor-label';
cursorLabel.textContent = '';
if (cursor) {
    cursor.appendChild(cursorLabel);
}

// Cursor positie + scroll-label logica
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (cursor) {
        cursor.style.top = `${y}px`;
        cursor.style.left = `${x}px`;
    }

    updateCursorLabel(e.clientX, e.clientY);
});

function updateCursorLabel(clientX, clientY) {
    if (!scrollContainer || !aboutSection || !cursorLabel) {
        return;
    }

    const aboutRect = aboutSection.getBoundingClientRect();

    const isInside = (rect) =>
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

    const overAbout = isInside(aboutRect);

    // Alleen tonen als je echt boven about-me hangt
    if (overAbout) {
        cursorLabel.textContent = 'scroll down';
        cursorLabel.style.opacity = '1';
    } else {
        cursorLabel.textContent = '';
        cursorLabel.style.opacity = '0';
    }
}

// Hover states voor links & buttons
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('hover');
    });

    link.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('hover');
    });
});

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('hover');
    });

    button.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('hover');
    });
});

// Cursor tonen/verbergen bij in/uit het window
window.addEventListener('mousemove', () => {
    if (cursor) cursor.style.display = 'block';
});

window.addEventListener('mouseout', (event) => {
    if (!cursor) return;
    if (!event.relatedTarget && !event.toElement) {
        cursor.style.display = 'none';
    }
});