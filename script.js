// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');
const cvDownloadBtn = document.getElementById('cv-download');
const cvSheet = document.getElementById('cv-sheet');
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

// Download the CV as a PDF
if (cvDownloadBtn && cvSheet) {
    cvDownloadBtn.addEventListener('click', async () => {
        const originalLabel = cvDownloadBtn.innerHTML;

        cvDownloadBtn.disabled = true;
        cvDownloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing PDF';

        try {
            const jsPdfNamespace = window.jspdf;
            const JsPdfCtor = jsPdfNamespace && jsPdfNamespace.jsPDF;

            if (!JsPdfCtor) {
                window.print();
                return;
            }

            const doc = new JsPdfCtor({ unit: 'mm', format: 'a4', orientation: 'portrait' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 16;
            const contentWidth = pageWidth - margin * 2;
            const lineHeight = 6;
            const sectionGap = 4;
            const leftColumnWidth = 63;
            const rightColumnWidth = contentWidth - leftColumnWidth - 8;
            let cursorY = 18;

            const ensurePageSpace = (requiredHeight) => {
                if (cursorY + requiredHeight > pageHeight - margin) {
                    doc.addPage();
                    cursorY = margin + 2;
                }
            };

            const writeHeading = (text) => {
                ensurePageSpace(14);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(18);
                doc.setTextColor(15, 23, 42);
                doc.text(text, margin, cursorY);
                cursorY += 7;
            };

            const writeSubheading = (text) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(26, 188, 156);
                doc.text(text.toUpperCase(), margin, cursorY);
                cursorY += 5;
            };

            const writeBody = (text, width = contentWidth, options = {}) => {
                doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
                doc.setFontSize(options.size || 10);
                doc.setTextColor(options.color ? options.color[0] : 51, options.color ? options.color[1] : 65, options.color ? options.color[2] : 85);
                const lines = doc.splitTextToSize(text, width);
                ensurePageSpace(lines.length * lineHeight + 2);
                doc.text(lines, options.x || margin, cursorY);
                cursorY += lines.length * lineHeight;
            };

            const writeDivider = () => {
                ensurePageSpace(4);
                doc.setDrawColor(219, 234, 254);
                doc.setLineWidth(0.4);
                doc.line(margin, cursorY, pageWidth - margin, cursorY);
                cursorY += 6;
            };

            writeSubheading('Client-ready resume');
            writeHeading('Steven Mwendwa');
            writeBody('Tech & Digital Solutions Specialist', contentWidth, { bold: true, size: 12, color: [52, 152, 219] });
            writeBody('Email: stevenmwexx@gmail.com   |   Phone: +254 104 081 145   |   Nakuru, Kenya', contentWidth, { size: 9.5 });
            writeBody('Open to freelance and collaboration opportunities', contentWidth, { bold: true, size: 10 });
            writeDivider();

            const renderTwoColumnBlock = (title, leftLines, rightLines) => {
                const leftText = doc.splitTextToSize(leftLines.join(' '), leftColumnWidth);
                const rightText = doc.splitTextToSize(rightLines.join(' '), rightColumnWidth);
                const blockHeight = Math.max(leftText.length, rightText.length) * lineHeight + 10;
                ensurePageSpace(blockHeight);

                const startY = cursorY;

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.setTextColor(15, 23, 42);
                doc.text(title, margin, cursorY);
                cursorY += 6;

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(26, 188, 156);
                doc.text('Highlights', margin, cursorY);
                doc.text('Details', margin + leftColumnWidth + 8, cursorY);
                cursorY += 4;

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9.5);
                doc.setTextColor(51, 65, 85);
                doc.text(leftText, margin, cursorY);
                doc.text(rightText, margin + leftColumnWidth + 8, cursorY);
                cursorY = startY + blockHeight;
                cursorY += 2;
            };

            writeSubheading('Professional summary');
            writeBody(
                'Tech-focused creative specialist with hands-on experience building responsive websites, improving digital workflows, and turning ideas into polished online experiences. I combine clean front-end development, practical automation thinking, and client-friendly communication to deliver work that is easy to trust, easy to use, and easy to scale.',
                contentWidth
            );
            writeDivider();

            writeSubheading('Core strengths');
            writeBody('Web Development, Automation, Database Management, Digital Marketing, UI / UX Thinking, Problem Solving', contentWidth);

            writeSubheading('Tools and platforms');
            writeBody('React, Node.js, MongoDB, Next.js, Python, Excel / Google Sheets, Git, HTML, CSS, JavaScript, Chart.js', contentWidth);

            writeSubheading('Selected project experience');
            renderTwoColumnBlock(
                'Joyep',
                ['Web app', 'Productivity'],
                ['A clean productivity platform designed to help users stay organized and move through tasks with less friction.']
            );
            renderTwoColumnBlock(
                'Finance Tracker',
                ['Finance', 'Personal management'],
                ['An intuitive dashboard for monitoring expenses, tracking budgets, and visualizing spending patterns clearly.']
            );
            renderTwoColumnBlock(
                'Muse Cosmetics Kenya',
                ['E-commerce', 'Beauty'],
                ['A modern storefront experience that supports product discovery, a polished brand feel, and smooth customer interaction.']
            );

            writeSubheading('Education');
            writeBody('Bachelor of Science in Computer Science', contentWidth, { bold: true });
            writeBody('University of Embu, Kenya', contentWidth);

            writeSubheading('Certifications');
            writeBody('Google Data Analytics Professional Certificate', contentWidth);
            writeBody('Microsoft Azure Fundamentals (AZ-900)', contentWidth);
            writeBody('HubSpot Content Marketing Certification', contentWidth);

            writeSubheading('What clients get');
            writeBody('Strong attention to detail, fast communication, reliable delivery, and a focus on solutions that look professional and work well across devices.', contentWidth);

            doc.save('Steven_Mwendwa_CV.pdf');
        } catch (error) {
            console.error('CV PDF generation failed:', error);
            window.print();
        } finally {
            cvDownloadBtn.disabled = false;
            cvDownloadBtn.innerHTML = originalLabel;
        }
    });
}

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

// Form submission handling
function setupForm() {
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Basic validation
            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                alert('Please fill in all fields');
                return;
            }

            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Build WhatsApp message
            const phone = '254104081145';
            const waMessage =
                `Hello, my name is ${encodeURIComponent(name)}.%0A` +
                `Email: ${encodeURIComponent(email)}%0A` +
                `Message: ${encodeURIComponent(message)}`;
            const waUrl = `https://wa.me/${phone}?text=${waMessage}`;

            // Open WhatsApp chat in new tab
            window.open(waUrl, '_blank');

            // Optionally reset form
            form.reset();
        });
    }
}

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