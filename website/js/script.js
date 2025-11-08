// TalentPrism Website Script
console.log('Script loaded successfully');

// Pricing toggle functionality (supports legacy switch and new segmented control)
const pricingToggle = document.getElementById('pricing-toggle'); // legacy
const priceAmounts = document.querySelectorAll('.amount');

function applyBilling(mode) {
    const isYearly = mode === 'yearly';
    priceAmounts.forEach(amount => {
        if (amount.textContent.trim() !== 'Custom') {
            const monthly = parseInt(amount.dataset.monthly);
            const yearly = parseInt(amount.dataset.yearly);
            if (!Number.isNaN(monthly) && !Number.isNaN(yearly)) {
                amount.textContent = isYearly ? `$${yearly}` : `$${monthly}`;
            }
        }
    });
}

// New segmented control
const billingOptions = document.querySelectorAll('.billing-option');
if (billingOptions && billingOptions.length) {
    billingOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.billing === 'yearly' ? 'yearly' : 'monthly';
            // update active state
            billingOptions.forEach(b => {
                const active = b === btn;
                b.classList.toggle('active', active);
                b.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            applyBilling(mode);
        });
    });
}

// Legacy switch support
if (pricingToggle) {
    pricingToggle.addEventListener('change', function() {
        applyBilling(this.checked ? 'yearly' : 'monthly');
    });
}

// Mobile menu toggle (improved: accessibility + scroll lock + resilience after header rewrites)
let mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
let nav = document.querySelector('.nav');

function bindMobileMenuToggle() {
    mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    nav = document.querySelector('.nav');
    if (!mobileMenuToggle || !nav) return;
    // Avoid duplicate listeners
    mobileMenuToggle.__tpBound && mobileMenuToggle.removeEventListener('click', mobileMenuToggle.__tpHandler);
    const handler = function () {
        const isOpen = nav.classList.toggle('active');
        this.classList.toggle('active', isOpen);
        this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('no-scroll', isOpen);
        // Close all open dropdown menus when collapsing
        if (!isOpen) {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
        }
    };
    mobileMenuToggle.addEventListener('click', handler);
    mobileMenuToggle.__tpBound = true;
    mobileMenuToggle.__tpHandler = handler;
}
bindMobileMenuToggle();

// Close mobile menu when clicking on a link (skip dropdown toggles on mobile)
const navLinks = document.querySelectorAll('.nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        const isMobile = (window.innerWidth || document.documentElement.clientWidth) <= 768;
        const isDropdownToggle = this.parentElement && this.parentElement.classList.contains('dropdown');
        if (isMobile && isDropdownToggle) return; // handled by dropdown binder
        if (nav && mobileMenuToggle) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    });
});

