// SalesforceConsultants.io - Main JavaScript

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available
                            showNotification('New version available! Refresh to update.', 'info');
                        }
                    });
                });
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Universal Search System
let searchData = [];
let searchModal = null;
let searchInput = null;
let searchResults = null;
let currentSearchIndex = -1;

// Initialize search system
function initializeSearch() {
    // Create search modal
    createSearchModal();
    
    // Add click handlers to search icons
    const searchIcons = document.querySelectorAll('.search-icon');
    searchIcons.forEach(icon => {
        icon.addEventListener('click', openSearchModal);
    });
    
    // Add keyboard shortcut (Ctrl/Cmd + K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearchModal();
        }
    });
    
    // Load search data
    loadSearchData();
}

// Create search modal
function createSearchModal() {
    const modalHTML = `
        <div id="searchModal" class="search-modal" style="display: none;">
            <div class="search-overlay"></div>
            <div class="search-container">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <svg class="search-icon-svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input type="text" id="searchInput" placeholder="Search for Salesforce implementation, services, expertise..." autocomplete="off">
                        <button class="search-close" onclick="closeSearchModal()">×</button>
                    </div>
                </div>
                <div class="search-results" id="searchResults">
                    <div class="search-placeholder">
                        <p>Type to search across all content...</p>
                        <div class="search-shortcuts">
                            <span>⌘K to open search</span>
                            <span>↑↓ to navigate</span>
                            <span>Enter to select</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    searchModal = document.getElementById('searchModal');
    searchInput = document.getElementById('searchInput');
    searchResults = document.getElementById('searchResults');
    
    // Add event listeners
    searchInput.addEventListener('input', debounce(performSearch, 300));
    searchInput.addEventListener('keydown', handleSearchKeydown);
    
    // Close modal when clicking overlay
    searchModal.querySelector('.search-overlay').addEventListener('click', closeSearchModal);
}

// Open search modal
function openSearchModal() {
    if (searchModal) {
        searchModal.style.display = 'block';
        searchInput.focus();
        searchInput.select();
        
        // Add body scroll lock
        document.body.style.overflow = 'hidden';
        
        // Show placeholder
        searchResults.innerHTML = `
            <div class="search-placeholder">
                <p>Type to search across all content...</p>
                <div class="search-shortcuts">
                    <span>⌘K to open search</span>
                    <span>↑↓ to navigate</span>
                    <span>Enter to select</span>
                </div>
            </div>
        `;
    }
}

// Close search modal
function closeSearchModal() {
    if (searchModal) {
        searchModal.style.display = 'none';
        searchInput.value = '';
        currentSearchIndex = -1;
        
        // Remove body scroll lock
        document.body.style.overflow = '';
    }
}

// Handle search keyboard navigation
function handleSearchKeydown(e) {
    const results = searchResults.querySelectorAll('.search-result-item');
    
    switch(e.key) {
        case 'Escape':
            closeSearchModal();
            break;
        case 'ArrowDown':
            e.preventDefault();
            currentSearchIndex = Math.min(currentSearchIndex + 1, results.length - 1);
            updateSearchSelection(results);
            break;
        case 'ArrowUp':
            e.preventDefault();
            currentSearchIndex = Math.max(currentSearchIndex - 1, -1);
            updateSearchSelection(results);
            break;
        case 'Enter':
            e.preventDefault();
            if (currentSearchIndex >= 0 && results[currentSearchIndex]) {
                results[currentSearchIndex].click();
            }
            break;
    }
}

// Update search selection
function updateSearchSelection(results) {
    results.forEach((item, index) => {
        item.classList.toggle('selected', index === currentSearchIndex);
    });
}

// Load search data from all pages
function loadSearchData() {
    searchData = [
        // Home page content
        {
            title: 'Salesforce Implementation Services',
            content: 'Comprehensive Salesforce implementation and adoption services for businesses and nonprofits',
            url: 'index.html',
            category: 'Services',
            tags: ['implementation', 'adoption', 'salesforce']
        },
        {
            title: 'Custom Salesforce Development',
            content: 'Custom Salesforce development solutions tailored to your specific business needs',
            url: 'index.html#services',
            category: 'Services',
            tags: ['custom', 'development', 'salesforce']
        },
        {
            title: 'Salesforce Training & Certification',
            content: 'Salesforce training programs and certification preparation for your team',
            url: 'index.html#services',
            category: 'Services',
            tags: ['training', 'certification', 'salesforce']
        },
        {
            title: 'Salesforce Integrations',
            content: 'Seamless Salesforce integrations with your existing systems and applications',
            url: 'index.html#services',
            category: 'Services',
            tags: ['integrations', 'salesforce', 'systems']
        },
        {
            title: 'Salesforce Automation',
            content: 'Advanced Salesforce automation solutions to streamline your business processes',
            url: 'index.html#services',
            category: 'Services',
            tags: ['automation', 'salesforce', 'processes']
        },
        {
            title: 'Salesforce Migrations',
            content: 'Expert Salesforce migration services to upgrade and optimize your platform',
            url: 'index.html#services',
            category: 'Services',
            tags: ['migration', 'salesforce', 'upgrade']
        },
        
        // Services page content
        {
            title: 'Salesforce Implementation & Adoption',
            content: 'Complete Salesforce implementation and adoption services with proven methodologies',
            url: 'services.html',
            category: 'Services',
            tags: ['implementation', 'adoption', 'methodologies']
        },
        {
            title: 'Custom Salesforce Development',
            content: 'Custom Salesforce development with advanced features and integrations',
            url: 'services.html',
            category: 'Services',
            tags: ['custom', 'development', 'features']
        },
        {
            title: 'Salesforce Training Programs',
            content: 'Comprehensive Salesforce training programs for administrators and users',
            url: 'services.html',
            category: 'Services',
            tags: ['training', 'programs', 'administrators']
        },
        {
            title: 'Salesforce System Integration',
            content: 'Seamless Salesforce system integration with third-party applications',
            url: 'services.html',
            category: 'Services',
            tags: ['integration', 'third-party', 'applications']
        },
        {
            title: 'Salesforce AI & Automation',
            content: 'Advanced Salesforce AI and automation solutions for business efficiency',
            url: 'services.html',
            category: 'Services',
            tags: ['ai', 'automation', 'efficiency']
        },
        {
            title: 'Salesforce Migration Services',
            content: 'Expert Salesforce migration services for platform upgrades and optimization',
            url: 'services.html',
            category: 'Services',
            tags: ['migration', 'upgrades', 'optimization']
        },
        
        // Success Stories content
        {
            title: 'LA Chamber of Commerce Success Story',
            content: 'How we transformed LA Chamber with comprehensive Salesforce solutions and training',
            url: 'success-stories.html',
            category: 'Success Stories',
            tags: ['chamber', 'commerce', 'training', 'success']
        },
        {
            title: 'Nonprofit Salesforce Implementation',
            content: 'Nonprofit Salesforce implementation that increased donor retention by 35%',
            url: 'success-stories.html',
            category: 'Success Stories',
            tags: ['nonprofit', 'donor', 'retention', 'implementation']
        },
        
        // Expertise content
        {
            title: 'Salesforce for Nonprofits',
            content: 'Specialized Salesforce solutions for nonprofit organizations and NPSP',
            url: 'expertise.html',
            category: 'Expertise',
            tags: ['nonprofit', 'npsp', 'organizations']
        },
        {
            title: 'Salesforce for Businesses',
            content: 'Comprehensive Salesforce solutions for businesses of all sizes',
            url: 'expertise.html',
            category: 'Expertise',
            tags: ['businesses', 'solutions', 'enterprise']
        },
        {
            title: 'Salesforce Certifications',
            content: '15+ Salesforce certifications across all major Salesforce products',
            url: 'expertise.html',
            category: 'Expertise',
            tags: ['certifications', 'salesforce', 'products']
        },
        
        // Contact content
        {
            title: 'Contact Salesforce Consultants',
            content: 'Get in touch for free Salesforce consultation and assessment',
            url: 'contact.html',
            category: 'Contact',
            tags: ['contact', 'consultation', 'assessment']
        },
        
        // Implementation Recovery content
        {
            title: 'Salesforce Implementation Recovery',
            content: 'Expert Salesforce implementation recovery services for failed or stalled projects',
            url: 'services/implementation-recovery.html',
            category: 'Services',
            tags: ['recovery', 'failed', 'stalled', 'projects']
        }
    ];
}

// Perform search
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length < 2) {
        searchResults.innerHTML = `
            <div class="search-placeholder">
                <p>Type to search across all content...</p>
                <div class="search-shortcuts">
                    <span>⌘K to open search</span>
                    <span>↑↓ to navigate</span>
                    <span>Enter to select</span>
                </div>
            </div>
        `;
        return;
    }
    
    const results = searchData.filter(item => {
        const searchText = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
        return searchText.includes(query);
    });
    
    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <p>No results found for "${query}"</p>
                <p>Try different keywords or check spelling</p>
            </div>
        `;
        return;
    }
    
    // Group results by category
    const groupedResults = results.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});
    
    let resultsHTML = '';
    
    Object.entries(groupedResults).forEach(([category, items]) => {
        resultsHTML += `
            <div class="search-category">
                <h3>${category}</h3>
                <div class="search-category-results">
        `;
        
        items.forEach(item => {
            const highlightedTitle = highlightText(item.title, query);
            const highlightedContent = highlightText(item.content, query);
            
            resultsHTML += `
                <a href="${item.url}" class="search-result-item" onclick="closeSearchModal()">
                    <div class="search-result-title">${highlightedTitle}</div>
                    <div class="search-result-content">${highlightedContent}</div>
                    <div class="search-result-url">${item.url}</div>
                </a>
            `;
        });
        
        resultsHTML += `
                </div>
            </div>
        `;
    });
    
    searchResults.innerHTML = resultsHTML;
    currentSearchIndex = -1;
}

