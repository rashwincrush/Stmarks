// Accessible hero slider using hero images in the modern hero section
function initHeroSlider() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    const slides = heroVisual.querySelectorAll('.hero-img');
    if (!slides || slides.length <= 1) return;

    let currentIndex = 0;
    let autoRotateTimer = null;
    const showControls = false; // hide manual controls/dots
    const prefersReducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
        slide.style.transition = 'opacity 0.6s ease';
        slide.style.opacity = index === 0 ? '1' : '0';
    });

    const imageStack = heroVisual.querySelector('.hero-image-stack');
    const overlay = document.createElement('div');
    overlay.className = 'hero-slide-overlay';

    const caption = document.createElement('div');
    caption.className = 'hero-slide-caption';
    const captionTitle = document.createElement('h3');
    const captionSubtitle = document.createElement('p');
    caption.append(captionTitle, captionSubtitle);

    if (imageStack) {
        imageStack.appendChild(overlay);
        imageStack.appendChild(caption);
    }

    const dots = [];
    let prevBtn = null;
    let nextBtn = null;

    if (showControls) {
        const controls = document.createElement('div');
        controls.className = 'hero-carousel-controls';

        prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'hero-carousel-prev';
        prevBtn.setAttribute('aria-label', 'Previous slide');
        prevBtn.textContent = '‹';

        nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'hero-carousel-next';
        nextBtn.setAttribute('aria-label', 'Next slide');
        nextBtn.textContent = '›';

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'hero-carousel-dots';
        dotsContainer.setAttribute('role', 'tablist');
        dotsContainer.setAttribute('aria-label', 'Hero images');

        Array.from(slides).forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'hero-carousel-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Show slide ${index + 1}`);
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            if (index === 0) {
                dot.classList.add('is-active');
            }
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });

        controls.appendChild(prevBtn);
        controls.appendChild(dotsContainer);
        controls.appendChild(nextBtn);
        heroVisual.appendChild(controls);
    }

    function setCaption(slide) {
        if (!captionTitle || !captionSubtitle) return;
        const title = slide?.dataset?.title || slide?.alt || '';
        const subtitle = slide?.dataset?.subtitle || '';
        captionTitle.textContent = title;
        captionSubtitle.textContent = subtitle;
    }

    function updateDots(newIndex) {
        dots.forEach((dot, i) => {
            const isActive = i === newIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    function showHeroSlide(newIndex) {
        if (newIndex === currentIndex || newIndex < 0 || newIndex >= slides.length) return;

        const previous = slides[currentIndex];
        const next = slides[newIndex];

        previous.setAttribute('aria-hidden', 'true');
        next.setAttribute('aria-hidden', 'false');

        previous.style.opacity = '0';
        next.style.opacity = '1';

        currentIndex = newIndex;
        updateDots(currentIndex);
        setCaption(next);
    }

    function goToNext() {
        const nextIndex = (currentIndex + 1) % slides.length;
        showHeroSlide(nextIndex);
    }

    function goToPrev() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        showHeroSlide(prevIndex);
    }

    function startAutoRotate() {
        if (prefersReducedMotion) return;
        if (autoRotateTimer) return;
        autoRotateTimer = window.setInterval(goToNext, 3000);
    }

    function stopAutoRotate() {
        if (autoRotateTimer) {
            window.clearInterval(autoRotateTimer);
            autoRotateTimer = null;
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoRotate();
            goToPrev();
            startAutoRotate();
        });

        nextBtn.addEventListener('click', () => {
            stopAutoRotate();
            goToNext();
            startAutoRotate();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentIndex) {
                stopAutoRotate();
                showHeroSlide(index);
                startAutoRotate();
            }
        });
    });

    heroVisual.addEventListener('mouseenter', stopAutoRotate);
    heroVisual.addEventListener('mouseleave', startAutoRotate);

    heroVisual.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stopAutoRotate();
            goToPrev();
            startAutoRotate();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            stopAutoRotate();
            goToNext();
            startAutoRotate();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoRotate();
        } else {
            startAutoRotate();
        }
    });

    // initialize caption
    setCaption(slides[0]);
    startAutoRotate();
}

