import { deleteTextNodeInRuby, setCustomRuby } from './DocumentFixer';
import { ScrollableWrapper } from './ScrollableWrapper';
import { Slidepad } from './Slidepad';
import { ScrollStateManager } from './ScrollStateManager';
import { Loader } from './loader';

// initialize
function initialize() {
  const wrapper = new ScrollableWrapper('div.content_wrapper');
  // start loading
  const loader = new Loader(document.querySelector('body'));
  loader.set('circle');
  loader.show();
  // fix dom
  deleteTextNodeInRuby(wrapper.dom);
  setCustomRuby(document.querySelector('body'));
  // add parts
  const slidepad = new Slidepad(document.querySelector('div.slidepad'), wrapper);
  // scroll document to bookmarks
  const scrollStateManager = new ScrollStateManager(wrapper);
  scrollStateManager.restore().then(() => {
    // start events
    scrollStateManager.start();
    // finish loading
    loader.hide();
  }).catch((reason: any) => {
    console.log(reason);
    // finish loading
    loader.hide();
  });
}

window.addEventListener('DOMContentLoaded', initialize);
