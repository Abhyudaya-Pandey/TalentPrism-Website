// TalentPrism Website Script
console.log('Script loaded successfully');

// Pricing toggle functionality (guarded for pages without pricing toggle)
const pricingToggle = document.getElementById('pricing-toggle');
const priceAmounts = document.querySelectorAll('.amount');

if (pricingToggle) {
    pricingToggle.addEventListener('change', function() {
        const isYearly = this.checked;
        priceAmounts.forEach(amount => {
            if (amount.textContent !== 'Custom') {
                const monthly = parseInt(amount.dataset.monthly);
                const yearly = parseInt(amount.dataset.yearly);
                if (!Number.isNaN(monthly) && !Number.isNaN(yearly)) {
                    amount.textContent = isYearly ? `$${yearly}` : `$${monthly}`;
                }
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
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (nav && mobileMenuToggle) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// Dropdown menu functionality for mobile (bound after header normalization too)
function bindDropdownsForMobile() {
    document.querySelectorAll('.dropdown > a').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdownMenu = this.nextElementSibling;
                const isOpen = dropdownMenu && dropdownMenu.style.display === 'block';
                document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
                if (dropdownMenu && !isOpen) dropdownMenu.style.display = 'block';
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
        // Only intercept if href is an on-page anchor and target exists
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (href.startsWith('#') && target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Features slider navigation
const featuresSlider = document.querySelector('.features-slider');
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

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Standardize header across pages
    standardizeHeader();

    // Rewrite any absolute /website/* paths to work on GitHub Pages (project subpath)
    (function rewriteAbsoluteWebsitePaths(){
        const path = location.pathname.replace(/\\/g, '/');
        const idx = path.indexOf('/website/');
        const repoPrefix = idx > 0 ? path.slice(0, idx) : '';
        // If running from repo subpath (GitHub Pages), prefix with repo path.
        // If running with site root at /website (local dev from the website folder), strip the /website/ prefix.

        const fixAttr = (el, attr) => {
            const val = el.getAttribute(attr);
            if (val && val.startsWith('/website/')) {
                if (repoPrefix) {
                    el.setAttribute(attr, repoPrefix + val);
                } else {
                    el.setAttribute(attr, val.replace('/website/', ''));
                }
            }
        };
        document.querySelectorAll('a[href^="/website/"]').forEach(a => fixAttr(a, 'href'));
        document.querySelectorAll('img[src^="/website/"]').forEach(img => fixAttr(img, 'src'));
        document.querySelectorAll('link[rel="stylesheet"][href^="/website/"]').forEach(l => fixAttr(l, 'href'));
        document.querySelectorAll('script[src^="/website/"]').forEach(s => fixAttr(s, 'src'));
    })();

    // Slider initialization
    updateSlider(); // Initialize slider position
    startAutoplay();
    
    // Pause autoplay on hover
    if (featuresSlider) {
        featuresSlider.addEventListener('mouseenter', stopAutoplay);
        featuresSlider.addEventListener('mouseleave', startAutoplay);
    }

    // Header scroll effect
    const header = document.querySelector('.header');

    if (header) {
        function updateHeaderScroll() {
            const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollTop > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }

        window.addEventListener('scroll', updateHeaderScroll, { passive: true });
        // Also check on page load in case user refreshes while scrolled
        updateHeaderScroll();
    }

    // Set initial pricing to yearly
    if (pricingToggle) {
        pricingToggle.checked = true;
        pricingToggle.dispatchEvent(new Event('change'));
    }

    // Show analytics banner after a delay
    setTimeout(showAnalyticsBanner, 2000);

    // Initialize floating Contact Sales widget on every page
    initFloatingContactWidget();

    // Initialize modern FAQ accordion (contact page)
    initModernFAQAccordion();

    // Ensure unified FAQ exists on pages missing it
    ensureFaqSection();

    // Initialize classic FAQ (for injected or existing .faq-item)
    initClassicFAQ();

    // Re-bind nav interactions after potential header replacement
    initNavigationBindings();
});

// Testimonial slider (simple auto-scroll)
const testimonialSlider = document.querySelector('.testimonial-slider');
let scrollAmount = 0;

function autoScroll() {
    if (testimonialSlider) {
        scrollAmount += 1;
        if (scrollAmount >= testimonialSlider.scrollWidth - testimonialSlider.clientWidth) {
            scrollAmount = 0;
        }
        testimonialSlider.scrollLeft = scrollAmount;
    }
}

setInterval(autoScroll, 50);

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

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ===============================
function initClassicFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h4, .faq-question');
        if (question) {
            question.addEventListener('click', function() {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                    }
                });
                // Toggle current FAQ item
                item.classList.toggle('open');
            });
        }
    });
}

