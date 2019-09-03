import nipplejs from 'nipplejs';

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
  const scrollmgr = new SlideScrollManager();
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
    scrollmgr.setSpeed(data);
  }).on('start', () => {
    scrollmgr.start();
  }).on('end', () => {
    scrollmgr.stop();
  });
}

// slide scroll
class SlideScrollManager {
  constructor() {
    this._animationId = -1;
    this._resetSpeed();
    this._scrollStartPos = 0;
    this._scrollStartDt = null;
  }

  start() {
    window.cancelAnimationFrame(this._animationId);
    this._scrollStartPos = content_wrapper.scrollLeft;
    this._scrollStartDt = (new Date()).getTime();
    const loop = () => {
      this._draw();
      this._animationId = window.requestAnimationFrame(loop);
    };
    this._animationId = window.requestAnimationFrame(loop);
  }

  stop() {
    window.cancelAnimationFrame(this._animationId);
    this._animationId = -1;
    this._resetSpeed();
    this._scrollStartPos = 0;
    this._scrollStartDt = null;
  }

  setSpeed(data) {
    if (!data || !data.direction || !data.distance) {
      this._resetSpeed();
      return;
    }
    const direction = data.direction.y == 'up' ? 1 : -1;
    const distance = data.distance / SLIDE_PAD_SIZE;
    const speed = Math.pow(distance, 2) * direction;
    if (this._previous_speed != speed) {
      this._previous_speed = this._speed;
      this._speed = speed;
      this.start();
    }
  }

  _resetSpeed() {
    this._previous_speed = 0;
    this._speed = 0;
  }

  _draw() {
    if (!this._scrollStartDt) {
      return;
    }
    const t = (new Date()).getTime() - this._scrollStartDt;
    const pos = this._scrollStartPos + this._speed * t;
    scrollTo(pos, false);
  }
}

// scroll
function scrollLeft(x, smooth) {
  scrollTo(content_wrapper.scrollLeft + x, smooth);
}

function scrollTo(x, smooth) {
  content_wrapper.scrollTo({
    left: x,
    behavior: smooth ? 'smooth' : 'auto'
  });
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
