// Cookie Consent Management System
class CookieConsentManager {
    constructor() {
        this.consentKey = 'kenz_cookie_consent';
        this.preferencesKey = 'kenz_cookie_preferences';
        this.consentTimestamp = 'kenz_consent_timestamp';
        this.init();
    }

    init() {
        // Check if consent has already been given
        const existingConsent = this.getStoredConsent();
        
        if (!existingConsent) {
            // Show banner after page load
            setTimeout(() => {
                this.showConsentBanner();
            }, 1000);
        } else {
            // Apply stored preferences
            this.applyStoredPreferences();
        }

        this.bindEvents();
    }

    bindEvents() {
        // Banner buttons
        document.getElementById('acceptCookies')?.addEventListener('click', () => {
            this.acceptAllCookies();
        });

        document.getElementById('rejectCookies')?.addEventListener('click', () => {
            this.rejectNonEssentialCookies();
        });

        document.getElementById('manageCookies')?.addEventListener('click', () => {
            this.showPreferencesModal();
        });

        // Modal buttons
        document.getElementById('savePreferences')?.addEventListener('click', () => {
            this.savePreferences();
        });

        document.getElementById('withdrawConsent')?.addEventListener('click', () => {
            this.withdrawAllConsent();
        });

        // Cookie settings link
        document.getElementById('openCookieSettings')?.addEventListener('click', () => {
            this.showPreferencesModal();
        });

        // Modal close
        document.querySelector('.cookie-modal-close')?.addEventListener('click', () => {
            this.hidePreferencesModal();
        });

        // Close modal on background click
        document.getElementById('cookiePreferencesModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'cookiePreferencesModal') {
                this.hidePreferencesModal();
            }
        });
    }

    showConsentBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.style.display = 'block';
        }
    }

    hideConsentBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    showPreferencesModal() {
        const modal = document.getElementById('cookiePreferencesModal');
        if (modal) {
            modal.style.display = 'flex';
            this.loadCurrentPreferences();
        }
    }

    hidePreferencesModal() {
        const modal = document.getElementById('cookiePreferencesModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    acceptAllCookies() {
        const preferences = {
            essential: true,
            analytics: true,
            marketing: true
        };

        this.saveConsentData(preferences);
        this.hideConsentBanner();
        this.applyCookiePreferences(preferences);
        this.showConsentConfirmation('All cookies accepted');
    }

    rejectNonEssentialCookies() {
        const preferences = {
            essential: true,
            analytics: false,
            marketing: false
        };

        this.saveConsentData(preferences);
        this.hideConsentBanner();
        this.applyCookiePreferences(preferences);
        this.showConsentConfirmation('Non-essential cookies rejected');
    }

    savePreferences() {
        const preferences = {
            essential: true, // Always true
            analytics: document.getElementById('analyticsCookies')?.checked || false,
            marketing: document.getElementById('marketingCookies')?.checked || false
        };

        this.saveConsentData(preferences);
        this.hidePreferencesModal();
        this.applyCookiePreferences(preferences);
        this.showConsentConfirmation('Cookie preferences saved');
    }

    withdrawAllConsent() {
        // Clear all stored consent data
        localStorage.removeItem(this.consentKey);
        localStorage.removeItem(this.preferencesKey);
        localStorage.removeItem(this.consentTimestamp);

        // Remove all non-essential cookies
        this.clearNonEssentialCookies();

        // Reset preferences to essential only
        const preferences = {
            essential: true,
            analytics: false,
            marketing: false
        };

        this.applyCookiePreferences(preferences);
        this.hidePreferencesModal();
        this.showConsentBanner();
        this.showConsentConfirmation('All consent withdrawn');
    }

    saveConsentData(preferences) {
        const consentData = {
            timestamp: new Date().toISOString(),
            preferences: preferences,
            version: '1.0'
        };

        localStorage.setItem(this.consentKey, 'true');
        localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
        localStorage.setItem(this.consentTimestamp, consentData.timestamp);

        // Log consent for compliance tracking
        this.logConsentEvent('consent_given', preferences);
    }

    getStoredConsent() {
        return localStorage.getItem(this.consentKey) === 'true';
    }

    getStoredPreferences() {
        const stored = localStorage.getItem(this.preferencesKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing stored preferences:', e);
            }
        }
        return null;
    }

    applyStoredPreferences() {
        const preferences = this.getStoredPreferences();
        if (preferences) {
            this.applyCookiePreferences(preferences);
        }
    }

    loadCurrentPreferences() {
        const preferences = this.getStoredPreferences() || {
            essential: true,
            analytics: false,
            marketing: false
        };

        // Update modal checkboxes
        document.getElementById('essentialCookies').checked = preferences.essential;
        document.getElementById('analyticsCookies').checked = preferences.analytics;
        document.getElementById('marketingCookies').checked = preferences.marketing;
    }

    applyCookiePreferences(preferences) {
        // Apply analytics cookies
        if (preferences.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        // Apply marketing cookies
        if (preferences.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }

        // Log preference application
        this.logConsentEvent('preferences_applied', preferences);
    }

    enableAnalytics() {
        // Enable Google Analytics or other analytics tools
        console.log('Analytics cookies enabled');
        
        // Example: Initialize Google Analytics
        // gtag('config', 'GA_MEASUREMENT_ID');
        
        // Set analytics consent flag
        this.setCookieConsentFlag('analytics', true);
    }

    disableAnalytics() {
        console.log('Analytics cookies disabled');
        
        // Disable analytics tracking
        // gtag('config', 'GA_MEASUREMENT_ID', { 'anonymize_ip': true });
        
        // Set analytics consent flag
        this.setCookieConsentFlag('analytics', false);
    }

    enableMarketing() {
        console.log('Marketing cookies enabled');
        
        // Enable marketing/advertising cookies
        this.setCookieConsentFlag('marketing', true);
    }

    disableMarketing() {
        console.log('Marketing cookies disabled');
        
        // Disable marketing/advertising cookies
        this.setCookieConsentFlag('marketing', false);
    }

    setCookieConsentFlag(type, enabled) {
        // Set a flag that other scripts can check
        window.cookieConsent = window.cookieConsent || {};
        window.cookieConsent[type] = enabled;
    }

    clearNonEssentialCookies() {
        // Get all cookies
        const cookies = document.cookie.split(';');
        
        // List of essential cookies to keep
        const essentialCookies = ['kenz_cookie_consent', 'kenz_cookie_preferences', 'kenz_consent_timestamp'];
        
        cookies.forEach(cookie => {
            const cookieName = cookie.split('=')[0].trim();
            
            // Don't delete essential cookies
            if (!essentialCookies.includes(cookieName)) {
                // Delete the cookie
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            }
        });
    }

    logConsentEvent(eventType, preferences) {
        // Log consent events for compliance tracking
        const logData = {
            timestamp: new Date().toISOString(),
            event: eventType,
            preferences: preferences,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.log('Cookie consent event:', logData);
        
        // In production, send this to your analytics/logging service
        // this.sendConsentLog(logData);
    }

    showConsentConfirmation(message) {
        // Show a brief confirmation message
        const confirmation = document.createElement('div');
        confirmation.className = 'cookie-consent-confirmation';
        confirmation.textContent = message;
        confirmation.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 10002;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(confirmation);

        // Remove after 3 seconds
        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }

    // Method to check if specific cookie type is allowed
    static isAllowed(cookieType) {
        const preferences = localStorage.getItem('kenz_cookie_preferences');
        if (preferences) {
            try {
                const parsed = JSON.parse(preferences);
                return parsed[cookieType] === true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    // Method for third-party scripts to check consent
    static hasConsent() {
        return localStorage.getItem('kenz_cookie_consent') === 'true';
    }
}

// Initialize cookie consent manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsentManager = new CookieConsentManager();
});

// Export for use by other scripts
window.CookieConsentManager = CookieConsentManager;