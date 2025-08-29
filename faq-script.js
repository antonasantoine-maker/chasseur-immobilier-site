// FAQ Simple Toggle JavaScript

function toggleAnswer(button) {
    // Trouver l'élément de réponse associé
    const faqItem = button.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    
    // Vérifier si la réponse est actuellement visible
    const isVisible = answer.style.display !== 'none';
    
    if (isVisible) {
        // Masquer la réponse
        answer.style.display = 'none';
        button.textContent = '↓';
        button.classList.remove('active');
    } else {
        // Afficher la réponse
        answer.style.display = 'block';
        button.textContent = '↑';
        button.classList.add('active');
        
        // Scroll vers la question pour une meilleure UX
        setTimeout(() => {
            faqItem.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }
}

// Pas d'animation d'entrée - les éléments FAQ sont immédiatement visibles
document.addEventListener('DOMContentLoaded', function() {
    // Le code d'animation d'entrée a été supprimé pour afficher immédiatement les questions
});