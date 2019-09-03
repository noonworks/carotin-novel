import { StoreManagerInstance } from "./StoreManager";
import { IPageStore, DeepPartial, IStoreData } from "./IStore";

export class ScrollStateManager {
  private articleId = '';
  private animationId = -1;
  private saveQueueId = -1;
  private prevState: IPageStore = null;

  constructor(contentElement: HTMLElement) {
    this.articleId = this.getArticleId(contentElement);
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

  private getState(): IPageStore {
    const ret: IPageStore = {
      page: null,
      scrolldepth: null,
      update: (new Date()).getTime(),
    };
    let e = document.elementFromPoint(100, 40);
    while (e.parentElement) {
      if (e.tagName.toLowerCase() == 'div' && e.classList.contains('page')) {
        break;
      }
      e = e.parentElement;
    }
    if (e) {
      ret.page = e.getAttribute('data-page-id');
      const boxW = e.scrollWidth;
      const winW = window.innerWidth;
      const curRight = e.getBoundingClientRect().right;
      ret.scrolldepth = (curRight - winW) / (boxW - winW);
    }
    return ret;
  }

  private getLeft(scrolldepth: number, boxWidth: number): number {
    const width = boxWidth - window.innerWidth;
    return Math.round(width * (scrolldepth - 1));
  }
}
