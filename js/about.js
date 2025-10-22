// About page functionality
class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkillBars();
        this.setupIntersectionObserver();
    }

    setupSkillBars() {
        // Animate skill bars when they come into view
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const animateSkillBar = (skillBar) => {
            const targetWidth = skillBar.getAttribute('data-width');
            skillBar.style.width = targetWidth;
        };

        // Use Intersection Observer to trigger animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    setTimeout(() => {
                        animateSkillBar(skillBar);
                    }, 200);
                    observer.unobserve(skillBar);
                }
            });
        }, {
            threshold: 0.5
        });

        skillBars.forEach(skillBar => {
            observer.observe(skillBar);
        });
    }

    setupIntersectionObserver() {
        // Animate timeline items and other elements
        const animatedElements = document.querySelectorAll('.timeline-item, .cert-item, .stat');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(element);
        });

        // Animate stats counter
        this.animateStats();
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element) => {
            const target = parseInt(element.textContent.replace(/\D/g, ''));
            const suffix = element.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
            }, 40);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        stats.forEach(stat => {
            observer.observe(stat);
        });
    }
}

// Initialize about page functionality
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.about-hero')) {
        new AboutPage();
    }
});