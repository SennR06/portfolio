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

    if (
        !showLabel &&
        contactSection &&
        !contactSection.classList.contains('pop-up')
    ) {
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

document.addEventListener('mouseover', (event) => {
    if (!cursor) return;

    const target = event.target.closest('a, button');
    if (target) {
        cursor.classList.add('hover');
    }
});

document.addEventListener('mouseout', (event) => {
    if (!cursor) return;

    const related = event.relatedTarget;
    // Als we het document uitgaan of niet meer boven een a/button hangen → hover uit
    if (!related || !related.closest || !related.closest('a, button')) {
        cursor.classList.remove('hover');
    }
});