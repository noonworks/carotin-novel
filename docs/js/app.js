function needsCustomRuby() {
  const parser = new UAParser();
  const result = parser.getResult();
  if (!result || !result.browser || !result.device || !result.browser.name) { return false; }
  if (result.browser.name.toLowerCase() == 'chrome' && result.device.type != 'mobile') { return true; }
  return false;
}

// FOR EDGE
function deleteTextNodeInRuby() {
  const emptyVal = /^\s*$/;
  const rubies = document.querySelectorAll('.content_wrapper ruby');
  rubies.forEach((rby) => {
    rby.childNodes.forEach((c) => {
      if (c.nodeType == Node.TEXT_NODE && emptyVal.test(c.nodeValue)) {
        rby.removeChild(c);
      }
    });
  });
}

function initialize() {
  deleteTextNodeInRuby();
  if (needsCustomRuby()) {
    document.querySelector('body').classList.add('custom_ruby');
  }
}

window.addEventListener('DOMContentLoaded', initialize);
