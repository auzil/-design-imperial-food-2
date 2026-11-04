/*
 * Copy: picks the page language from <html lang>, looks up messages.js and fills the HTML hooks.
 *
 *   data-i18n="key"              text; {placeholders} come from FIELDS, or from child elements marked data-slot="name"
 *   data-i18n-lines="key"        headline: one <span class="line"> per item of the message array
 *   data-i18n-attr="attr:key,…"  attributes (aria-label, alt, placeholder)
 *   data-field="name"            a value from data.js (FIELDS)
 *   data-link-to="name"          an href from data.js (LINKS)
 */
(() => {
  "use strict";
  const Site = window.Site;
  const { data, messages } = Site;

  const DEFAULT_LOCALE = "cs";
  const pageLang = document.documentElement.lang;
  const locale = pageLang in messages ? pageLang : DEFAULT_LOCALE;

  /** A localized data value ({ cs, en, ru }) in this page's language; plain values pass through. */
  const localize = (value) =>
    value && typeof value === "object" && !Array.isArray(value) ? value[locale] ?? value[DEFAULT_LOCALE] : value;

  // destructured on purpose: export-final's path scanner takes the dotted property path for an icon file
  const { ico } = data.company;

  /** Values from data.js for copy ({name} in messages) and markup (data-field="name"). */
  const FIELDS = {
    brand: data.brand.name,
    street: data.address.street,
    city: `${data.address.city} – ${localize(data.address.district)}`,
    address: `${data.address.street}, ${data.address.city}`,
    area: localize(data.delivery.area),
    areaShort: localize(data.delivery.areaShort),
    hours: `${data.hours.open}–${data.hours.close}`,
    door: localize(data.door),
    phone: data.contacts.phone,
    email: data.contacts.email,
    company: data.company.name,
    ico,
    seat: data.company.seat,
  };

  /** Hrefs from data.js (data-link-to="name"). */
  const LINKS = {
    phone: `tel:${data.contacts.phone.replace(/\s/g, "")}`,
    email: `mailto:${data.contacts.email}`,
    instagram: data.contacts.instagram.url,
    tiktok: data.contacts.tiktok.url,
    maps: data.links["google.profile"].url,
  };

  const PLACEHOLDER = /\{(\w+)\}/g;

  /** Raw message (string or array) for a dotted key, in this language or Czech. */
  function message(key) {
    const find = (dict) => key.split(".").reduce((node, part) => node?.[part], dict);
    return find(messages[locale]) ?? find(messages[DEFAULT_LOCALE]);
  }

  /** Text for a key with {placeholders} filled from vars, then FIELDS. Unknown keys return the key itself. */
  function t(key, vars = {}) {
    const text = message(key);
    if (typeof text !== "string") return key;
    return text.replace(PLACEHOLDER, (_, name) => String(vars[name] ?? FIELDS[name] ?? ""));
  }

  /** Headline lines for a key (an array in messages.js). */
  function lines(key) {
    const value = message(key);
    return Array.isArray(value) ? value : [t(key)];
  }

  function setLines(el, items) {
    const spans = items.map((text) => {
      const span = document.createElement("span");
      span.className = "line";
      span.textContent = text;
      return span;
    });
    // a space between the lines keeps the text readable when copied or read without CSS
    el.replaceChildren(...spans.flatMap((span, i) => (i ? [" ", span] : [span])));
  }

  /** Text with live elements in it: {name} is replaced by the child marked data-slot="name" (a link, say). */
  function setTextWithSlots(el, key) {
    const slots = new Map([...el.querySelectorAll("[data-slot]")].map((slot) => [slot.dataset.slot, slot]));
    const parts = (message(key) ?? key).split(PLACEHOLDER); // odd items are placeholder names
    el.replaceChildren(...parts.map((part, i) => (i % 2 ? slots.get(part) ?? FIELDS[part] ?? "" : part)));
  }

  function applyCopy(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (el.querySelector("[data-slot]")) setTextWithSlots(el, key);
      else el.textContent = t(key);
    });
    root.querySelectorAll("[data-i18n-lines]").forEach((el) => setLines(el, lines(el.dataset.i18nLines)));
    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      for (const pair of el.dataset.i18nAttr.split(",")) {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        el.setAttribute(attr, t(key));
      }
    });
    root.querySelectorAll("[data-field]").forEach((el) => {
      el.textContent = FIELDS[el.dataset.field] ?? "";
    });
    root.querySelectorAll("[data-link-to]").forEach((el) => {
      const href = LINKS[el.dataset.linkTo];
      if (href) el.setAttribute("href", href);
    });
  }

  function init() {
    applyCopy();
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));
  }

  Site.i18n = { init, locale, t, lines, localize, applyCopy };
})();
