/* Caption Studio helper service worker.
   GitHub Pages cannot send the COOP/COEP headers that let a page use
   multiple CPU threads, so this worker adds them to every response.
   With it, the CPU transcription engine uses all cores instead of one. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;
  e.respondWith(
    fetch(r).then(res => {
      if (res.status === 0 || res.type === 'opaque') return res;
      const h = new Headers(res.headers);
      h.set('Cross-Origin-Embedder-Policy', 'credentialless');
      h.set('Cross-Origin-Opener-Policy', 'same-origin');
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
    }).catch(() => fetch(r))
  );
});
