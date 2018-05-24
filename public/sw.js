var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
var STATIC_FILES = [
    '/',
    'index.html',
    'dist/styles.css',
    'dist/scripts.js',
    'dist/images/logo.png',
    'https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900',
];

self.addEventListener('install', function(event){
    console.log('[Service Worker] Instalando o Service Worker...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
        .then(function(cache){
            console.log('[Service Worker] App Precaching');
            cache.addAll(STATIC_FILES);
        })
    );
});

self.addEventListener('activate', function(event){
    console.log('[Service Worker] Ativando Service Worker...', event);
    event.waitUntil(
        caches.keys()
        .then(function(keyList){
            return Promise.all(keyList.map( function(key) {
                if(key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME){
                    console.log('[Service Worker] Removendo cache antiga.', key);
                    return caches.delete(key);
                }
            }))
        })
    );
    return self.clients.claim();
});

function isInArray(string, array) {
    var cachePath;
    if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
        console.log('matched ', string);
        cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else {
        cachePath = string; // store the full request (for CDNs)
    }
    return array.indexOf(cachePath) > -1;
}

self.addEventListener('fetch', function(event){
    console.log('[Service Worker] Requisição', event);

    var url = 'https://httpbin.org/get';
    if (event.request.url.indexOf(url) > -1) {
        event.respondWith(
            caches.open(CACHE_DYNAMIC_NAME)
                .then(function (cache) {
                    return fetch(event.request)
                        .then(function(res) {
                            cache.put(event.request, res.clone());
                            return res;
                        })
                })
        );
    } else if (isInArray(event.request.url, STATIC_FILES)) {
        event.respondWith(
            caches.match(event.request)
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    if(response){
                        return response;
                    } else {
                        return fetch(event.request)
                            .then(function(res) {
                                return caches.open(CACHE_DYNAMIC_NAME)
                                    .then(function(cache){
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            })
                            .catch(function (erro) {
                                return caches.open(CACHE_STATIC_NAME)
                                    .then(function(cache){
                                        if(event.request.headers.get('accept').includes('text.html')){
                                            return cache.match('/offline.html');
                                        }
                                    })
                            })
                    }
                })
        );
    }
});


 