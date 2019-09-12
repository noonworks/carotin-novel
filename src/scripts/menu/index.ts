function appendCSS(): void {
  const links = document.head.querySelectorAll('link');
  let foundIonicons = false;
  let foundGFNotoSerifJP = false;
  links.forEach(l => {
    if (l.rel.toLowerCase() != 'stylesheet') {
      return;
    }
    if (l.href.indexOf('ionicons') >= 0) {
      foundIonicons = true;
    }
    if (
      l.href.indexOf('fonts.googleapis.com') >= 0 &&
      l.href.indexOf('Noto+Serif+JP') >= 0
    ) {
      foundGFNotoSerifJP = true;
    }
  });
  if (!foundIonicons) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css';
    document.head.appendChild(link);
  }
  if (!foundGFNotoSerifJP) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css?family=Noto+Serif+JP&display=swap';
    document.head.appendChild(link);
  }
}

type ItemType = 'page' | 'share' | 'settings' | 'help' | 'close';

interface MenuItem {
  className: ItemType;
  icon: string;
  title: string;
}

const ITEM_PAGE: MenuItem = {
  className: 'page',
  icon: 'ion-md-bookmarks',
  title: 'ページ'
};

const ITEM_SHARE: MenuItem = {
  className: 'share',
  icon: 'ion-md-share',
  title: 'シェア'
};

const DEFAULT_MENU: MenuItem[] = [
  {
    className: 'settings',
    icon: 'ion-md-settings',
    title: '設定'
  },
  {
    className: 'help',
    icon: 'ion-md-help-circle',
    title: 'ヘルプ'
  },
  {
    className: 'close',
    icon: 'ion-md-close-circle',
    title: '閉じる'
  }
];

interface MenuOption {
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

  public onClickItem(id: ItemType): void {
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
    this.menuRootDom.appendChild(this.createMenuBack());
    this.menuContentWrapperDom = document.createElement('div');
    this.menuContentWrapperDom.classList.add('menu-content-wrapper');
    this.menuRootDom.appendChild(this.menuContentWrapperDom);
    const menu = [];
    if (option.page.enable) {
      menu.push(ITEM_PAGE);
    }
    if (option.share.enable) {
      menu.push(ITEM_SHARE);
    }
    this.menuContentWrapperDom.appendChild(
      this.createTopMenu([...menu, ...DEFAULT_MENU])
    );
  }

  private createMenuBack(): HTMLDivElement {
    const back = document.createElement('div');
    back.classList.add('menu-back');
    const ms = document.createElement('div');
    ms.classList.add('menu-slide');
    const i = document.createElement('i');
    i.classList.add('icon');
    i.classList.add('ion-ios-arrow-back');
    ms.appendChild(i);
    back.appendChild(ms);
    ms.addEventListener('click', () => {
      this.open();
    });
    return back;
  }

  private createTopMenu(items: MenuItem[]): HTMLDivElement {
    const t = document.createElement('div');
    t.classList.add('menu-content');
    t.classList.add('menu-top');
    {
      const h2 = document.createElement('h2');
      const l1 = document.createElement('span');
      l1.classList.add('line');
      const title = document.createElement('span');
      title.classList.add('title');
      title.textContent = 'MENU';
      h2.appendChild(l1);
      h2.appendChild(title);
      h2.appendChild(l1.cloneNode());
      t.appendChild(h2);
    }
    {
      const ul = document.createElement('ul');
      items.forEach(i => {
        const li = document.createElement('li');
        li.classList.add(i.className);
        const a = document.createElement('a');
        a.classList.add('button');
        const icon = document.createElement('i');
        icon.classList.add('icon');
        icon.classList.add(i.icon);
        const title = document.createElement('span');
        title.textContent = i.title;
        a.appendChild(icon);
        a.appendChild(title);
        li.appendChild(a);
        ul.appendChild(li);
        a.addEventListener('click', () => {
          this.onClickItem(i.className);
        });
      });
      t.appendChild(ul);
    }
    return t;
  }
}
