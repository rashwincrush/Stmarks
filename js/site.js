// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
});

// Hero carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const tags = document.querySelectorAll('.carousel-tag');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    if (tags.length > 0) {
        tags.forEach((tag, i) => {
            tag.textContent = slides[i].dataset.tag;
        });
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

if (slides.length > 0) {
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
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
