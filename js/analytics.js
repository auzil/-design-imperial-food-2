/*
 * Analytics stub: reports every app-link tap ("App tap" { app, cuisine, section, source, lang }) to Plausible
 * if it is on the page (cookieless). The source is the first utm_source of the visit. Add ?debug to log taps to the console.
 * Hooks: a[data-app] with data-cuisine and data-track (set by render.js).
 */
(() => {
  "use strict";
  const Site = window.Site;
  const SOURCE_KEY = "tr-src";
  const params = new URLSearchParams(location.search);
  const debug = params.has("debug");

  // sessionStorage can throw (private mode, blocked storage): tracking must never break the page
  const session = {
    get(key) {
      try { return sessionStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
    },
  };

  function onTap(event) {
    const link = event.target.closest("a[data-app]");
    if (!link) return;
    const props = {
      app: link.dataset.app,
      cuisine: link.dataset.cuisine,
      section: link.dataset.track,
      source: session.get(SOURCE_KEY) ?? "direct",
      lang: Site.i18n.locale,
    };
    window.plausible?.("App tap", { props });
    if (debug) console.info("[track] App tap", props);
  }

  function init() {
    const source = params.get("utm_source");
    if (source) session.set(SOURCE_KEY, source);
    document.addEventListener("click", onTap);
  }

  Site.analytics = { init };
})();
