// Script premium pour le site chasseur immobilier

// Configuration
const CONFIG = {
    animationDuration: 600,
    scrollOffset: 100,
    counterSpeed: 2000
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeFormHandling();
    initializeCTAOptimization();
    initializeNavigation();
    initializeCounters();
    initializeProjectsCarousel();
});

// === CARROUSEL DE PROJETS ===

function initializeProjectsCarousel() {
    const carousel = document.querySelector('.projects-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const indicators = carousel.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Fonction pour afficher une slide
    function showSlide(index) {
        // Masquer toutes les slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Afficher la slide active
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        
        // Déplacer le track
        track.style.transform = `translateX(-${index * 33.333}%)`;
        
        // Mettre à jour les indicateurs
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        // Mettre à jour les boutons
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === totalSlides - 1;
        
        currentSlide = index;
    }
    
    // Navigation précédent
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    });
    
    // Navigation suivant
    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            showSlide(currentSlide + 1);
        }
    });
    
    // Navigation par indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Navigation au clavier
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            showSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
            showSlide(currentSlide + 1);
        }
    });
    
    // Auto-play (optionnel)
    let autoPlayInterval;
    let autoPlayTimeout;
    
    function startAutoPlay() {
        // Nettoyer les intervalles existants pour éviter les conflits
        clearInterval(autoPlayInterval);
        clearTimeout(autoPlayTimeout);
        
        autoPlayInterval = setInterval(() => {
            const nextIndex = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
            showSlide(nextIndex);
        }, 5000); // Change toutes les 5 secondes (plus lent)
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
        clearTimeout(autoPlayTimeout);
    }
    
    function restartAutoPlayAfterDelay() {
        stopAutoPlay();
        autoPlayTimeout = setTimeout(() => {
            startAutoPlay();
        }, 8000); // Redémarrer après 8 secondes d'inactivité
    }
    
    // Démarrer l'auto-play
    startAutoPlay();
    
    // Arrêter l'auto-play au survol
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', restartAutoPlayAfterDelay);
    
    // Arrêter l'auto-play si l'utilisateur interagit
    [prevBtn, nextBtn, ...indicators].forEach(element => {
        element.addEventListener('click', restartAutoPlayAfterDelay);
    });
    
    // Support tactile pour mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        const diffX = startX - currentX;
        const threshold = 50; // Seuil minimum pour déclencher le changement
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && currentSlide < totalSlides - 1) {
                // Swipe vers la gauche - slide suivante
                showSlide(currentSlide + 1);
            } else if (diffX < 0 && currentSlide > 0) {
                // Swipe vers la droite - slide précédente
                showSlide(currentSlide - 1);
            }
        }
        
        isDragging = false;
        restartAutoPlayAfterDelay();
    });
    
    // Initialiser la première slide
    showSlide(0);
}

// === ANIMATIONS ET EFFETS VISUELS ===

// Initialisation des animations
function initializeAnimations() {
    // Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animation spéciale pour les cartes
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('step') || 
                    entry.target.classList.contains('testimonial-card')) {
                    animateCard(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observer tous les éléments animables
    const animatableElements = document.querySelectorAll(
        '.feature-card, .step, .testimonial-card, .section-header'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

// Animation des cartes
function animateCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, Math.random() * 200); // Délai aléatoire pour effet cascade
}

// === EFFETS DE SCROLL ===

// Initialisation des effets de scroll
function initializeScrollEffects() {
    // Navbar au scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(13, 27, 42, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Parallax léger pour le hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// === GESTION DES FORMULAIRES ===

// Initialisation de la gestion des formulaires
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
    
    // Sticky CTA mobile optimisé
    initializeStickyCTA();
    
    // Urgence dynamique
    updateUrgencyMessages();
    
    // Gestion du clic sur le CTA minimisé
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-sticky.minimized')) {
            expandStickyCTA();
        }
    });
}

