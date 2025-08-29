// Gestionnaire de consentement des cookies - RGPD

class CookieConsent {
    constructor() {
        this.cookieName = 'cookie_consent';
        this.cookieExpiry = 365; // jours
        this.consentGiven = false;
        this.preferences = {
            necessary: true, // Toujours activé
            analytics: false,
            marketing: false,
            functional: false
        };
        
        this.init();
    }
    
    init() {
        // Vérifier si le consentement a déjà été donné
        const existingConsent = this.getCookie(this.cookieName);
        
        if (existingConsent) {
            this.preferences = JSON.parse(existingConsent);
            this.consentGiven = true;
            this.loadApprovedScripts();
            this.showStatusIndicator();
        } else {
            // Afficher la bannière après un court délai
            setTimeout(() => {
                this.showBanner();
            }, 1000);
        }
        
        this.createBanner();
        this.createPreferencesModal();
        this.bindEvents();
    }
    
    createBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.id = 'cookieConsent';
        
        banner.innerHTML = `
            <div class="cookie-consent-container">
                <div class="cookie-consent-content">
                    <h3 class="cookie-consent-title">🍪 Gestion des cookies</h3>
                    <p class="cookie-consent-text">
                        Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. 
                        <a href="politique-confidentialite.html" target="_blank">En savoir plus</a>
                    </p>
                </div>
                <div class="cookie-consent-actions">
                    <button class="cookie-btn cookie-btn-settings" id="cookieSettings">
                        ⚙️ Préférences
                    </button>
                    <button class="cookie-btn cookie-btn-decline" id="cookieDecline">
                        Refuser
                    </button>
                    <button class="cookie-btn cookie-btn-accept" id="cookieAccept">
                        ✓ Accepter tout
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
    }
    
    createPreferencesModal() {
        const modal = document.createElement('div');
        modal.className = 'cookie-preferences-modal';
        modal.id = 'cookiePreferencesModal';
        
        modal.innerHTML = `
            <div class="cookie-preferences-content">
                <div class="cookie-preferences-header">
                    <h2 class="cookie-preferences-title">Préférences des cookies</h2>
                    <p class="cookie-preferences-subtitle">
                        Gérez vos préférences de cookies. Vous pouvez modifier ces paramètres à tout moment.
                    </p>
                </div>
                
                <div class="cookie-preferences-body">
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3 class="cookie-category-title">Cookies nécessaires</h3>
                            <label class="cookie-toggle">
                                <input type="checkbox" checked disabled>
                                <span class="cookie-toggle-slider disabled"></span>
                            </label>
                        </div>
                        <p class="cookie-category-description">
                            Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.
                        </p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3 class="cookie-category-title">Cookies d'analyse</h3>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="analyticsToggle">
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p class="cookie-category-description">
                            Ces cookies nous aident à comprendre comment vous utilisez notre site (Google Analytics).
                        </p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3 class="cookie-category-title">Cookies marketing</h3>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="marketingToggle">
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p class="cookie-category-description">
                            Ces cookies sont utilisés pour la publicité et le remarketing (Facebook Pixel, Google Ads).
                        </p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3 class="cookie-category-title">Cookies fonctionnels</h3>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="functionalToggle">
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p class="cookie-category-description">
                            Ces cookies améliorent l'expérience utilisateur (préférences, chat, etc.).
                        </p>
                    </div>
                </div>
                
