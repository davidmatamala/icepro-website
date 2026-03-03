// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal logic
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once it's visible if we only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animElements = document.querySelectorAll('.slide-up, .fade-in');
    animElements.forEach(el => observer.observe(el));

    // Optional: add a slight parallax effect to the hero image based on mouse movement
    const heroVisual = document.querySelector('.hero-visual');
    const heroMockup = document.querySelector('.product-mockup');

    if (heroVisual && heroMockup && window.innerWidth > 768) {
        heroVisual.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            heroMockup.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            heroMockup.style.transform = `rotateY(0deg) rotateX(0deg)`;
        });
    }
});
