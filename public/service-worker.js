const cacheName = "cache-v2";
const runtimeCacheName = "runtime-cache";
const assets = [
  "/",
  "/css/suggestion.css",
  "/css/form.css",
  "/css/global.css",
  "/css/suggestions.css",
  "/css/sent.css",
  "/css/offline.css",
  "/css/user.css",
  "/images/favicon.ico",
  "/images/strand-eiland.jpg",
  "/offline",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap",
  "https://kit.fontawesome.com/87a1015511.js",
];

const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size){
                cache.delete(keys[0].then(limitCacheSize(name,size)));
            }
        });
    });
};

self.addEventListener("install", (event) => {
  console.log("Installed service worker");

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll(assets).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Activating service worker");
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== cacheName && name !== runtimeCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Fetch");
  event.respondWith(
    caches
      .match(event.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(event.request).then((fetchRes) => {
            return caches.open(runtimeCacheName).then((cache) => {
              cache.put(event.request.url, fetchRes.clone());
              // limitCacheSize(cacheName,5);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/offline");
        }
      })
  );
});