                <div class="cookie-preferences-footer">
                    <button class="cookie-btn cookie-btn-decline" id="modalDecline">
                        Refuser tout
                    </button>
                    <button class="cookie-btn cookie-btn-accept" id="modalSave">
                        Enregistrer les préférences
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    bindEvents() {
        // Boutons de la bannière
        document.getElementById('cookieAccept')?.addEventListener('click', () => {
            this.acceptAll();
        });
        
        document.getElementById('cookieDecline')?.addEventListener('click', () => {
            this.declineAll();
        });
        
        document.getElementById('cookieSettings')?.addEventListener('click', () => {
            this.showPreferences();
        });
        
        // Boutons du modal
        document.getElementById('modalSave')?.addEventListener('click', () => {
            this.savePreferences();
        });
        
        document.getElementById('modalDecline')?.addEventListener('click', () => {
            this.declineAll();
        });
        
        // Fermer le modal en cliquant à l'extérieur
        document.getElementById('cookiePreferencesModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'cookiePreferencesModal') {
                this.hidePreferences();
            }
        });
        
        // Indicateur de statut
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cookie-status-indicator')) {
                this.showPreferences();
            }
        });
    }
    
    showBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.classList.add('show');
        }
    }
    
    hideBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 400);
        }
    }
    
    showPreferences() {
        const modal = document.getElementById('cookiePreferencesModal');
        if (modal) {
            // Mettre à jour les toggles avec les préférences actuelles
            document.getElementById('analyticsToggle').checked = this.preferences.analytics;
            document.getElementById('marketingToggle').checked = this.preferences.marketing;
            document.getElementById('functionalToggle').checked = this.preferences.functional;
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hidePreferences() {
        const modal = document.getElementById('cookiePreferencesModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    acceptAll() {
        this.preferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true
        };
        
        this.saveConsent();
        this.hideBanner();
        this.hidePreferences();
        this.loadApprovedScripts();
        this.showStatusIndicator();
        
        this.showNotification('✅ Tous les cookies ont été acceptés', 'success');
    }
    
    declineAll() {
        this.preferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false
        };
        
        this.saveConsent();
        this.hideBanner();
        this.hidePreferences();
        this.showStatusIndicator();
        
        this.showNotification('❌ Seuls les cookies nécessaires sont activés', 'info');
    }
    
    savePreferences() {
        this.preferences = {
            necessary: true,
            analytics: document.getElementById('analyticsToggle').checked,
            marketing: document.getElementById('marketingToggle').checked,
            functional: document.getElementById('functionalToggle').checked
        };
        
        this.saveConsent();
        this.hideBanner();
        this.hidePreferences();
        this.loadApprovedScripts();
        this.showStatusIndicator();
        
        this.showNotification('✅ Vos préférences ont été enregistrées', 'success');
    }
    
    saveConsent() {
        const consentData = JSON.stringify(this.preferences);
        this.setCookie(this.cookieName, consentData, this.cookieExpiry);
        this.consentGiven = true;
    }
    
    loadApprovedScripts() {
        // Google Analytics
        if (this.preferences.analytics && typeof gtag === 'undefined') {
            this.loadGoogleAnalytics();
        }
        
        // Facebook Pixel
        if (this.preferences.marketing && typeof fbq === 'undefined') {
            this.loadFacebookPixel();
        }
        
        // Autres scripts fonctionnels
        if (this.preferences.functional) {
            this.loadFunctionalScripts();
        }
    }
    
    loadGoogleAnalytics() {
        // Le script Google Analytics est déjà chargé dans le HTML
        // On active le tracking selon les préférences
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': this.preferences.analytics ? 'granted' : 'denied',
                'ad_storage': this.preferences.marketing ? 'granted' : 'denied',
                'functionality_storage': this.preferences.functional ? 'granted' : 'denied',
                'personalization_storage': this.preferences.marketing ? 'granted' : 'denied'
            });
            
            // Envoyer un événement de consentement
            if (this.preferences.analytics) {
                gtag('event', 'cookie_consent_granted', {
                    'event_category': 'cookie_consent',
                    'event_label': 'analytics_accepted'
                });
            }
        }
    }
    
    loadFacebookPixel() {
        // Charger Facebook Pixel si nécessaire
        if (typeof fbq === 'undefined') {
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            // Remplacez par votre ID Facebook Pixel
            // fbq('init', 'YOUR_PIXEL_ID');
            // fbq('track', 'PageView');
        }
    }
    
    loadFunctionalScripts() {
        // Charger d'autres scripts fonctionnels si nécessaire
        console.log('Chargement des scripts fonctionnels...');
    }
    
    showStatusIndicator() {
        // Créer l'indicateur de statut
        let indicator = document.querySelector('.cookie-status-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'cookie-status-indicator';
            indicator.innerHTML = '🍪 Cookies';
            indicator.title = 'Cliquez pour gérer vos préférences de cookies';
            document.body.appendChild(indicator);
        }
        
        setTimeout(() => {
            indicator.classList.add('show');
        }, 1000);
    }
    
    showNotification(message, type = 'info') {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10002;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animer l'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Utilitaires pour les cookies
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Méthode publique pour réinitialiser le consentement
    resetConsent() {
        document.cookie = `${this.cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        location.reload();
    }
}

// Initialiser le gestionnaire de consentement
document.addEventListener('DOMContentLoaded', function() {
    window.cookieConsent = new CookieConsent();
});

// Fonction globale pour réinitialiser le consentement (utile pour les tests)
window.resetCookieConsent = function() {
    if (window.cookieConsent) {
        window.cookieConsent.resetConsent();
    }
};