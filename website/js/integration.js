// Integration Page JavaScript
console.log('Integration page script loaded');

// Smooth scrolling for navigation cards
document.querySelectorAll('.integration-nav-card').forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
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

// Observe integration sections for animations
document.querySelectorAll('.integration-section').forEach(section => {
    observer.observe(section);
});

// Observe integration items for staggered animations
document.querySelectorAll('.integration-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// Observe API resources for animations
document.querySelectorAll('.api-resource').forEach((resource, index) => {
    resource.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(resource);
});

// Observe benefit cards for animations
document.querySelectorAll('.benefit-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Add scroll-based active states for navigation
const navCards = document.querySelectorAll('.integration-nav-card');
const sections = document.querySelectorAll('.integration-section');

function updateActiveNav() {
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navCards.forEach(card => card.classList.remove('active'));
            navCards[index].classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Add hover effects for integration items
document.querySelectorAll('.integration-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation for images
document.querySelectorAll('.integration-item img, .feature-visual img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });

    // Set initial opacity to 0 for fade-in effect
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
});

// Initialize animations on page load
window.addEventListener('load', function() {
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.integration-section').forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('animate-in');
            }
        });
    }, 100);
});

// Add click tracking for integration items (for analytics)
document.querySelectorAll('.integration-item').forEach(item => {
    item.addEventListener('click', function() {
        const platformName = this.querySelector('h4').textContent;
        console.log(`Integration clicked: ${platformName}`);
        // Add analytics tracking here if needed
    });
});

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button (if needed in future)
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

// Initialize scroll to top button
createScrollToTopButton();

// Search and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('integration-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const integrationSections = document.querySelectorAll('.integration-section');
    const integrationItems = document.querySelectorAll('.integration-item');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterIntegrations(searchTerm, getActiveFilter());
        });
    }

    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            filterIntegrations(searchInput ? searchInput.value.toLowerCase().trim() : '', filter);
        });
    });

    function getActiveFilter() {
        const activeButton = document.querySelector('.filter-btn.active');
        return activeButton ? activeButton.getAttribute('data-filter') : 'all';
    }

    function filterIntegrations(searchTerm, filter) {
        integrationSections.forEach(section => {
            const sectionId = section.id;
            const items = section.querySelectorAll('.integration-item');
            let visibleItems = 0;

            items.forEach(item => {
                const itemName = item.querySelector('h4').textContent.toLowerCase();
                const itemDesc = item.querySelector('p').textContent.toLowerCase();
                const matchesSearch = !searchTerm || itemName.includes(searchTerm) || itemDesc.includes(searchTerm);
                const matchesFilter = filter === 'all' || sectionId === filter;

                if (matchesSearch && matchesFilter) {
                    item.style.display = 'block';
                    visibleItems++;
                } else {
                    item.style.display = 'none';
                }
            });

            // Show/hide section based on visible items
            if (visibleItems > 0) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }
});