import { ScrollableWrapper } from './scroll/ScrollableWrapper';
import { Loader } from './loader';
import { SlidepadManager } from './slidepad/SlidePadManager';
import { ScrollStateManager } from './scroll/ScrollStateManager';
import { deleteTextNodeInRuby, setCustomRuby } from './util';

export class CarotinNovel {
  private bodyDom: HTMLBodyElement;
  private wrapperDom: HTMLDivElement;
  private slidepadDom: HTMLDivElement;
  private loaderDom: HTMLDivElement;
  private bgDom: HTMLDivElement;

  private wrapper: ScrollableWrapper;
  private loader: Loader;
  private slidepad: SlidepadManager;
  private scrollManager: ScrollStateManager;

  constructor() {
    {
      const body = document.querySelector('body');
      const wrapper = document.querySelector('div.carotin_novel');
      if (!body || !wrapper) {
        throw new Error('Could not get elements.');
      }
      this.bodyDom = body;
      this.wrapperDom = wrapper as HTMLDivElement;
      this.wrapper = new ScrollableWrapper(this.wrapperDom);
    }
    {
      let slidepad = this.wrapperDom.querySelector('div.slidepad');
      if (!slidepad) {
        slidepad = document.createElement('div');
        slidepad.classList.add('slidepad');
        this.wrapperDom.appendChild(slidepad);
      }
      this.slidepadDom = slidepad as HTMLDivElement;
      this.slidepad = new SlidepadManager(this.slidepadDom, this.wrapper);
      this.slidepad.show();
    }
    {
      let loader = this.wrapperDom.querySelector('div.loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.classList.add('loader');
        this.wrapperDom.appendChild(loader);
      }
      this.loaderDom = loader as HTMLDivElement;
      this.loader = new Loader(this.loaderDom);
    }
    {
      let bg = this.bodyDom.querySelector('bg_wrapper');
      if (!bg) {
        bg = document.createElement('div');
        bg.classList.add('bg_wrapper');
        this.bodyDom.insertBefore(bg, this.wrapperDom);
      }
      this.bgDom = bg as HTMLDivElement;
    }
    this.scrollManager = new ScrollStateManager(this.wrapper);
  }

  public start(): void {
    // start loading
    this.loader.set('circle');
    this.loader.show();
    // fix dom
    deleteTextNodeInRuby(this.wrapperDom);
    setCustomRuby(this.bodyDom);
    // scroll document to bookmarks
    this.scrollManager
      .restore()
      .then(() => {
        // start events
        this.scrollManager.start();
        // finish loading
        this.loader.hide();
      })
      .catch((reason: Error) => {
        console.log(reason);
        // start events
        this.scrollManager.start();
        // finish loading
        this.loader.hide();
      });
  }
}
