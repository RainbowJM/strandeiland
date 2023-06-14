const cacheName = 'cache-v1';
const runtimeCacheName = 'runtime-cache'
const assets = [
    '/',
    '/css/style.css',
    '/css/detail-page.css',
    '/css/form.css',
    '/css/global.css',
    '/css/overview-page.css',
    '/css/sent.css',
    '/img/favicon.ico',
];


self.addEventListener('install', event => {
    console.log('Installed service worker');

    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                cache.addAll(assets)
                    .then(() => self.skipWaiting());
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Activating service worker')
    event.waitUntil(
        caches.keys()
            .then(names => {
                return Promise.all(names
                    .filter(name => name !== cacheName && name !== runtimeCacheName)
                    .map(key => caches.delete(key)))
            })
    )
});

