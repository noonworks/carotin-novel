import { StoreManagerInstance } from '../store/StoreManager';
import { PageStore, WorkStore } from '../store/IStore';
import { ScrollableWrapper } from './ScrollableWrapper';

export class ScrollStateManager {
  private articleId = '';
  private animationId = -1;
  private saveQueueId = -1;
  private prevState: PageStore | null = null;
  private wrapper: ScrollableWrapper;

  constructor(wrapper: ScrollableWrapper, articleId: string) {
    this.wrapper = wrapper;
    this.articleId = articleId;
  }

  public start(): void {
    window.cancelAnimationFrame(this.animationId);
    const loop = (): void => {
      this.autoSave();
      this.animationId = window.requestAnimationFrame(loop);
    };
    this.animationId = window.requestAnimationFrame(loop);
  }

  private autoSave(): void {
    this.save();
  }

  public restore(): Promise<void> {
    const bm = StoreManagerInstance.getWork(this.articleId);
    if (bm != null) {
      return this.doRestore(bm);
    }
    return new Promise((resolve: () => void): void => {
      resolve();
    });
  }

  private doRestore(bm: WorkStore): Promise<void> {
    return new Promise(
      (resolve: () => void, reject: (reason?: Error) => void): void => {
        const ps = bm.autosave;
        // console.log(ps);
        if (!ps) {
          resolve();
          return;
        }
        this.moveToBookmark(ps)
          .then(resolve)
          .catch(reject);
      }
    );
  }

  private moveToBookmark(ps: PageStore): Promise<void> {
    const pages = Array.from(this.wrapper.dom.querySelectorAll('div.page'));
    let element: HTMLElement | null = null;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].getAttribute('data-page-id') == ps.page) {
        element = pages[i] as HTMLElement;
        break;
      }
    }
    if (!element) {
      return new Promise((_, reject: (reason?: Error) => void): void => {
        reject(new Error('Page not found.'));
      });
    }
    const pos = Math.round(element.scrollWidth * ps.scrolldepth);
    // console.log('pos ' + pos);
    return new Promise((resolve: () => void): void => {
      if (element) {
        element.scrollIntoView();
        element.offsetLeft;
      }
      setTimeout(() => {
        this.wrapper.scrollToLeft(pos * -1, false);
        resolve();
      }, 300);
    });
  }

  private save(): void {
    const s = this.getState();
    if (!s.page || s.scrolldepth == null) {
      return;
    }
    if (this.prevState == null) {
      this.prevState = s;
      return;
    }
    if (this.isSame(this.prevState, s)) {
      return;
    }
    this.prevState = s;
    const upd = { autosave: s };
    window.clearTimeout(this.saveQueueId);
    this.saveQueueId = window.setTimeout(() => {
      StoreManagerInstance.updateWork(this.articleId, upd);
    }, 500);
  }

  private isSame(stateA: PageStore, stateB: PageStore): boolean {
    if (
      stateA.page == stateB.page &&
      stateA.scrolldepth == stateB.scrolldepth
    ) {
      return true;
    }
    return false;
  }

  private getRightTopElement(): HTMLElement | null {
    let page = document.elementFromPoint(window.innerWidth - 40, 0);
    while (page && page.parentElement) {
      if (
        page.tagName.toLowerCase() == 'div' &&
        page.classList.contains('page')
      ) {
        return page as HTMLElement;
      }
      page = page.parentElement;
    }
    return null;
  }

  private getState(): PageStore {
    const ret: PageStore = {
      page: '',
      scrolldepth: 0,
      update: new Date().getTime()
    };
    const page = this.getRightTopElement();
    if (page) {
      ret.page = page.getAttribute('data-page-id') || '';
      const curR = page.getBoundingClientRect().right - window.innerWidth;
      ret.scrolldepth = curR / page.scrollWidth;
      // console.log(curR + '=' + Math.round(page.scrollWidth * ret.scrolldepth) + '/' + page.scrollWidth + '=' + ret.scrolldepth);
    }
    return ret;
  }
}
