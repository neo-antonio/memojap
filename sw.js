const C='memojap-v10',F=['./','index.html','style.css','app.js','data.js','icons.js','strokes.js','sentences.js','manifest.webmanifest','icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{if(/^fonts\.g(oogleapis|static)\.com$/.test(new URL(e.request.url).hostname)){e.respondWith(caches.open(C).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n}).catch(()=>Response.error()))));return}e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
