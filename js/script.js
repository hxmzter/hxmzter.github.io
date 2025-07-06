// Check if device supports hover (desktop)
const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Session storage for loading screen
const hasVisitedBefore = sessionStorage.getItem('hasVisited');

// Create floating particles
document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = 20 + Math.random() * 10 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Custom Cursor - only on desktop
    if (hasHover) {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');

        if (cursor && cursorFollower) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                setTimeout(() => {
                    cursorFollower.style.left = e.clientX - 10 + 'px';
                    cursorFollower.style.top = e.clientY - 10 + 'px';
                }, 100);
            });

            // Hover Effects Enhancement - only for desktop
            document.querySelectorAll('a, button').forEach(element => {
                element.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'scale(1.5)';
                    cursorFollower.style.transform = 'scale(1.5)';
                });
                
                element.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'scale(1)';
                    cursorFollower.style.transform = 'scale(1)';
                });
            });
        }
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });

        // Prevent mobile menu from closing when clicking inside it
        mobileNav.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Set active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Enhanced Loading Screen - only on first visit of session
    const loader = document.getElementById('loader');
    if (loader) {
        if (!hasVisitedBefore && currentPage === 'index.html') {
            // Show loading screen on first visit
            setTimeout(() => {
                loader.classList.add('hide');
                sessionStorage.setItem('hasVisited', 'true');
            }, 2500);
        } else {
            // Hide loading screen immediately on subsequent visits
            loader.classList.add('hide');
        }
    }

    // Smooth scrolling for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator a');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector('#services');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Scroll Effects
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Form Handling with Formspree
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const button = contactForm.querySelector('.cta-button');
            const originalText = button.textContent;
            
            // Disable button and show loading
            button.disabled = true;
            button.textContent = 'Sending...';
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                    formStatus.classList.add('show');
                    formStatus.style.color = '#10b981';
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Oops! There was a problem sending your message.';
                    formStatus.classList.add('show');
                    formStatus.style.color = '#ef4444';
                }
            } catch (error) {
                formStatus.textContent = 'Oops! There was a problem sending your message.';
                formStatus.classList.add('show');
                formStatus.style.color = '#ef4444';
            } finally {
                button.disabled = false;
                button.textContent = originalText;
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.classList.remove('show');
                }, 5000);
            }
        });
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.glass-card, .service-card, .mission-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});
