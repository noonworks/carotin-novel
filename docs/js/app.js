// FOR DESKTOP CHROME
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

// Scroll for Desktop Browsers
function setScrollEvent() {
  const wrapper = document.querySelector('div.content_wrapper');
  if (wrapper) {
    wrapper.addEventListener('mousewheel', e => {
      if (e.deltaX != 0) { return; }
      e.stopPropagation();
      e.preventDefault();
      wrapper.scrollLeft += e.deltaY * -1;
    }, { passive: false });
  }
}

function initialize() {
  deleteTextNodeInRuby();
  if (needsCustomRuby()) {
    document.querySelector('body').classList.add('custom_ruby');
  }
  setScrollEvent();
}

window.addEventListener('DOMContentLoaded', initialize);
