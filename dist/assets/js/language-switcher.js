// Language Switcher Functionality
let currentLanguage = 'en';

function switchLanguage() {
    const select = document.getElementById('languageSelect');
    const selectedLang = select.value;
    
    if (selectedLang !== currentLanguage) {
        currentLanguage = selectedLang;
        
        // Update HTML attributes
        const html = document.documentElement;
        html.setAttribute('lang', selectedLang);
        html.setAttribute('dir', selectedLang === 'ar' ? 'rtl' : 'ltr');
        
        // Update all elements with data attributes
        const elements = document.querySelectorAll('[data-en][data-ar]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${selectedLang}`);
            if (text) {
                element.innerHTML = text;
            }
        });
        
        // Update title
        const title = document.querySelector('title');
        if (title) {
            const titleText = title.getAttribute(`data-${selectedLang}`);
            if (titleText) {
                title.textContent = titleText;
            }
        }
        
        // Add/remove RTL class for styling
        document.body.classList.toggle('rtl', selectedLang === 'ar');
        
        // Store language preference
        localStorage.setItem('preferredLanguage', selectedLang);
    }
}

// Load saved language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'en') {
        document.getElementById('languageSelect').value = savedLang;
        switchLanguage();
    }
});

// Initialize language switcher
window.switchLanguage = switchLanguage;