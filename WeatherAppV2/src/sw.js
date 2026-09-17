const CACHE_NAME = "weather-pwa-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "../src/app.js",
    "../src/db.js",
    '../styles"',
    "../styles/main.css",
    "../manifest.json"
];

self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))

    );

    self.skipWaiting();
});