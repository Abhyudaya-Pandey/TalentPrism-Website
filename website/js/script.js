// Pricing toggle functionality
const pricingToggle = document.getElementById('pricing-toggle');
if (pricingToggle) {
    const priceAmounts = document.querySelectorAll('.amount');
    pricingToggle.addEventListener('change', function() {
        const isYearly = this.checked;
        priceAmounts.forEach(amount => {
            if (amount.textContent !== 'Custom') {
                const monthly = parseInt(amount.dataset.monthly);
                const yearly = parseInt(amount.dataset.yearly);
                amount.textContent = isYearly ? `$${yearly}` : `$${monthly}`;
            }
        });
    });
}

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');

if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav a');
if (navLinks.length > 0 && nav && mobileMenuToggle) {
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}

// Dropdown menu functionality for mobile
const dropdownToggles = document.querySelectorAll('.dropdown > a');

if (dropdownToggles.length > 0) {
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Only prevent default on mobile/tablet
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdownMenu = this.nextElementSibling;
                const isOpen = dropdownMenu.style.display === 'block';
                
                // Close all dropdowns first
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.style.display = 'none';
                });
                
                // Toggle current dropdown
                if (!isOpen) {
                    dropdownMenu.style.display = 'block';
                }
            }
        });
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown') && window.innerWidth <= 768) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Features slider navigation
const featuresSlider = document.querySelector('.features-slider');
if (featuresSlider) {
    const sliderMask = document.querySelector('.slider-mask');
    const featureSlides = document.querySelectorAll('.features-slide');
    const sliderDots = document.querySelectorAll('.w-slider-dot');
    const sliderLeft = document.querySelector('.slider-left');
    const sliderRight = document.querySelector('.slider-right');

    let currentSlide = 0;
    const totalSlides = featureSlides.length;

    function updateSlider() {
        if (sliderMask) {
            sliderMask.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        // Update dots
        sliderDots.forEach((dot, index) => {
            dot.classList.toggle('w-active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    }

    // Event listeners for navigation
    if (sliderLeft) {
        sliderLeft.addEventListener('click', prevSlide);
    }

    if (sliderRight) {
        sliderRight.addEventListener('click', nextSlide);
    }

    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Make feature slides clickable to advance
    featureSlides.forEach((slide, index) => {
        const slideWrap = slide.querySelector('.features-slide-wrap');
        if (slideWrap) {
            slideWrap.addEventListener('click', (e) => {
                // Prevent default link behavior
                e.preventDefault();
                // Advance to next slide
                nextSlide();
            });
        }
    });

    // Auto-play functionality (optional)
    let autoplayInterval;

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Start autoplay on page load
    document.addEventListener('DOMContentLoaded', function() {
        updateSlider(); // Initialize slider position
        startAutoplay();
        
        // Pause autoplay on hover
        if (featuresSlider) {
            featuresSlider.addEventListener('mouseenter', stopAutoplay);
            featuresSlider.addEventListener('mouseleave', startAutoplay);
        }
    });
}

// Header scroll effect
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// Testimonial slider (simple auto-scroll)
const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider) {
    let scrollAmount = 0;

    function autoScroll() {
        scrollAmount += 1;
        if (scrollAmount >= testimonialSlider.scrollWidth - testimonialSlider.clientWidth) {
            scrollAmount = 0;
        }
        testimonialSlider.scrollLeft = scrollAmount;
    }

    setInterval(autoScroll, 50);
}

// Intersection Observer for animations (if needed)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .pricing-card, .testimonial, .deep-dive-item').forEach(el => {
    observer.observe(el);
});

// Add loading states for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
});

// Form validation (if forms are added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Analytics opt-in (placeholder)
function showAnalyticsBanner() {
    // Implement GDPR-compliant analytics banner
    console.log('Analytics banner would show here');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial pricing to yearly
    pricingToggle.checked = true;
    pricingToggle.dispatchEvent(new Event('change'));

    // Show analytics banner after a delay
    setTimeout(showAnalyticsBanner, 2000);
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// Performance: Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'images/logo.png',
        'images/dashboard-mockup.webp'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadCriticalResources();

// FAQ accordion functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const item = this.parentElement;
        const isOpen = item.classList.contains('open');
        const toggle = this.querySelector('.faq-toggle');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open');
            const t = i.querySelector('.faq-toggle');
            if (t) t.textContent = '+';
        });
        
        // Open the clicked item if it wasn't already open
        if (!isOpen) {
            item.classList.add('open');
            if (toggle) toggle.textContent = '-';
        }
    });
});