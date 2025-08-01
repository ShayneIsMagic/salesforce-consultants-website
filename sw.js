// Service Worker for DevPipeline Salesforce Consulting
const CACHE_NAME = 'devpipeline-salesforce-v1.0';
const STATIC_CACHE = 'static-v1.0';
const DYNAMIC_CACHE = 'dynamic-v1.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/assets/logos/Salesforce_Consulting_Logo.svg',
    '/assets/SalesforceConsultants-Graphic.png',
    '/assets/Jason Fletcher Profile.JPG',
    '/assets/Shayne Roy Profile.png',
    '/services.html',
    '/contact.html',
    '/success-stories.html',
    '/expertise.html',
    '/clients.html'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (request.destination === 'image') {
        // Images: Cache first, then network
        event.respondWith(handleImageRequest(request));
    } else if (request.destination === 'style' || request.destination === 'script') {
        // CSS/JS: Cache first, then network
        event.respondWith(handleStaticRequest(request));
    } else if (request.destination === 'document') {
        // HTML: Network first, then cache
        event.respondWith(handleDocumentRequest(request));
    } else {
        // Default: Network first, then cache
        event.respondWith(handleDefaultRequest(request));
    }
});

// Handle image requests
async function handleImageRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Fetch from network
        const networkResponse = await fetch(request);
        
        // Cache the response
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Image fetch failed:', error);
        // Return a fallback image if available
        return caches.match('/assets/logos/Salesforce_Consulting_Logo.svg');
    }
}

// Handle static file requests (CSS, JS)
async function handleStaticRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Update cache in background
            fetch(request).then(response => {
                if (response.ok) {
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(request, response);
                    });
                }
            });
            return cachedResponse;
        }

        // Fetch from network
        const networkResponse = await fetch(request);
        
        // Cache the response
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Static file fetch failed:', error);
        return new Response('', { status: 404 });
    }
}

// Handle document requests (HTML)
async function handleDocumentRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Document fetch failed, trying cache:', error);
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page
        return caches.match('/index.html');
    }
}

// Handle default requests
async function handleDefaultRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Default fetch failed, trying cache:', error);
        // Fallback to cache
        return caches.match(request);
    }
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Handle any pending background tasks
        console.log('Service Worker: Processing background sync');
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update from DevPipeline Salesforce Consulting',
        icon: '/assets/logos/Salesforce_Consulting_Logo.svg',
        badge: '/assets/logos/Salesforce_Consulting_Logo.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Learn More',
                icon: '/assets/logos/Salesforce_Consulting_Logo.svg'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/logos/Salesforce_Consulting_Logo.svg'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('DevPipeline Salesforce Consulting', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
}); 