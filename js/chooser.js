/*
 * App chooser presets. Each time #chooser opens ("dialog:open" from dialogs.js), its content depends on the opener:
 *
 *   combos button (data-chooser="combos")  data.combosListing, or both listings side by side while it is null
 *   header button, order bar               the menu section in view, else the hero choice
 *
 * Hooks inside #chooser: [data-chooser-one] (switch + one listing), [data-chooser-both] (both listings).
 */
(() => {
  "use strict";
  const Site = window.Site;

  function preset(event) {
    const { dialog, opener } = event.detail;
    if (dialog.id !== "chooser") return;
    const { data, cuisine } = Site;

    const fromCombos = opener?.dataset.chooser === "combos";
    const listing = fromCombos ? data.combosListing : null;
    const showBoth = fromCombos && !listing;

    dialog.querySelectorAll("[data-chooser-one]").forEach((el) => (el.hidden = showBoth));
    dialog.querySelector("[data-chooser-both]").hidden = !showBoth;
    cuisine.setChooser(showBoth ? cuisine.hero : listing ?? cuisine.inView ?? cuisine.hero);
  }

  function init() {
    document.addEventListener("dialog:open", preset);
  }

  Site.chooser = { init };
})();
