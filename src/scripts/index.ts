import { deleteTextNodeInRuby, setCustomRuby } from './DocumentFixer';
import { ScrollableWrapper } from './ScrollableWrapper';
import { Slidepad } from './Slidepad';
import { ScrollStateManager } from './ScrollStateManager';

// initialize
function initialize() {
  const wrapper = new ScrollableWrapper('div.content_wrapper');
  deleteTextNodeInRuby(wrapper.dom);
  setCustomRuby(document.querySelector('body'));
  const slidepad = new Slidepad(document.querySelector('div.slidepad'), wrapper);
  const scrollStateManager = new ScrollStateManager(wrapper.dom);
  scrollStateManager.start();
}

window.addEventListener('DOMContentLoaded', initialize);
