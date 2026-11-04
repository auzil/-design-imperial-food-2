/*
 * Pizza / sushi state. Three independent choices:
 *
 *   hero     the hero switch (pizza on every load): hero photo focus, the "Objednej …:" label,
 *            the hero app links, and which menu section comes first
 *   context  the menu section in the middle of the viewport, else the hero choice → <body data-cuisine>
 *            (accent of the header button and the order bar)
 *   chooser  preset by chooser.js each time the chooser opens; its own switch changes only the chooser
 *
 * Hooks: input[name="cuisine"], input[name="cuisine-chooser"], [data-hero], [data-hero-order], #pizza, #sushi, #chooser.
 * Emits "cuisinechange" ({ cuisine }) on document when the hero choice changes (motion.js listens).
 */
(() => {
  "use strict";
  const Site = window.Site;
  const CUISINES = ["pizza", "sushi"];
  const other = (cuisine) => (cuisine === "pizza" ? "sushi" : "pizza");

  const state = {
    hero: "pizza",
    inView: null, // "pizza" | "sushi" | null
    chooser: "pizza",
  };

  const setRadios = (name, value) => {
    document.querySelectorAll(`input[name="${name}"]`).forEach((input) => (input.checked = input.value === value));
  };

  function updateContext() {
    document.body.dataset.cuisine = state.inView ?? state.hero;
  }

  /** The chosen cuisine's menu section comes first on the page and in the nav lists; the other one is flipped. */
  function putFirst(first) {
    const second = other(first);
    const firstSection = document.getElementById(first);
    const secondSection = document.getElementById(second);
    if (secondSection.compareDocumentPosition(firstSection) & Node.DOCUMENT_POSITION_FOLLOWING) {
      secondSection.before(firstSection);
    }
    firstSection.classList.remove("menu--flip");
    secondSection.classList.add("menu--flip");

    for (const link of document.querySelectorAll(`a[href="#${first}"]`)) {
      const item = link.closest("li") ?? link;
      const otherLink = item.parentElement.querySelector(`a[href="#${second}"]`);
      const otherItem = otherLink?.closest("li") ?? otherLink;
      if (otherItem?.parentElement === item.parentElement) otherItem.before(item);
    }
  }

  /** animate: the photo focus move is animated only after a tap; the first paint is already in place */
  function setHero(cuisine, { animate = false } = {}) {
    state.hero = cuisine;
    setRadios("cuisine", cuisine);

    const hero = document.querySelector("[data-hero]");
    hero.dataset.cuisine = cuisine;
    if (animate) hero.dataset.live = "";

    document.querySelector("[data-hero-order]").textContent = Site.i18n.t(`order.prompt.${cuisine}`);
    Site.render.apps("hero", cuisine);
    putFirst(cuisine);
    updateContext();
    document.dispatchEvent(new CustomEvent("cuisinechange", { detail: { cuisine } }));
  }

  function setChooser(cuisine) {
    state.chooser = cuisine;
    setRadios("cuisine-chooser", cuisine);
    document.getElementById("chooser").dataset.cuisine = cuisine;
    Site.render.apps("chooser", cuisine);
  }

  /** Tracks the menu section that crosses the middle of the viewport. */
  function watchSections() {
    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
        state.inView = CUISINES.find((cuisine) => visible.get(cuisine)) ?? null;
        updateContext();
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    CUISINES.forEach((cuisine) => observer.observe(document.getElementById(cuisine)));
  }

  function init() {
    document.addEventListener("change", (event) => {
      if (event.target.matches('input[name="cuisine"]')) setHero(event.target.value, { animate: true });
      if (event.target.matches('input[name="cuisine-chooser"]')) setChooser(event.target.value);
    });
    watchSections();
    setChooser(state.hero);
    setHero(state.hero);
  }

  Site.cuisine = {
    init,
    setHero,
    setChooser,
    get hero() {
      return state.hero;
    },
    get inView() {
      return state.inView;
    },
  };
})();
