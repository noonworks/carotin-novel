const SLIDE_PAD_SIZE = 45;

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
  content_wrapper.addEventListener('mousewheel', e => {
    if (e.deltaX != 0) { return; }
    e.stopPropagation();
    e.preventDefault();
    scrollLeft(e.deltaY * -1);
  }, { passive: false });
}

// Virtual slide pad
function initializeSlidePad() {
  const padarea = document.querySelector('div.slidepad');
  const slide_pad_manager = nipplejs.create({
    zone: padarea,
    color: 'white',
    size: SLIDE_PAD_SIZE * 2,
    position: { left: '50%', top: '50%' },
    mode: 'static',
    lockY: true,
    restOpacity: 0.8
  });
  slide_pad_manager.on('move', (e, data) => {
    slide_scroll_data = data;
  }).on('start', () => {
    startSlideScroll();
  }).on('end', () => {
    stopSlideScroll();
  });
}

// slide scroll
let slide_scroll_id = -1;
let slide_scroll_prev_dt;
let slide_scroll_data;
function startSlideScroll() {
  window.cancelAnimationFrame(slide_scroll_id);
  const loop = () => {
    doSlideScroll();
    slide_scroll_id = window.requestAnimationFrame(loop);
  };
  slide_scroll_prev_dt = (new Date()).getTime();
  slide_scroll_id = window.requestAnimationFrame(loop);
}
function stopSlideScroll() {
  window.cancelAnimationFrame(slide_scroll_id);
  slide_scroll_id = -1;
  slide_scroll_data = undefined;
  slide_scroll_prev_dt = undefined;
}
function doSlideScroll() {
  if (!slide_scroll_prev_dt) {
    stopSlideScroll();
    return;
  }
  if (!slide_scroll_data || !slide_scroll_data.direction || !slide_scroll_data.distance) {
    return;
  }
  const cur = (new Date()).getTime();
  if (cur - slide_scroll_prev_dt < 50) {
    return;
  }
  slide_scroll_prev_dt = cur;
  const direction = slide_scroll_data.direction.y == 'up' ? 1 : -1;
  const distanceRate = slide_scroll_data.distance / SLIDE_PAD_SIZE;
  const speed = 10 * Math.pow(distanceRate, 2);
  scrollLeft(speed * direction);
}

// scroll
function scrollLeft(x, smooth) {
  content_wrapper.scrollTo({
    left: content_wrapper.scrollLeft + x,
    behavior: smooth ? 'smooth' : 'auto'
  });
  // content_wrapper.scrollLeft += x;
}

// initialize
let content_wrapper;
function initialize() {
  content_wrapper = document.querySelector('div.content_wrapper');
  deleteTextNodeInRuby();
  if (needsCustomRuby()) {
    document.querySelector('body').classList.add('custom_ruby');
  }
  setScrollEvent();
  initializeSlidePad();
}

window.addEventListener('DOMContentLoaded', initialize);
