// Main JavaScript functionality
class MLPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupLoadingStates();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.hideLoadingSpinner();
            this.initializePage();
        });

        // Window events
        // window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        // window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');
        
        if (!themeToggle) return;

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    setupMobileNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            
            const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    setupLoadingStates() {
        // Show loading spinner for navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Skip for anchor links, external links, and downloads
            if (href.startsWith('#') || 
                href.startsWith('http') || 
                href.startsWith('mailto:') ||
                href.includes('download')) {
                return;
            }

            this.showLoadingSpinner();
        });
    }

    showLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('active');
        }
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('active');
        }
    }

    handleScroll() {
        this.updateNavbarOnScroll();
        this.updateActiveNavLink();
        this.handleScrollAnimations();
    }

    updateNavbarOnScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    handleResize() {
        // Close mobile menu on resize
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (window.innerWidth > 768) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    }

    initializeAnimations() {
        // Add animation classes to elements
        const elementsToAnimate = [
            { selector: '.hero-content', animation: 'fade-in' },
            { selector: '.hero-visual', animation: 'slide-in-right' },
            { selector: '.project-card', animation: 'fade-in' },
            { selector: '.skill-category', animation: 'fade-in' },
            { selector: '.section-title', animation: 'fade-in' }
        ];

        elementsToAnimate.forEach(({ selector, animation }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.classList.add(animation);
                element.style.animationDelay = `${index * 0.1}s`;
            });
        });

        // Trigger initial animation check
        this.handleScrollAnimations();
    }

    initializePage() {
        // Initialize syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }

        // Initialize any page-specific functionality
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'projects':
                this.initializeProjectsPage();
                break;
            case 'about':
                this.initializeAboutPage();
                break;
            case 'contact':
                this.initializeContactPage();
                break;
            default:
                this.initializeHomePage();
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('projects')) return 'projects';
        if (path.includes('about')) return 'about';
        if (path.includes('contact')) return 'contact';
        return 'home';
    }

    initializeHomePage() {
        // Home page specific initialization
        this.setupHeroAnimations();
    }

    initializeProjectsPage() {
        // Projects page will be handled by projects.js
    }

    initializeAboutPage() {
        // About page will be handled by about.js
    }

    initializeContactPage() {
        // Contact page will be handled by contact.js
    }

    setupHeroAnimations() {
        // Add typing effect to hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            this.addTypingEffect(heroTitle);
        }
    }

    addTypingEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Copy to clipboard functionality
    copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            return new Promise((resolve, reject) => {
                document.execCommand('copy') ? resolve() : reject();
                textArea.remove();
            });
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
            color: white;
            padding: var(--space-4) var(--space-6);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform var(--transition-normal);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the portfolio
const portfolio = new MLPortfolio();