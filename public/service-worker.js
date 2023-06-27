const cacheName = 'cache-v9';
const runtimeCacheName = 'runtime-cache'
const assets = [
    '/',
    '/css/suggestion.css',
    '/css/form.css',
    '/css/global.css',
    '/css/suggestions.css',
    '/css/sent.css',
    '/css/offline.css',
    '/css/user.css',
    '/images/favicon.ico',
    '/images/strand-eiland.jpg',
    '/offline',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap',
    'https://kit.fontawesome.com/87a1015511.js',
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

self.addEventListener('fetch', event => {
    console.log('Fetch');
    if (isCoreGetRequest(event.request)) {
        event.respondWith(
            caches.open(cacheName)
                .then(cache => cache.match(event.request.url))
        );
    } else if (isHtmlGetRequest(event.request)) {
        event.respondWith(
            caches.open(runtimeCacheName)
                .then(cache => cache.match(event.request.url))
                .then(response => response ? response : fetchAndCache(event.request, runtimeCacheName))
                .catch(e => {
                    return caches.open(cacheName)
                        .then(cache => cache.match('/offline'))
                })
        );
    }
});

function isCoreGetRequest(request) {
    return request.method === 'GET' && assets.includes(getPathName(request.url));
}

function isHtmlGetRequest(request) {
    return request.method === 'GET' && 
    (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('text/html') > -1);
}

function fetchAndCache(request, cacheName) {
    return fetch(request)
        .then(response => {
            if (!response.ok) {
                throw new TypeError('Bad response status');
            }
            const clone = response.clone();
            caches.open(cacheName).then((cache) => cache.put(request, clone));
            limitCacheSize(cacheName,5);
            return response;
        })
}

function getPathName(requestUrl) {
    const url = new URL(requestUrl);
    return url.pathname;
}