// Pricing card animations on scroll
const pricingCards = document.querySelectorAll('.pricing-card');

function animatePricingCards() {
    pricingCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (cardTop < windowHeight - 100) {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}

// Run animations on scroll
window.addEventListener('scroll', animatePricingCards);
window.addEventListener('load', animatePricingCards);

// Preload critical resources
function preloadCriticalResources() {
    // Preload hero images
    const criticalImages = [
        // Add critical image paths here if needed
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadCriticalResources();

// ===============================
// Floating Contact Sales Widget
// ===============================
function initFloatingContactWidget() {
        // Avoid duplicate injection
        if (document.getElementById('tp-floating-contact')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'tp-floating-contact';
        wrapper.innerHTML = `
            <button class="floating-contact-btn" aria-haspopup="dialog" aria-controls="tp-contact-dialog" aria-label="Contact Sales">
                <i class="fas fa-comments"></i>
                <span>Contact Sales</span>
            </button>
            <div class="floating-overlay" data-close="contact"></div>
            <div class="floating-dialog" id="tp-contact-dialog" role="dialog" aria-modal="true" aria-labelledby="tp-contact-title" aria-hidden="true">
                <div class="floating-dialog-header">
                    <h3 id="tp-contact-title">Talk to Sales</h3>
                    <button class="floating-close" aria-label="Close dialog">&times;</button>
                </div>
                <form class="floating-form" id="tp-contact-form" novalidate>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="tp-first-name">First name *</label>
                            <input id="tp-first-name" name="firstName" type="text" required />
                        </div>
                        <div class="form-group">
                            <label for="tp-last-name">Last name *</label>
                            <input id="tp-last-name" name="lastName" type="text" required />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tp-email">Work email *</label>
                            <input id="tp-email" name="email" type="email" required />
                        </div>
                        <div class="form-group">
                            <label for="tp-phone">Phone *</label>
                            <input id="tp-phone" name="phone" type="tel" required />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tp-employees">No. of employees *</label>
                            <select id="tp-employees" name="employees" required>
                                <option value="">Select</option>
                                <option>1-10</option>
                                <option>11-50</option>
                                <option>51-200</option>
                                <option>201-1000</option>
                                <option>1000+</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="tp-country">Country *</label>
                            <select id="tp-country" name="country" required>
                                <option value="">Select country</option>
                                <option>United States</option>
                                <option>Canada</option>
                                <option>United Kingdom</option>
                                <option>India</option>
                                <option>Australia</option>
                                <option>Germany</option>
                                <option>France</option>
                                <option>Singapore</option>
                                <option>United Arab Emirates</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="tp-message">Message *</label>
                            <textarea id="tp-message" name="message" rows="4" required placeholder="How can we help?"></textarea>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary floating-submit">Send</button>
                    <p class="floating-legal">By submitting, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
                </form>
            </div>
        `;

        document.body.appendChild(wrapper);

        const btn = wrapper.querySelector('.floating-contact-btn');
        const dialog = wrapper.querySelector('.floating-dialog');
        const overlay = wrapper.querySelector('.floating-overlay');
        const closeBtn = wrapper.querySelector('.floating-close');
        const form = wrapper.querySelector('#tp-contact-form');

        function openDialog() {
                dialog.setAttribute('aria-hidden', 'false');
                document.body.classList.add('no-scroll');
                overlay.classList.add('show');
                dialog.classList.add('show');
                // focus first field
                const first = dialog.querySelector('input, select, textarea');
                if (first) first.focus();
        }

        function closeDialog() {
                dialog.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('no-scroll');
                overlay.classList.remove('show');
                dialog.classList.remove('show');
                btn.focus();
        }

        btn.addEventListener('click', openDialog);
        closeBtn.addEventListener('click', closeDialog);
        overlay.addEventListener('click', closeDialog);
        document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && dialog.classList.contains('show')) closeDialog();
        });

        form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Basic validation
                const required = form.querySelectorAll('[required]');
                let valid = true;
                required.forEach(el => {
                        if (!el.value || (el.type === 'email' && !validateEmail(el.value))) {
                                el.classList.add('field-error');
                                valid = false;
                        } else {
                                el.classList.remove('field-error');
                        }
                });
                if (!valid) return;

                // Simulated submit; integrate with backend later
                console.log('Contact Sales submission:', Object.fromEntries(new FormData(form).entries()));
                form.reset();
                closeDialog();
                showToast('Thanks! Our sales team will reach out shortly.');
        });
}

