/*
 * Data-driven lists, cloned from the <template>s at the end of index.html.
 *
 *   [data-grid="pizza|sushi"]  dish cards (#tpl-dish, #tpl-tag)
 *   [data-combos]              combo cards (#tpl-combo); no combos → the section and its nav links are removed
 *   [data-apps="…"]            app links (#tpl-app-link): "pizza" / "sushi" are fixed,
 *                              "hero" / "chooser" are re-rendered by cuisine.js when the choice changes
 */
(() => {
  "use strict";
  const Site = window.Site;
  const { data } = Site;

  // Image paths in data.js are relative to the page root; the en/ and ru/ pages live one folder down.
  const ROOT = new URL("../", document.currentScript.src);
  const asset = (path) => new URL(path, ROOT).href;

  const clone = (templateId) => document.getElementById(templateId).content.firstElementChild.cloneNode(true);
  const slot = (el, name) => el.querySelector(`[data-slot="${name}"]`);
  const markSample = (el, item) => {
    if (item.sample) el.dataset.sample = "true";
  };

  function dishCard(dish) {
    const { t, localize } = Site.i18n;
    const card = clone("tpl-dish");
    markSample(card, dish);

    const photo = slot(card, "photo");
    photo.src = asset(dish.img);
    photo.alt = dish.name;
    slot(card, "name").textContent = dish.name;
    slot(card, "line").textContent = localize(dish.line);

    const [amount, unit] = dish.size;
    slot(card, "size").textContent = `${amount} ${t(`dish.unit.${unit}`)}`;
    for (const tag of dish.tags) {
      const chip = clone("tpl-tag");
      chip.classList.add(`tag--${tag}`);
      chip.textContent = t(`dish.tag.${tag}`);
      slot(card, "meta").append(chip);
    }
    return card;
  }

  function comboCard(combo) {
    const { localize } = Site.i18n;
    const card = clone("tpl-combo");
    markSample(card, combo);

    const photo = slot(card, "photo");
    photo.src = asset(combo.img);
    photo.alt = localize(combo.name);
    slot(card, "name").textContent = localize(combo.name);
    slot(card, "line").textContent = localize(combo.line);
    return card;
  }

  function appLink(app, cuisine, track) {
    const { t } = Site.i18n;
    const link = data.links[`${app.id}.${cuisine}`];
    const a = clone("tpl-app-link");
    a.href = link.url;
    a.textContent = app.label;
    a.dataset.app = app.id;
    a.dataset.cuisine = cuisine;
    a.dataset.track = track;
    markSample(a, link);
    a.setAttribute("aria-label", t("order.appLabel", { cuisine: t(`order.cuisine.${cuisine}`), app: app.label }));
    return a;
  }

  /** Fills every [data-apps="<group>"] box with links to the given cuisine's listings. */
  function apps(group, cuisine) {
    document.querySelectorAll(`[data-apps="${group}"]`).forEach((box) => {
      box.replaceChildren(...data.apps.map((app) => appLink(app, cuisine, box.dataset.track ?? "")));
    });
  }

  function removeCombos() {
    document.getElementById("combos")?.remove();
    document.querySelectorAll('a[href="#combos"]').forEach((a) => (a.closest("li") ?? a).remove());
  }

  function init() {
    document.querySelectorAll("[data-grid]").forEach((list) => {
      list.replaceChildren(...(data.dishes[list.dataset.grid] ?? []).map(dishCard));
    });

    if (data.combos.length) document.querySelector("[data-combos]")?.replaceChildren(...data.combos.map(comboCard));
    else removeCombos();

    apps("pizza", "pizza");
    apps("sushi", "sushi");
  }

  Site.render = { init, apps };
})();
