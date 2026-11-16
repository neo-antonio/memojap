const C='memojap-v13',F=['./','index.html','style.css','app.js','data.js','icons.js','strokes.js','sentences.js','manifest.webmanifest','icon.svg'],OPT=['sad.png'];
// cache:'reload' skips the browser HTTP cache, so a new version never precaches stale copies of old files
const fresh=u=>new Request(u,{cache:'reload'});
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.add(fresh(u)))).then(()=>Promise.all(OPT.map(u=>c.add(fresh(u)).catch(()=>{}))))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
if(/^fonts\.g(oogleapis|static)\.com$/.test(u.hostname)){e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>m||fetch(r).then(n=>{c.put(r,n.clone());return n}).catch(()=>Response.error()))));return}
if(u.origin!==location.origin)return;
// page loads: the precached index.html (refreshed on every version bump)
if(r.mode==='navigate'){e.respondWith(caches.match('index.html').then(m=>m||fetch(r)));return}
// everything else: network first (always the latest when online), cache as the offline fallback
e.respondWith(fetch(r,{cache:'no-cache'}).then(n=>{if(n.ok&&n.type==='basic'){const cp=n.clone();caches.open(C).then(c=>c.put(r,cp))}return n}).catch(()=>caches.match(r,{ignoreSearch:true})))});
