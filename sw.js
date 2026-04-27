self.addEventListener("install", event => {
    console.log("Service Worker Installed");
});

self.addEventListener("fetch", event => {
    //for now: just pass requests through
});