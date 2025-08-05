// Form validation and authentication logic
class LoginApp {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.submitButton = document.getElementById('submitButton');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.modal = document.getElementById('modalOverlay');
        this.modalClose = document.getElementById('modalClose');
        this.modalButton = document.getElementById('modalButton');
        
        this.isLoading = false;
        this.validationErrors = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordToggle();
        this.setupModalHandlers();
        this.setupKeyboardNavigation();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        
        // Prevent form submission with Enter if there are validation errors
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && Object.keys(this.validationErrors).length > 0) {
                e.preventDefault();
                this.validateForm();
            }
        });
    }

    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const isPassword = this.passwordInput.type === 'password';
            
            this.passwordInput.type = isPassword ? 'text' : 'password';
            
            const eyeOpen = this.passwordToggle.querySelector('.eye-open');
            const eyeClosed = this.passwordToggle.querySelector('.eye-closed');
            
            if (isPassword) {
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
                this.passwordToggle.setAttribute('aria-label', 'Hide password');
            } else {
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
                this.passwordToggle.setAttribute('aria-label', 'Show password');
            }
        });
    }

    setupModalHandlers() {
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modalButton.addEventListener('click', () => this.closeModal());
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display !== 'none') {
                this.closeModal();
            }
        });
        
        // Close modal by clicking overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    setupKeyboardNavigation() {
        // Enhance keyboard navigation
        const focusableElements = this.form.querySelectorAll(
            'input, button, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach((element, index) => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
                    if (index < focusableElements.length - 1) {
                        e.preventDefault();
                        focusableElements[index + 1].focus();
                    }
                } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
                    if (index > 0) {
                        e.preventDefault();
                        focusableElements[index - 1].focus();
                    }
                }
            });
        });
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailError = document.getElementById('email-error');
        
        if (!email) {
            this.setError('email', 'Email address is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setError('email', 'Please enter a valid email address');
            return false;
        }
        
        // Additional business logic validation
        if (email.length > 254) {
            this.setError('email', 'Email address is too long');
            return false;
        }
        
        this.clearError('email');
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.setError('password', 'Password is required');
            return false;
        }
        
        if (password.length < 8) {
            this.setError('password', 'Password must be at least 8 characters long');
            return false;
        }
        
        // Check for at least one number, one lowercase and one uppercase letter
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
            this.setError('password', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
            return false;
        }
        
        this.clearError('password');
        return true;
    }

    validateForm() {
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        return isEmailValid && isPasswordValid;
    }

    setError(field, message) {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field);
        
        this.validationErrors[field] = message;
        errorElement.textContent = message;
        inputElement.setAttribute('aria-invalid', 'true');
        inputElement.classList.add('error');
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field);
        
        delete this.validationErrors[field];
        errorElement.textContent = '';
        inputElement.setAttribute('aria-invalid', 'false');
        inputElement.classList.remove('error');
    }

    setLoadingState(isLoading) {
        this.isLoading = isLoading;
        const buttonText = this.submitButton.querySelector('.button-text');
        const loadingSpinner = this.submitButton.querySelector('.loading-spinner');
        
        if (isLoading) {
            this.submitButton.disabled = true;
            buttonText.style.display = 'none';
            loadingSpinner.style.display = 'block';
            this.submitButton.setAttribute('aria-label', 'Signing in, please wait');
        } else {
            this.submitButton.disabled = false;
            buttonText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            this.submitButton.setAttribute('aria-label', 'Sign in');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        // Validate form before submission
        if (!this.validateForm()) {
            // Focus on first error field
            const firstErrorField = Object.keys(this.validationErrors)[0];
            if (firstErrorField) {
                document.getElementById(firstErrorField).focus();
            }
            return;
        }
        
        const formData = new FormData(this.form);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };
        
        this.setLoadingState(true);
        
        try {
            const result = await this.authenticateUser(credentials);
            
            if (result.success) {
                this.showModal('success', 'Sign In Successful!', 
                    `Welcome back! You have successfully signed in as ${credentials.email}.`);
                
                // Store user session if remember me is checked
                if (credentials.remember) {
                    this.storeUserSession(result.user);
                }
                
                // Simulate redirect after success
                setTimeout(() => {
                    console.log('Redirecting to dashboard...');
                    // window.location.href = '/dashboard';
                }, 2000);
                
            } else {
                this.showModal('error', 'Sign In Failed', 
                    result.message || 'Invalid email or password. Please try again.');
            }
            
        } catch (error) {
            console.error('Authentication error:', error);
            this.showModal('error', 'Connection Error', 
                'Unable to connect to the server. Please check your internet connection and try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async authenticateUser(credentials) {
        // Mock API call - replace with actual authentication logic
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate different scenarios for demo
                const { email, password } = credentials;
                
                // Demo accounts for testing
                const validAccounts = [
                    { email: 'demo@evilmartians.com', password: 'Password123!' },
                    { email: 'test@example.com', password: 'TestPass123' },
                    { email: 'admin@company.com', password: 'Admin12345' }
                ];
                
                const validAccount = validAccounts.find(
                    account => account.email === email && account.password === password
                );
                
                if (validAccount) {
                    resolve({
                        success: true,
                        user: {
                            id: Date.now(),
                            email: email,
                            name: email.split('@')[0],
                            lastLogin: new Date().toISOString()
                        },
                        token: this.generateMockToken()
                    });
                } else {
                    // Simulate random failures for demo
                    const scenarios = [
                        { success: false, message: 'Invalid email or password.' },
                        { success: false, message: 'Account temporarily locked. Please try again later.' },
                        { success: false, message: 'Account not found. Please check your email address.' }
                    ];
                    
                    resolve(scenarios[Math.floor(Math.random() * scenarios.length)]);
                }
            }, 1500); // Simulate network delay
        });
    }

    generateMockToken() {
        return btoa(JSON.stringify({
            timestamp: Date.now(),
            random: Math.random().toString(36).substr(2, 9)
        }));
    }

    storeUserSession(user) {
        try {
            localStorage.setItem('userSession', JSON.stringify({
                user,
                timestamp: Date.now(),
                expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
            }));
        } catch (error) {
            console.warn('Failed to store user session:', error);
        }
    }

    showModal(type, title, message) {
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalIcon = document.getElementById('modalIcon');
        
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        modalIcon.className = `modal-icon ${type}`;
        modalIcon.textContent = type === 'success' ? '✓' : '✕';
        
        this.modal.style.display = 'flex';
        
        // Focus management for accessibility
        setTimeout(() => {
            this.modalClose.focus();
        }, 100);
        
        // Auto-close success modals after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.closeModal();
            }, 5000);
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        
        // Return focus to the submit button
        this.submitButton.focus();
    }
}

