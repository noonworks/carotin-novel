import { StoreManagerInstance } from "./StoreManager";
import { IPageStore, DeepPartial, IStoreData, IWorkStore } from "./IStore";
import { ScrollableWrapper } from "./ScrollableWrapper";

export class ScrollStateManager {
  private articleId = '';
  private animationId = -1;
  private saveQueueId = -1;
  private prevState: IPageStore = null;
  private wrapper: ScrollableWrapper;

  constructor(wrapper: ScrollableWrapper) {
    this.wrapper = wrapper;
    this.articleId = this.getArticleId(wrapper.dom);
  }

  public start(): void {
    window.cancelAnimationFrame(this.animationId);
    const loop = () => {
      this.autoSave();
      this.animationId = window.requestAnimationFrame(loop);
    };
    this.animationId = window.requestAnimationFrame(loop);
  }

  private autoSave(): void {
    this.save(true);
  }

  public bookmark(): void {
    this.save(false);
  }

  public restore(): Promise<void> {
    const bm = StoreManagerInstance.getWork(this.articleId);
    if (bm != null) {
      return this.doRestore(bm);
    }
    return new Promise((resolve: () => void, _) => {
      resolve();
    });
  }

  private doRestore(bm: IWorkStore): Promise<void> {
    return new Promise((resolve: () => void, reject: (reason?: any) => void) => {
      let ps = bm.autosave || bm.bookmark;
      // console.log(ps);
      if (!ps) {
        resolve();
        return;
      }
      this.moveToBookmark(ps).then(resolve).catch(reject);
    });
  }

  private moveToBookmark(ps: IPageStore): Promise<void> {
    const pages = this.wrapper.dom.querySelectorAll('div.page');
    let element: HTMLElement = null;
    pages.forEach((p) => {
      if (!element) {
        if (p.getAttribute('data-page-id') == ps.page) {
          element = p as HTMLElement;
        }
      }
    });
    if (!element) {
      return new Promise((_, reject: (reason?: any) => void) => {
        reject('Page not found.');
      });
    }
    const pos = Math.round(element.scrollWidth * ps.scrolldepth);
    // console.log('pos ' + pos);
    return new Promise((resolve: () => void, _) => {
      element.scrollIntoView();
      element.offsetLeft;
      setTimeout(() => {
        this.wrapper.scrollToLeft(pos * -1, false);
        resolve();
      }, 300);
    });
  }

  private getArticleId(contentElement: HTMLElement): string {
    const data = contentElement.getAttribute('data-article-id');
    if (data) { return data; }
    return location.pathname;
  }

  private save(auto: boolean): void {
    const s = this.getState();
    if (s.page == null || s.scrolldepth == null) { return; }
    if (this.prevState == null) {
      this.prevState = s;
      return;
    }
    if (this.isSame(this.prevState, s)) { return; }
    this.prevState = s;
    const upd: DeepPartial<IStoreData> = {
      works: {
        [this.articleId]: {},
      }
    };
    if (auto) {
      upd.works[this.articleId].autosave = s;
    } else {
      upd.works[this.articleId].bookmark = s;
    }
    window.clearTimeout(this.saveQueueId);
    this.saveQueueId = window.setTimeout(() => {
      StoreManagerInstance.update(upd);
    }, 500);
  }

  private isSame(stateA: IPageStore, stateB: IPageStore) {
    if (stateA.page == stateB.page && stateA.scrolldepth == stateB.scrolldepth) {
      return true;
    }
    return false;
  }

  private getRightTopElement(): HTMLElement {
    let page = document.elementFromPoint(window.innerWidth - 1, 0);
    while (page && page.parentElement) {
      if (page.tagName.toLowerCase() == 'div' && page.classList.contains('page')) {
        return page as HTMLElement;
      }
      page = page.parentElement;
    }
    return null;
  }

  private getState(): IPageStore {
    const ret: IPageStore = {
      page: null,
      scrolldepth: null,
      update: (new Date()).getTime(),
    };
    const page = this.getRightTopElement();
    if (page) {
      ret.page = page.getAttribute('data-page-id');
      const curR = page.getBoundingClientRect().right - window.innerWidth;
      ret.scrolldepth = curR / page.scrollWidth;
      // console.log(curR + '=' + Math.round(page.scrollWidth * ret.scrolldepth) + '/' + page.scrollWidth + '=' + ret.scrolldepth);
    }
    return ret;
  }
}
