/*
 * Motion — dark-kitchen / c-custom
 *
 * moment         trigger          what moves                                           why
 * revealLines    scroll into view section words (data-reveal="lines") rise line by      the big condensed words are
 *                                 line out of a mask (SplitText)                       the design; they arrive, not blink
 * revealPhotos   scroll into view dish, combo, pickup and sign-up photos wipe up        food photos land one by one
 *                                 (data-reveal="photo", CSS clip-path transition)
 * cuisineNudge   switch change    hero app links rise in; the photo focus move and     shows that the buttons now
 *                                 the accent cross-fade are CSS (sections.css)         open the other listing
 * (CSS only)     dialog open      mobile menu wipes down, chooser sheet slides up      motion.css
 *
 * Reduced motion: no moments run and html.motion-ok is never set, so nothing starts hidden; the page is in its
 *                 final state. The switch still changes accent, label, links and photo focus instantly
 *                 (motion.css zeroes the CSS transitions).
 *
 * Needs gsap + SplitText (same pinned version, loaded before this file). Without them headlines simply show.
 * The edit panel uses window.pageMotion: revert() stops the moments, unsplitAll() / splitAll() give it plain DOM.
 */
(() => {
  "use strict";

  /* ── Tokens ─────────────────────────────────────────────────────────────── */

  const MOTION = {
    dur: { fast: 0.3, base: 0.6, lines: 0.9 }, // seconds
    ease: { out: "power3.out", lines: "expo.out" },
    stagger: { tight: 0.06, lines: 0.08 },
    dist: { rise: 12 }, // px
    wait: { font: 2500, failsafe: 3000 }, // ms: longest wait for a headline's font; headlines never stay hidden longer
  };

  const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
  const root = document.documentElement;
  const { gsap, SplitText } = window;

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  const q = (name) => document.querySelector(`[data-motion="${name}"]`);

  /** Runs callback once, the first time el scrolls into view. */
  function onceVisible(el, callback) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        callback();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
  }

  /** Resolves when el's own font is loaded (a split made in the fallback font has different line breaks). */
  function fontLoaded(el) {
    const style = getComputedStyle(el);
    const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const giveUp = new Promise((resolve) => setTimeout(resolve, MOTION.wait.font)); // motion-lint-disable-line timer-sequencing
    return Promise.race([document.fonts.load(font, el.textContent), giveUp]).catch(() => {});
  }

  /* ── Moments (in page order) ────────────────────────────────────────────── */

  /** One entry per headline: { el, split, tween, skipped }. */
  const headlines = [];

  /*
   * The split is never reverted when the animation ends: reverting re-wraps the plain text, and its line breaks
   * can differ from the animated ones. autoSplit re-splits (keeping the progress) if the font arrives late or
   * the viewport resizes.
   */
  function splitLines(entry, { animate }) {
    const { el } = entry;
    entry.split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        // Masks are exactly one line box tall. With tight display line-heights, descenders and diacritics
        // (g y p, Č Ř Ů) stick out and would be clipped: a clip-path that reaches past the box keeps the mask
        // effect and leaves room for the glyphs, without changing layout.
        self.masks.forEach((mask) => {
          mask.style.overflow = "visible";
          mask.style.clipPath = "inset(-0.25em -0.1em -0.35em -0.1em)";
        });
        el.classList.add("is-split");
        if (!animate) return;

        const firstSplit = !entry.tween;
        entry.tween = gsap.from(self.lines, {
          // start each line fully below its (extended) mask: line height + bottom room + top overhang
          y: (i, line) => line.offsetHeight + parseFloat(getComputedStyle(line).fontSize) * 0.65,
          duration: MOTION.dur.lines,
          ease: MOTION.ease.lines,
          stagger: MOTION.stagger.lines,
          paused: firstSplit, // plays when the headline scrolls into view
        });
        return entry.tween;
      },
    });
    el._kitSplit = entry.split; // read by check-linebreaks.mjs
  }

  function revealLines() {
    const els = [...document.querySelectorAll('[data-reveal="lines"]')];
    const showAll = () => els.forEach((el) => el.classList.add("is-split"));
    if (!gsap || !SplitText) return showAll();
    gsap.registerPlugin(SplitText);
    setTimeout(showAll, MOTION.wait.failsafe); // motion-lint-disable-line timer-sequencing

    for (const el of els) {
      const entry = { el, split: null, tween: null, skipped: false };
      headlines.push(entry);
      fontLoaded(el).then(() => {
        if (entry.split || entry.skipped) return;
        splitLines(entry, { animate: true });
        onceVisible(el, () => entry.tween?.play());
      });
    }
  }

  function revealPhotos() {
    document.querySelectorAll('[data-reveal="photo"]').forEach((el) => onceVisible(el, () => el.classList.add("is-in")));
  }

  function cuisineNudge(ctx) {
    const onChange = ctx.add(() => {
      const apps = q("hero-apps");
      if (!apps) return;
      gsap.from(apps.children, { y: MOTION.dist.rise, autoAlpha: 0, duration: MOTION.dur.fast, stagger: MOTION.stagger.tight });
    });
    document.addEventListener("cuisinechange", onChange);
    return () => document.removeEventListener("cuisinechange", onChange);
  }

  /* ── For the edit panel ─────────────────────────────────────────────────── */

  /** Plain DOM for contenteditable: reverts every split (and its tween). */
  function unsplitAll() {
    for (const entry of headlines) {
      if (!entry.split) {
        entry.skipped = true; // its font hasn't loaded yet: don't split it later either
        continue;
      }
      entry.tween?.revert();
      entry.tween = null;
      entry.split.revert();
      entry.split = null;
      entry.el._kitSplit = null;
    }
  }

  /** Back to the final state after editing: split again, no animation. */
  function splitAll() {
    for (const entry of headlines) {
      entry.skipped = false;
      if (!entry.split) splitLines(entry, { animate: false });
    }
  }

  /* ── Entry point ────────────────────────────────────────────────────────── */

  let mm = null;

  function init() {
    if (matchMedia(REDUCED_MOTION).matches) return; // final state: nothing is hidden without html.motion-ok
    root.classList.add("motion-ok");
    revealLines();
    revealPhotos();
    if (!gsap) return;

    gsap.defaults({ duration: MOTION.dur.base, ease: MOTION.ease.out });
    mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", (ctx) => cuisineNudge(ctx)); // cleanup runs on revert
  }

  window.pageMotion = {
    revert: () => mm?.revert(),
    unsplitAll,
    splitAll,
  };
  window.Site.motion = { init };
})();
