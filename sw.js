const CACHE_NAME = "gmplayer-v1"

const ASSETS = [
    "/",
    "/index.html",
    "/style.css",
    "/GoblinAE.js"
];


self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
    
});

self.addEventListener("fetch", event => {
    event.resondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});