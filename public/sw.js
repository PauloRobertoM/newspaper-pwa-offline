var CACHE_STATIC_NAME = 'static-v10';
var CACHE_DYNAMIC_NAME = 'dynamic-v10';
var STATIC_FILES = [
    './index.html',
    './offline.html',
    './dist/styles.css',
    './dist/scripts.js',
    './dist/images/logo.png',
    'https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900',
];

self.addEventListener('install', function(event){
    console.log('[Service Worker] Instalando o Service Worker...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
        .then(function(cache){
            console.log('[Service Worker] App Precaching');
            return cache.addAll(STATIC_FILES);
        }).catch(function(){
            console.error('Failed to cache', error);
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
    console.log('TESTE ', cachePath);
    return array.indexOf(cachePath) > -1;
}

self.addEventListener('fetch', function(e){
    console.log('[Service Worker] Requisição', e);
    e.respondWith(
        caches.match(e.request).then(function(r) {
              console.log('[Service Worker] Fetching resource: '+e.request.url);
          return r || fetch(e.request).then(function(response) {
                    return caches.open(CACHE_STATIC_NAME).then(function(cache) {
              console.log('[Service Worker] Caching new resource: '+e.request.url);
              cache.put(e.request, response.clone());
              return response;
            });
          });
        })
      );
});


 