// Service Worker de MisFinanzas.
// Estrategia: intenta red primero (para tener siempre la versión más nueva).
// Si la red falla o se corta (celular con mala señal), sirve la última copia
// buena guardada en el celular en vez de dejar la pantalla en blanco.
const CACHE='misfinanzas-shell-v1';
const SHELL='./misfinanzas.html';

self.addEventListener('install',function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){return c.add(SHELL);}));
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'||e.request.url.indexOf('misfinanzas.html')>=0){
    e.respondWith(
      fetch(e.request).then(function(resp){
        var copy=resp.clone();
        caches.open(CACHE).then(function(c){c.put(SHELL,copy);});
        return resp;
      }).catch(function(){
        return caches.match(SHELL);
      })
    );
  }
});
