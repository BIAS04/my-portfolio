// Contact page functionality
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupFormValidation();
        this.setupFormSubmission();
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
        }

        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Name validation
        if (fieldName === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long.';
            }
        }

        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long.';
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }
        // Replace any references to the old resume filename with the new one
        (() => {
            const oldName = 'Alex_Chen_Resume.html';
            const newName = 'Mayank_Singh_Parihar_Resume.pdf';

            // Update input/textarea values and data attributes
            const fields = this.form.querySelectorAll('input, textarea');
            fields.forEach(el => {
                if (el.value === oldName) el.value = newName;
                if (el.dataset && el.dataset.filename === oldName) el.dataset.filename = newName;
            });

            // Update anchor href attributes inside the form
            const anchors = this.form.querySelectorAll('a[href]');
            anchors.forEach(a => {
                const hrefAttr = a.getAttribute('href') || '';
                if (hrefAttr.includes(oldName)) {
                    a.setAttribute('href', hrefAttr.replace(oldName, newName));
                }
            });

            // Replace plain text occurrences inside the form
            const allEls = this.form.querySelectorAll('*');
            allEls.forEach(el => {
                if (el.childNodes && el.childNodes.length) {
                    el.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.includes(oldName)) {
                            node.nodeValue = node.nodeValue.replace(new RegExp(oldName, 'g'), newName);
                        }
                    });
                }
            });
        })();
        this.setSubmitState(true);

        try {
            // Simulate form submission
            await this.submitForm();
            this.showSuccess();
        } catch (error) {
            this.showError(null, 'Failed to send message. Please try again.');
        } finally {
            this.setSubmitState(false);
        }
    }

    async submitForm() {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (in real app, this would be an actual API call)
                Math.random() > 0.1 ? resolve() : reject(new Error('Network error'));
            }, 2000);
        });
    }

    setSubmitState(isSubmitting) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        if (isSubmitting) {
            this.submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            this.submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    showSuccess() {
        const successDiv = document.getElementById('form-success');
        if (successDiv) {
            successDiv.style.display = 'block';
            this.form.style.display = 'none';
            
            // Scroll to success message
            successDiv.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showError(field, message) {
        if (field) {
            const errorElement = document.getElementById(`${field.name}-error`);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
            field.classList.add('error');
        } else {
            // Show general error notification
            this.showNotification(message, 'error');
        }
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        field.classList.remove('error');
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            company: 'Company',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

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
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});