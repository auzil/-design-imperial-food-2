/*
 * Boot. Every module in js/ only defines itself on window.Site; this file starts them, in this order:
 * copy first (the others read translated text), then lists and state, behaviours, and motion last
 * (it splits the final, translated headlines and watches the rendered cards).
 * Scripts are deferred, so the DOM is parsed when this runs.
 */
(() => {
  "use strict";
  const Site = window.Site;

  Site.i18n.init();
  Site.render.init();
  Site.cuisine.init();
  Site.dialogs.init();
  Site.chooser.init();
  Site.status.init();
  Site.signupForm.init();
  Site.analytics.init();
  Site.page.init();
  Site.motion.init();
})();
