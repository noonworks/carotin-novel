function needsCustomRuby() {
  const parser = new UAParser();
  const result = parser.getResult();
  if (!result || !result.browser || !result.device || !result.browser.name) { return false; }
  if (result.browser.name.toLowerCase() == 'chrome' && result.device.type != 'mobile') { return true; }
  return false;
}

function initialize() {
  if (needsCustomRuby()) {
    document.querySelector('body').classList.add('custom_ruby');
  }
}

window.addEventListener('DOMContentLoaded', initialize);
