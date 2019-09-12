import { appendCSS, createMenuBack } from './util';
import { createTopMenu } from './TopMenu';

interface MenuOption {
  enable: boolean;
  page: {
    enable: boolean;
  };
  share: {
    enable: boolean;
  };
}

export class Menu {
  private menuRootDom: HTMLDivElement;
  private menuContentWrapperDom: HTMLDivElement;

  public get dom(): HTMLDivElement {
    return this.menuRootDom;
  }

  public open(): void {
    this.menuRootDom.classList.add('on');
  }

  public close(): void {
    this.menuRootDom.classList.remove('on');
  }

  public onClickItem(id: string): void {
    switch (id) {
      case 'close':
        setTimeout(() => {
          this.close();
        }, 200);
        break;
    }
  }

  constructor(option: MenuOption) {
    appendCSS();
    this.menuRootDom = document.createElement('div');
    this.menuRootDom.classList.add('menu');
    this.menuRootDom.appendChild(
      createMenuBack(() => {
        this.open();
      })
    );
    this.menuContentWrapperDom = document.createElement('div');
    this.menuContentWrapperDom.classList.add('menu-content-wrapper');
    this.menuRootDom.appendChild(this.menuContentWrapperDom);
    this.menuContentWrapperDom.appendChild(
      createTopMenu(option.page.enable, option.share.enable, (id: string) => {
        this.onClickItem(id);
      })
    );
  }
}
