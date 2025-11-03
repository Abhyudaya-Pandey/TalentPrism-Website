console.log('Integration page script loaded');

const header = document.querySelector('.header');

document.querySelectorAll('a[href^="#"]').forEach(link => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#' || targetId.length <= 1) {
        return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
        return;
    }

    link.addEventListener('click', event => {
        event.preventDefault();
        const offset = header ? header.offsetHeight + 16 : 16;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    });
});

const heroImage = document.querySelector('.hero-visual img');
if (heroImage) {
    const fadeIn = () => {
        heroImage.style.opacity = '1';
    };

    heroImage.style.opacity = '0';
    heroImage.style.transition = 'opacity 0.6s ease';

    if (heroImage.complete) {
        requestAnimationFrame(fadeIn);
    } else {
        heroImage.addEventListener('load', fadeIn);
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        font-size: 20px;
    `;

    button.addEventListener('click', scrollToTop);
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        button.style.opacity = window.scrollY > 300 ? '1' : '0';
    });
}

createScrollToTopButton();