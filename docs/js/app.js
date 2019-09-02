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

// Virtual slide pad
function initializeSlidePad() {
  const padarea = document.querySelector('div.slidepad');
  const mgr = nipplejs.create({
    zone: padarea,
    color: 'white',
    size: 90,
    position: { left: '50%', top: '50%' },
    mode: 'static',
    lockY: true,
    restOpacity: 0.8
  });
}

function initialize() {
  deleteTextNodeInRuby();
  if (needsCustomRuby()) {
    document.querySelector('body').classList.add('custom_ruby');
  }
  setScrollEvent();
  initializeSlidePad();
}

window.addEventListener('DOMContentLoaded', initialize);
