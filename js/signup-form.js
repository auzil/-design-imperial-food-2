/*
 * Sign-up form: e-mail + marketing consent → gift code. No backend in the prototype: a valid submit shows the success text.
 * Hooks: form[data-signup], [data-fields] (hidden on success), [data-error="email|consent"], [data-success].
 * Errors are written next to the field, announced (aria-live) and linked with aria-describedby in the HTML.
 */
(() => {
  "use strict";
  const Site = window.Site;

  function showError(input, box, message) {
    box.textContent = message;
    box.hidden = !message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function init() {
    const form = document.querySelector("[data-signup]");
    if (!form) return;
    const { t } = Site.i18n;
    const email = form.elements.namedItem("email");
    const consent = form.elements.namedItem("consent");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const emailOk = email.value.trim() !== "" && email.checkValidity();
      showError(email, form.querySelector('[data-error="email"]'), emailOk ? "" : t("signup.errors.email"));
      showError(consent, form.querySelector('[data-error="consent"]'), consent.checked ? "" : t("signup.errors.consent"));

      if (!emailOk) return email.focus();
      if (!consent.checked) return consent.focus();

      form.querySelector("[data-fields]").hidden = true;
      const success = form.querySelector("[data-success]");
      success.hidden = false;
      success.focus();
    });
  }

  Site.signupForm = { init };
})();
