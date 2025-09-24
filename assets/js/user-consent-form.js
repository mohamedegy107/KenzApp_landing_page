// User Consent Form Management System
class UserConsentFormManager {
    constructor() {
        this.consentKey = 'kenz_user_data_consent';
        this.consentTimestamp = 'kenz_user_consent_timestamp';
        this.consentVersion = '1.0';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStoredConsent();
    }

    bindEvents() {
        // Bind checkbox change events
        document.querySelectorAll('.user-consent-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleConsentChange(e.target);
            });
        });

        // Bind form submission events
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateConsent(form)) {
                    e.preventDefault();
                    this.showConsentError(form);
                }
            });
        });

        // Bind consent withdrawal buttons
        document.querySelectorAll('.withdraw-consent-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.withdrawConsent();
            });
        });

        // Bind privacy policy links
        document.querySelectorAll('.privacy-policy-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPrivacyPolicy();
            });
        });
    }

    handleConsentChange(checkbox) {
        const container = checkbox.closest('.user-consent-checkbox-container');
        const consentContainer = checkbox.closest('.user-consent-container');
        
        if (checkbox.checked) {
            container.classList.add('checked');
            this.saveConsent(checkbox.value, true);
            this.hideError(consentContainer);
        } else {
            container.classList.remove('checked');
            this.saveConsent(checkbox.value, false);
        }

        // Update UI state
        this.updateConsentState(consentContainer);
    }

    saveConsent(consentType, granted) {
        const existingConsent = this.getStoredConsent();
        const consentData = {
            ...existingConsent,
            [consentType]: {
                granted: granted,
                timestamp: new Date().toISOString(),
                version: this.consentVersion
            }
        };

        localStorage.setItem(this.consentKey, JSON.stringify(consentData));
        localStorage.setItem(this.consentTimestamp, new Date().toISOString());

        // Log consent event
        this.logConsentEvent('consent_updated', {
            type: consentType,
            granted: granted
        });
    }

    getStoredConsent() {
        const stored = localStorage.getItem(this.consentKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing stored consent:', e);
            }
        }
        return {};
    }

    loadStoredConsent() {
        const storedConsent = this.getStoredConsent();
        
        Object.keys(storedConsent).forEach(consentType => {
            const checkbox = document.querySelector(`input[value="${consentType}"]`);
            if (checkbox && storedConsent[consentType].granted) {
                checkbox.checked = true;
                const container = checkbox.closest('.user-consent-checkbox-container');
                if (container) {
                    container.classList.add('checked');
                }
            }
        });
    }

    validateConsent(form) {
        const requiredConsents = form.querySelectorAll('.user-consent-checkbox[required]');
        let allValid = true;

        requiredConsents.forEach(checkbox => {
            if (!checkbox.checked) {
                allValid = false;
                const container = checkbox.closest('.user-consent-container');
                container.classList.add('required');
            }
        });

        return allValid;
    }

    showConsentError(form) {
        const errorElements = form.querySelectorAll('.user-consent-error');
        errorElements.forEach(error => {
            error.classList.add('show');
        });

        // Shake animation for visual feedback
        const consentContainers = form.querySelectorAll('.user-consent-container.required');
        consentContainers.forEach(container => {
            container.classList.add('shake');
            setTimeout(() => {
                container.classList.remove('shake');
            }, 500);
        });

        // Scroll to first error
        if (consentContainers.length > 0) {
            consentContainers[0].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    hideError(container) {
        container.classList.remove('required');
        const error = container.querySelector('.user-consent-error');
        if (error) {
            error.classList.remove('show');
        }
    }

    updateConsentState(container) {
        const checkbox = container.querySelector('.user-consent-checkbox');
        const success = container.querySelector('.user-consent-success');
        
        if (checkbox.checked && success) {
            success.classList.add('show');
            setTimeout(() => {
                success.classList.remove('show');
            }, 3000);
        }
    }

    withdrawConsent() {
        // Clear all stored consent
        localStorage.removeItem(this.consentKey);
        localStorage.removeItem(this.consentTimestamp);

        // Uncheck all checkboxes
        document.querySelectorAll('.user-consent-checkbox').forEach(checkbox => {
            checkbox.checked = false;
            const container = checkbox.closest('.user-consent-checkbox-container');
            if (container) {
                container.classList.remove('checked');
            }
        });

        // Log withdrawal event
        this.logConsentEvent('consent_withdrawn', {});

        // Show confirmation
        this.showWithdrawalConfirmation();
    }

    showWithdrawalConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.className = 'user-consent-withdrawal-confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <h4>Consent Withdrawn</h4>
                <p>Your consent for data sharing has been withdrawn. You can re-enable it at any time.</p>
            </div>
        `;
        confirmation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #28a745;
            border-radius: 8px;
            padding: 20px;
            z-index: 10003;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            max-width: 400px;
            text-align: center;
        `;

        document.body.appendChild(confirmation);

        // Remove after 4 seconds
        setTimeout(() => {
            confirmation.remove();
        }, 4000);
    }

    openPrivacyPolicy() {
        // Open privacy policy in new window/tab
        window.open('privacy-policy.html', '_blank');
    }

    logConsentEvent(eventType, data) {
        const logData = {
            timestamp: new Date().toISOString(),
            event: eventType,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href,
            version: this.consentVersion
        };

        console.log('User consent event:', logData);
        
        // In production, send this to your compliance logging service
        // this.sendConsentLog(logData);
    }

    // Static method to check if user has consented to specific data sharing
    static hasConsentFor(consentType) {
        const stored = localStorage.getItem('kenz_user_data_consent');
        if (stored) {
            try {
                const consent = JSON.parse(stored);
                return consent[consentType] && consent[consentType].granted === true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    // Static method to get all consent status
    static getAllConsent() {
        const stored = localStorage.getItem('kenz_user_data_consent');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return {};
            }
        }
        return {};
    }

    // Method to create consent form HTML
    static createConsentForm(options = {}) {
        const {
            title = 'Data Sharing Consent',
            description = 'We need your explicit consent before sharing your data with third-party networks.',
            consentType = 'third_party_sharing',
            required = true,
            showDetails = true
        } = options;

        return `
            <div class="user-consent-container">
                <div class="user-consent-header">
                    <div class="icon">🔒</div>
                    <h3 class="user-consent-title" data-en="${title}" data-ar="موافقة مشاركة البيانات">${title}</h3>
                </div>
                
                <p class="user-consent-description" data-en="${description}" data-ar="نحتاج موافقتك الصريحة قبل مشاركة بياناتك مع الشبكات الخارجية.">${description}</p>
                
                <div class="user-consent-checkbox-container">
                    <input type="checkbox" 
                           class="user-consent-checkbox" 
                           id="consent_${consentType}" 
                           value="${consentType}"
                           ${required ? 'required' : ''}>
                    <label for="consent_${consentType}" class="user-consent-label">
                        <strong data-en="I consent to sharing my data" data-ar="أوافق على مشاركة بياناتي">I consent to sharing my data</strong>
                        <span data-en="with approved third-party networks for task completion and payment processing." data-ar="مع الشبكات الخارجية المعتمدة لإكمال المهام ومعالجة المدفوعات.">with approved third-party networks for task completion and payment processing.</span>
                    </label>
                </div>
                
                ${showDetails ? `
                <div class="user-consent-details">
                    <h4 data-en="What data will be shared:" data-ar="البيانات التي سيتم مشاركتها:">What data will be shared:</h4>
                    <ul>
                        <li data-en="User ID and profile information" data-ar="معرف المستخدم ومعلومات الملف الشخصي">User ID and profile information</li>
                        <li data-en="Task completion status and timestamps" data-ar="حالة إكمال المهام والأوقات">Task completion status and timestamps</li>
                        <li data-en="Payment and earnings data" data-ar="بيانات الدفع والأرباح">Payment and earnings data</li>
                        <li data-en="Device and browser information" data-ar="معلومات الجهاز والمتصفح">Device and browser information</li>
                    </ul>
                    
                    <div class="user-consent-warning">
                        <span class="warning-icon">⚠️</span>
                        <span data-en="You can withdraw this consent at any time. Withdrawal may affect your ability to participate in certain tasks." data-ar="يمكنك سحب هذه الموافقة في أي وقت. قد يؤثر السحب على قدرتك على المشاركة في مهام معينة.">You can withdraw this consent at any time. Withdrawal may affect your ability to participate in certain tasks.</span>
                    </div>
                </div>
                ` : ''}
                
                <div class="user-consent-actions">
                    <a href="#" class="user-consent-btn link privacy-policy-link" data-en="View Privacy Policy" data-ar="عرض سياسة الخصوصية">View Privacy Policy</a>
                    <button type="button" class="user-consent-btn secondary withdraw-consent-btn" data-en="Withdraw Consent" data-ar="سحب الموافقة">Withdraw Consent</button>
                </div>
                
                <div class="user-consent-error" data-en="Please provide your consent to continue." data-ar="يرجى تقديم موافقتك للمتابعة.">Please provide your consent to continue.</div>
                <div class="user-consent-success" data-en="Consent saved successfully!" data-ar="تم حفظ الموافقة بنجاح!">Consent saved successfully!</div>
            </div>
        `;
    }
}

// Initialize user consent form manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.userConsentFormManager = new UserConsentFormManager();
});

// Export for use by other scripts
window.UserConsentFormManager = UserConsentFormManager;