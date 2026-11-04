/*
 * Page logic (no motion): language, rendering from data.js, app links, pizza/sushi switch,
 * open-now status, analytics stub, sign-up form. Runs before kit.js (defer order), so the kit
 * sees the rendered cards and the translated headlines.
 */
(() => {
  "use strict";
  const S = window.SITE;
  const root = document.documentElement;
  const lang = window.I18N[root.lang] ? root.lang : "cs";
  const dict = window.I18N[lang];
  const BASE = new URL(".", document.currentScript.src); // variant root, also from /en/ and /ru/
  const asset = (path) => new URL(path, BASE).href;
  const loc = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.cs : v);

  /* ---------- copy ---------- */
  const hoursText = `${S.hours.open}–${S.hours.close}`;
  const VARS = {
    address: `${S.address.street}, ${S.address.city}`,
    area: loc(S.delivery.areaShort),
    hours: hoursText,
    phone: S.contacts.phone,
    email: S.contacts.email,
    ico: S.company.ico,
  };
  const t = (key, vars = {}) =>
    (dict[key] ?? window.I18N.cs[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? VARS[k] ?? "");

  function applyCopy(scope = document) {
    scope.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    scope.querySelectorAll("[data-i18n-html]").forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
    scope.querySelectorAll("[data-i18n-attr]").forEach((el) =>
      el.dataset.i18nAttr.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":");
        el.setAttribute(attr.trim(), t(key.trim()));
      })
    );
    scope.querySelectorAll("[data-fill]").forEach((el) => (el.textContent = fill(el.dataset.fill)));
    scope.querySelectorAll("[data-contact]").forEach((a) => { const h = href(a.dataset.contact); if (h) a.href = h; });
  }
  function href(what) {
    const c = S.contacts;
    switch (what) {
      case "phone": return `tel:${c.phone.replace(/\s/g, "")}`;
      case "email": return `mailto:${c.email}`;
      case "instagram": return c.instagram?.url;
      case "tiktok": return c.tiktok?.url;
      default: return "";
    }
  }
  function fill(what) {
    switch (what) {
      case "brand": return S.brand.name;
      case "area": return loc(S.delivery.area);
      case "street": return S.address.street;
      case "city": return `${S.address.city} – ${loc(S.address.district)}`;
      case "hours": return hoursText;
      case "door": return loc(S.door);
      case "phone": return S.contacts.phone;
      case "email": return S.contacts.email;
      case "company": return S.company.name;
      case "seat": return S.company.seat;
      default: return "";
    }
  }

  /* ---------- rendering from data ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const sizeText = ([n, unit]) => `${n} ${t(`unit.${unit}`)}`;

  function dishCard(d) {
    const tags = d.tags.map((tag) => `<span class="tag tag--${tag}">${esc(t(`tag.${tag}`))}</span>`).join("");
    return `<li class="dish"${d.sample ? ' data-sample="true"' : ""}>
      <div class="dish__photo" data-reveal="photo"><img src="${asset(d.img)}" alt="${esc(d.name)}" width="720" height="720" loading="lazy" decoding="async"></div>
      <h3 class="dish__name t-h3">${esc(d.name)}</h3>
      <p class="dish__line">${esc(loc(d.line))}</p>
      <p class="dish__meta"><span class="dish__size tabular">${esc(sizeText(d.size))}</span>${tags}</p>
    </li>`;
  }
  document.querySelectorAll("[data-grid]").forEach((ul) => {
    ul.innerHTML = (S.dishes[ul.dataset.grid] || []).map(dishCard).join("");
  });

  const combos = document.getElementById("combos");
  if (combos) {
    if (!S.combos?.length) {
      combos.remove();
      document.querySelectorAll('a[href="#combos"]').forEach((a) => a.closest("li")?.remove());
    } else {
      combos.querySelector("[data-combos]").innerHTML = S.combos
        .map(
          (c) => `<li class="combo"${c.sample ? ' data-sample="true"' : ""}>
          <div class="combo__photo" data-reveal="photo"><img src="${asset(c.img)}" alt="${esc(loc(c.name))}" width="1000" height="671" loading="lazy" decoding="async"></div>
          <h3 class="combo__name t-h3">${esc(loc(c.name))}</h3>
          <p class="combo__line">${esc(loc(c.line))}</p>
        </li>`
        )
        .join("");
    }
  }
  // Why us renders only with 3+ true facts; with fewer the section is removed.
  const why = document.getElementById("why");
  if (why && (S.whyUs?.length ?? 0) < 3) why.remove();

  /* ---------- app buttons ---------- */
  // Three independent cuisine states:
  //   hero    — the hero switch (pizza on every load); drives the hero photo, label and buttons
  //   context — the menu section in view (#pizza / #sushi), else the hero choice; drives the bar/header accent
  //   chooser — set from context each time the chooser opens; its own switch only changes the chooser
  const CUISINES = ["pizza", "sushi"];
  let heroCuisine = "pizza"; // always opens on pizza
  let chooserCuisine = heroCuisine;
  let inView = null; // "pizza" | "sushi" | null
  const hero = document.querySelector(".hero");
  const chooser = document.getElementById("chooser");

  function renderApps(which) {
    document.querySelectorAll(which ? `[data-apps="${which}"]` : "[data-apps]").forEach((box) => {
      const mode = box.dataset.apps; // "pizza" | "sushi" | "hero" | "chooser"
      const c = mode === "hero" ? heroCuisine : mode === "chooser" ? chooserCuisine : mode;
      box.innerHTML = S.apps
        .map((app) => {
          const link = S.links[`${app.id}.${c}`];
          const aria = t("app.aria", { cuisine: t(`cuisine.${c}`), app: app.label });
          return `<a class="app" href="${esc(link.url)}" data-app="${app.id}" data-cuisine="${c}" data-track="${esc(box.dataset.track || "")}"${link.sample ? ' data-sample="true"' : ""} aria-label="${esc(aria)}">${esc(app.label)}</a>`;
        })
        .join("");
    });
  }
  const setRadios = (name, value) =>
    document.querySelectorAll(`input[name="${name}"]`).forEach((input) => (input.checked = input.value === value));

  /* ---------- pizza / sushi switch (signature) ---------- */
  function setHeroCuisine(next, { picked = false } = {}) {
    heroCuisine = next;
    setRadios("cuisine", next);
    if (hero) {
      hero.dataset.cuisine = next;
      if (picked) hero.dataset.live = ""; // the hero is zoomed from first paint (data-picked in HTML); only taps animate the focus move
    }
    const label = document.querySelector("[data-hero-order]");
    if (label) label.textContent = t(`pick.${next}`);
    renderApps("hero");
    orderSections(next);
    updateContext();
    document.dispatchEvent(new CustomEvent("cuisinechange", { detail: { cuisine: next } }));
  }
  // The chosen cuisine's menu goes first on the page (and in the nav); the second one takes the flipped layout.
  function orderSections(first) {
    const second = first === "pizza" ? "sushi" : "pizza";
    const a = document.getElementById(first), b = document.getElementById(second);
    if (!a || !b || a.nextElementSibling === b || (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      /* already in order */
    } else {
      b.before(a);
      window.ScrollTrigger?.refresh();
    }
    a.classList.remove("menu--flip");
    b.classList.add("menu--flip");
    document.querySelectorAll(`a[href="#${first}"]`).forEach((link) => {
      const item = link.closest("li") || link;
      const other = item.parentElement.querySelector(`a[href="#${second}"]`);
      const otherItem = other && (other.closest("li") || other);
      if (otherItem && otherItem.parentElement === item.parentElement) otherItem.before(item);
    });
  }
  function setChooserCuisine(next) {
    chooserCuisine = next;
    setRadios("cuisine-chooser", next);
    if (chooser) chooser.dataset.cuisine = next;
    renderApps("chooser");
  }
  function updateContext() {
    document.body.dataset.cuisine = inView || heroCuisine;
  }
  document.addEventListener("change", (e) => {
    if (e.target.matches('input[name="cuisine"]')) setHeroCuisine(e.target.value, { picked: true });
    if (e.target.matches('input[name="cuisine-chooser"]')) setChooserCuisine(e.target.value);
  });

  // Track the menu section that crosses the middle of the viewport.
  if ("IntersectionObserver" in window) {
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.dataset.cuisine, e.isIntersecting));
        inView = CUISINES.find((c) => seen.get(c)) || null;
        updateContext();
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    CUISINES.forEach((c) => { const sec = document.getElementById(c); if (sec) io.observe(sec); });
  }

  // Preselect the chooser before kit.js opens it (this listener is registered first: site.js loads before kit.js).
  document.addEventListener("click", (e) => {
    const opener = e.target.closest('[data-menu-open="chooser"]');
    if (!opener || !chooser) return;
    const fixed = opener.dataset.chooser === "combos" ? S.combosListing : undefined;
    const both = opener.dataset.chooser === "combos" && !CUISINES.includes(fixed);
    chooser.querySelectorAll("[data-chooser-one]").forEach((el) => (el.hidden = both));
    chooser.querySelector("[data-chooser-both]").hidden = !both;
    setChooserCuisine(both ? heroCuisine : fixed || inView || heroCuisine);
  });

  /* ---------- open-now status ---------- */
  const WEEKDAY = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  function pragueNow() {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: S.timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date())
      .reduce((o, p) => ((o[p.type] = p.value), o), {});
    return { day: WEEKDAY[parts.weekday], min: Number(parts.hour) * 60 + Number(parts.minute) };
  }
  function status() {
    const { day, min } = pragueNow();
    const { days, open, close } = S.hours;
    const openToday = days.includes(day);
    if (openToday && min >= toMin(open) && min < toMin(close)) return { open: true, text: t("status.open", { t: close }), barText: t("status.openBar", { t: close }) };
    if (openToday && min < toMin(open)) return { open: false, text: t("status.opens", { t: open }) };
    return { open: false, text: t("status.tomorrow", { t: open }) };
  }
  function renderStatus() {
    const s = status();
    document.querySelectorAll("[data-status]").forEach((el) => {
      el.dataset.open = String(s.open);
      el.querySelector("[data-status-text]").textContent = (el.classList.contains("bar__status") && s.barText) || s.text; // sticky bar has its own open-state copy
    });
  }

  /* ---------- analytics stub: app taps with source ---------- */
  const params = new URLSearchParams(location.search);
  try { if (params.get("utm_source")) sessionStorage.setItem("tr-src", params.get("utm_source")); } catch { /* ignore */ }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-app]");
    if (!a) return;
    let source = "direct";
    try { source = sessionStorage.getItem("tr-src") || "direct"; } catch { /* ignore */ }
    const props = { app: a.dataset.app, cuisine: a.dataset.cuisine, section: a.dataset.track, source, lang };
    window.plausible?.("App tap", { props }); // Plausible/Umami at port; no cookies
    console.info("[track] App tap", props);
  });

  /* ---------- sign-up form (no backend in the prototype) ---------- */
  const form = document.querySelector("[data-signup]");
  if (form) {
    const email = form.querySelector('input[type="email"]');
    const consent = form.querySelector('input[type="checkbox"]');
    const errEmail = form.querySelector('[data-error="email"]');
    const errConsent = form.querySelector('[data-error="consent"]');
    const setErr = (input, box, msg) => {
      box.textContent = msg || "";
      box.hidden = !msg;
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const okEmail = email.value.trim() !== "" && email.checkValidity();
      setErr(email, errEmail, okEmail ? "" : t("signup.errEmail"));
      setErr(consent, errConsent, consent.checked ? "" : t("signup.errConsent"));
      if (!okEmail) return email.focus();
      if (!consent.checked) return consent.focus();
      form.querySelector("[data-fields]").hidden = true;
      const done = form.querySelector("[data-success]");
      done.hidden = false;
      done.focus();
    });
  }

  /* ---------- other links and lines from data ---------- */
  document.querySelectorAll("[data-link]").forEach((a) => {
    const link = S.links[a.dataset.link];
    if (link) a.href = link.url;
  });
  const office = document.querySelector("[data-office]");
  if (office) {
    const tel = S.contacts.phone.replace(/\s/g, "");
    office.innerHTML = t("combos.office", {
      phone: `<a href="tel:${esc(tel)}">${esc(S.contacts.phone)}</a>`,
      email: `<a href="mailto:${esc(S.contacts.email)}">${esc(S.contacts.email)}</a>`,
    });
  }

  /* ---------- mobile hero: photo height = viewport minus the text stack ---------- */
  const heroBody = document.querySelector(".hero__body");
  if (hero && heroBody && "ResizeObserver" in window) {
    new ResizeObserver(() => hero.style.setProperty("--stack-h", `${heroBody.offsetHeight}px`)).observe(heroBody);
  }

  /* ---------- header: solid once the page scrolls ---------- */
  const header = document.querySelector("[data-header]");
  const onScroll = () => header?.classList.toggle("is-solid", window.scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- in-app browsers (Instagram, TikTok, Facebook) may not hand off to the apps ---------- */
  if (/Instagram|FBAN|FBAV|TikTok|musical_ly|Bytedance/i.test(navigator.userAgent)) {
    const hint = document.querySelector("[data-inapp-hint]");
    if (hint) hint.hidden = false;
  }

  /* ---------- language links ---------- */
  document.querySelectorAll("[data-lang-link]").forEach((a) => {
    if (a.getAttribute("hreflang") === lang) a.setAttribute("aria-current", "page");
  });

  /* ---------- boot ---------- */
  applyCopy();
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.desc"));
  renderApps();
  setChooserCuisine(heroCuisine);
  setHeroCuisine(heroCuisine);
  renderStatus();
  setInterval(renderStatus, 60_000);

  window.Site = { t, setHeroCuisine, setChooserCuisine, status };
})();
