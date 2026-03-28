// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const profile3dCard = document.getElementById('profile3dCard');

// Card Click Flip Control
if (profile3dCard) {
    let isFlipped = false;
    
    // Click to flip
    profile3dCard.addEventListener('click', () => {
        if (!isFlipped) {
            profile3dCard.classList.add('card-flipped');
            isFlipped = true;
        } else {
            profile3dCard.classList.remove('card-flipped');
            isFlipped = false;
        }
    });
    
    // Hover effect - subtle movement only
    profile3dCard.addEventListener('mouseenter', () => {
        profile3dCard.classList.add('card-hover');
    });
    
    profile3dCard.addEventListener('mouseleave', () => {
        profile3dCard.classList.remove('card-hover');
    });
}

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add active class to main element
            entry.target.classList.add('active');
            
            // Handle section titles
            const sectionTitle = entry.target.querySelector('.section-title');
            if (sectionTitle) {
                setTimeout(() => {
                    sectionTitle.classList.add('active');
                }, 200);
            }
            
            // Handle stagger items with delay
            const staggerItems = entry.target.querySelectorAll('.stagger-item');
            staggerItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('active');
                }, index * 100); // 100ms delay between each item
            });
            
            // Handle waterfall items with longer delay for cascade effect
            const waterfallItems = entry.target.querySelectorAll('.waterfall-item');
            waterfallItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('active');
                }, index * 200); // 200ms delay between each item for waterfall
            });
            
            // Handle flip cards with sequential animation
            const flipCards = entry.target.querySelectorAll('.flip-card');
            flipCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('active');
                }, index * 150); // 150ms delay between each card flip
            });
        }
    });
}, observerOptions);

// Observe all animated sections
document.addEventListener('DOMContentLoaded', () => {
    // Observe main sections
    const animatedSections = document.querySelectorAll('.fade-up, .fade-in, .slide-left, .slide-right, .scale-up, .rotate-in');
    animatedSections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe individual animated elements
    const waterfallItems = document.querySelectorAll('.waterfall-item');
    const flipCards = document.querySelectorAll('.flip-card');
    const sectionTitles = document.querySelectorAll('.section-title');
    
    // Add to observer if they are standalone (not inside observed sections)
    [...waterfallItems, ...flipCards, ...sectionTitles].forEach(element => {
        const parentSection = element.closest('.fade-up, .fade-in, .slide-left, .slide-right, .scale-up, .rotate-in');
        if (!parentSection) {
            observer.observe(element);
        }
    });
    
    // Initialize progress bars animation
    initProgressBars();
});

// Progress bars animation
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 300);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Mobile Navigation Toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (!navbar) {
        return;
    }
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting
function highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// Skills progress bar animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });
}

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Mohon lengkapi semua field!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Format email tidak valid!', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
        contactForm.reset();
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        default:
            notification.style.background = '#3498db';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Scroll to top button
function createScrollToTopButton() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Projects filter functionality
function initProjectFilter() {
    const projects = document.querySelectorAll('.project-card');
    
    // Add filter buttons if needed (for future enhancement)
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projects.forEach(project => {
                if (filter === 'all' || project.classList.contains(filter)) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Theme toggle functionality (for future enhancement)
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
        }
        
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            
            // Save theme preference
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark-theme');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }
}

// Lazy loading for images (for future enhancement)
function initLazyLoading() {
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

// Parallax effect for hero section
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createScrollToTopButton();
    initProjectFilter();
    initThemeToggle();
    initLazyLoading();
    
    // Add smooth reveal animation to elements
    const animateElements = document.querySelectorAll('.skill-item, .project-card, .stat');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
});

