import { deleteTextNodeInRuby, setCustomRuby } from './DocumentFixer';
import { ScrollableWrapper } from './ScrollableWrapper';
import { Slidepad } from './Slidepad';
import { ScrollStateManager } from './ScrollStateManager';
import { Loader } from './loader';

// initialize
function initialize() {
  const body = document.querySelector('body');
  const wrapperDom = document.querySelector('div.content_wrapper') as HTMLElement;
  const loaderDom = document.querySelector('div.loader') as HTMLElement;
  if (!body || !wrapperDom || !loaderDom) {
    // show error
    return;
  }
  const wrapper = new ScrollableWrapper(wrapperDom);
  // start loading
  const loader = new Loader(loaderDom);
  loader.set('circle');
  loader.show();
  // fix dom
  deleteTextNodeInRuby(wrapper.dom);
  setCustomRuby(body);
  // add parts
  const slidepad = document.querySelector('div.slidepad');
  if (slidepad) {
    new Slidepad(slidepad as HTMLElement, wrapper);
  }
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
