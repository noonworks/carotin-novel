import { ScrollableWrapper } from './scroll/ScrollableWrapper';
import { Loader } from './loader';
import { ScrollStateManager } from './scroll/ScrollStateManager';
import { deleteTextNodeInRuby, setCustomRuby, addDummyForEdge } from './util';
import { WorkConfigInstance } from './WorkConfig';

export class CarotinNovelMini {
  private rootDom: HTMLDivElement;
  private wrapperDom: HTMLDivElement;
  private loaderDom: HTMLDivElement;
  private bgDom: HTMLDivElement;
  private fgDom: HTMLDivElement;

  private wrapper: ScrollableWrapper;
  private loader: Loader;
  private scrollManager: ScrollStateManager;
  private _articleId: string;

  public get articleId(): string {
    return this._articleId;
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
      this._articleId =
        this.wrapperDom.getAttribute('data-article-id') || location.pathname;
      WorkConfigInstance.setArticleId(this._articleId);
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
      let loader = this.fgDom.querySelector('div.loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.classList.add('loader');
        this.fgDom.appendChild(loader);
      }
      this.loaderDom = loader as HTMLDivElement;
      this.loader = new Loader(this.loaderDom);
    }
    this.scrollManager = new ScrollStateManager(this.wrapper, this._articleId);
  }

  public start(): void {
    // start loading
    this.loader.set('circle');
    this.loader.show();
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
