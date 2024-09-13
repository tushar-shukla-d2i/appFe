const CACHE_NAME = "my-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/service-worker.js",
  "/d2i_logo_192.jpg",
  "/vite.svg",
  "/manifest.json",
];

// Install event: cache necessary files
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[ServiceWorker] Caching app shell and assets");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("[ServiceWorker] Failed to cache", error);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("[ServiceWorker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve cached files when offline
self.addEventListener("fetch", (event) => {
  console.log("[ServiceWorker] Fetching resource:", event.request.url);

  // Handle only GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Cache hit - return the cached response
        if (response) {
          console.log("[ServiceWorker] Serving from cache:", event.request.url);
          return response;
        }

        // No cache - try to fetch from network
        return fetch(event.request).then((networkResponse) => {
          // Check if the network response is valid
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            console.log(
              "[ServiceWorker] Network request failed for:",
              event.request.url
            );
            return networkResponse;
          }

          // Cache the new network response for future requests
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            console.log(
              "[ServiceWorker] Cached new resource:",
              event.request.url
            );
            return networkResponse;
          });
        });
      })
      .catch((error) => {
        console.error("[ServiceWorker] Fetch failed; serving fallback.", error);
        // Fallback to index.html when offline (for single-page apps)
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      })
  );
});
