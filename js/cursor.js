// js/cursor.js

const cursor = document.querySelector('.cursor');
const buttons = document.querySelectorAll('button');
const links = document.querySelectorAll('a');
const scrollContainer = document.getElementById('section-scroll-container');
const aboutSection = document.querySelector('.about-me');
const howIWorkSection = document.querySelector('.how-i-work');
const contactSection = document.querySelector('.contact');

// Label in de cursor
const cursorLabel = document.createElement('span');
cursorLabel.className = 'cursor-label';
cursorLabel.textContent = 'scroll down';
if (cursor) {
    cursor.appendChild(cursorLabel);
}

// Laatst bekende muispositie
let lastMouseX = window.innerWidth / 2;
let lastMouseY = window.innerHeight / 2;

// Mousemove: cursor positie + label
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    lastMouseX = x;
    lastMouseY = y;

    if (cursor) {
        cursor.style.top = `${y}px`;
        cursor.style.left = `${x}px`;
    }

    updateCursorLabel(x, y);
});

// Hulpfunctie: ligt punt in rect?
function isInsideRect(rect, clientX, clientY) {
    return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
    );
}

// Bepaalt tekst + zichtbaarheid van het label
function evaluateCursorLabelVisibility(clientX, clientY) {
    if (!cursorLabel) return;

    let labelText = '';
    let showLabel = false;

    // Check per sectie in de scroll-container
    if (aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        if (isInsideRect(aboutRect, clientX, clientY)) {
            labelText = 'scroll down';
            showLabel = true;
        }
    }

    if (!showLabel && howIWorkSection) {
        const howRect = howIWorkSection.getBoundingClientRect();
        if (isInsideRect(howRect, clientX, clientY)) {
            labelText = 'scroll down/up';
            showLabel = true;
        }
    }

    if (!showLabel && contactSection) {
        const contactRect = contactSection.getBoundingClientRect();
        if (isInsideRect(contactRect, clientX, clientY)) {
            labelText = 'scroll up';
            showLabel = true;
        }
    }

    if (showLabel) {
        cursorLabel.textContent = labelText;
        cursorLabel.style.opacity = '1';
        cursorLabel.style.transform = 'translate(-50%, 0)';
    } else {
        cursorLabel.style.opacity = '0';
        cursorLabel.style.transform = 'translate(-50%, 6px)';
    }
}

function updateCursorLabel(clientX, clientY) {
    evaluateCursorLabelVisibility(clientX, clientY);
}

// Window-scroll (voor het verplaatsen van de custom cursor zelf)
window.addEventListener(
    'scroll',
    () => {
        if (cursor) {
            cursor.style.top = `${lastMouseY}px`;
            cursor.style.left = `${lastMouseX}px`;
        }
        updateCursorLabel(lastMouseX, lastMouseY);
    },
    { passive: true }
);

// Container-scroll (belangrijkste in jouw layout)
if (scrollContainer) {
    scrollContainer.addEventListener(
        'scroll',
        () => {
            if (cursor) {
                cursor.style.top = `${lastMouseY}px`;
                cursor.style.left = `${lastMouseX}px`;
            }
            updateCursorLabel(lastMouseX, lastMouseY);
        },
        { passive: true }
    );
}

// Hover states voor links & buttons
links.forEach((link) => {
    link.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('hover');
    });

    link.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('hover');
    });
});

buttons.forEach((button) => {
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