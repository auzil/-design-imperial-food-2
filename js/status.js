/*
 * Open-now status ("Otevřeno do 22:00" / "Zavřeno, otevíráme v 11:00") from data.hours, in Prague time.
 * Hooks: [data-status] gets data-open="true|false"; its [data-status-text] gets the text. Refreshes every minute.
 */
(() => {
  "use strict";
  const Site = window.Site;
  const REFRESH_MS = 60_000;
  const ISO_WEEKDAY = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  /** Weekday (1 = Monday) and minutes since midnight in the business's time zone. */
  function localNow() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: Site.data.timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const part = (type) => parts.find((p) => p.type === type).value;
    return { day: ISO_WEEKDAY[part("weekday")], minutes: Number(part("hour")) * 60 + Number(part("minute")) };
  }

  /** @returns {{ open: boolean, text: string }} */
  function current() {
    const { t } = Site.i18n;
    const { days, open, close } = Site.data.hours;
    const { day, minutes } = localNow();
    const openToday = days.includes(day);

    if (openToday && minutes >= toMinutes(open) && minutes < toMinutes(close)) {
      return { open: true, text: t("status.openUntil", { time: close }) };
    }
    if (openToday && minutes < toMinutes(open)) {
      return { open: false, text: t("status.opensAt", { time: open }) };
    }
    return { open: false, text: t("status.opensTomorrow", { time: open }) };
  }

  function render() {
    const status = current();
    document.querySelectorAll("[data-status]").forEach((el) => {
      el.dataset.open = String(status.open);
      el.querySelector("[data-status-text]").textContent = status.text;
    });
  }

  function init() {
    render();
    setInterval(render, REFRESH_MS);
  }

  Site.status = { init, current };
})();