// Dropdown menu functionality for mobile (bound after header normalization too)
function bindDropdownsForMobile() {
    document.querySelectorAll('.dropdown > a').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if ((window.innerWidth || document.documentElement.clientWidth) <= 768) {
                e.preventDefault();
                const dropdownMenu = this.nextElementSibling;
                const isOpen = dropdownMenu && (dropdownMenu.style.display === 'grid' || dropdownMenu.style.display === 'block');
                document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
                if (dropdownMenu && !isOpen) {
                    // Use block for complex mega menus to preserve their internal layout; grid for simple lists
                    if (dropdownMenu.classList.contains('solutions-mega') || dropdownMenu.classList.contains('solutions-mega-new')) {
                        dropdownMenu.style.display = 'block';
                    } else {
                        dropdownMenu.style.display = 'grid';
                    }
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

if (sliderDots && sliderDots.length) {
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
}

// Make feature slides clickable to advance
if (featureSlides && featureSlides.length) {
    featureSlides.forEach((slide) => {
        const slideWrap = slide.querySelector('.features-slide-wrap');
        if (slideWrap) {
            slideWrap.addEventListener('click', (e) => {
                e.preventDefault();
                nextSlide();
            });
        }
    });
}

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

    // Fix relative links inside /pages so they don't incorrectly point to pages/*
    (function fixRelativePagesLinks(){
        const path = location.pathname.replace(/\\/g, '/');
        if (!/\/pages\//.test(path)) return; // only adjust when already in /pages/
        document.querySelectorAll('a[href^="pages/"]').forEach(a => {
            const href = a.getAttribute('href');
            if (href) a.setAttribute('href', href.replace(/^pages\//, ''));
        });
    })();

    // Slider initialization (only if we have slides)
    if (totalSlides > 0) {
        updateSlider(); // Initialize slider position
        if (totalSlides > 1) startAutoplay();
    }
    
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

    // Initialize pricing mode based on UI state/content
    (function initBillingMode(){
        // Prefer segmented control state if present
        const activeSeg = document.querySelector('.billing-option.active');
        if (activeSeg) {
            applyBilling(activeSeg.dataset.billing === 'yearly' ? 'yearly' : 'monthly');
            return;
        }
        // Fallback to legacy switch default to yearly for consistency
        if (pricingToggle) {
            pricingToggle.checked = true;
            applyBilling('yearly');
            return;
        }
        // Detect from first amount value
        const first = document.querySelector('.amount');
        if (first) {
            const val = parseInt(first.textContent.replace(/[^0-9]/g, ''));
            const y = parseInt(first.dataset.yearly);
            applyBilling(val === y ? 'yearly' : 'monthly');
        }
    })();

    // Show analytics banner after a delay
    setTimeout(showAnalyticsBanner, 2000);

    // Initialize floating Contact Sales widget on every page
    initFloatingContactWidget();

    // Initialize modern FAQ accordion (contact page)
    initModernFAQAccordion();

    // Ensure unified FAQ exists on pages missing it
    ensureFaqSection();

    // Ensure shared conversion sections exist (feature grid, testimonials, CTA)
    ensureSharedSections();

    // Initialize classic FAQ (for injected or existing .faq-item)
    initClassicFAQ();

    // Re-bind nav interactions after potential header replacement
    initNavigationBindings();

    // Normalize dropdown/menu state on resize across breakpoints
    window.addEventListener('resize', () => {
        const w = window.innerWidth || document.documentElement.clientWidth;
        if (w > 768) {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = '');
            const navEl = document.querySelector('.nav');
            const toggleEl = document.querySelector('.mobile-menu-toggle');
            if (navEl) navEl.classList.remove('active');
            if (toggleEl) toggleEl.classList.remove('active');
        }
    });
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
    // Close mobile menu with Escape (guard for null elements)
    if (e.key === 'Escape') {
        const navEl = document.querySelector('.nav');
        const toggleEl = document.querySelector('.mobile-menu-toggle');
        if (navEl && navEl.classList.contains('active')) {
            navEl.classList.remove('active');
            if (toggleEl) toggleEl.classList.remove('active');
        }
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
    // Skip FAQ injection on signin page
    if (location.pathname.includes('signin.html')) return;
    
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
// Ensure shared conversion sections exist across pages
// ===============================
function ensureSharedSections() {
    const path = location.pathname.replace(/\\/g, '/');
    if (path.includes('signin.html')) return;

    const main = document.querySelector('main') || document.body;
    if (!main) return;

    const isInPages = /\/pages\//.test(path);
    const linkPrefix = isInPages ? '' : 'pages/';

    const findInsertionPoint = () => document.querySelector('.pre-footer-cta') || document.querySelector('footer') || main.lastElementChild;

    if (!document.querySelector('.feature-4-wrapper')) {
        const featureWrapper = document.createElement('div');
        featureWrapper.className = 'feature-4-wrapper';
        featureWrapper.innerHTML = `
            <div class="feature-4-left">
                <h2>Get started with TalentPrism</h2>
                <p class="features-4-text">Our 14-day free trial allows anyone to explore the platform without commitment, while our team is committed to providing support and guidance throughout the process.</p>
                <a href="${linkPrefix}pricing.html" class="features-learn-more-link white">
                    <span>View All Features</span>
                    <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/627cdcca8bc0d2f4efb2671c_Group%2023.svg" loading="lazy" alt="" class="featured-learn-more-arrow">
                    <div class="features-learn-more-link-line"></div>
                </a>
            </div>
            <div class="pointer-grid">
                <div class="pointer-grid-item">
                    <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/627cdcca8bc0d2b16eb26720_Group%2017.svg" loading="lazy" alt="" class="pointer-icon">
                    <div>Data migration from your existing recruitment software</div>
                </div>
                <div class="pointer-grid-item">
                    <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/627cdcca8bc0d2a495b26718_Group%2013.svg" loading="lazy" alt="" class="pointer-icon">
                    <div>Training for a fast and smooth onboarding</div>
                </div>
                <div class="pointer-grid-item">
                    <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/627cdcca8bc0d2f319b26742_Group%2018.svg" loading="lazy" alt="" class="pointer-icon">
                    <div>Transparent and flexible pricing without lock-in contract</div>
                </div>
                <div class="pointer-grid-item">
                    <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/627cdcca8bc0d20d6db2670e_Group%2019.svg" loading="lazy" width="30" alt="" class="pointer-icon">
                    <div>Highest security protocol as standard (SOC II Type 2)</div>
                </div>
                <div class="pointer-grid-item">
                    <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/627cdcca8bc0d24f2fb26710_Group%2021.svg" loading="lazy" alt="" class="pointer-icon">
                    <div>24 / 5 support via live chat</div>
                </div>
                <div class="pointer-grid-item">
                    <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/627cdcca8bc0d2038fb26714_Group%2022.svg" loading="lazy" alt="" class="pointer-icon">
                    <div>All-in-one platform covering all your recruitment needs</div>
                </div>
            </div>`;

        const insertionTarget = document.querySelector('.testimonials-container') || document.querySelector('.pre-footer-cta') || findInsertionPoint();
        if (insertionTarget && insertionTarget.parentNode) {
            insertionTarget.parentNode.insertBefore(featureWrapper, insertionTarget);
        } else {
            main.appendChild(featureWrapper);
        }
    }

    if (!document.querySelector('.testimonials-container')) {
        const testimonials = document.createElement('div');
        testimonials.className = 'testimonials-container';
        testimonials.innerHTML = `
            <h2>What our customers say</h2>
            <div class="marquee-wrapper">
                <div class="marquee">
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62908f4d3ad8aefb3bc0a243_william-twining-linkedin-1.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-7">Bill Twinning</h5>
                                <div class="_16-px">Talent Resources & Development Director - Charoen Pokphand Group</div>
                            </div>
                        </div>
                        <div class="text-block-13">TalentPrism is the best ATS we worked with. Simplicity, efficiency and the latest technologies combined make it an indispensable tool for any large-scale HR team. Since its adoption, we've seen a huge increase across all our key recruitment metrics. To summarize, it is a must-have.</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/6290898c4fda35f97ab40206_Dina-Demajo.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-6">Dina Demajo</h5>
                                <div class="_16-px">Senior Talent Acquisition - Manpower Group</div>
                            </div>
                        </div>
                        <div class="text-block-6">Manpower has been using TalentPrism and we couldn't be happier as a team with the services this platform has provided. The application is extremely user-friendly and very well equipped with all the useful functions one would require for successful recruitment. The support team is also excellent with very fast response time.</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62908f4d5332b75a567025dc_Achmad-Firdaus-linkedin1.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-7">Ahmed Firdaus</h5>
                                <div class="_16-px">Director - MRI Network, Executive Search Firm</div>
                            </div>
                        </div>
                        <div class="text-block-13">I've been using TalentPrism for the past couple of months and the platform is excellent, user-friendly and it has helped me a lot in my recruitment process, operation and database management. I'm very happy with their great support. Whenever I ask something they come back to me within minutes.</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62908a81e467d8f6893c8e8f_Edmund-Yeo.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5>Edmund Yeo</h5>
                                <div class="_16-px">Human Resources Manager - Oakwood</div>
                            </div>
                        </div>
                        <div class="text-block-12">TalentPrism is a sophisticated, easy-to-use, mobile-friendly, and cloud-based applicant tracking system that helps companies achieve digitalization and seamless integration to LinkedIn and other job boards. The team at TalentPrism is very supportive, helpful, prompt in their replies and we were pleased to see that the support they offer exceeded our expectations.</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62908f4e7cfbad6a2d295f64_Maxime-Ferreira-Photo.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-7">Maxime Ferreira</h5>
                                <div class="_16-px">International Director - JB Hired</div>
                            </div>
                        </div>
                        <div class="text-block-13">TalentPrism has been at the core of our agency's expansion. Using it has greatly improved and simplified our recruitment processes. Incredibly easy and intuitive to use, customizable to a tee, and offers top-tier live support. Our recruiters love it. A must-have for all recruitment agencies. Definitely recommend!</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62c0878274a3663382491a05_testiomonial-ngoc-trinh-tran%20(1).webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-8">Ngoc-Thinh Tran</h5>
                                <div class="_16-px">HR Manager, Talent Sourcing & Acquisition - Suntory PepsiCo Beverage</div>
                            </div>
                        </div>
                        <div class="text-block-14">I am using TalentPrism for talent sourcing and it is the best platform ever. I am so impressed, the TalentPrism team did an excellent job. This is so awesome I am recommending the solution to all recruiters I know.</div>
                    </div>
                </div>
                <div class="marquee">
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62908f4d3ad8aefb3bc0a243_william-twining-linkedin-1.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-7">Bill Twinning</h5>
                                <div class="_16-px">Talent Resources & Development Director - Charoen Pokphand Group</div>
                            </div>
                        </div>
                        <div class="text-block-13">TalentPrism is the best ATS we worked with. Simplicity, efficiency and the latest technologies combined make it an indispensable tool for any large-scale HR team. Since its adoption, we've seen a huge increase across all our key recruitment metrics. To summarize, it is a must-have.</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/6290898c4fda35f97ab40206_Dina-Demajo.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-6">Dina Demajo</h5>
                                <div class="_16-px">Senior Talent Acquisition - Manpower Group</div>
                            </div>
                        </div>
                        <div class="text-block-6">Manpower has been using TalentPrism and we couldn't be happier as a team with the services this platform has provided. The application is extremely user-friendly and very well equipped with all the useful functions one would require for successful recruitment. The support team is also excellent with very fast response time.</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62908f4d5332b75a567025dc_Achmad-Firdaus-linkedin1.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-7">Ahmed Firdaus</h5>
                                <div class="_16-px">Director - MRI Network, Executive Search Firm</div>
                            </div>
                        </div>
                        <div class="text-block-13">I've been using TalentPrism for the past couple of months and the platform is excellent, user-friendly and it has helped me a lot in my recruitment process, operation and database management. I'm very happy with their great support. Whenever I ask something they come back to me within minutes.</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62908a81e467d8f6893c8e8f_Edmund-Yeo.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5>Edmund Yeo</h5>
                                <div class="_16-px">Human Resources Manager - Oakwood</div>
                            </div>
                        </div>
                        <div class="text-block-12">TalentPrism is a sophisticated, easy-to-use, mobile-friendly, and cloud-based applicant tracking system that helps companies achieve digitalization and seamless integration to LinkedIn and other job boards. The team at TalentPrism is very supportive, helpful, prompt in their replies and we were pleased to see that the support they offer exceeded our expectations.</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62908f4e7cfbad6a2d295f64_Maxime-Ferreira-Photo.webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-7">Maxime Ferreira</h5>
                                <div class="_16-px">International Director - JB Hired</div>
                            </div>
                        </div>
                        <div class="text-block-13">TalentPrism has been at the core of our agency's expansion. Using it has greatly improved and simplified our recruitment processes. Incredibly easy and intuitive to use, customizable to a tee, and offers top-tier live support. Our recruiters love it. A must-have for all recruitment agencies. Definitely recommend!</div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-image-and-name">
                            <div class="testimonial-image">
                                <img src="https://cdn.prod.website-files.com/627cdcca8bc0d25e49b26705/62c0878274a3663382491a05_testiomonial-ngoc-trinh-tran%20(1).webp" loading="lazy" alt="" class="image">
                            </div>
                            <div class="testimonial-name-and-designation">
                                <h5 class="heading-8">Ngoc-Thinh Tran</h5>
                                <div class="_16-px">HR Manager, Talent Sourcing & Acquisition - Suntory PepsiCo Beverage</div>
                            </div>
                        </div>
                        <div class="text-block-14">I am using TalentPrism for talent sourcing and it is the best platform ever. I am so impressed, the TalentPrism team did an excellent job. This is so awesome I am recommending the solution to all recruiters I know.</div>
                    </div>
                </div>
            </div>`;

        const testimonialsTarget = document.querySelector('.pre-footer-cta') || findInsertionPoint();
        if (testimonialsTarget && testimonialsTarget.parentNode) {
            testimonialsTarget.parentNode.insertBefore(testimonials, testimonialsTarget);
        } else {
            main.appendChild(testimonials);
        }
    }

    if (!document.querySelector('.pre-footer-cta')) {
        const preFooter = document.createElement('section');
        preFooter.className = 'pre-footer-cta';
        preFooter.innerHTML = `
            <div class="container">
                <div class="cta-content">
                    <h2>Try TalentPrism for free during 14-day with no commitment.</h2>
                    <p>No credit card required • 2 minutes to get started</p>
                    <div class="cta-buttons">
                        <a href="${linkPrefix}signin.html" class="btn btn-primary btn-large">Start Free Trial</a>
                        <a href="${linkPrefix}bookdemo.html" class="btn btn-outline btn-large">Book a Demo</a>
                    </div>
                </div>
            </div>`;

        const footer = document.querySelector('footer.footer');
        if (footer && footer.parentNode) {
            footer.parentNode.insertBefore(preFooter, footer);
        } else {
            main.appendChild(preFooter);
        }
    }
}

// ===============================
// Header normalization to match contact page across site
// ===============================
function standardizeHeader() {
        const header = document.querySelector('header.header');
        if (!header) return;

    // If the page already includes the new mega-menu (solutions-mega or solutions-mega-new) or an AI tab, don't overwrite.
    // This preserves hand-authored headers like on the homepage.
    if (header.querySelector('.solutions-mega') || header.querySelector('.solutions-mega-new') || header.querySelector('a[href*="ai-page.html"]')) {
        return;
    }

    // Detect if current page is under a `pages` directory regardless of repo subpath or whether
    // the site root is the repo root or the `website` folder. This works for:
    // - Local: /.../website/pages/...
    // - GitHub Pages (root set to website/): /<repo>/pages/...
    // - GitHub Pages (root set to repo): /<repo>/website/pages/...
    const isInPages = /\/pages\//.test(location.pathname.replace(/\\/g, '/'));
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
                            <ul class="dropdown-menu solutions-mega">
                                <li class="mega-aside">
                                    <span class="eyebrow">Solutions</span>
                                    <h4>Use Cases</h4>
                                    <p>Choose a workflow that fits your goals. Only green checks. No red crosses.</p>
                                </li>
                                <li class="mega-item">
                                    <a href="${link('high-volume-recruiting.html')}">
                                        <i class="fas fa-layer-group"></i>
                                        <div class="dropdown-item-content">
                                            <strong>High-Volume Recruiting</strong>
                                            <span>Hire at scale with automation</span>
                                        </div>
                                        <span class="menu-check">✓</span>
                                    </a>
                                </li>
                                <li class="mega-item">
                                    <a href="${link('find-job.html')}">
                                        <i class="fas fa-magnifying-glass"></i>
                                        <div class="dropdown-item-content">
                                            <strong>Find Job Applicants</strong>
                                            <span>Boost sourcing across channels</span>
                                        </div>
                                        <span class="menu-check">✓</span>
                                    </a>
                                </li>
                                <li class="mega-item">
                                    <a href="${link('improve-emp.html')}">
                                        <i class="fas fa-award"></i>
                                        <div class="dropdown-item-content">
                                            <strong>Improve Employer Branding</strong>
                                            <span>Showcase culture and careers</span>
                                        </div>
                                        <span class="menu-check">✓</span>
                                    </a>
                                </li>
                                <li class="mega-item">
                                    <a href="${link('enhance-candidate-xp.html')}">
                                        <i class="fas fa-face-smile"></i>
                                        <div class="dropdown-item-content">
                                            <strong>Enhance Candidate Experience</strong>
                                            <span>Fast, friendly, transparent</span>
                                        </div>
                                        <span class="menu-check">✓</span>
                                    </a>
                                </li>
                                <li class="mega-item">
                                    <a href="${link('boost-recruitment.html')}">
                                        <i class="fas fa-bolt"></i>
                                        <div class="dropdown-item-content">
                                            <strong>Boost Recruitment Efficiency</strong>
                                            <span>Shorten time-to-hire</span>
                                        </div>
                                        <span class="menu-check">✓</span>
                                    </a>
                                </li>
                                <li class="mega-item">
                                    <a href="${link('leverage-ai.html')}">
                                        <i class="fas fa-brain"></i>
                                        <div class="dropdown-item-content">
                                            <strong>Leverage AI</strong>
                                            <span>Automate and elevate decisions</span>
                                        </div>
                                        <span class="menu-check">✓</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li><a href="${isInPages ? 'ai-page.html' : 'pages/ai-page.html'}">AI</a></li>
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
    bindMobileMenuToggle();
    bindDropdownsForMobile();
    const navEl = document.querySelector('.nav');
    const toggleEl = document.querySelector('.mobile-menu-toggle');
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', function() {
            const isMobile = (window.innerWidth || document.documentElement.clientWidth) <= 768;
            const isDropdownToggle = this.parentElement && this.parentElement.classList.contains('dropdown');
            if (isMobile && isDropdownToggle) return; // allow dropdown open
            if (navEl && toggleEl) {
                navEl.classList.remove('active');
                toggleEl.classList.remove('active');
                toggleEl.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            }
        });
    });
}

// Demo form functionality
function initDemoForm() {
    const demoForm = document.getElementById('demo-form');
    if (!demoForm) return;

    // Form validation and submission
    demoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const requiredFields = demoForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                isValid = false;
            } else {
                field.style.borderColor = '#10b981';
                field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }
        });

        if (isValid) {
            // Show success message
            const submitBtn = demoForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '✓ Demo Scheduled!';
            submitBtn.style.background = '#10b981';
            submitBtn.disabled = true;

            // Reset form after 3 seconds
            setTimeout(() => {
                demoForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;

                // Reset field styles
                requiredFields.forEach(field => {
                    field.style.borderColor = '#e5e7eb';
                    field.style.boxShadow = 'none';
                });
            }, 3000);

            // Here you would typically send the form data to your backend
            console.log('Demo form submitted successfully!');
        }
    });

    // Real-time validation feedback
    const inputs = demoForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
                this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            } else if (this.value.trim()) {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor !== 'rgb(239, 68, 68)') {
                this.style.borderColor = '#e5e7eb';
                this.style.boxShadow = 'none';
            }
        });
    });
}

// Smooth scroll to demo form
function scrollToDemoForm() {
    const demoFormSection = document.getElementById('demo-form');
    if (demoFormSection) {
        demoFormSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize demo form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDemoForm();

    // Add click handlers for demo CTA buttons
    const demoButtons = document.querySelectorAll('a[href="#demo-form"], a[href="#demo"]');
    demoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToDemoForm();
        });
    });
});

// Solutions mega menu sidebar navigation
document.addEventListener('DOMContentLoaded', function() {
    const solutionsNavItems = document.querySelectorAll('.solutions-nav-item');
    const solutionsPanels = document.querySelectorAll('.solutions-panel');
    
    solutionsNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('data-target');
            
            // Remove active from all nav items
            solutionsNavItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked item
            this.classList.add('active');
            
            // Hide all panels
            solutionsPanels.forEach(panel => panel.classList.remove('active'));
            
            // Show target panel
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
});