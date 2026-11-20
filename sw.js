const CACHE_NAME="ruchi-gnm-shell-v4";
const APP_FILES=["./","./index.html","./manifest.webmanifest","./icon.svg","./assets/book-covers/gnm-syllabus.svg","./assets/book-covers/anatomy-physiology.svg","./assets/book-covers/nursing-fundamentals.svg","./assets/book-covers/nursing-skills.svg","./assets/book-covers/nursing-pharmacology.svg"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("ruchi-gnm-shell-")&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).then(async response=>{
   if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone())}
   return response;
  }).catch(()=>caches.match(request).then(cached=>cached||caches.match("./index.html"))));
  return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(async response=>{
  if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone())}
  return response;
 })));
});
