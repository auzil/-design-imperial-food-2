/*
 * Copy per language, nested by page section. Czech is also written in index.html (readable without JS);
 * en/ and ru/ are copies of index.html (build-langs.mjs) and i18n.js swaps in the copy for that language.
 *
 * - Keys are used in the HTML as dotted paths: data-i18n="hero.pickup".
 * - Headlines are arrays, one item per visual line (data-i18n-lines).
 * - {placeholders} are filled from data.js (see fields in i18n.js), or by elements marked data-slot.
 * - Tone: short, informal "ty" / "you" / "ты".
 */
const MESSAGES = {
  cs: {
    meta: {
      title: "Pizza a sushi s rozvozem, Praha 4 | Imperial Food",
      description: "Pizza a sushi s rozvozem z Chodova. Objednej přes Wolt, foodora nebo Bolt Food, nebo si to vyzvedni.",
    },
    skipLink: "Přeskočit na obsah",
    nav: {
      pizza: "Pizza",
      sushi: "Sushi",
      combos: "Sety",
      pickup: "Výdej",
      gift: "Dárek",
      menu: "Menu",
      close: "Zavřít",
    },
    lang: {
      label: "Jazyk",
    },
    status: {
      openUntil: "Otevřeno do {time}",
      opensAt: "Zavřeno, otevíráme v {time}",
      opensTomorrow: "Zavřeno, otevíráme zítra v {time}",
    },
    switch: {
      legend: "Na co máš chuť?",
      pizza: "Pizza",
      sushi: "Sushi",
    },
    order: {
      button: "Objednat",
      prices: "Aktuální ceny a celé menu najdeš v aplikacích.",
      appLabel: "Objednat {cuisine} v aplikaci {app}",
      cuisine: { pizza: "pizzu", sushi: "sushi" },
      heading: { pizza: "Objednej pizzu", sushi: "Objednej sushi" },
      prompt: { pizza: "Objednej pizzu:", sushi: "Objednej sushi:" },
    },
    hero: {
      title: ["Co dneska:", "pizza, nebo sushi?"],
      photoAlt: "Pizza v otevřené krabici a set sushi na kuchyňském pultu",
      pickup: "Výdej: {address}",
      inAppHint: "Aplikace se neotevřela? Otevři stránku v prohlížeči přes menu vpravo nahoře.",
    },
    facts: {
      delivery: { title: "Rozvoz", text: "{areaShort}. Přiveze ti to Wolt, foodora nebo Bolt Food." },
      pickup: { title: "Výdej", text: "Denně {hours}. V aplikaci zvol vyzvednutí." },
      gift: { title: "Dárek", text: "Za e-mail rolka nebo pití zdarma při výdeji." },
      prices: { title: "Ceny" },
    },
    pizza: {
      title: ["Pizza"],
      line: "Pár kousků z menu. Pizzy pečeme na 32 cm.",
    },
    sushi: {
      title: ["Sushi"],
      line: "Rolky a sety z menu. Počet kousků vidíš u každé.",
    },
    dish: {
      tag: { spicy: "pálivé", veg: "bez masa" },
      unit: { cm: "cm", pcs: "ks" },
    },
    combos: {
      title: ["Sety"],
      line: "Pro dva, pro partu i pro celou kancelář.",
      cta: "Vybrat aplikaci",
      office: "Objednávka do kanceláře pro víc lidí? Zavolej na {phone} nebo napiš na {email}.",
    },
    pickup: {
      title: ["Vyzvedni", "si to"],
      line: "Objednej v aplikaci, zvol vyzvednutí a přijď si pro to. Dárek za e-mail vydáváme jen tady.",
      address: "Adresa",
      hours: "Otevřeno",
      days: "Po–Ne",
      door: "Jak najít dveře",
      maps: "Otevřít v Mapách Google",
      mapAlt: "Plánek okolí výdejního okénka",
      doorPhotoAlt: "Vchod do provozovny Imperial Food: černá cedule nad prosklenými dveřmi",
    },
    signup: {
      title: ["Rolka nebo pití", "zdarma"],
      line: "Nech nám e-mail a pošleme ti kód. Ukážeš ho při výdeji a dostaneš rolku nebo pití.",
      photoAlt: "Rolky a limonáda na pultu výdejního okénka",
      emailLabel: "Tvůj e-mail",
      emailPlaceholder: "jmeno@email.cz",
      consent: "Chci od vás dostávat e-maily s novinkami a akcemi, 1–2× měsíčně. Odhlásit se můžu kdykoli.",
      privacyLink: "Jak chráníme tvoje údaje",
      submit: "Chci kód",
      terms: "Kód platí jednou na osobu a jen při vyzvednutí.",
      errors: {
        email: "Zkontroluj e-mail, něco v něm chybí.",
        consent: "Bez souhlasu ti kód poslat nemůžeme. Zaškrtni políčko.",
      },
      done: "Hotovo. Potvrď odkaz v e-mailu, který jsme ti poslali, a kód dorazí hned potom.",
    },
    footer: {
      office: "Firemní objednávky",
      follow: "Sleduj nás",
      company: "Provozovatel",
      companyId: "IČO {ico}",
      privacy: "Ochrana osobních údajů",
    },
    chooser: {
      title: "Kde objednáš?",
      sub: "Otevře se rovnou naše nabídka v aplikaci.",
    },
  },

  en: {
    meta: {
      title: "Pizza and sushi delivery, Prague 4 | Imperial Food",
      description: "Pizza and sushi delivered from Chodov. Order on Wolt, foodora or Bolt Food, or pick it up.",
    },
    skipLink: "Skip to content",
    nav: {
      pizza: "Pizza",
      sushi: "Sushi",
      combos: "Combos",
      pickup: "Pickup",
      gift: "Gift",
      menu: "Menu",
      close: "Close",
    },
    lang: {
      label: "Language",
    },
    status: {
      openUntil: "Open until {time}",
      opensAt: "Closed, opening at {time}",
      opensTomorrow: "Closed, opening tomorrow at {time}",
    },
    switch: {
      legend: "What are you craving?",
      pizza: "Pizza",
      sushi: "Sushi",
    },
    order: {
      button: "Order",
      prices: "Current prices and the full menu are in the apps.",
      appLabel: "Order {cuisine} on {app}",
      cuisine: { pizza: "pizza", sushi: "sushi" },
      heading: { pizza: "Order pizza", sushi: "Order sushi" },
      prompt: { pizza: "Order pizza:", sushi: "Order sushi:" },
    },
    hero: {
      title: ["Today’s pick:", "pizza or sushi?"],
      photoAlt: "Pizza in an open box and a sushi set on a kitchen counter",
      pickup: "Pickup: {address}",
      inAppHint: "App didn't open? Open this page in your browser from the menu at the top right.",
    },
    facts: {
      delivery: { title: "Delivery", text: "{areaShort}. Brought to you by Wolt, foodora or Bolt Food." },
      pickup: { title: "Pickup", text: "Daily {hours}. Choose pickup in the app." },
      gift: { title: "Gift", text: "Leave your e-mail, get a free roll or drink at pickup." },
      prices: { title: "Prices" },
    },
    pizza: {
      title: ["Pizza"],
      line: "A few from the menu. Our pizzas are 32 cm.",
    },
    sushi: {
      title: ["Sushi"],
      line: "Rolls and sets from the menu, pieces listed on each.",
    },
    dish: {
      tag: { spicy: "spicy", veg: "meat-free" },
      unit: { cm: "cm", pcs: "pcs" },
    },
    combos: {
      title: ["Combos"],
      line: "For two, for the crew, for the whole office.",
      cta: "Choose an app",
      office: "Big order for the office? Call {phone} or write to {email}.",
    },
    pickup: {
      title: ["Pick it", "up"],
      line: "Order in the app, choose pickup and come by. The e-mail gift is only handed out here.",
      address: "Address",
      hours: "Open",
      days: "Mon–Sun",
      door: "Finding the door",
      maps: "Open in Google Maps",
      mapAlt: "Street plan around the pickup hatch",
      doorPhotoAlt: "Entrance of the Imperial Food shop: black sign above a glass door",
    },
    signup: {
      title: ["A free roll", "or drink"],
      line: "Leave your e-mail and we send you a code. Show it at pickup and get a roll or a drink.",
      photoAlt: "Rolls and lemonade on the pickup hatch counter",
      emailLabel: "Your e-mail",
      emailPlaceholder: "name@email.com",
      consent: "Send me news and offers by e-mail, 1–2 times a month. I can unsubscribe any time.",
      privacyLink: "How we protect your data",
      submit: "Send me the code",
      terms: "One code per person, valid at pickup only.",
      errors: {
        email: "Check your e-mail, something's missing.",
        consent: "We can't send the code without your consent. Tick the box.",
      },
      done: "Done. Confirm the link in the e-mail we just sent, and the code arrives right after.",
    },
    footer: {
      office: "Office orders",
      follow: "Follow us",
      company: "Operator",
      companyId: "Company ID {ico}",
      privacy: "Privacy policy",
    },
    chooser: {
      title: "Where do you order?",
      sub: "Opens our listing in the app.",
    },
  },

  ru: {
    meta: {
      title: "Доставка пиццы и суши, Прага 4 | Imperial Food",
      description: "Пицца и суши с доставкой с Ходова. Закажи в Wolt, foodora или Bolt Food, или забери сам.",
    },
    skipLink: "Перейти к содержанию",
    nav: {
      pizza: "Пицца",
      sushi: "Суши",
      combos: "Сеты",
      pickup: "Самовывоз",
      gift: "Подарок",
      menu: "Меню",
      close: "Закрыть",
    },
    lang: {
      label: "Язык",
    },
    status: {
      openUntil: "Открыто до {time}",
      opensAt: "Закрыто, откроемся в {time}",
      opensTomorrow: "Закрыто, откроемся завтра в {time}",
    },
    switch: {
      legend: "Что хочешь?",
      pizza: "Пицца",
      sushi: "Суши",
    },
    order: {
      button: "Заказать",
      prices: "Актуальные цены и всё меню ищи в приложениях.",
      appLabel: "Заказать {cuisine} в {app}",
      cuisine: { pizza: "пиццу", sushi: "суши" },
      heading: { pizza: "Заказать пиццу", sushi: "Заказать суши" },
      prompt: { pizza: "Закажи пиццу:", sushi: "Закажи суши:" },
    },
    hero: {
      title: ["Что сегодня:", "пицца или суши?"],
      photoAlt: "Пицца в открытой коробке и сет суши на кухонном столе",
      pickup: "Самовывоз: {address}",
      inAppHint: "Приложение не открылось? Открой страницу в браузере через меню справа вверху.",
    },
    facts: {
      delivery: { title: "Доставка", text: "{areaShort}. Привезёт Wolt, foodora или Bolt Food." },
      pickup: { title: "Самовывоз", text: "Ежедневно {hours}. В приложении выбери самовывоз." },
      gift: { title: "Подарок", text: "Оставь e-mail и получи ролл или напиток бесплатно при самовывозе." },
      prices: { title: "Цены" },
    },
    pizza: {
      title: ["Пицца"],
      line: "Немного из меню. Все пиццы 32 см.",
    },
    sushi: {
      title: ["Суши"],
      line: "Роллы и сеты из меню, у каждого указано количество.",
    },
    dish: {
      tag: { spicy: "острое", veg: "без мяса" },
      unit: { cm: "см", pcs: "шт." },
    },
    combos: {
      title: ["Сеты"],
      line: "На двоих, для компании и для всего офиса.",
      cta: "Выбрать приложение",
      office: "Большой заказ в офис? Звони {phone} или пиши на {email}.",
    },
    pickup: {
      title: ["Забери", "сам"],
      line: "Закажи в приложении, выбери самовывоз и приходи. Подарок за e-mail выдаём только здесь.",
      address: "Адрес",
      hours: "Открыто",
      days: "Пн–Вс",
      door: "Как найти дверь",
      maps: "Открыть в Google Картах",
      mapAlt: "Схема улиц у окна выдачи",
      doorPhotoAlt: "Вход в Imperial Food: чёрная вывеска над стеклянной дверью",
    },
    signup: {
      title: ["Ролл или напиток", "бесплатно"],
      line: "Оставь e-mail, и мы пришлём код. Покажи его при самовывозе и получи ролл или напиток.",
      photoAlt: "Роллы и лимонад на стойке окна выдачи",
      emailLabel: "Твой e-mail",
      emailPlaceholder: "imya@email.cz",
      consent: "Хочу получать письма с новостями и акциями, 1–2 раза в месяц. Отписаться можно в любой момент.",
      privacyLink: "Как мы защищаем данные",
      submit: "Получить код",
      terms: "Один код на человека, только при самовывозе.",
      errors: {
        email: "Проверь e-mail, в нём чего-то не хватает.",
        consent: "Без согласия мы не можем прислать код. Отметь галочку.",
      },
      done: "Готово. Подтверди ссылку в письме, которое мы прислали, и код придёт сразу после этого.",
    },
    footer: {
      office: "Заказы для офиса",
      follow: "Мы в соцсетях",
      company: "Оператор",
      companyId: "IČO {ico}",
      privacy: "Политика конфиденциальности",
    },
    chooser: {
      title: "Где закажешь?",
      sub: "Откроется наша страница в приложении.",
    },
  },
};

window.Site = window.Site || {};
window.Site.messages = MESSAGES;
