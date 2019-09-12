import { OnMenuItemCallback, MenuItem, MENUITEM_BACK } from './MenuItem';
import { createMenuContent, createMenuTitle } from './util';

export function createHelpMenu(callback: OnMenuItemCallback): HTMLDivElement {
  const t = createMenuContent('操作方法');
  t.classList.add('menu-help');
  {
    const ul = document.createElement('ul');
    [
      '右から左に読む縦書きのビューアーです。',
      'マウスホイールの上下で横にスクロールできます。',
      '画面上のスライドパッドで横にスクロールできます。',
      '読み進めた位置は自動でブラウザに記憶されます。'
    ].forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });
    t.appendChild(ul);
  }
  {
    const h2 = createMenuTitle('ビューアーについて');
    t.appendChild(h2);
  }
  const div = document.createElement('div');
  div.classList.add('menu_center');
  {
    const a = document.createElement('a');
    a.innerHTML = 'Carotin Novel';
    a.href = 'https://noonworks.github.io/carotin-novel/';
    a.target = '_blank';
    div.appendChild(a);
  }
  {
    const ul = document.createElement('ul');
    ul.classList.add('menu_item');
    ul.classList.add('control');
    const mi = new MenuItem(MENUITEM_BACK);
    ul.appendChild(mi.toElement(callback));
    div.appendChild(ul);
  }
  t.appendChild(div);
  return t;
}
