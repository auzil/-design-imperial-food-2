/*
 * Modal dialogs (mobile menu, app chooser) on native <dialog>: focus trap, Esc and the inert page come from the browser.
 *
 *   [data-dialog-open="<id>"]  opens that dialog; aria-expanded follows on all its openers
 *   [data-dialog-close]        inside a dialog: closes it (so does any link inside it)
 *
 * Dispatches "dialog:open" ({ dialog, opener }) on document just before a dialog opens, so others can preset it.
 * Scroll lock is CSS (base.css, html:has(dialog[open])).
 */
(() => {
  "use strict";
  let lastOpener = null;

  function open(dialog, opener) {
    lastOpener = opener;
    document.dispatchEvent(new CustomEvent("dialog:open", { detail: { dialog, opener } }));
    dialog.showModal();
    opener.setAttribute("aria-expanded", "true");
  }

  function onClosed(dialog) {
    document.querySelectorAll(`[data-dialog-open="${dialog.id}"]`).forEach((b) => b.setAttribute("aria-expanded", "false"));
    // Give focus back to the opener, unless something else already took it (a link in the menu focuses its target).
    const focus = document.activeElement;
    if (!focus || focus === document.body || dialog.contains(focus)) lastOpener?.focus();
    lastOpener = null;
  }

  function init() {
    document.addEventListener("click", (event) => {
      const opener = event.target.closest("[data-dialog-open]");
      const dialog = opener && document.getElementById(opener.dataset.dialogOpen);
      if (!dialog) return;
      event.preventDefault();
      open(dialog, opener);
    });

    for (const dialog of document.querySelectorAll("dialog")) {
      // Listening on the dialog itself runs before document-level handlers, so the dialog is closed
      // (and the page scrolls again) before a link's anchor scroll starts.
      dialog.addEventListener("click", (event) => {
        if (event.target.closest("[data-dialog-close], a[href]")) dialog.close();
      });
      dialog.addEventListener("close", () => onClosed(dialog));
    }
  }

  window.Site.dialogs = { init };
})();