// CTA sticky mobile optimisé
function initializeStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');
    if (!stickyCTA) return;
    
    let isVisible = false;
    let isMinimized = false;
    let lastScrollY = window.scrollY;
    let scrollDirection = 'up';
    
    // Gestion du scroll avec direction
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScrollY;
        
        const heroSection = document.querySelector('.hero');
        const footer = document.querySelector('.footer');
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const footerTop = footer.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // Afficher après la section hero mais cacher avant le footer
        const shouldShow = scrollPosition > heroBottom && window.scrollY + window.innerHeight < footerTop - 100;
        
        if (shouldShow && !isVisible) {
            stickyCTA.style.display = 'block';
            stickyCTA.classList.remove('hidden');
            isVisible = true;
        } else if (!shouldShow && isVisible) {
            stickyCTA.classList.add('hidden');
            setTimeout(() => {
                if (stickyCTA.classList.contains('hidden')) {
                    stickyCTA.style.display = 'none';
                }
            }, 400);
            isVisible = false;
        }
        
        // Effet de masquage intelligent selon la direction du scroll
        if (isVisible && !isMinimized) {
            if (scrollDirection === 'down' && currentScrollY > heroBottom + 200) {
                stickyCTA.style.opacity = '0.7';
                stickyCTA.style.transform = 'translateY(10px) scale(0.95)';
            } else if (scrollDirection === 'up') {
                stickyCTA.style.opacity = '1';
                stickyCTA.style.transform = 'translateY(0) scale(1)';
            }
        }
    });
    
    // Auto-minimisation après inactivité
    let inactivityTimer;
    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (isVisible && !isMinimized) {
                minimizeStickyCTA();
            }
        }, 8000); // 8 secondes d'inactivité
    };
    
    // Reset timer sur interaction
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('scroll', resetInactivityTimer);
    document.addEventListener('touchstart', resetInactivityTimer);
    
    resetInactivityTimer();
}

// Fonction pour basculer l'état du CTA sticky
function toggleStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');
    const btnSticky = document.querySelector('.btn-sticky');
    
    if (stickyCTA.classList.contains('minimized')) {
        expandStickyCTA();
    } else {
        minimizeStickyCTA();
    }
}

// Fonction pour minimiser le CTA
function minimizeStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');
    const btnSticky = document.querySelector('.btn-sticky');
    
    stickyCTA.classList.add('minimized');
    btnSticky.classList.add('minimized');
}

// Fonction pour agrandir le CTA
function expandStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');
    const btnSticky = document.querySelector('.btn-sticky');
    
    stickyCTA.classList.remove('minimized');
    btnSticky.classList.remove('minimized');
    
    // Auto-minimiser après 5 secondes
    setTimeout(() => {
        if (!stickyCTA.classList.contains('minimized')) {
            minimizeStickyCTA();
        }
    }, 5000);
}

// Messages d'urgence dynamiques
function updateUrgencyMessages() {
    const urgencyElements = document.querySelectorAll('.cta-urgency');
    
    urgencyElements.forEach(element => {
        // Calcul des places restantes (simulation)
        const placesLeft = Math.floor(Math.random() * 5) + 1;
        element.textContent = `⚡ Plus que ${placesLeft} places disponibles cette semaine`;
        
        // Animation clignotante subtile
        setInterval(() => {
            element.style.opacity = '0.7';
            setTimeout(() => {
                element.style.opacity = '1';
            }, 500);
        }, 3000);
    });
}

// === NAVIGATION ===

// Initialisation de la navigation
function initializeNavigation() {
    // Gestion du menu hamburger mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    if (navToggle && navMenu) {
        // Toggle du menu mobile
        navToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });
        
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Fermer le menu avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
        
        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }
    
    function openMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        body.style.overflow = 'hidden'; // Empêcher le scroll
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        body.style.overflow = ''; // Restaurer le scroll
    }
    
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
    
    // Console pour debug
    console.log('Conversion tracked:', eventName, eventData);
}

// === ANIMATIONS CSS DYNAMIQUES ===

// Ajout des animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: 'Lato', sans-serif;
    }
    
    /* Améliorations des interactions */
    .btn-primary:active,
    .btn-hero:active,
    .btn-cta-main:active {
        transform: scale(0.95) !important;
    }
    
    /* Curseur personnalisé sur les CTA */
    .btn-primary,
    .btn-hero,
    .btn-cta-main {
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    
    .btn-primary::before,
    .btn-hero::before,
    .btn-cta-main::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
    }
    
    .btn-primary:hover::before,
    .btn-hero:hover::before,
    .btn-cta-main:hover::before {
        width: 300px;
        height: 300px;
    }
`;

document.head.appendChild(style);

// === OPTIMISATIONS PERFORMANCE ===

// Lazy loading des images (si nécessaire)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}



// Initialisation des optimisations
initializeLazyLoading();

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
    // Créer un lien de téléchargement vers le vrai fichier PDF
    const link = document.createElement('a');
    link.href = 'Ebook Gratuit - Les bases de l\'immobilier.pdf';
    link.download = 'Ebook Gratuit - Les bases de l\'immobilier.pdf';
    
    // Déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Afficher une notification de succès
    showNotification('📥 Livre blanc téléchargé avec succès !', 'success');
    
    // Tracker la conversion
    trackConversion('white_paper_download', {
        content_name: 'Les 7 erreurs à éviter pour réussir son premier investissement locatif',
        content_category: 'lead_magnet'
    });
    
    // Optionnel : rediriger vers une page de remerciement après un délai
    setTimeout(() => {
        // window.location.href = '#contact'; // Redirection vers la section contact
    }, 2000);
}

// === GESTION DES ERREURS ===
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});