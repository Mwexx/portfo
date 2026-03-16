// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');
const progressBars = document.querySelectorAll('.progress');
const form = document.getElementById('inquiry-form');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress bars animation
    initProgressBars();
    
    // Set up form submission
    setupForm();
    
    // Set up smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Set up active navigation links based on scroll position
    setupActiveNav();
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Back to top functionality
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize progress bars with animation
function initProgressBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const learningSection = document.querySelector('.learning');
    if (learningSection) {
        observer.observe(learningSection);
    }
}

// WhatsApp Integration Configuration
const WHATSAPP_NUMBER = '254104081145'; 
const WHATSAPP_MESSAGE_PREFIX = 'New contact form submission:%0A%0A'; // %0A = newline in URL encoding

// Form submission handling with WhatsApp integration
function setupForm() {
    const form = document.getElementById('inquiry-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Format WhatsApp message
            const whatsappMessage = `
Name: ${name}
Email: ${email}
Message: ${message}
            `.trim();
            
            // URL encode the message
            const encodedMessage = WHATSAPP_MESSAGE_PREFIX + encodeURIComponent(whatsappMessage);
            
            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            
            // Show success message before redirecting
            showNotification('Redirecting to WhatsApp to send your message...', 'success');
            
            // Redirect to WhatsApp after a short delay
            setTimeout(() => {
                // For mobile devices, open in same tab (better WhatsApp app detection)
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    window.location.href = whatsappURL;
                } 
                // For desktop, open in new tab
                else {
                    window.open(whatsappURL, '_blank');
                    // Reset form after successful submission
                    form.reset();
                    showNotification('WhatsApp chat opened in new tab! Please send the pre-filled message.', 'success', 5000);
                }
            }, 1500);
        });
    }
}

// Notification system for user feedback
function showNotification(message, type, duration = 3000) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Add CSS for notifications if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                opacity: 1;
                transform: translateY(0);
                transition: all 0.3s ease;
                box-shadow: 0 5px 25px rgba(0,0,0,0.2);
                border-radius: 12px;
                overflow: hidden;
                font-family: 'Poppins', sans-serif;
            }
            .notification-content {
                display: flex;
                align-items: center;
                padding: 15px 25px;
                color: white;
                font-weight: 500;
            }
            .notification.success .notification-content {
                background: linear-gradient(to right, #10b981, #059669);
            }
            .notification.error .notification-content {
                background: linear-gradient(to right, #ef4444, #dc2626);
            }
            .notification i {
                font-size: 1.4rem;
                margin-right: 12px;
            }
            .notification span {
                font-size: 1.05rem;
            }
            @media (max-width: 768px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    width: calc(100% - 40px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Email validation function (keep existing one)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Add click handler for floating WhatsApp button
document.addEventListener('DOMContentLoaded', () => {
    const whatsappBtn = document.getElementById('whatsapp-button');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            // Add tracking or analytics here if needed
            console.log('WhatsApp button clicked');
        });
    }
    
    // Initialize other functionality
    initProgressBars();
    setupForm();
    setupSmoothScrolling();
    setupActiveNav();
});

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Set active navigation link based on scroll position
function setupActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Fade-in animation for sections on scroll
const fadeElements = document.querySelectorAll('.about, .skills, .learning, .projects, .cv-section, .contact');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
    fadeObserver.observe(element);
});

// Initialize progress bars on page load if visible
window.addEventListener('load', () => {
    setTimeout(() => {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 300);
});