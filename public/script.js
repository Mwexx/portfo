const WHATSAPP_NUMBER = "254104081145";
const TOAST_DURATION = 3200;

let toastTimer;

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-link");
    const backToTop = document.getElementById("back-to-top");
    const form = document.getElementById("inquiry-form");

    setupMenu(hamburger, navLinks, navItems);
    setupSmoothScrolling(navLinks, hamburger);
    setupScrollEffects(navbar, backToTop);
    setupActiveNav(navItems);
    setupRevealAnimations();
    setupProgressBars();
    setupContactForm(form);
    setupHeroParallax();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});

function setupMenu(hamburger, navLinks, navItems) {
    if (!hamburger || !navLinks) {
        return;
    }

    hamburger.addEventListener("click", () => {
        const isActive = navLinks.classList.toggle("active");
        hamburger.setAttribute("aria-expanded", String(isActive));
        hamburger.innerHTML = isActive ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });

    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            navLinks.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            navLinks.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

function setupSmoothScrolling(navLinks, hamburger) {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");
            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);
            if (!target) {
                return;
            }

            event.preventDefault();
            const navHeight = document.querySelector(".navbar")?.offsetHeight || 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight + 4;

            window.scrollTo({
                top: targetTop,
                behavior: "smooth"
            });

            if (navLinks && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }

            if (hamburger) {
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
}

function setupScrollEffects(navbar, backToTop) {
    const onScroll = () => {
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 24);
        }

        if (backToTop) {
            backToTop.classList.toggle("show", window.scrollY > 360);
        }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
}

function setupActiveNav(navItems) {
    if (!navItems.length) {
        return;
    }

    const sections = Array.from(document.querySelectorAll("section, header"))
        .filter((section) => section.id);

    const updateActive = () => {
        const navHeight = document.querySelector(".navbar")?.offsetHeight || 0;
        const marker = window.scrollY + navHeight + 20;
        let currentId = "home";

        sections.forEach((section) => {
            if (marker >= section.offsetTop) {
                currentId = section.id;
            }
        });

        navItems.forEach((link) => {
            const href = link.getAttribute("href")?.replace("#", "");
            link.classList.toggle("active", href === currentId);
        });
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
}

function setupRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, io) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach((element) => observer.observe(element));
}

function setupProgressBars() {
    const bars = document.querySelectorAll(".progress-fill");

    if (!bars.length) {
        return;
    }

    const animateBars = () => {
        bars.forEach((bar) => {
            const progress = Number.parseInt(bar.dataset.progress || "0", 10);
            const safeProgress = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0;
            bar.style.width = `${safeProgress}%`;
        });
    };

    if (!("IntersectionObserver" in window)) {
        animateBars();
        return;
    }

    const observer = new IntersectionObserver((entries, io) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            animateBars();
            io.disconnect();
        });
    }, { threshold: 0.4 });

    const learningSection = document.getElementById("learning");
    if (learningSection) {
        observer.observe(learningSection);
    } else {
        animateBars();
    }
}

function setupContactForm(form) {
    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const message = document.getElementById("message")?.value.trim() || "";

        if (!name || !email || !message) {
            showToast("Please complete all fields before sending.", true);
            return;
        }

        if (!validateEmail(email)) {
            showToast("Enter a valid email address.", true);
            return;
        }

        const whatsappText = [
            "Hello Steven, I would like to connect.",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Message: ${message}`
        ].join("\n");

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

        showToast("Opening WhatsApp with your message...");

        setTimeout(() => {
            if (isMobileDevice()) {
                window.location.href = whatsappUrl;
            } else {
                window.open(whatsappUrl, "_blank", "noopener,noreferrer");
            }
            form.reset();
        }, 550);
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.style.background = isError ? "rgba(141, 36, 36, 0.96)" : "rgba(23, 21, 18, 0.95)";

    toast.classList.add("show");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, TOAST_DURATION);
}

function setupHeroParallax() {
    const card = document.querySelector(".hero-portrait");
    if (!card || window.matchMedia("(max-width: 900px)").matches) {
        return;
    }

    card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;

        const rotateX = (-offsetY / rect.height) * 7;
        const rotateY = (offsetX / rect.width) * 7;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}
