// Nettoyage : ce service worker remplace celui du jeu installe par erreur a la racine du site.
// Il vide les caches, se desinstalle et recharge les pages ouvertes pour afficher le vrai site.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.map(k => caches.delete(k)));
    await self.registration.unregister();
    const cs = await self.clients.matchAll({ type: 'window' });
    cs.forEach(c => { try { c.navigate(c.url) } catch (err) {} });
  })());
});