// Highlight search terms in text
function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.nav-dropdown');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu && mobileMenuBtn) {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    }
}

// Share dropdown toggle
function toggleShareDropdown() {
    const shareMenu = document.getElementById('shareMenu');
    if (shareMenu) {
        shareMenu.classList.toggle('active');
    }
}

// Copy to clipboard function
function copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        // Show success notification
        showNotification('Link copied to clipboard!', 'success');
        // Close dropdown
        toggleShareDropdown();
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy link', 'error');
    });
}

// Close share dropdown when clicking outside
document.addEventListener('click', function(event) {
    const shareDropdown = document.querySelector('.share-dropdown');
    const shareMenu = document.getElementById('shareMenu');
    
    if (shareDropdown && shareMenu && !shareDropdown.contains(event.target)) {
        shareMenu.classList.remove('active');
    }
});

// Read more toggle function
function toggleReadMore() {
    const expandedContent = document.getElementById('expandedContent');
    const readMoreBtn = document.querySelector('.read-more-btn');
    
    if (expandedContent && readMoreBtn) {
        if (expandedContent.style.display === 'none') {
            expandedContent.style.display = 'block';
            readMoreBtn.textContent = 'Read Less';
        } else {
            expandedContent.style.display = 'none';
            readMoreBtn.textContent = 'Read More';
        }
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search system
    initializeSearch();
    
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Smooth scrolling for emergency button
    const emergencyBtn = document.querySelector('.btn-emergency');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                e.preventDefault();
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = 'var(--shadow-light)';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .feature-card, .cert-category, .testimonial');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual Formspree handling)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you! Your Salesforce assessment request has been sent. We\'ll contact you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 2000);
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(style);

// Stats Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('%') ? '%' : '+');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent.replace('+', '') + (counter.textContent.includes('%') ? '' : '+');
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Mobile Menu Responsive Behavior
function handleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    // Add mobile menu styles if not already present
    if (!document.getElementById('mobile-menu-styles')) {
        const mobileStyles = `
            @media (max-width: 768px) {
                #nav-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--white);
                    flex-direction: column;
                    padding: 1rem;
                    box-shadow: var(--shadow-medium);
                    border-top: 1px solid var(--light-gray);
                }
                
                #nav-menu.active {
                    display: flex;
                }
                
                #nav-menu li {
                    margin: 0.5rem 0;
                }
                
                #nav-menu a {
                    display: block;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--light-gray);
                }
                
                #nav-menu a:last-child {
                    border-bottom: none;
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'mobile-menu-styles';
        styleElement.textContent = mobileStyles;
        document.head.appendChild(styleElement);
    }
}

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', handleMobileMenu);

// Form Validation
function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--accent-red)';
            isValid = false;
        } else {
            field.style.borderColor = 'var(--light-gray)';
        }
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.style.borderColor = 'var(--accent-red)';
            isValid = false;
        }
    }
    
    return isValid;
}

// Add form validation to submit
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
    }
});

// Lazy Loading for Images (when added)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Performance Optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Header scroll effect (already implemented above)
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Console welcome message
console.log(`
        Welcome to SalesforceConsultants.io!
    
Transform your Salesforce investment with our certified consultants.
15+ certifications, proven results, mission-driven approach.
    
Get started: https://salesforceconsultants.io
        Contact: marketing@devpipeline.com
Phone: (385) 309-0807
`);

// Export functions for global access (if needed)
window.toggleMobileMenu = toggleMobileMenu;
window.showNotification = showNotification;

 