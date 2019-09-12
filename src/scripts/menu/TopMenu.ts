import { createMenuContent } from './util';
import { MenuItem, MenuItemOption, OnMenuItemCallback } from './MenuItem';

const ITEM_PAGE: MenuItemOption = {
  id: 'page',
  icon: 'ion-md-bookmarks',
  title: 'ページ'
};

const ITEM_SHARE: MenuItemOption = {
  id: 'share',
  icon: 'ion-md-share',
  title: 'シェア'
};

const DEFAULT_MENU: MenuItemOption[] = [
  {
    id: 'settings',
    icon: 'ion-md-settings',
    title: '設定'
  },
  {
    id: 'help',
    icon: 'ion-md-help-circle',
    title: 'ヘルプ'
  },
  {
    id: 'close',
    icon: 'ion-md-close-circle',
    title: '閉じる'
  }
];

export function createTopMenu(
  page: boolean,
  share: boolean,
  callback: OnMenuItemCallback
): HTMLDivElement {
  const t = createMenuContent('MENU');
  t.classList.add('menu-top');
  const ul = document.createElement('ul');
  ul.classList.add('menu_item');
  [page ? ITEM_PAGE : null, share ? ITEM_SHARE : null, ...DEFAULT_MENU].forEach(
    i => {
      if (i) {
        const mi = new MenuItem(i);
        ul.appendChild(mi.toElement(callback));
      }
    }
  );
  t.appendChild(ul);
  return t;
}
