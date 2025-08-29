// Script premium pour le site chasseur immobilier

// Configuration
const CONFIG = {
    animationDuration: 600,
    scrollOffset: 100,
    counterSpeed: 2000
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations(); // Fonction unifiée pour toutes les animations au scroll
    initializeScrollEffects();
    initializeFormHandling();
    initializeCTAOptimization();
    initializeNavigation();
    initializeCounters();
    initializeMobileMenu();
    
    // Le sticky CTA s'affiche automatiquement via l'intersection observer
});

/**
 * Initialise le menu mobile avec gestion des interactions
 * Gère l'ouverture/fermeture, les événements clavier et le responsive
 */
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu || !navOverlay) return;
    
    // Fonction pour ouvrir/fermer le menu
    function toggleMenu() {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    navToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);
    
    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Fermer le menu lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// === GRILLE DE PROJETS ===

/**
 * Fonction unifiée d'observation des éléments pour les animations au scroll
 * Gère différents types d'animations selon les classes CSS des éléments
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Animation pour les cartes de projets avec délai CSS
                if (element.classList.contains('project-card')) {
                    element.classList.add('animate-in');
                }
                // Animation standard pour les autres éléments
                else {
                    element.classList.add('animate');
                    
                    // Animation spéciale pour certains types de cartes
                    if (element.classList.contains('feature-card') || 
                        element.classList.contains('step') || 
                        element.classList.contains('testimonial-card')) {
                        animateCard(element);
                    }
                }
            }
        });
    }, observerOptions);

    // Observer tous les éléments animables
    const animatableElements = document.querySelectorAll(
        '.project-card, .feature-card, .step, .testimonial-card, .section-header'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

// Alias pour la compatibilité
function initializeProjectsGrid() {
    // Fonction déplacée vers initializeScrollAnimations
}

function initializeAnimations() {
    // Fonction déplacée vers initializeScrollAnimations
}

/**
 * Anime une carte avec des effets de transition optimisés
 * @param {HTMLElement} card - L'élément carte à animer
 */
function animateCard(card) {
    // Utiliser requestAnimationFrame pour éviter les forced reflows
    requestAnimationFrame(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            requestAnimationFrame(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, Math.random() * 200);
    });
}

// === EFFETS DE SCROLL ===

// Initialisation des effets de scroll optimisés
/**
 * Initialise les effets de scroll pour la navigation et le CTA sticky
 * Gère l'affichage/masquage des éléments selon la position de scroll
 */
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateScrollEffects() {
        const currentScrollY = window.scrollY;
        
        // Optimisation navbar - éviter les reflows
        if (navbar) {
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(13, 27, 42, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
        
        // Parallax optimisé pour le hero
        if (hero) {
            const rate = currentScrollY * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// === GESTION DES FORMULAIRES ===

// Initialisation de la gestion des formulaires
/**
 * Initialise la gestion des formulaires avec validation en temps réel
 * Configure les événements de validation et de soumission
 */
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Validation en temps réel
        const inputs = contactForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
    }
}

// Gestion de la soumission du formulaire
/**
 * Gère la soumission des formulaires avec validation et feedback
 * @param {Event} e - L'événement de soumission du formulaire
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.btn-submit');
    
    // Validation
    if (!validateForm(form)) {
        showNotification('Veuillez corriger les erreurs dans le formulaire.', 'error');
        return;
    }
    
    // Animation du bouton
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Simulation d'envoi (remplacer par vraie logique)
    setTimeout(() => {
        showNotification('Votre message a été envoyé avec succès ! Nous vous recontacterons rapidement.', 'success');
        form.reset();
        
        // Restaurer le bouton
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Tracking conversion (Google Analytics, Facebook Pixel, etc.)
        trackConversion('contact_form_submit');
        
    }, 2000);
}

// Validation d'un champ
/**
 * Valide un champ de saisie en temps réel
 * @param {Event} e - L'événement de saisie (input/blur)
 */
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Supprimer les erreurs précédentes
    clearValidationError(e);
    
    let isValid = true;
    let errorMessage = '';
    
    // Validation selon le type
    switch (input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez saisir une adresse email valide.';
            }
            break;
        case 'tel':
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez saisir un numéro de téléphone valide.';
            }
            break;
        default:
            if (input.required && value === '') {
                isValid = false;
                errorMessage = 'Ce champ est obligatoire.';
            }
    }
    
    if (!isValid) {
        showInputError(input, errorMessage);
    }
    
    return isValid;
}

// Afficher une erreur sur un champ
/**
 * Affiche un message d'erreur pour un champ de saisie
 * @param {HTMLElement} input - Le champ de saisie
 * @param {string} message - Le message d'erreur à afficher
 */
