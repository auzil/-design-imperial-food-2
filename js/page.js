/*
 * Small page behaviours that don't belong to one section:
 *
 *   solidHeader     [data-header] gets .is-solid once the page scrolls
 *   heroPhotoHeight [data-hero] gets --stack-h = height of [data-hero-body] (mobile photo height, see sections.css)
 *   inAppHint       [data-inapp-hint] shows in Instagram / TikTok / Facebook browsers, which may not hand off to the apps
 *   currentLanguage [data-lang-link] for this page's language gets aria-current="page"
 *   anchorScroll    a[href^="#"] scrolls smoothly (instant with reduced motion) and moves focus to the target;
 *                   data-no-scroll opts out
 *   orderBar        [data-sticky-cta] slides in once [data-sticky-anchor] (the hero app links) leaves the screen
 */
(() => {
  "use strict";
  const Site = window.Site;
  const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  function solidHeader() {
    const header = document.querySelector("[data-header]");
    const update = () => header.classList.toggle("is-solid", window.scrollY > 8);
    addEventListener("scroll", update, { passive: true });
    update();
  }

  function heroPhotoHeight() {
    const hero = document.querySelector("[data-hero]");
    const body = document.querySelector("[data-hero-body]");
    new ResizeObserver(() => hero.style.setProperty("--stack-h", `${body.offsetHeight}px`)).observe(body);
  }

  function inAppHint() {
    if (/Instagram|FBAN|FBAV|TikTok|musical_ly|Bytedance/i.test(navigator.userAgent)) {
      document.querySelector("[data-inapp-hint]").hidden = false;
    }
  }

  function currentLanguage() {
    document.querySelectorAll("[data-lang-link]").forEach((a) => {
      if (a.getAttribute("hreflang") === Site.i18n.locale) a.setAttribute("aria-current", "page");
    });
  }

  function anchorScroll() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || link.hasAttribute("data-no-scroll")) return;

      const hash = link.getAttribute("href");
      let target = null;
      try {
        target = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      } catch { /* malformed hash: let the browser handle it */ }
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      if (location.hash !== hash) history.pushState(null, "", hash);
      // keyboard and screen-reader users continue from the target, not from the link
      if (!target.matches("a, button, input, select, textarea, [tabindex]")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  function orderBar() {
    const bar = document.querySelector("[data-sticky-cta]");
    const anchor = document.querySelector("[data-sticky-anchor]");
    // while it is off screen (only translated away) the bar must not be focusable or announced
    const show = (visible) => {
      bar.classList.toggle("is-visible", visible);
      bar.inert = !visible;
      if (visible) bar.removeAttribute("aria-hidden");
      else bar.setAttribute("aria-hidden", "true");
    };
    show(false);
    new IntersectionObserver(([entry]) => show(!entry.isIntersecting)).observe(anchor);
  }

  function init() {
    solidHeader();
    heroPhotoHeight();
    inAppHint();
    currentLanguage();
    anchorScroll();
    orderBar();
  }

  Site.page = { init };
})();
