document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('reveal-once')) {
                    observer.unobserve(entry.target);
                }
            } else {
                if (!entry.target.classList.contains('reveal-once')) {
                    entry.target.classList.remove('active');
                }
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-once');
    revealElements.forEach(el => observer.observe(el));


    // Numbers Counting Animation
    const numbersObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const numbersObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                const prefix = target.getAttribute('data-prefix') || '';
                const suffix = target.getAttribute('data-suffix') || '';
                const duration = 2000; // ms
                let startTimestamp = null;

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    // easeOutQuart
                    const easeProgress = 1 - Math.pow(1 - progress, 4);
                    const currentValue = Math.floor(easeProgress * endValue);

                    target.innerText = prefix + currentValue + suffix;

                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        target.innerText = prefix + endValue + suffix;
                    }
                };

                window.requestAnimationFrame(step);
                observer.unobserve(target);
            }
        });
    }, numbersObserverOptions);

    const numberElements = document.querySelectorAll('.number-val');
    numberElements.forEach(el => numbersObserver.observe(el));


    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Optional: Close all other open accordions
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });

            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                const answer = question.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Testimonials Carousel Logic
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.getElementById('carousel-dots');
        let currentSlideIndex = 0;

        // Dynamically calculate visible slides based on CSS
        let visibleSlides = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
        let maxIndex = Math.max(0, slides.length - visibleSlides);

        window.addEventListener('resize', () => {
            visibleSlides = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
            maxIndex = Math.max(0, slides.length - visibleSlides);
            if (currentSlideIndex > maxIndex) {
                currentSlideIndex = maxIndex;
                updateCarousel(currentSlideIndex);
            }
            createDots();
        });

        const updateCarousel = (index) => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${index * slideWidth}px)`;

            // Update dots
            const dots = Array.from(dotsNav.children);
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');

            // Disable/Enable buttons
            if (index === 0) {
                prevButton.style.opacity = '0.5';
                prevButton.style.cursor = 'default';
            } else {
                prevButton.style.opacity = '1';
                prevButton.style.cursor = 'pointer';
            }

            if (index === maxIndex) {
                nextButton.style.opacity = '0.5';
                nextButton.style.cursor = 'default';
            } else {
                nextButton.style.opacity = '1';
                nextButton.style.cursor = 'pointer';
            }
        };

        const createDots = () => {
            dotsNav.innerHTML = '';
            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot' + (i === currentSlideIndex ? ' active' : '');
                dot.addEventListener('click', () => {
                    currentSlideIndex = i;
                    updateCarousel(currentSlideIndex);
                });
                dotsNav.appendChild(dot);
            }
        };

        nextButton.addEventListener('click', () => {
            if (currentSlideIndex < maxIndex) {
                currentSlideIndex++;
                updateCarousel(currentSlideIndex);
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateCarousel(currentSlideIndex);
            }
        });

        // Initialization
        createDots();
        updateCarousel(0);
    }

    // NEW Header Scroll Transparency & Mobile Drawer
    const newHeader = document.getElementById('site-header-new');
    if (newHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 12) {
                newHeader.classList.add('is-scrolled');
            } else {
                newHeader.classList.remove('is-scrolled');
            }
        });
    }

    const hamburger = document.querySelector('.site-hamburger');
    const drawer = document.getElementById('site-mobile-drawer');
    const drawerClose = document.querySelector('.site-drawer-close');
    const drawerLinksNew = document.querySelectorAll('.site-drawer-link, .site-drawer-btn');

    if (hamburger && drawer && drawerClose) {
        hamburger.addEventListener('click', () => {
            drawer.classList.add('is-open');
        });
        drawerClose.addEventListener('click', () => {
            drawer.classList.remove('is-open');
        });
        drawerLinksNew.forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.remove('is-open');
            });
        });
    }

    // Client Login Modal Logic
    const clientModal = document.getElementById('client-modal');
    const btnOpenModal = document.querySelectorAll('.open-client-modal');
    const btnCloseModal = document.querySelector('.client-modal-close');
    const loginForm = document.getElementById('client-login-form');
    const loginFeedback = document.getElementById('login-feedback');

    if (clientModal) {
        btnOpenModal.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                clientModal.classList.add('is-active');
            });
        });

        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', () => {
                clientModal.classList.remove('is-active');
                if (loginFeedback) loginFeedback.innerText = '';
                if (loginForm) loginForm.reset();
            });
        }

        clientModal.addEventListener('click', (e) => {
            if (e.target === clientModal) {
                clientModal.classList.remove('is-active');
                if (loginFeedback) loginFeedback.innerText = '';
                if (loginForm) loginForm.reset();
            }
        });

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (loginFeedback) {
                    loginFeedback.innerText = 'Credenciales incorrectas.';
                }
            });
        }
    }
});
