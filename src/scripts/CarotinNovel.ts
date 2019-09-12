import { ScrollableWrapper } from './scroll/ScrollableWrapper';
import { Loader } from './loader';
import { SlidepadManager } from './slidepad/SlidePadManager';
import { ScrollStateManager } from './scroll/ScrollStateManager';
import { deleteTextNodeInRuby, setCustomRuby } from './util';
import { Menu } from './menu';

export class CarotinNovel {
  private rootDom: HTMLDivElement;
  private wrapperDom: HTMLDivElement;
  private slidepadDom: HTMLDivElement;
  private loaderDom: HTMLDivElement;
  private bgDom: HTMLDivElement;

  private wrapper: ScrollableWrapper;
  private loader: Loader;
  private slidepad: SlidepadManager;
  private scrollManager: ScrollStateManager;
  private menu: Menu;

  constructor() {
    {
      const root = document.querySelector('div.carotin_novel');
      if (!root) {
        throw new Error('Could not get elements.');
      }
      this.rootDom = root as HTMLDivElement;
      const wrapper = root.querySelector('div.content_wrapper');
      if (!wrapper) {
        throw new Error('Could not get elements.');
      }
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
      let bg = this.rootDom.querySelector('bg_wrapper');
      if (!bg) {
        bg = document.createElement('div');
        bg.classList.add('bg_wrapper');
        this.rootDom.insertBefore(bg, this.wrapperDom);
      }
      this.bgDom = bg as HTMLDivElement;
    }
    this.scrollManager = new ScrollStateManager(this.wrapper);
    this.menu = new Menu({ page: { enable: true }, share: { enable: true } });
    this.rootDom.appendChild(this.menu.dom);
  }

  public start(): void {
    // start loading
    this.loader.set('circle');
    this.loader.show();
    // fix dom
    deleteTextNodeInRuby(this.wrapperDom);
    setCustomRuby(this.rootDom);
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
