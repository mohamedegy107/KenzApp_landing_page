/**
 * Waitlist Functionality
 * Handles email validation, form submission, and user feedback
 */

class WaitlistManager {
    constructor() {
        this.form = null;
        this.emailInput = null;
        this.submitBtn = null;
        this.isSubmitting = false;
        this.apiEndpoint = '/api/waitlist'; // Backend endpoint
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.form = document.getElementById('waitlist-form');
        this.emailInput = document.getElementById('waitlist-email');
        this.submitBtn = document.getElementById('waitlist-submit');

        if (!this.form || !this.emailInput || !this.submitBtn) {
            console.warn('Waitlist form elements not found');
            return;
        }

        // Email input validation
        this.emailInput.addEventListener('input', (e) => this.validateEmail(e.target.value));
        this.emailInput.addEventListener('blur', (e) => this.validateEmail(e.target.value));
        this.emailInput.addEventListener('focus', () => this.clearMessages());

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Accessibility: Enter key support
        this.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isSubmitting) {
                this.handleSubmit(e);
            }
        });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorElement = document.getElementById('email-error');
        
        // Clear previous states
        this.emailInput.classList.remove('error', 'success');
        
        if (!email) {
            this.showFieldError('Please enter your email address');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showFieldError('Please enter a valid email address');
            return false;
        }

        // Valid email
        this.emailInput.classList.add('success');
        this.hideFieldError();
        return true;
    }

    showFieldError(message) {
        this.emailInput.classList.add('error');
        const errorElement = document.getElementById('email-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        // Announce error to screen readers
        this.announceToScreenReader(message);
    }

    hideFieldError() {
        const errorElement = document.getElementById('email-error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    clearMessages() {
        this.hideFieldError();
        this.hideGlobalMessage();
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;

        const email = this.emailInput.value.trim();
        
        // Validate email before submission
        if (!this.validateEmail(email)) {
            return;
        }

        this.setLoadingState(true);
        
        try {
            const response = await this.submitToWaitlist(email);
            
            if (response.success) {
                this.showSuccessMessage(response.message || 'Successfully joined the waitlist!');
                this.resetForm();
                this.trackEvent('waitlist_join_success', { email: email });
            } else {
                throw new Error(response.message || 'Failed to join waitlist');
            }
        } catch (error) {
            console.error('Waitlist submission error:', error);
            this.showErrorMessage(error.message || 'Something went wrong. Please try again.');
            this.trackEvent('waitlist_join_error', { error: error.message });
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitToWaitlist(email) {
        // Try the PHP API endpoint first
        try {
            const response = await fetch('/api/waitlist.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    timestamp: new Date().toISOString(),
                    source: 'landing_page'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            // If PHP endpoint fails (e.g., on GitHub Pages), use demo simulation
            console.info('Using demo mode for GitHub Pages deployment:', error.message);
            
            // Demo simulation for GitHub Pages deployment
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Check for duplicate email simulation
                    const existingEmails = JSON.parse(localStorage.getItem('waitlist_emails') || '[]');
                    
                    if (existingEmails.includes(email)) {
                        resolve({
                            success: true,
                            message: 'You\'re already on the waitlist! We\'ll notify you when Kenz Tasks launches.',
                            alreadyExists: true,
                            waitlistPosition: existingEmails.length
                        });
                        return;
                    }
                    
                    // Simulate successful signup (100% success rate for demo)
                    // Add email to localStorage for demo
                    existingEmails.push(email);
                    localStorage.setItem('waitlist_emails', JSON.stringify(existingEmails));
                    
                    // Store additional metadata
                    const waitlistData = JSON.parse(localStorage.getItem('waitlist_data') || '{}');
                    waitlistData[email] = {
                        timestamp: new Date().toISOString(),
                        source: 'github_pages_demo',
                        position: existingEmails.length
                    };
                    localStorage.setItem('waitlist_data', JSON.stringify(waitlistData));
                    
                    resolve({
                        success: true,
                        message: `🎉 Welcome to the waitlist! You're #${existingEmails.length} in line. We'll notify you when Kenz Tasks launches.`,
                        waitlistPosition: existingEmails.length,
                        timestamp: new Date().toISOString(),
                        demoMode: true
                    });
                }, 800); // Reduced delay for better UX
            });
        }
    }

    setLoadingState(loading) {
        this.isSubmitting = loading;
        
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
            this.submitBtn.setAttribute('aria-busy', 'true');
            this.emailInput.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
            this.submitBtn.setAttribute('aria-busy', 'false');
            this.emailInput.disabled = false;
        }
    }

    showSuccessMessage(message) {
        const successElement = document.getElementById('success-message');
        if (successElement) {
            successElement.textContent = message;
            successElement.classList.add('show');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                successElement.classList.remove('show');
            }, 5000);
        }
        
        this.announceToScreenReader(message);
    }

    showErrorMessage(message) {
        const errorElement = document.getElementById('global-error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorElement.classList.remove('show');
            }, 5000);
        }
        
        this.announceToScreenReader(message);
    }

    hideGlobalMessage() {
        const successElement = document.getElementById('success-message');
        const errorElement = document.getElementById('global-error-message');
        
        if (successElement) successElement.classList.remove('show');
        if (errorElement) errorElement.classList.remove('show');
    }

    resetForm() {
        this.emailInput.value = '';
        this.emailInput.classList.remove('error', 'success');
        this.hideFieldError();
    }

    announceToScreenReader(message) {
        // Create or update live region for screen readers
        let liveRegion = document.getElementById('waitlist-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'waitlist-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = message;
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking - integrate with your analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', data);
        }
        
        console.log('Event tracked:', eventName, data);
    }
}

// Language support for multilingual sites
const WaitlistTranslations = {
    en: {
        title: 'Join the Waitlist',
        subtitle: 'Be the first to know when Kenz Tasks launches!',
        emailPlaceholder: 'Enter your email address',
        submitButton: 'Join Waitlist',
        submitting: 'Joining...',
        successMessage: 'Welcome to the waitlist! We\'ll notify you when Kenz Tasks launches.',
        errorRequired: 'Please enter your email address',
        errorInvalid: 'Please enter a valid email address',
        errorNetwork: 'Network error. Please check your connection and try again.',
        errorGeneric: 'Something went wrong. Please try again.'
    },
    ar: {
        title: 'انضم لقائمة الانتظار',
        subtitle: 'كن أول من يعرف عند إطلاق كنز تاسكس!',
        emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
        submitButton: 'انضم لقائمة الانتظار',
        submitting: 'جاري الانضمام...',
        successMessage: 'مرحباً بك في قائمة الانتظار! سنخبرك عند إطلاق كنز تاسكس.',
        errorRequired: 'يرجى إدخال عنوان بريدك الإلكتروني',
        errorInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        errorNetwork: 'خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
        errorGeneric: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.'
    }
};

// Initialize waitlist manager when script loads
const waitlistManager = new WaitlistManager();

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WaitlistManager, WaitlistTranslations };
}