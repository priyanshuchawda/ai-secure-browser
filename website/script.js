// AI Secure Browser - Landing Page Script

document.addEventListener('DOMContentLoaded', () => {
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
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 26, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 26, 0.8)';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in animation to sections
    document.querySelectorAll('.feature-card, .pipeline-step, .tech-card, .roadmap-item').forEach(el => {
        el.classList.add('fade-in');
        fadeInObserver.observe(el);
    });

    // Browser mockup cycling text
    const scanTexts = [
        'Analyzing URL...',
        'Checking domain reputation...',
        'Fetching page content...',
        'Running AI analysis...'
    ];

    const scanResults = [
        '✓ Site verified as SAFE',
        '✓ No threats detected',
        '✓ Trusted source confirmed',
        '✓ Download approved'
    ];

    let textIndex = 0;
    const scanTextEl = document.querySelector('.scan-text');
    const scanResultEl = document.querySelector('.scan-result');

    if (scanTextEl && scanResultEl) {
        setInterval(() => {
            textIndex = (textIndex + 1) % scanTexts.length;

            scanTextEl.style.opacity = '0';
            scanResultEl.style.opacity = '0';

            setTimeout(() => {
                scanTextEl.textContent = scanTexts[textIndex];
                scanResultEl.textContent = scanResults[textIndex];
                scanTextEl.style.opacity = '1';
            }, 300);

            setTimeout(() => {
                scanResultEl.style.opacity = '1';
            }, 2300);
        }, 4000);
    }

    // Add hover effects to feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');

        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    console.log('AI Secure Browser landing page loaded');
});

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .scan-text, .scan-result {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);
