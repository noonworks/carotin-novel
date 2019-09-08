export class ScrollableWrapper {
  private _dom: HTMLElement;

  constructor(HTMLElement: HTMLElement) {
    this._dom = HTMLElement;
    this.setScrollEvent();
  }

  public get scrollLeft(): number {
    return this._dom.scrollLeft;
  }

  public get dom(): HTMLElement {
    return this._dom;
  }

  public scrollToLeft(x: number, smooth: boolean): void {
    this.scrollTo(this._dom.scrollLeft + x, smooth);
  }

  public scrollTo(x: number, smooth: boolean): void {
    if (!this._dom.scrollTo) {
      this._dom.scrollLeft = x;
    } else {
      this._dom.scrollTo({
        left: x,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }

  private setScrollEvent(): void {
    this._dom.addEventListener(
      'wheel',
      (e: MouseWheelEvent) => {
        if (e.deltaX != 0) {
          return;
        }
        e.stopPropagation();
        e.preventDefault();
        this.scrollToLeft(e.deltaY * -1, false);
      },
      { passive: false }
    );
  }
}