function initGalleryLightbox() {
    const gallery = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('gallery-lightbox-img');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const prevBtn = lightbox?.querySelector('.gallery-prev');
    const nextBtn = lightbox?.querySelector('.gallery-next');

    if (!gallery || !lightbox || !lightboxImg) return;

    const images = Array.from(gallery.querySelectorAll('img'));
    let currentIndex = 0;

    const open = (index) => {
        const img = images[index];
        if (!img) return;
        currentIndex = index;
        const src = img.dataset.full || img.src;
        const alt = img.alt || '';
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.hidden = false;
        lightbox.focus();
    };

    const close = () => {
        lightbox.hidden = true;
        lightboxImg.src = '';
    };

    const goPrev = () => {
        const nextIndex = (currentIndex - 1 + images.length) % images.length;
        open(nextIndex);
    };

    const goNext = () => {
        const nextIndex = (currentIndex + 1) % images.length;
        open(nextIndex);
    };

    images.forEach((img, index) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => open(index));
        img.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(index);
            }
        });
        img.setAttribute('tabindex', '0');
    });

    lightboxClose?.addEventListener('click', close);
    prevBtn?.addEventListener('click', goPrev);
    nextBtn?.addEventListener('click', goNext);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) close();
        if (e.key === 'ArrowLeft' && !lightbox.hidden) goPrev();
        if (e.key === 'ArrowRight' && !lightbox.hidden) goNext();
    });
}

function initFacilityLightbox() {
    const gallery = document.querySelector('.facility-scroll');
    const lightbox = document.getElementById('facility-lightbox');
    const lightboxImg = document.getElementById('facility-lightbox-img');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const prevBtn = lightbox?.querySelector('.facility-prev');
    const nextBtn = lightbox?.querySelector('.facility-next');

    if (!gallery || !lightbox || !lightboxImg) return;

    const images = Array.from(gallery.querySelectorAll('img'));
    let currentIndex = 0;

    const openByIndex = (index) => {
        const img = images[index];
        if (!img) return;
        currentIndex = index;
        const src = img.dataset.full || img.src;
        const alt = img.alt || '';
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.hidden = false;
        lightbox.focus();
    };

    const open = (img) => openByIndex(images.indexOf(img));

    const close = () => {
        lightbox.hidden = true;
        lightboxImg.src = '';
    };

    const goPrev = () => {
        const nextIndex = (currentIndex - 1 + images.length) % images.length;
        openByIndex(nextIndex);
    };

    const goNext = () => {
        const nextIndex = (currentIndex + 1) % images.length;
        openByIndex(nextIndex);
    };

    images.forEach((img) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => open(img));
        img.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(img);
            }
        });
        img.setAttribute('tabindex', '0');
    });

    lightboxClose?.addEventListener('click', close);
    prevBtn?.addEventListener('click', goPrev);
    nextBtn?.addEventListener('click', goNext);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) close();
        if (e.key === 'ArrowLeft' && !lightbox.hidden) goPrev();
        if (e.key === 'ArrowRight' && !lightbox.hidden) goNext();
    });
}
// Testimonials carousel
let currentTestimonial = 0;
const testimonialSlides = document.querySelectorAll('.testimonial-slide');

function showTestimonial(index) {
    testimonialSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
    showTestimonial(currentTestimonial);
}

if (testimonialSlides.length > 0) {
    setInterval(nextTestimonial, 7000); // Change testimonial every 7 seconds
}

