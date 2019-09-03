import { deleteTextNodeInRuby, setCustomRuby } from './DocumentFixer';
import { ScrollableWrapper } from './ScrollableWrapper';
import { Slidepad } from './Slidepad';

// initialize
function initialize() {
  const wrapper = new ScrollableWrapper('div.content_wrapper');
  deleteTextNodeInRuby(wrapper.dom);
  setCustomRuby(document.querySelector('body'));
  const slidepad = new Slidepad(document.querySelector('div.slidepad'), wrapper);
}

window.addEventListener('DOMContentLoaded', initialize);
