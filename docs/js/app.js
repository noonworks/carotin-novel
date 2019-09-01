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

// Scroll for Mobile devices
function setMobileScroll() {
  if (!window.DeviceOrientationEvent) { return; }
  let tilt;
  let offset;
  const wrapper = document.querySelector('div.content_wrapper');
  window.addEventListener('deviceorientation', e => {
    tilt = e.gamma;
    offset = offset || tilt;
    if ((tilt - offset) ** 2 > 9) {
      wrapper.scrollBy(Math.round((0.2 * (tilt - offset)) ** 3), 0);
    }
  });
  wrapper.addEventListener('touchend', () => {
    offset = tilt;
  });
}

function initialize() {
  deleteTextNodeInRuby();
  if (needsCustomRuby()) {
    document.querySelector('body').classList.add('custom_ruby');
  }
  setScrollEvent();
  setMobileScroll();
}

window.addEventListener('DOMContentLoaded', initialize);
