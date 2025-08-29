// Service Worker pour optimiser les performances et le cache

const CACHE_NAME = 'immobilier-conseil-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/booking.html',
    '/styles.css',
    '/script.js?v=2024011501',
    '/Ebook Gratuit - Les bases de l\'immobilier.pdf'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    // Service Worker: Installation
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                // Service Worker: Mise en cache des ressources statiques
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(err => {/* Erreur de cache silencieuse */})
    );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
    // Service Worker: Activation
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
                        // Service Worker: Suppression ancien cache
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Stratégie de cache
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorer les requêtes non-HTTP
    if (!request.url.startsWith('http')) return;
    
    // Stratégie Cache First pour les ressources statiques
    if (STATIC_ASSETS.includes(url.pathname) || 
        request.destination === 'style' || 
        request.destination === 'script' || 
        request.destination === 'image') {
        
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(request)
                        .then(fetchResponse => {
                            const responseClone = fetchResponse.clone();
                            caches.open(STATIC_CACHE)
                                .then(cache => {
                                    cache.put(request, responseClone);
                                });
                            return fetchResponse;
                        });
                })
                .catch(() => {
                    // Fallback pour les images
                    if (request.destination === 'image') {
                        return new Response(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image indisponible</text></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    }
                })
        );
    }
    // Stratégie Network First pour les pages HTML
    else if (request.destination === 'document') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then(cache => {
                            cache.put(request, responseClone);
                        });
                    return response;
                })
                .catch(() => {
                    return caches.match(request)
                        .then(response => {
                            return response || caches.match('/index.html');
                        });
                })
        );
    }
});

// Gestion des messages du client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Nettoyage périodique du cache
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        caches.open(DYNAMIC_CACHE)
            .then(cache => {
                cache.keys().then(requests => {
                    // Garder seulement les 50 dernières entrées
                    if (requests.length > 50) {
                        const toDelete = requests.slice(0, requests.length - 50);
                        toDelete.forEach(request => {
                            cache.delete(request);
                        });
                    }
                });
            });
    }
});

// Préchargement intelligent
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PREFETCH') {
        const urls = event.data.urls;
        caches.open(DYNAMIC_CACHE)
            .then(cache => {
                urls.forEach(url => {
                    fetch(url)
                        .then(response => {
                            if (response.ok) {
                                cache.put(url, response);
                            }
                        })
                        .catch(err => {/* Erreur de préchargement silencieuse */});
                });
            });
    }
});