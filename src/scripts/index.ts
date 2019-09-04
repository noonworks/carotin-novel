import { deleteTextNodeInRuby, setCustomRuby } from './DocumentFixer';
import { ScrollableWrapper } from './ScrollableWrapper';
import { Slidepad } from './Slidepad';
import { ScrollStateManager } from './ScrollStateManager';
import { Loader } from './loader';

// initialize
function initialize() {
  const wrapper = new ScrollableWrapper('div.content_wrapper');
  // start loading
  const loader = new Loader(wrapper.dom);
  loader.set('circle');
  loader.show();
  // fix dom
  deleteTextNodeInRuby(wrapper.dom);
  setCustomRuby(document.querySelector('body'));
  // add parts
  const slidepad = new Slidepad(document.querySelector('div.slidepad'), wrapper);
  const scrollStateManager = new ScrollStateManager(wrapper.dom);
  // start events
  scrollStateManager.start();
  // finish loading
  setTimeout(() => {
    loader.hide();
  }, 1500); // dummy
}

window.addEventListener('DOMContentLoaded', initialize);
