/*
 * Motion — dark-kitchen / c-custom
 *
 * moment         trigger          what moves                                         why
 * heroSettle     load             hero photo scale 1.06 → 1                          the food "lands"; buttons stay still and usable
 * cuisineNudge   switch change    hero photo zooms (1 → 1.22) toward the chosen      shows what the switch changed
 *                                 dish (CSS transform-origin), "Objednej pizzu:"     the buttons now open the other listing
 *                                 label swaps, accent cross-fades, app labels rise
 * (kit)          load / scroll    hero H1 + section words: data-reveal="lines";      generic entrances, owned by kit.js
 *                                 dish/combo photos: data-reveal="photo"
 *
 * Reduced motion: no moments run; the page is in its final state. The switch still changes accent,
 *                 label, links and photo zoom instantly (kit.css zeroes the CSS transitions).
 *
 * Needs (in this order, all deferred): gsap, ScrollTrigger, SplitText (same pinned version), kit.js, motion.js.
 * <head> adds html.js-motion (failsafe timer removes it); CSS scales the hero photo only while that class is on.
 */

/* ── Tokens ─────────────────────────────────────────────────────────────── */

const MOTION = {
  dur: { fast: 0.3, base: 0.6 }, // seconds
  ease: { out: "power3.out" },
  stagger: { tight: 0.06 },
  dist: { rise: 12 }, // px
};

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ duration: MOTION.dur.base, ease: MOTION.ease.out });

/* ── Helpers ────────────────────────────────────────────────────────────── */

const q = (name, root = document) => root.querySelector(`[data-motion="${name}"]`);
const qa = (name, root = document) => [...root.querySelectorAll(`[data-motion="${name}"]`)];

/* ── Entry point ────────────────────────────────────────────────────────── */

const root = document.documentElement;
const mm = gsap.matchMedia();
mm.add({ motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
  if (!ctx.conditions.motion) return root.classList.remove("js-motion"); // reduced motion: final state
  root.classList.remove("js-motion"); // hero is pre-zoomed in HTML; nothing animates on load
  return cuisineNudge(ctx); // cleanup: removes the listener when matchMedia reverts
});

// The edit panel (and anything else that needs plain, editable DOM) can stop all motion.
window.pageMotion = {
  revert() {
    mm.revert();
    root.classList.remove("js-motion");
  },
};

/* ── Moments (in page order) ────────────────────────────────────────────── */

function cuisineNudge(ctx) {
  const onChange = ctx.add(() => {
    const apps = q("hero-apps");
    if (!apps) return;
    gsap.from(apps.children, { y: MOTION.dist.rise, autoAlpha: 0, duration: MOTION.dur.fast, stagger: MOTION.stagger.tight });
  });
  document.addEventListener("cuisinechange", onChange);
  return () => document.removeEventListener("cuisinechange", onChange);
}
