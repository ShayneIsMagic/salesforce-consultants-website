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

// Interactive Timeline Functions
function activateStep(stepNumber) {
    // Remove active class from all steps
    const allSteps = document.querySelectorAll('.step-circle');
    allSteps.forEach(step => step.classList.remove('active'));
    
    // Add active class to clicked step
    const activeStep = document.getElementById(`step-${stepNumber}`);
    if (activeStep) {
        activeStep.classList.add('active');
    }
    
    // Hide all content cards
    const allContent = document.querySelectorAll('.content-card');
    allContent.forEach(content => content.style.display = 'none');
    
    // Show the corresponding content card
    const activeContent = document.getElementById(`content-${stepNumber}`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }
}

// Auto-advance timeline on page load
document.addEventListener('DOMContentLoaded', function() {
    // Start with step 1 active
    setTimeout(() => activateStep(1), 1000);
    
    // Auto-advance every 4 seconds
    let currentStep = 1;
    setInterval(() => {
        currentStep = currentStep >= 5 ? 1 : currentStep + 1;
        activateStep(currentStep);
    }, 4000);
});

// Export timeline function
window.activateStep = activateStep; 