// Basic Service Worker for Cloudflare Drop PWA
const CACHE_NAME = 'cloudflare-drop-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/web/main.tsx',
  '/logo.png',
  '/logo.svg',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Don't cache API responses or large files
            if (
              event.request.url.includes('/api/') ||
              event.request.url.includes('/files/')
            ) {
              return fetchResponse
            }

            // Clone the response
            const responseToCache = fetchResponse.clone()

            // Cache the response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return fetchResponse
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/')
            }
          })
      })
  )
})

// Background sync for file uploads (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'file-upload-sync') {
    event.waitUntil(
      // Handle background file upload sync
      console.log('Background sync triggered for file upload')
    )
  }
})

// Push notifications (if supported)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body || 'File sharing update',
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'file-notification',
      requireInteraction: false,
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/logo.png'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'Cloudflare Drop', options)
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