// Animated stats counters for homepage stats section
function initStatsCounters() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const statElements = statsSection.querySelectorAll('.stat-number-modern');
    if (!statElements.length) return;

    const prefersReducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const formatNumber = (value) => {
        const num = Number(value);
        if (!Number.isFinite(num)) return value;
        return num.toLocaleString('en-IN');
    };

    const runAnimation = () => {
        statElements.forEach((el) => {
            const target = parseInt(el.getAttribute('data-count') || '0', 10);
            if (!target || el.dataset.animated === 'true') {
                el.textContent = formatNumber(target || el.textContent || '0');
                return;
            }

            const duration = 1600;
            const startTime = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const current = Math.floor(target * progress);
                el.textContent = formatNumber(current);
                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };

            el.dataset.animated = 'true';
            requestAnimationFrame(tick);
        });
    };

    // If reduced motion is preferred or IntersectionObserver not supported, set final values immediately
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
        statElements.forEach((el) => {
            const target = parseInt(el.getAttribute('data-count') || '0', 10);
            el.textContent = formatNumber(target || el.textContent || '0');
        });
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                runAnimation();
                obs.disconnect();
            }
        });
    }, {
        threshold: 0.4,
    });

    observer.observe(statsSection);
}

// Header/footer injection and shared behaviors
class HeaderFooterInjector {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadHeader();
        await this.loadFooter();
        this.initMobileMenu();
        this.setActiveNavLink();
    }

    async loadHeader() {
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) return;

        try {
            const response = await fetch('/partials/header.html');
            if (response.ok) {
                const html = await response.text();
                headerContainer.innerHTML = html;
            } else {
                console.warn('Header could not be loaded');
            }
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    async loadFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) return;

        try {
            const response = await fetch('/partials/footer.html');
            if (response.ok) {
                const html = await response.text();
                footerContainer.innerHTML = html;
            } else {
                console.warn('Footer could not be loaded');
            }
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    setActiveNavLink() {
        const currentPath = window.location.pathname || '/';
        const navLinks = document.querySelectorAll('[data-route]');

        navLinks.forEach(link => {
            const route = link.getAttribute('data-route');
            if (!route) return;
            if (route === '/index.html') {
                if (currentPath === '/' || currentPath.endsWith('/index.html')) {
                    link.classList.add('active');
                }
                return;
            }

            if (currentPath === route || currentPath.endsWith(route)) {
                link.classList.add('active');
            }
        });
    }

    initMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('mobile-menu');
        if (!toggle || !menu) return;

        let isOpen = false;
        let lastFocusedElement = null;

        const openMenu = () => {
            menu.style.display = 'block';
            document.body.style.overflow = 'hidden';
            toggle.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');
            lastFocusedElement = document.activeElement;
            const focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            if (focusable.length) {
                focusable[0].focus();
            }
            isOpen = true;
        };

        const closeMenu = () => {
            menu.style.display = 'none';
            document.body.style.overflow = '';
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
            isOpen = false;
        };

        toggle.addEventListener('click', () => {
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (isOpen) {
                    closeMenu();
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') {
                closeMenu();
                return;
            }

            if (e.key === 'Tab') {
                const focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }
}

function initAccessibleForms() {
    const formConfigs = [
        {
            id: 'enquiry-form',
            statusId: 'enquiry-form-status',
            successMessage: 'Thank you for your enquiry. We will get back to you soon!',
            fields: [
                { id: 'parent-name', type: 'text', required: true, label: 'your name' },
                { id: 'phone', type: 'phone', required: true, label: 'a valid phone number' },
                { id: 'email', type: 'email', required: true, label: 'a valid email address' },
                { id: 'child-name', type: 'text', required: true, label: "your child's name" },
                { id: 'class-seeking', type: 'select', required: true, label: 'the class you are seeking' }
            ]
        },
        {
            id: 'feedback-form',
            statusId: 'feedback-form-status',
            successMessage: 'Thank you for sharing your feedback with us.',
            fields: [
                { id: 'feedback-parent-name', type: 'text', required: true, label: 'your name' },
                { id: 'feedback-child-name', type: 'text', required: true, label: "your child\'s name and class" },
                { id: 'feedback-relation', type: 'text', required: true, label: 'your relationship to the child' },
                { id: 'feedback-message', type: 'text', required: true, label: 'your feedback' }
            ]
        }
    ];

    const isValidPhone = (value) => {
        if (!value) return false;
        return /^\+?[\d\s\-\(\)]+$/.test(value);
    };

    const isValidEmail = (value) => {
        if (!value) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    formConfigs.forEach((config) => {
        const form = document.getElementById(config.id);
        if (!form) return;

        const statusEl = config.statusId ? document.getElementById(config.statusId) : null;

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            if (statusEl) {
                statusEl.textContent = '';
                statusEl.classList.remove('form-status--success', 'form-status--error');
            }

            let hasError = false;

            config.fields.forEach((fieldConfig) => {
                const field = document.getElementById(fieldConfig.id);
                if (!field) return;

                field.removeAttribute('aria-invalid');
                const group = field.closest('.form-group');
                if (group) {
                    group.classList.remove('error');
                    const existingError = group.querySelector('.form-error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                }
            });

            const showFieldError = (field, message) => {
                hasError = true;
                field.setAttribute('aria-invalid', 'true');
                const group = field.closest('.form-group');
                if (!group) return;
                group.classList.add('error');
                const errorEl = document.createElement('p');
                errorEl.className = 'form-error-message';
                errorEl.textContent = message;
                group.appendChild(errorEl);
            };

            config.fields.forEach((fieldConfig) => {
                const field = document.getElementById(fieldConfig.id);
                if (!field) return;

                const value = field.value.trim();
                if (fieldConfig.required && !value) {
                    showFieldError(field, `Please enter ${fieldConfig.label}.`);
                    return;
                }

                if (fieldConfig.type === 'phone' && !isValidPhone(value)) {
                    showFieldError(field, 'Please enter a valid phone number.');
                    return;
                }

                if (fieldConfig.type === 'email' && !isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address.');
                }
            });

            if (hasError) {
                if (statusEl) {
                    statusEl.textContent = 'Please correct the highlighted fields.';
                    statusEl.classList.add('form-status', 'form-status--error');
                }

                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                if (firstInvalid && typeof firstInvalid.focus === 'function') {
                    firstInvalid.focus();
                }
                return;
            }

            if (statusEl) {
                statusEl.textContent = config.successMessage;
                statusEl.classList.add('form-status', 'form-status--success');
            }

            form.reset();
        });
    });
}

// Video modal (for Campus Tour button)
function openVideoModal() {
    const existing = document.querySelector('.video-modal');
    if (existing) return;

    const overlay = document.createElement('div');
    overlay.className = 'video-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Campus tour video');
    overlay.innerHTML = `
        <div class="video-modal-content">
            <button class="video-close" type="button" aria-label="Close video">&times;</button>
            <div class="video-wrapper">
                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="Campus tour video"
                        frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const closeButton = overlay.querySelector('.video-close');

    const close = () => {
        overlay.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKeyDown);
    };

    function onKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            close();
        }
    }

    closeButton.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            close();
        }
    });

    document.addEventListener('keydown', onKeyDown);
}

function initVideoModal() {
    const triggers = document.querySelectorAll('.video-trigger');
    if (!triggers.length) return;

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openVideoModal();
        });
    });
}

// Initialize shared behavior on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');

    if (headerContainer || footerContainer) {
        new HeaderFooterInjector();
    }

    const attachNavDropdown = () => {
        const dropdowns = document.querySelectorAll('.nav .dropdown');
        if (!dropdowns.length) {
            // header may be injected asynchronously
            setTimeout(attachNavDropdown, 150);
            return;
        }

        dropdowns.forEach((dd) => {
            const toggle = dd.querySelector('.dropdown-toggle');
            const menu = dd.querySelector('.dropdown-menu');
            let hideTimer = null;

            const open = () => {
                clearTimeout(hideTimer);
                dd.classList.add('open');
                if (toggle) toggle.setAttribute('aria-expanded', 'true');
            };

            const close = () => {
                clearTimeout(hideTimer);
                dd.classList.remove('open');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            };

            const scheduleClose = () => {
                clearTimeout(hideTimer);
                hideTimer = window.setTimeout(close, 3500);
            };

            if (toggle) {
                toggle.addEventListener('mouseenter', open);
                toggle.addEventListener('focus', open);
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (dd.classList.contains('open')) {
                        close();
                    } else {
                        open();
                    }
                });
                toggle.addEventListener('mouseleave', scheduleClose);
            }

            if (menu) {
                menu.addEventListener('mouseenter', open);
                menu.addEventListener('mouseleave', scheduleClose);
                menu.addEventListener('focusin', open);
                menu.addEventListener('focusout', (e) => {
                    if (!dd.contains(e.relatedTarget)) {
                        scheduleClose();
                    }
                });
            }

            dd.addEventListener('mouseleave', scheduleClose);

            document.addEventListener('click', (e) => {
                if (!dd.contains(e.target)) {
                    close();
                }
            });
        });
    };

    initAccessibleForms();
    initHeroSlider();
    initVideoModal();
    initStatsCounters();
    attachNavDropdown();
    initStaffSlider();
    initGalleryLightbox();
    initFacilityLightbox();
});

function initStaffSlider() {
    const slider = document.querySelector('.staff-slider-wrapper');
    if (!slider) return;

    const track = slider.querySelector('.staff-track');
    const prev = slider.querySelector('.staff-nav.prev');
    const next = slider.querySelector('.staff-nav.next');
    const cards = slider.querySelectorAll('.staff-card');
    const lightbox = document.getElementById('staff-lightbox');
    const lightboxImg = document.getElementById('staff-lightbox-img');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');

    const scrollByAmount = () => track?.clientWidth ? track.clientWidth * 0.6 : 300;

    const scrollToDirection = (dir) => {
        if (!track) return;
        track.scrollBy({ left: dir * scrollByAmount(), behavior: 'smooth' });
    };

    prev?.addEventListener('click', () => scrollToDirection(-1));
    next?.addEventListener('click', () => scrollToDirection(1));

    const openLightbox = (src, alt) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.hidden = false;
        lightbox.focus();
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.hidden = true;
        lightboxImg.src = '';
    };

    cards.forEach((card) => {
        const img = card.querySelector('.staff-photo');
        img?.addEventListener('click', () => openLightbox(img.src, img.alt));
        img?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(img.src, img.alt);
            }
        });
        img?.setAttribute('tabindex', '0');
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
            closeLightbox();
        }
    });
}

// Gallery lightbox (global definition to ensure click works on gallery page)
function initGalleryLightbox() {
    const gallery = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('gallery-lightbox-img');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const prevBtn = lightbox?.querySelector('.gallery-prev');
    const nextBtn = lightbox?.querySelector('.gallery-next');

    if (!gallery || !lightbox || !lightboxImg) return;

    const images = Array.from(gallery.querySelectorAll('img'));
    let currentIndex = 0;

    const open = (index) => {
        const img = images[index];
        if (!img) return;
        currentIndex = index;
        const src = img.dataset.full || img.src;
        const alt = img.alt || '';
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.hidden = false;
        lightbox.focus();
    };

    const close = () => {
        lightbox.hidden = true;
        lightboxImg.src = '';
    };

    const goPrev = () => {
        const nextIndex = (currentIndex - 1 + images.length) % images.length;
        open(nextIndex);
    };

    const goNext = () => {
        const nextIndex = (currentIndex + 1) % images.length;
        open(nextIndex);
    };

    images.forEach((img, index) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => open(index));
        img.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(index);
            }
        });
        img.setAttribute('tabindex', '0');
    });

    lightboxClose?.addEventListener('click', close);
    prevBtn?.addEventListener('click', goPrev);
    nextBtn?.addEventListener('click', goNext);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) close();
        if (e.key === 'ArrowLeft' && !lightbox.hidden) goPrev();
        if (e.key === 'ArrowRight' && !lightbox.hidden) goNext();
    });
}
