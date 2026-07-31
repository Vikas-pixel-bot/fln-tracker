const CACHE_NAME = "fln-pwa-v3";
const OFFLINE_URL = "/";

// Core routes and assets needed immediately offline
const APP_SHELL = [
  "/",
  "/assessments/live",
  "/students",
  "/resources",
  "/resources/simulations",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Precache the app shell
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Bypass API routes, server actions, and non-GET requests
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/image") || // Image optimization endpoint
    request.method !== "GET"
  ) {
    return;
  }

  // 2. Next.js Static Assets (JS, CSS, Chunks) -> Stale-While-Revalidate
  // Fast boot time offline, updates cache in background if online.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(() => {
          // If offline and not in cache, let it fail gracefully
        });
        
        // Return cached immediately if available, else wait for network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Media Assets (Images, SVGs, Fonts) -> Cache-First
  // Saves bandwidth for heavy tribal art and humanoid bot assets.
  const isMediaAsset = 
    request.destination === "image" || 
    request.destination === "font" || 
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg");

  if (isMediaAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(() => {
          // Offline fallback for images could go here
        });
      })
    );
    return;
  }

  // 4. HTML Pages & Navigation -> Network-First
  // Ensures we get the freshest data if online, but falls back to cache if offline.
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(async () => {
        // Network failed (offline). Try cache for this specific route.
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        
        // If the exact page isn't cached, return the offline fallback shell (Home)
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // 5. Default Fallback -> Cache-First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
        });
        return networkResponse;
      });
    }).catch(() => {
       // Ignore generic fetch errors
    })
  );
});
