const CACHE_NAME = "weather-pwa-v1";

const APP_FILES = [
    "./",
    "./src/api.js",
    "./src/app.js",
    "./src/db.js",
    "./styles/main.css",
    "./manifest.json",
    "./index.html"
];

self.addEventListener("install", (ev) => {
    ev.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
    self.skipWaiting();
});

self.addEventListener('fetch', (ev) => {
    ev.respondWith(
        caches.match(ev.request)
            .then((response) => {
                if (response) { return response; }
                return fetch(ev.request);
            })
    );
});

self.addEventListener('activate', (ev) => {
    const cacheWhitelist = [CACHE_NAME];
    ev.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});