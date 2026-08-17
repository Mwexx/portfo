// ===== DIGITAL BOOK PAGE MANAGER =====
class DigitalBookManager {
    constructor() {
        this.totalPages = 11;
        this.currentPage = 1;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.showPage(1);
        this.playOpeningAnimation();
    }
    
    initializeElements() {
        this.pages = document.querySelectorAll('.book-page');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.pageNumbers = document.querySelectorAll('.page-number');
        this.currentPageDisplay = document.querySelector('.current-page');
        this.bookPages = document.querySelector('.book-pages');
        this.openBookBtn = document.querySelector('.btn-open-book');
        this.cvDownloadBtn = document.getElementById('cv-download');
        this.form = document.getElementById('inquiry-form');
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Page number buttons
        this.pageNumbers.forEach(btn => {
            btn.addEventListener('click', () => {
                const pageNum = parseInt(btn.dataset.page);
                this.goToPage(pageNum);
            });
        });
        
        // Open book button (cover page)
        if (this.openBookBtn) {
            this.openBookBtn.addEventListener('click', () => this.nextPage());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch/Swipe navigation
        this.bookPages.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
        this.bookPages.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
        
        // Mouse click navigation (sides of book)
        this.bookPages.addEventListener('click', (e) => this.handlePageClick(e));
        
        // CV Download
        if (this.cvDownloadBtn) {
            this.cvDownloadBtn.addEventListener('click', () => this.downloadCV());
        }
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }
    
    showPage(pageNum) {
        if (pageNum < 1 || pageNum > this.totalPages) return;
        
        // Update previous page state
        this.pages.forEach((page, index) => {
            const pgNum = index + 1;
            page.classList.remove('active', 'prev');
            
            if (pgNum === pageNum) {
                page.classList.add('active');
            } else if (pgNum < pageNum) {
                page.classList.add('prev');
            }
        });
        
        // Update page counter
        this.currentPageDisplay.textContent = String(pageNum).padStart(2, '0');
        
        // Update page number buttons
        this.pageNumbers.forEach(btn => {
            if (parseInt(btn.dataset.page) === pageNum) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update navigation button states
        this.prevBtn.disabled = pageNum === 1;
        this.nextBtn.disabled = pageNum === this.totalPages;
        
        this.currentPage = pageNum;
    }
    
    playPageFlip() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Slight animation delay for smooth effect
        setTimeout(() => {
            this.isAnimating = false;
        }, 700);
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.playPageFlip();
            this.showPage(this.currentPage + 1);
        }
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.playPageFlip();
            this.showPage(this.currentPage - 1);
        }
    }
    
    goToPage(pageNum) {
        if (pageNum !== this.currentPage) {
            this.playPageFlip();
            this.showPage(pageNum);
        }
    }
    
    handleKeyboard(event) {
        if (this.isAnimating) return;
        
        if (event.key === 'ArrowRight') {
            this.nextPage();
        } else if (event.key === 'ArrowLeft') {
            this.previousPage();
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        if (this.isAnimating) return;
        
        this.touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        // Swipe left = next page
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextPage();
            } else {
                this.previousPage();
            }
        }
    }
    
    handlePageClick(e) {
        if (this.isAnimating) return;
        
        const rect = this.bookPages.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const midpoint = rect.width / 2;
        
        // Right half = next page, left half = previous page
        if (clickX > midpoint) {
            this.nextPage();
        } else if (clickX < midpoint) {
            this.previousPage();
        }
    }
    
    playOpeningAnimation() {
        // Cover page entrance animation
        const coverPage = this.pages[0];
        coverPage.style.animation = 'none';
        setTimeout(() => {
            coverPage.classList.add('active');
        }, 100);
    }
    
    downloadCV() {
        const originalLabel = this.cvDownloadBtn.innerHTML;
        this.cvDownloadBtn.disabled = true;
        this.cvDownloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing PDF';
        
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
            writeBody('Joyep - A clean productivity platform designed to help users stay organized and move through tasks with less friction.', contentWidth, { bold: true });
            writeBody('Finance Tracker - An intuitive dashboard for monitoring expenses, tracking budgets, and visualizing spending patterns clearly.', contentWidth, { bold: true });
            writeBody('Muse Cosmetics Kenya - A modern storefront experience that supports product discovery, a polished brand feel, and smooth customer interaction.', contentWidth, { bold: true });
            writeDivider();
            
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
            this.cvDownloadBtn.disabled = false;
            this.cvDownloadBtn.innerHTML = originalLabel;
        }
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Validation
        if (!name.trim() || !email.trim() || !message.trim()) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!this.validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Send via WhatsApp
        const phone = '254104081145';
        const waMessage =
            `Hello, my name is ${encodeURIComponent(name)}.%0A` +
            `Email: ${encodeURIComponent(email)}%0A` +
            `Message: ${encodeURIComponent(message)}`;
        const waUrl = `https://wa.me/${phone}?text=${waMessage}`;
        
        window.open(waUrl, '_blank');
        this.form.reset();
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
}

// ===== INITIALIZE ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    new DigitalBookManager();
});