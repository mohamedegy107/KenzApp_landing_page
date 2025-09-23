/**
 * Language Switcher Module
 * Handles language switching functionality and RTL support
 */

class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.translations = {};
        this.rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        this.init();
    }

    init() {
        this.setupLanguageSwitcher();
        this.loadTranslations();
        this.applyLanguage(this.currentLanguage);
    }

    /**
     * Setup language switcher UI and event handlers
     */
    setupLanguageSwitcher() {
        // Create language switcher if it doesn't exist
        if ($('.language-switcher').length === 0) {
            this.createLanguageSwitcher();
        }

        // Handle language change
        $('.language-switcher select').on('change', (event) => {
            const selectedLanguage = $(event.target).val();
            this.switchLanguage(selectedLanguage);
        });

        // Set current language in dropdown
        $('.language-switcher select').val(this.currentLanguage);
    }

    /**
     * Create language switcher HTML
     */
    createLanguageSwitcher() {
        const languageSwitcher = `
            <div class="language-switcher">
                <select id="languageSelect">
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                </select>
            </div>
        `;

        $('body').append(languageSwitcher);
    }

    /**
     * Switch to a different language
     * @param {string} languageCode - Language code (e.g., 'en', 'ar', 'es')
     */
    switchLanguage(languageCode) {
        this.currentLanguage = languageCode;
        this.storeLanguage(languageCode);
        this.applyLanguage(languageCode);
        this.updateDirection(languageCode);
        
        // Trigger custom event
        $(document).trigger('languageChanged', [languageCode]);
    }

    /**
     * Apply language translations to the page
     * @param {string} languageCode - Language code
     */
    applyLanguage(languageCode) {
        const translations = this.translations[languageCode];
        
        if (!translations) {
            console.warn(`Translations not found for language: ${languageCode}`);
            return;
        }

        // Apply translations to elements with data-translate attribute
        $('[data-translate]').each(function() {
            const key = $(this).data('translate');
            const translation = translations[key];
            
            if (translation) {
                if ($(this).is('input, textarea')) {
                    $(this).attr('placeholder', translation);
                } else {
                    $(this).text(translation);
                }
            }
        });

        // Update HTML lang attribute
        $('html').attr('lang', languageCode);
    }

    /**
     * Update text direction for RTL languages
     * @param {string} languageCode - Language code
     */
    updateDirection(languageCode) {
        const isRTL = this.rtlLanguages.includes(languageCode);
        const direction = isRTL ? 'rtl' : 'ltr';
        
        $('html').attr('dir', direction);
        $('body').toggleClass('rtl', isRTL);
    }

    /**
     * Load translations from external files or inline data
     */
    async loadTranslations() {
        // Default English translations
        this.translations.en = {
            'nav.home': 'Home',
            'nav.services': 'Services',
            'nav.about': 'About',
            'nav.features': 'Features',
            'nav.download': 'Download',
            'hero.title': 'Earn Money with Simple Tasks',
            'hero.subtitle': 'Complete micro-tasks and earn real money with KenzApp',
            'hero.cta': 'Get Started',
            'services.title': 'Our Services',
            'services.subtitle': 'Discover various ways to earn money',
            'about.title': 'How KenzApp Works',
            'footer.copyright': '© 2024 KenzApp. All rights reserved.'
        };

        // Arabic translations
        this.translations.ar = {
            'nav.home': 'الرئيسية',
            'nav.services': 'الخدمات',
            'nav.about': 'حول',
            'nav.features': 'المميزات',
            'nav.download': 'تحميل',
            'hero.title': 'اربح المال من المهام البسيطة',
            'hero.subtitle': 'أكمل المهام الصغيرة واربح أموال حقيقية مع كينز آب',
            'hero.cta': 'ابدأ الآن',
            'services.title': 'خدماتنا',
            'services.subtitle': 'اكتشف طرق مختلفة لكسب المال',
            'about.title': 'كيف يعمل كينز آب',
            'footer.copyright': '© 2024 كينز آب. جميع الحقوق محفوظة.'
        };

        // Try to load additional translations from external files
        try {
            const response = await fetch('/assets/translations/translations.json');
            if (response.ok) {
                const externalTranslations = await response.json();
                this.translations = { ...this.translations, ...externalTranslations };
            }
        } catch (error) {
            console.log('External translations not found, using default translations');
        }
    }

    /**
     * Get stored language from localStorage
     * @returns {string|null} - Stored language code
     */
    getStoredLanguage() {
        return localStorage.getItem('kenzapp-language');
    }

    /**
     * Store language preference in localStorage
     * @param {string} languageCode - Language code to store
     */
    storeLanguage(languageCode) {
        localStorage.setItem('kenzapp-language', languageCode);
    }

    /**
     * Get current language
     * @returns {string} - Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Check if current language is RTL
     * @returns {boolean} - True if current language is RTL
     */
    isRTL() {
        return this.rtlLanguages.includes(this.currentLanguage);
    }

    /**
     * Add translation for a specific language
     * @param {string} languageCode - Language code
     * @param {Object} translations - Translation object
     */
    addTranslations(languageCode, translations) {
        if (!this.translations[languageCode]) {
            this.translations[languageCode] = {};
        }
        
        this.translations[languageCode] = {
            ...this.translations[languageCode],
            ...translations
        };
    }

    /**
     * Get translation for a specific key
     * @param {string} key - Translation key
     * @param {string} languageCode - Language code (optional, uses current language)
     * @returns {string} - Translated text
     */
    translate(key, languageCode = this.currentLanguage) {
        const translations = this.translations[languageCode];
        return translations && translations[key] ? translations[key] : key;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
}

// Auto-initialize if jQuery is available
if (typeof $ !== 'undefined') {
    $(document).ready(() => {
        window.languageSwitcherModule = new LanguageSwitcher();
    });
}