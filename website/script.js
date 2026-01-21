// AI Secure Browser - Landing Page Script

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Smooth scroll for anchor links
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

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.padding = '8px 32px';
            navbar.style.background = 'rgba(10, 10, 26, 0.85)';
            navbar.style.width = 'calc(100% - 32px)';
        } else {
            navbar.style.padding = '12px 32px';
            navbar.style.background = 'rgba(10, 10, 26, 0.6)';
            navbar.style.width = 'calc(100% - 48px)';
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation classes to elements
    const revealElements = [
        '.bento-item', 
        '.pipeline-step', 
        '.tech-card', 
        '.section-header', 
        '.hero-content > *',
        '.cta-card'
    ];

    revealElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal-on-scroll');
            revealObserver.observe(el);
        });
    });

    // Mockup Text Cycling
    const scanTexts = [
        'Analyzing URL...',
        'Checking SSL...',
        'Fetching Reputation...',
        'Vetting Assets...'
    ];

    let textIndex = 0;
    const scanTextEl = document.querySelector('.scan-text');
    
    if (scanTextEl) {
        setInterval(() => {
            textIndex = (textIndex + 1) % scanTexts.length;
            scanTextEl.style.opacity = '0';
            setTimeout(() => {
                scanTextEl.textContent = scanTexts[textIndex];
                scanTextEl.style.opacity = '1';
            }, 500);
        }, 3000);
    }

    // Add CSS for Reveal Animations
    const style = document.createElement('style');
    style.textContent = `
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Stagger delays for bento items */
        .bento-item:nth-child(1) { transition-delay: 0.1s; }
        .bento-item:nth-child(2) { transition-delay: 0.2s; }
        .bento-item:nth-child(3) { transition-delay: 0.3s; }
        .bento-item:nth-child(4) { transition-delay: 0.4s; }
        .bento-item:nth-child(5) { transition-delay: 0.5s; }
        .bento-item:nth-child(6) { transition-delay: 0.6s; }
        
        /* Stagger for tech cards */
        .tech-card:nth-child(1) { transition-delay: 0.1s; }
        .tech-card:nth-child(2) { transition-delay: 0.2s; }
        .tech-card:nth-child(3) { transition-delay: 0.3s; }
        .tech-card:nth-child(4) { transition-delay: 0.4s; }

        .scan-text { transition: opacity 0.5s ease; }
    `;
    document.head.appendChild(style);

    console.log('AI Secure Browser: Premium Landing Page Initialized');
});
