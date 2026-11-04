/*
 * Site data — Imperial Food (c-custom prototype).
 * The ONE place for app links, hours, address, contacts and dishes. Editing this file never touches the layout.
 * Anything with `sample: true` is a prototype placeholder (listed in clients/dark-kitchen/TODO-OWNER.md).
 * Port: this object becomes data/site.json.
 */
window.SITE = {
  brand: { name: "Imperial Food", sample: true }, // temporary working name

  // Order links. Keys exactly as in the brief. A listing merge only changes these values.
  // No /go/ redirects: buttons link straight here; the tap is reported to analytics just before leaving.
  links: {
    "wolt.pizza":    { url: "https://wolt.com/cs/cze/prague/restaurant/testo-a-ryze-pizza", sample: true },
    "wolt.sushi":    { url: "https://wolt.com/cs/cze/prague/restaurant/testo-a-ryze-sushi", sample: true },
    "foodora.pizza": { url: "https://www.foodora.cz/restaurant/tr4p/testo-a-ryze-pizza", sample: true },
    "foodora.sushi": { url: "https://www.foodora.cz/restaurant/tr4s/testo-a-ryze-sushi", sample: true },
    "bolt.pizza":    { url: "https://food.bolt.eu/cs-CZ/2-prague/p/48213-testo-a-ryze-pizza", sample: true },
    "bolt.sushi":    { url: "https://food.bolt.eu/cs-CZ/2-prague/p/48214-testo-a-ryze-sushi", sample: true },
    "google.profile": { url: "https://www.google.com/maps/search/?api=1&query=Krejnick%C3%A1+2021/1,+148+00+Praha+4", sample: true },
  },
  apps: [
    { id: "wolt", label: "Wolt" },
    { id: "foodora", label: "foodora" },
    { id: "bolt", label: "Bolt Food" },
  ],

  // Opening hours drive the "Otevřeno do …" status. ISO weekdays 1 = Monday … 7 = Sunday.
  timeZone: "Europe/Prague",
  hours: { sample: true, days: [1, 2, 3, 4, 5, 6, 7], open: "11:00", close: "22:00" },

  address: {
    sample: true,
    street: "Krejnická 2021/1",
    city: "148 00 Praha 4",
    district: { cs: "Chodov", en: "Chodov", ru: "Ходов" },
  },
  delivery: {
    sample: true,
    area: {
      cs: "Vozíme po Praze 4 a okolí.",
      en: "We deliver around Prague 4 and nearby.",
      ru: "Доставляем по Праге 4 и окрестностям.",
    },
    areaShort: { cs: "Praha 4 a okolí", en: "Prague 4 and nearby", ru: "Прага 4 и окрестности" },
  },
  door: {
    sample: true,
    cs: "Hledej černou ceduli IMPERIAL FOOD nad vchodem. Dveře jsou prosklené, přímo z ulice, vedle okna s plakátem.",
    en: "Look for the black IMPERIAL FOOD sign above the entrance. The glass door opens straight onto the street, next to the window with the poster.",
    ru: "Ищи чёрную вывеску IMPERIAL FOOD над входом. Стеклянная дверь прямо с улицы, рядом с окном с плакатом.",
  },
  contacts: {
    sample: true,
    phone: "+420 734 218 560",
    email: "objednavky@testoaryze.cz",
    instagram: { handle: "@testoaryze", url: "https://www.instagram.com/testoaryze/" },
    tiktok: { handle: "@testoaryze", url: "https://www.tiktok.com/@testoaryze" },
  },
  company: { sample: true, name: "Imperial Food s.r.o.", ico: "217 45 397", seat: "Krejnická 2021/1, 148 00 Praha 4" },

  // Sign-up gift (which one and who checks the code: TODO owner)
  gift: { sample: true },

  // Dishes: names stay as in the apps; lines are 2–4 key ingredients. No prices on the page.
  dishes: {
    pizza: [
      { id: "margherita", name: "Margherita", img: "media/pizza-margherita-1.webp", size: [32, "cm"], tags: ["veg"], sample: true,
        line: { cs: "rajčata San Marzano, mozzarella, bazalka", en: "San Marzano tomatoes, mozzarella, basil", ru: "томаты Сан-Марцано, моцарелла, базилик" } },
      { id: "diavola", name: "Diavola", img: "media/pizza-diavola-1.webp", size: [32, "cm"], tags: ["spicy"], sample: true,
        line: { cs: "pikantní salám, mozzarella, chilli", en: "spicy salami, mozzarella, chilli", ru: "острая салями, моцарелла, чили" } },
      { id: "quattro-formaggi", name: "Quattro formaggi", img: "media/pizza-quattro-formaggi-1.webp", size: [32, "cm"], tags: ["veg"], sample: true,
        line: { cs: "mozzarella, gorgonzola, parmazán, eidam", en: "mozzarella, gorgonzola, parmesan, edam", ru: "моцарелла, горгонзола, пармезан, эдам" } },
      { id: "prosciutto-funghi", name: "Prosciutto e funghi", img: "media/pizza-prosciutto-funghi-1.webp", size: [32, "cm"], tags: [], sample: true,
        line: { cs: "šunka, žampiony, mozzarella", en: "ham, mushrooms, mozzarella", ru: "ветчина, шампиньоны, моцарелла" } },
      { id: "tonno-cipolla", name: "Tonno e cipolla", img: "media/pizza-tonno-cipolla-1.webp", size: [32, "cm"], tags: [], sample: true,
        line: { cs: "tuňák, červená cibule, olivy", en: "tuna, red onion, olives", ru: "тунец, красный лук, оливки" } },
      { id: "salsiccia", name: "Salsiccia", img: "media/pizza-salsiccia-1.webp", size: [32, "cm"], tags: [], sample: true,
        line: { cs: "italská klobása, pečené brambory, rozmarýn", en: "Italian sausage, roast potatoes, rosemary", ru: "итальянская колбаска, печёный картофель, розмарин" } },
    ],
    sushi: [
      { id: "philadelphia", name: "Philadelphia roll", img: "media/sushi-philadelphia-1.webp", size: [8, "pcs"], tags: [], sample: true,
        line: { cs: "losos, krémový sýr, okurka", en: "salmon, cream cheese, cucumber", ru: "лосось, сливочный сыр, огурец" } },
      { id: "california", name: "California roll", img: "media/sushi-california-1.webp", size: [8, "pcs"], tags: [], sample: true,
        line: { cs: "krab, avokádo, okurka, tobiko", en: "crab, avocado, cucumber, tobiko", ru: "краб, авокадо, огурец, тобико" } },
      { id: "spicy-tuna", name: "Spicy tuna roll", img: "media/sushi-spicy-tuna-1.webp", size: [8, "pcs"], tags: ["spicy"], sample: true,
        line: { cs: "tuňák, spicy mayo, jarní cibulka", en: "tuna, spicy mayo, spring onion", ru: "тунец, спайси-майо, зелёный лук" } },
      { id: "avocado-maki", name: "Avocado maki", img: "media/sushi-avocado-maki-1.webp", size: [6, "pcs"], tags: ["veg"], sample: true,
        line: { cs: "avokádo, sezam", en: "avocado, sesame", ru: "авокадо, кунжут" } },
      { id: "sake-nigiri", name: "Sake nigiri", img: "media/sushi-sake-nigiri-1.webp", size: [2, "pcs"], tags: [], sample: true,
        line: { cs: "losos na rýži", en: "salmon on rice", ru: "лосось на рисе" } },
      { id: "set-salmon-lover", name: "Set Salmon Lover", img: "media/sushi-set-salmon-1.webp", size: [24, "pcs"], tags: [], sample: true,
        line: { cs: "Philadelphia, California, sake maki, sake nigiri", en: "Philadelphia, California, sake maki, sake nigiri", ru: "Филадельфия, Калифорния, саке маки, саке нигири" } },
    ],
  },

  // Which listing sells the combos (owner question, see TODO-OWNER.md): "pizza" | "sushi" | null.
  // null = the "Vybrat aplikaci" button under Sety offers both listings side by side.
  combosListing: null,

  // Combos: the block renders only if this list has items. Real combos: TODO owner.
  combos: [
    { id: "pro-dva", img: "media/combo-pro-dva-cc.webp", sample: true,
      name: { cs: "Pro dva", en: "For two", ru: "На двоих" },
      line: { cs: "1 pizza 32 cm a 1 rolka (8 ks)", en: "1 pizza 32 cm and 1 roll (8 pcs)", ru: "1 пицца 32 см и 1 ролл (8 шт.)" } },
    { id: "pro-partu", img: "media/combo-pro-partu-cc.webp", sample: true,
      name: { cs: "Pro partu", en: "For the crew", ru: "Для компании" },
      line: { cs: "2 pizzy 32 cm a set 24 ks", en: "2 pizzas 32 cm and a 24-piece set", ru: "2 пиццы 32 см и сет на 24 шт." } },
    { id: "do-kanclu", img: "media/combo-do-kanclu-cc.webp", sample: true,
      name: { cs: "Do kanclu", en: "For the office", ru: "В офис" },
      line: { cs: "3 pizzy 32 cm a 2 sety (48 ks)", en: "3 pizzas 32 cm and 2 sets (48 pcs)", ru: "3 пиццы 32 см и 2 сета (48 шт.)" } },
  ],

  // Why us: needs 3 true facts from the owner. Fewer than 3 → the block is not rendered.
  whyUs: [],
};
