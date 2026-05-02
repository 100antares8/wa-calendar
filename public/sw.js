// Service Worker — 和暦カレンダー
// アプリ更新が端末に届くよう、HTML・JS はネットワーク優先（キャッシュはオフライン用フォールバックのみ）
const CACHE = "wa-calendar-v2";
const PRECACHE = ["/manifest.json", "/icon-192.png", "/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (url.pathname.startsWith("/api/")) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ error: "オフライン中です" }), {
          headers: { "Content-Type": "application/json" }
        })
      )
    );
    return;
  }

  // ページ本体（ナビゲーション）はネットワーク優先 → 更新が iPhone / iPad に確実に届く
  if (e.request.mode === "navigate" || e.request.destination === "document") {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok && sameOrigin) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // その他（_next 静的ファイルなど）もネットワーク優先。成功時のみキャッシュを更新
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok && sameOrigin) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
