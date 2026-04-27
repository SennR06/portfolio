// js/contact-popup.js

function openContactPopup() {
    const popup = document.querySelector('.contact.pop-up');
    const dashedWrapper = document.querySelector('.dashed-wrapper');
    const backBtn = document.querySelector('.back-btn');

    if (!popup || !dashedWrapper) return;

    // open state toevoegen
    popup.classList.add('open');
    dashedWrapper.classList.add('open');
    backBtn.classList.add('open');
    backBtn.innerHTML = `CLOSE 
<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path
        d="M0.13112 13.5712L12.0922 1.61004L-0.000453203 1.5825L-0.000453287 -3.49944e-05H14.8442V14.8446H13.2341L13.2341 2.75194L1.27302 14.713L0.13112 13.5712Z"
        fill="white" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path
        d="M0.13112 13.5712L12.0922 1.61004L-0.000453203 1.5825L-0.000453287 -3.49944e-05H14.8442V14.8446H13.2341L13.2341 2.75194L1.27302 14.713L0.13112 13.5712Z"
        fill="white" />
</svg>`;


    // scroll blokkeren onder de popup
    document.body.style.overflow = 'hidden';
}

function closeContactPopup() {
    const popup = document.querySelector('.contact.pop-up');
    const dashedWrapper = document.querySelector('.dashed-wrapper');
    const backBtn = document.querySelector('.back-btn');

    if (!popup || !dashedWrapper || !backBtn) return;

    // open weghalen, closing toevoegen
    popup.classList.remove('open');
    popup.classList.add('closing');

    dashedWrapper.classList.remove('open');
    backBtn.classList.remove('open');
    backBtn.innerHTML = `BACK 
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
                d="M0.13112 13.5712L12.0922 1.61004L-0.000453203 1.5825L-0.000453287 -3.49944e-05H14.8442V14.8446H13.2341L13.2341 2.75194L1.27302 14.713L0.13112 13.5712Z"
                fill="#2C52E5" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
                d="M0.13112 13.5712L12.0922 1.61004L-0.000453203 1.5825L-0.000453287 -3.49944e-05H14.8442V14.8446H13.2341L13.2341 2.75194L1.27302 14.713L0.13112 13.5712Z"
                fill="#2C52E5" />
        </svg>`;

    // scroll weer aan maar pas ná de animatie als je wilt:
    document.body.style.overflow = '';

    // als de langste animatie 0.4s duurt + 0.3s delay op opacity:
    setTimeout(() => {
        popup.classList.remove('closing');
    }, 700);
}

function isContactOpen() {
    const popup = document.querySelector('.contact.pop-up');
    return popup && popup.classList.contains('open');
}

function handleBackOrClose() {
    if (isContactOpen()) {
        // Popup is open → sluit popup
        closeContactPopup();
    } else {
        // Popup is niet open → normale back-actie
        if (typeof goBack === 'function') {
            goBack();
        } else {
            window.history.back();
        }
    }
}