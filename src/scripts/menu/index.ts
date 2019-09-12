import { appendCSS, createMenuBack } from './util';
import { createTopMenu } from './TopMenu';
import { createHelpMenu } from './Help';
import { createSettingsMenu } from './Settings';

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

  private topMenuDom: HTMLDivElement;
  private helpMenuDom: HTMLDivElement;
  private settingsMenuDom: HTMLDivElement;
  private pages: HTMLDivElement[];

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
      case 'settings':
        this.doAfterRipple(() => {
          this.hideAll();
          this.settingsMenuDom.classList.add('on');
        });
        break;
      case 'help':
        this.doAfterRipple(() => {
          this.hideAll();
          this.helpMenuDom.classList.add('on');
        });
        break;
      case 'close':
        this.doAfterRipple(() => {
          this.close();
        });
        break;
      case 'back':
        this.doAfterRipple(() => {
          this.hideAll();
          this.topMenuDom.classList.add('on');
        });
        break;
    }
  }

  private hideAll(): void {
    this.pages.forEach(p => p.classList.remove('on'));
  }

  private doAfterRipple(cb: () => void): void {
    setTimeout(cb, 200);
  }

  constructor(option: MenuOption) {
    this.pages = [];
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
    const cb = (id: string): void => {
      this.onClickItem(id);
    };
    this.topMenuDom = createTopMenu(
      option.page.enable,
      option.share.enable,
      cb
    );
    this.helpMenuDom = createHelpMenu(cb);
    this.settingsMenuDom = createSettingsMenu(cb);
    this.menuContentWrapperDom.appendChild(this.topMenuDom);
    this.menuContentWrapperDom.appendChild(this.helpMenuDom);
    this.menuContentWrapperDom.appendChild(this.settingsMenuDom);
    this.pages = [this.topMenuDom, this.helpMenuDom, this.settingsMenuDom];
    this.topMenuDom.classList.add('on');
  }
}
