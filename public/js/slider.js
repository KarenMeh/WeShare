document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary elements
    const track = document.querySelector('.slider-track');
    const slides = Array.from(document.querySelectorAll('.slider-slide'));
    const dotsContainer = document.querySelector('.slider-dots');
    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');

    // Check if we have all required elements
    if (!track || !slides.length || !dotsContainer || !prevButton || !nextButton) {
        console.error('Missing required slider elements');
        return;
    }

    // Set up initial state
    let currentIndex = 0;
    const totalSlides = slides.length;
    let slideInterval;

    // Set up the slides
    slides.forEach((slide, index) => {
        // Position each slide
        slide.style.position = 'absolute';
        slide.style.left = `${index * 100}%`;
        slide.style.width = '100%';
        slide.style.transition = 'left 0.5s ease-in-out';

        // Create dot for this slide
        const dot = document.createElement('div');
        dot.className = 'slider-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Function to show a specific slide
    function showSlide(index) {
        // Handle index bounds
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        // Update current index
        currentIndex = index;

        // Move slides
        slides.forEach((slide, i) => {
            const offset = (i - currentIndex) * 100;
            slide.style.left = `${offset}%`;
        });

        // Update dots
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Function to show next slide
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    // Function to show previous slide
    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Start automatic sliding
    function startAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 3000);
    }

    // Stop automatic sliding
    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // Add event listeners
    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide();
    });

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoSlide();
    });

    // Initialize the slider
    showSlide(0);
    startAutoSlide();

    // Log for debugging
    console.log('Slider initialized with', totalSlides, 'slides');
}); 