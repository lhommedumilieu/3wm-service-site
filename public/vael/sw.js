const V='vael-v60';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','confidentialite.html','cgv.html'];
const MUS=["boss.mp3", "brumeval.mp3", "desert.mp3", "donjon.mp3", "givrecroc.mp3", "ruines.mp3", "titre.mp3", "victoire.mp3", "village.mp3"].map(f=>'musique/'+f);
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim()).then(()=>caches.open(V)).then(c=>Promise.all(MUS.map(u=>c.match(u).then(r=>r||c.add(u).catch(()=>{}))))))});
async function ranged(req,res){const r=req.headers.get('range');if(!r)return res;const b=await res.blob(),m=/bytes=(\d*)-(\d*)/.exec(r);if(!m)return res;
  const st=m[1]?+m[1]:0,en=m[2]?+m[2]:b.size-1;return new Response(b.slice(st,en+1),{status:206,headers:{'Content-Type':res.headers.get('Content-Type')||'audio/mpeg','Content-Range':`bytes ${st}-${en}/${b.size}`,'Content-Length':String(en-st+1),'Accept-Ranges':'bytes'}})}
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
  const isMus=q.url.includes('/musique/');
  const isPage=q.mode==='navigate'||/\/(index\.html)?$/.test(new URL(q.url).pathname);
  if(isPage){e.respondWith(caches.open(V).then(async c=>{try{const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),6000);const r=await fetch(q,{cache:'no-store',signal:ctl.signal});clearTimeout(tm);if(r.ok)c.put('index.html',r.clone());return r}catch(err){return (await c.match('index.html'))||Response.error()}}));return}
  e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(q.url.split('#')[0],{ignoreSearch:true});
    if(hit)return isMus?ranged(q,hit):hit;
    if(isMus){c.add(q.url).catch(()=>{});return fetch(q)}
    try{const r=await fetch(q);if(r.ok&&q.mode==='navigate')c.put('index.html',r.clone());return r}catch(err){return (await c.match('index.html'))||Response.error()}}))});
