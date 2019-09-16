import { ScrollableWrapper } from './scroll/ScrollableWrapper';
import { Loader } from './loader';
import { SlidepadManager } from './slidepad/SlidePadManager';
import { ScrollStateManager } from './scroll/ScrollStateManager';
import { deleteTextNodeInRuby, setCustomRuby, addDummyForEdge } from './util';
import { Menu } from './menu';
import { ThemeManagerInstance } from './theme/ThemeManager';
import { StoreManagerInstance } from './store/StoreManager';

export class CarotinNovel {
  private rootDom: HTMLDivElement;
  private wrapperDom: HTMLDivElement;
  private slidepadDom: HTMLDivElement;
  private loaderDom: HTMLDivElement;
  private bgDom: HTMLDivElement;
  private fgDom: HTMLDivElement;

  private wrapper: ScrollableWrapper;
  private loader: Loader;
  private slidepad: SlidepadManager;
  private scrollManager: ScrollStateManager;
  private menu: Menu;

  public applyConfig(): void {
    const config = StoreManagerInstance.config;
    ThemeManagerInstance.apply(config.theme);
    {
      const pos = config.slidepad.position;
      this.slidepad.hide();
      switch (pos) {
        case 'left':
        case 'right':
          this.slidepad.movePosition(pos);
          this.slidepad.show();
          break;
      }
    }
  }

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
      let bg = this.rootDom.querySelector('div.bg_wrapper');
      if (!bg) {
        bg = document.createElement('div');
        bg.classList.add('bg_wrapper');
        this.rootDom.insertBefore(bg, this.wrapperDom);
      }
      this.bgDom = bg as HTMLDivElement;
    }
    {
      let fg = this.rootDom.querySelector('div.fg_wrapper');
      if (!fg) {
        fg = document.createElement('div');
        fg.classList.add('fg_wrapper');
        this.rootDom.insertBefore(fg, this.wrapperDom);
      }
      this.fgDom = fg as HTMLDivElement;
    }
    {
      let slidepad = this.rootDom.querySelector('div.slidepad');
      if (!slidepad) {
        slidepad = document.createElement('div');
        slidepad.classList.add('slidepad');
        this.rootDom.appendChild(slidepad);
      }
      this.slidepadDom = slidepad as HTMLDivElement;
      this.slidepad = new SlidepadManager(this.slidepadDom, this.wrapper);
      this.slidepad.show();
    }
    {
      let loader = this.fgDom.querySelector('div.loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.classList.add('loader');
        this.fgDom.appendChild(loader);
      }
      this.loaderDom = loader as HTMLDivElement;
      this.loader = new Loader(this.loaderDom);
    }
    this.scrollManager = new ScrollStateManager(this.wrapper);
    this.menu = new Menu({
      app: this,
      enable: true,
      page: { enable: false },
      share: { enable: false }
    });
    this.rootDom.appendChild(this.menu.dom);
  }

  public start(): void {
    // start loading
    this.loader.set('circle');
    this.loader.show();
    // apply config
    this.applyConfig();
    // fix dom
    deleteTextNodeInRuby(this.wrapperDom);
    setCustomRuby(this.rootDom);
    addDummyForEdge(this.wrapperDom);
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
