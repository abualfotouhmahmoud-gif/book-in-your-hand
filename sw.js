// Book in Your Hand — service worker: works offline and receives PDFs shared from other apps.
const CACHE = 'biyh-v11';
const ASSETS = [
  './', './index.html', './pdf.min.js', './pdf.worker.min.js', './three.min.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== 'biyh-share').map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // "Share → Book in Your Hand": keep the shared PDFs, then open the app to add them to the library
  if (e.request.method === 'POST' && url.pathname.endsWith('/share-target')) {
    e.respondWith((async () => {
      try {
        const form = await e.request.formData();
        const files = form.getAll('pdf');
        const cache = await caches.open('biyh-share');
        let i = 0;
        for (const f of files) {
          if (!f || !f.size) continue;
          await cache.put('./shared/' + Date.now() + '-' + (i++),
            new Response(f, {headers: {'Content-Type': 'application/pdf', 'X-Name': encodeURIComponent(f.name || 'book.pdf')}}));
        }
      } catch (_) {}
      return Response.redirect('./?shared=1', 303);
    })());
    return;
  }

  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  // the app page itself: always try the newest version first, fall back to the saved copy offline
  if (e.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
    e.respondWith((async () => {
      try {
        const res = await fetch(e.request, {cache: 'no-cache'});
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; }
        throw 0;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match(e.request, {ignoreSearch: true})) || Response.error();
      }
    })());
    return;
  }

  // other app files (PDF engine, icons): cache first, then network (and keep a fresh copy)
  e.respondWith((async () => {
    const cached = await caches.match(e.request, {ignoreSearch: true});
    const network = fetch(e.request).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => null);
    return cached || (await network) || (e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error());
  })());
});