function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'success-message';
        toast.innerHTML = `<span>✅</span> <span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
}

// ===============================
// Modern FAQ Accordion (Contact)
// ===============================
function initModernFAQAccordion() {
        const items = document.querySelectorAll('.faq-accordion-item');
        if (!items.length) return;
        items.forEach(item => {
                const trigger = item.querySelector('.faq-accordion-trigger');
                const content = item.querySelector('.faq-accordion-content');
                if (!trigger || !content) return;
                trigger.addEventListener('click', () => {
                        const expanded = trigger.getAttribute('aria-expanded') === 'true';
                        // close others
                        document.querySelectorAll('.faq-accordion-trigger[aria-expanded="true"]').forEach(t => {
                                t.setAttribute('aria-expanded', 'false');
                                const c = t.parentElement.querySelector('.faq-accordion-content');
                                if (c) c.style.maxHeight = null;
                        });
                        trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                        content.style.maxHeight = expanded ? null : content.scrollHeight + 'px';
                });
        });
}

// ===============================
// Inject unified FAQ if missing
// ===============================
function ensureFaqSection() {
    if (document.querySelector('.faq-section, .faq-section-modern, .faq-accordion')) return;
        const main = document.querySelector('main') || document.body;
        const section = document.createElement('section');
        section.className = 'faq-section';
        section.innerHTML = `
            <div class="container">
                <div class="faq">
                    <h2>Frequently Asked Questions</h2>
                    <div class="faq-item">
                        <div class="faq-question">How fast can I get started?<span class="faq-toggle">+</span></div>
                        <div class="faq-answer">You can create an account and explore the platform in minutes. Setup assistance is available during onboarding.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">Do you offer integrations?<span class="faq-toggle">+</span></div>
                        <div class="faq-answer">Yes, we support job boards, email/calendar, collaboration tools and more. Custom APIs and webhooks are available on request.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">Is my data secure?<span class="faq-toggle">+</span></div>
                        <div class="faq-answer">We adhere to strict security standards with encryption, access controls, and compliance best practices.</div>
                    </div>
                </div>
            </div>`;
        main.appendChild(section);
}

// ===============================
// Header normalization to match contact page across site
// ===============================
function standardizeHeader() {
        const header = document.querySelector('header.header');
        if (!header) return;

    const isInPages = /\/website\/pages\//.test(location.pathname.replace(/\\/g, '/'));
    const logoPath = isInPages ? '../img/l.png' : 'img/l.png';
    const link = (p) => isInPages ? p : `pages/${p}`;
    const logoHref = isInPages ? '../index.html' : 'index.html';

        header.innerHTML = `
            <div class="container">
                <div class="logo">
                    <a href="${logoHref}"><img src="${logoPath}" alt="TalentPrism Logo" style="height:70px;width:auto"></a>
                </div>
                <nav class="nav">
                    <ul>
                        <li class="dropdown">
                            <a href="#features">Features <span class="dropdown-arrow">▼</span></a>
                            <ul class="dropdown-menu">
                                <li><a href="${link('candidate-sourcing.html')}"><i class="fas fa-user-plus"></i><div class="dropdown-item-content"><strong>Candidate Sourcing</strong><span>Find top talent from multiple sources</span></div></a></li>
                                <li><a href="${link('ai-candidate-enrichment.html')}"><i class="fas fa-user"></i><div class="dropdown-item-content"><strong>AI Candidate Enrichment</strong><span>Enhance profiles with AI insights</span></div></a></li>
                                <li><a href="${link('analytics.html')}"><i class="fas fa-chart-bar"></i><div class="dropdown-item-content"><strong>Analytics & Reports</strong><span>Data-driven insights</span></div></a></li>
                                <li><a href="${link('support.html')}"><i class="fas fa-headset"></i><div class="dropdown-item-content"><strong>Support & Assistance</strong><span>24/7 expert help</span></div></a></li>
                                <li><a href="${link('applicant-tracking.html')}"><i class="fas fa-users"></i><div class="dropdown-item-content"><strong>Applicant Tracking</strong><span>Streamline your pipeline</span></div></a></li>
                                <li><a href="${link('ai-recommendations.html')}"><i class="fas fa-wand-magic-sparkles"></i><div class="dropdown-item-content"><strong>AI Recommendations</strong><span>Smart matching</span></div></a></li>
                                <li><a href="${link('branded-career.html')}"><i class="fas fa-award"></i><div class="dropdown-item-content"><strong>Branded Career Page</strong><span>Showcase your brand</span></div></a></li>
                                <li><a href="${link('security.html')}"><i class="fas fa-lock"></i><div class="dropdown-item-content"><strong>Security</strong><span>Enterprise-grade protection</span></div></a></li>
                                <li><a href="${link('recruitment-crm.html')}"><i class="fas fa-th-large"></i><div class="dropdown-item-content"><strong>Recruitment CRM</strong><span>Manage relationships</span></div></a></li>
                                <li><a href="${link('collaboration.html')}"><i class="fas fa-handshake"></i><div class="dropdown-item-content"><strong>Collaboration</strong><span>Team coordination</span></div></a></li>
                                <li><a href="${link('data-privacy.html')}"><i class="fas fa-user-lock"></i><div class="dropdown-item-content"><strong>Data Privacy</strong><span>GDPR compliant</span></div></a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="#solutions">Solutions <span class="dropdown-arrow">▼</span></a>
                            <ul class="dropdown-menu dropdown-menu-solutions">
                                <li><a href="${link('freelance-recruiters.html')}"><i class="fas fa-user-tie"></i><div class="dropdown-item-content"><strong>Freelance Recruiters</strong><span>Tools for independents</span></div></a></li>
                                <li><a href="${link('staffing-agencies.html')}"><i class="fas fa-building"></i><div class="dropdown-item-content"><strong>Staffing Agencies</strong><span>End-to-end platform</span></div></a></li>
                                <li><a href="${link('executive-search.html')}"><i class="fas fa-crown"></i><div class="dropdown-item-content"><strong>Executive Search</strong><span>Elite talent</span></div></a></li>
                                <li><a href="${link('recruitment-agencies.html')}"><i class="fas fa-users-cog"></i><div class="dropdown-item-content"><strong>Recruitment Agencies</strong><span>Scale operations</span></div></a></li>
                            </ul>
                        </li>
                        <li><a href="${isInPages ? 'integration.html' : 'pages/integration.html'}">Integrations</a></li>
                        <li><a href="${isInPages ? 'pricing.html' : 'pages/pricing.html'}">Pricing</a></li>
                        <li><a href="${isInPages ? 'contact.html' : 'pages/contact.html'}">Contact</a></li>
                    </ul>
                </nav>
                <div class="header-ctas">
                    <a href="${isInPages ? 'bookdemo.html' : 'pages/bookdemo.html'}" class="btn btn-outline">Book a demo</a>
                    <a href="${isInPages ? 'signin.html' : 'pages/signin.html'}" class="btn btn-primary">Start free trial</a>
                </div>
                <button class="mobile-menu-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
            </div>`;
}

function initNavigationBindings() {
        const nav = document.querySelector('.nav');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle && nav) {
                mobileMenuToggle.addEventListener('click', function() {
                        nav.classList.toggle('active');
                        this.classList.toggle('active');
                });
        }
        bindDropdownsForMobile();
        document.querySelectorAll('.nav a').forEach(link => {
                link.addEventListener('click', function() {
                        if (nav && mobileMenuToggle) {
                                nav.classList.remove('active');
                                mobileMenuToggle.classList.remove('active');
                        }
                });
        });
}