// Utility functions for enhanced UX
class UXEnhancements {
    static addRippleEffect(button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }

    static addFormFieldAnimations() {
        const inputs = document.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (this.value) {
                    this.parentElement.classList.add('filled');
                } else {
                    this.parentElement.classList.remove('filled');
                }
            });
        });
    }

    static addSmoothScrolling() {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    static setupPerformanceOptimizations() {
        // Lazy load non-critical resources
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            });
            
            document.querySelectorAll('.login-card').forEach(el => {
                observer.observe(el);
            });
        }
    }
}

// Security utilities
class SecurityUtils {
    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static validateCSRF() {
        // In a real application, validate CSRF tokens here
        return true;
    }

    static hashPassword(password) {
        // In a real application, use proper password hashing
        // This is just for demo purposes
        return btoa(password);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new LoginApp();
    
    // Add UX enhancements
    UXEnhancements.addRippleEffect(document.querySelector('.submit-button'));
    UXEnhancements.addFormFieldAnimations();
    UXEnhancements.addSmoothScrolling();
    UXEnhancements.setupPerformanceOptimizations();
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .input-container.focused .form-input {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .login-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .login-card.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Show the login card
    setTimeout(() => {
        document.querySelector('.login-card').classList.add('visible');
    }, 100);
    
    console.log('🚀 Evil Martians Login App initialized successfully!');
    console.log('💡 Demo accounts:');
    console.log('   📧 demo@evilmartians.com / Password: Password123!');
    console.log('   📧 test@example.com / Password: TestPass123');
    console.log('   📧 admin@company.com / Password: Admin12345');
});