function showInputError(input, message) {
    input.style.borderColor = '#ef4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: fadeInUp 0.3s ease;
    `;
    
    input.parentNode.appendChild(errorDiv);
}

// Supprimer l'erreur d'un champ
function clearValidationError(e) {
    const input = e.target;
    input.style.borderColor = '';
    
    const errorDiv = input.parentNode.querySelector('.input-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validation complète du formulaire
/**
 * Valide l'ensemble d'un formulaire
 * @param {HTMLFormElement} form - Le formulaire à valider
 * @returns {boolean} True si le formulaire est valide, false sinon
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// === OPTIMISATION DES CONVERSIONS ===

// Initialisation de l'optimisation des conversions
function initializeCTAOptimization() {
    // Tracking des clics sur les CTA
    const ctaButtons = document.querySelectorAll('.btn-hero, .btn-cta-main, .btn-primary, .btn-sticky');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Animation de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Tracking
            const ctaType = this.classList.contains('btn-hero') ? 'hero_cta' : 
                           this.classList.contains('btn-cta-main') ? 'main_cta' : 
                           this.classList.contains('btn-sticky') ? 'sticky_cta' : 'secondary_cta';
            trackConversion(ctaType + '_click');
        });
    });
    
    // Urgence dynamique
    // updateUrgencyMessages(); // Désactivé pour garder le texte fixe
}



// Messages d'urgence dynamiques - DÉSACTIVÉ pour garder le texte fixe
// function updateUrgencyMessages() {
//     const urgencyElements = document.querySelectorAll('.cta-urgency');
//     
//     urgencyElements.forEach(element => {
//         // Calcul des places restantes (simulation)
//         const placesLeft = Math.floor(Math.random() * 5) + 1;
//         element.textContent = `⚠️ Nombre d'accompagnements volontairement limité pour garantir un suivi de qualité`;
//         
//         // Animation clignotante subtile
//         setInterval(() => {
//             element.style.opacity = '0.7';
//             setTimeout(() => {
//                 element.style.opacity = '1';
//             }, 500);
//         }, 3000);
//     });
// }

// === NAVIGATION ===

// Initialisation de la navigation
function initializeNavigation() {
    
    // Scroll fluide vers les sections (seulement pour les liens internes)
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Seulement empêcher le comportement par défaut si la section existe
            if (targetSection) {
                e.preventDefault();
                const offsetTop = targetSection.offsetTop - 80; // Hauteur navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === COMPTEURS ANIMÉS ===

// Initialisation des compteurs
/**
 * Initialise les compteurs animés avec IntersectionObserver
 * Déclenche l'animation des chiffres au scroll
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animation d'un compteur
/**
 * Anime un compteur numérique de 0 à sa valeur finale
 * @param {HTMLElement} element - L'élément contenant le nombre à animer
 */
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = CONFIG.counterSpeed;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// === NOTIFICATIONS ===

// Affichage des notifications
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// === TRACKING ET ANALYTICS ===

// Tracking des conversions
function trackConversion(eventName, eventData = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'conversion',
            event_label: 'real_estate_hunter',
            ...eventData
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', eventData);
    }
    
    // Conversion trackée silencieusement
}

// === ANIMATIONS CSS DYNAMIQUES ===

// Ajout des animations CSS
// CSS dynamique déplacé vers styles.css pour une meilleure séparation des préoccupations



// === OPTIMISATIONS PERFORMANCE ===

// Optimisations de performance avancées
// Lazy loading des images avec fallback
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback pour les navigateurs plus anciens
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        });
    }
}

// Optimisation des performances critiques
/**
 * Optimisations de performance simplifiées
 * Évite les conflits potentiels avec d'autres scripts
 */
function optimizePerformance() {
    // Respect des préférences d'accessibilité pour les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01s');
    }
    
    // Préchargement des ressources critiques
    const criticalResources = ['booking.html'];
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });
    
    // Nettoyage des observers pour éviter les fuites mémoire
    window.addEventListener('beforeunload', () => {
        // Nettoyer tous les observers IntersectionObserver
        document.querySelectorAll('[data-observer]').forEach(el => {
            const observer = el.observerInstance;
            if (observer) observer.disconnect();
        });
    });
}

// Initialisation optimisée
function initOptimizations() {
    initializeLazyLoading();
    optimizePerformance();
}

// Initialisation des optimisations
initOptimizations();



// === ACCESSIBILITÉ ===

// Amélioration de l'accessibilité
function enhanceAccessibility() {
    // Focus visible pour la navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ARIA labels dynamiques
    const ctaButtons = document.querySelectorAll('.btn-hero, .btn-cta-main');
    ctaButtons.forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', 'Réserver un appel gratuit avec notre expert immobilier');
        }
    });
}

// Initialisation de l'accessibilité
enhanceAccessibility();

// === TÉLÉCHARGEMENT LIVRE BLANC ===

// Fonction pour télécharger le livre blanc
function downloadWhitePaper() {
    try {
        const pdfUrl = 'Ebook Gratuit - Les bases de l\'immobilier.pdf';
        
        // Vérifier si on est sur mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Sur mobile, ouvrir dans un nouvel onglet pour éviter les blocages
            const newWindow = window.open(pdfUrl, '_blank');
            if (!newWindow) {
                // Si le popup est bloqué, essayer la méthode classique
                window.location.href = pdfUrl;
            }
        } else {
            // Sur desktop, utiliser la méthode de téléchargement classique
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'Ebook Gratuit - Les bases de l\'immobilier.pdf';
            link.style.display = 'none';
            
            // Ajouter au DOM, cliquer, puis supprimer
            document.body.appendChild(link);
            link.click();
            
            // Supprimer après un court délai pour s'assurer que le téléchargement a commencé
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
        }
        
        // Afficher une notification de succès
        showNotification('📥 Livre blanc téléchargé avec succès !', 'success');
        
        // Tracker la conversion
        trackConversion('white_paper_download', {
            content_name: 'Les 7 erreurs à éviter pour réussir son premier investissement locatif',
            content_category: 'lead_magnet',
            device_type: isMobile ? 'mobile' : 'desktop'
        });
        
    } catch (error) {
        // Erreur lors du téléchargement
        showNotification('❌ Erreur lors du téléchargement. Veuillez réessayer.', 'error');
        
        // En cas d'erreur, essayer d'ouvrir le PDF dans un nouvel onglet
        try {
            window.open('Ebook Gratuit - Les bases de l\'immobilier.pdf', '_blank');
        } catch (fallbackError) {
            // Erreur de fallback
        }
    }
}

// === GESTION DES ERREURS ===
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});