// Handle page load animations
window.addEventListener('load', () => {
    // Remove loading screen if exists
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
    
    // Start typing animation for hero title
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Smooth page transitions
function initPageTransitions() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize page transitions
initPageTransitions();

// Add custom cursor effect (optional)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(52, 152, 219, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
        display: none;
    `;
    
    document.body.appendChild(cursor);
    
    // Show cursor only on desktop
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Scale cursor on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursor.style.background = 'rgba(52, 152, 219, 0.3)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = 'rgba(52, 152, 219, 0.5)';
            });
        });
    }
}

// Initialize custom cursor
initCustomCursor();

// Performance optimization: Debounce scroll events
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
const debouncedScrollHandler = debounce(() => {
    highlightActiveSection();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Photo Background Hero Interactivity
document.addEventListener('DOMContentLoaded', () => {
    // Simple scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator-simple');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Parallax effect for background image
    const backgroundImage = document.querySelector('.background-image');
    if (backgroundImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            backgroundImage.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Add entrance animation delay for better UX
    const heroContentOverlay = document.querySelector('.hero-content-overlay');
    if (heroContentOverlay) {
        setTimeout(() => {
            heroContentOverlay.style.opacity = '1';
            heroContentOverlay.style.transform = 'translateY(0)';
        }, 300);
    }
});

// ===== 3D HERO EFFECTS =====

// Typing Animation
const typingTexts = [
    "Information Systems Student",
    "Web Developer",
    "Frontend Enthusiast", 
    "Tech Explorer",
    "Problem Solver"
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeWriter() {
    if (!typingElement) return;
    
    const currentText = typingTexts[currentTextIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
            setTimeout(typeWriter, 500);
        } else {
            setTimeout(typeWriter, 50);
        }
    } else {
        typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeWriter, 2000);
        } else {
            setTimeout(typeWriter, 100);
        }
    }
}

// Start typing animation
setTimeout(typeWriter, 1000);

// 3D Card Effects - Mouse Follow
const mouseFollower = document.getElementById('mouseFollower');

if (profile3dCard) {
    // Mouse follow effect - only for hover movement
    profile3dCard.addEventListener('mousemove', (e) => {
        const rect = profile3dCard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const rotateX = (e.clientY - centerY) / 15; // Reduced sensitivity
        const rotateY = (centerX - e.clientX) / 15;
        
        profile3dCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    profile3dCard.addEventListener('mouseleave', () => {
        profile3dCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// Mouse Follower Effect
document.addEventListener('mousemove', (e) => {
    if (mouseFollower) {
        mouseFollower.style.left = e.clientX + 'px';
        mouseFollower.style.top = e.clientY + 'px';
    }
});

// Parallax Background Movement
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // Move geometric shapes
    const geoShapes = document.querySelectorAll('.floating-geometry > div');
    geoShapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 50;
        const y = (mouseY - 0.5) * speed * 50;
        shape.style.transform = `translate(${x}px, ${y}px) rotateX(${y * 0.1}deg) rotateY(${x * 0.1}deg)`;
    });
    
    // Move tech icons
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach((icon, index) => {
        const speed = (index % 3 + 1) * 0.3;
        const x = (mouseX - 0.5) * speed * 30;
        const y = (mouseY - 0.5) * speed * 30;
        icon.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Scroll-based Parallax
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-3d');
    
    if (heroSection) {
        const rate = scrolled * -0.5;
        const parallaxBg = document.querySelector('.parallax-background');
        if (parallaxBg) {
            parallaxBg.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    }
});

// 3D Button Hover Effects
const buttons3d = document.querySelectorAll('.btn-3d');
buttons3d.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-8px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0px)';
    });
});

// Pixel Action Buttons Animation - Minecraft Style
const pixelActionBtns = document.querySelectorAll('.pixel-action-btn');
pixelActionBtns.forEach((btn, index) => {
    // Simple minecraft click sound effect (visual)
    btn.addEventListener('click', (e) => {
        // Simple scale effect
        btn.style.transform = 'translateY(0) scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'translateY(-1px) scale(1)';
        }, 100);
    });
    
    // Simple hover effects
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-1px)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
    
    // Initial simple animation
    setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0) scale(1)';
    }, 1200 + (index * 100));
});

// Floating Animation for Geometric Shapes
function animateGeometry() {
    const geoShapes = document.querySelectorAll('.floating-geometry > div');
    geoShapes.forEach((shape, index) => {
        const speed = 2000 + (index * 500);
        const range = 20 + (index * 10);
        
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * range;
            const randomY = (Math.random() - 0.5) * range;
            const randomRotate = Math.random() * 360;
            
            shape.style.transform += ` translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
        }, speed);
    });
}

// Tech Icons Float Animation
function animateTechIcons() {
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach((icon, index) => {
        const delay = index * 200;
        const duration = 3000 + (index * 500);
        
        setTimeout(() => {
            icon.style.animation = `techFloat ${duration}ms ease-in-out infinite`;
        }, delay);
    });
}

// Initialize animations when page loads
window.addEventListener('load', () => {
    animateGeometry();
    animateTechIcons();
    
    // Add loaded class for animations
    document.body.classList.add('loaded');
});

// Intersection Observer for 3D Hero
const hero3dObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

const hero3dSection = document.querySelector('.hero-3d');
if (hero3dSection) {
    hero3dObserver.observe(hero3dSection);
}
