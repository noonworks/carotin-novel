import { OnMenuItemCallback, MenuItem, MenuItemOption } from './MenuItem';
import { createMenuContent, createMenuTitle } from './util';

const MENUITEM_CANCEL: MenuItemOption = {
  id: 'back',
  icon: 'ion-md-close-circle',
  title: 'キャンセル'
};

const MENUITEM_SAVE: MenuItemOption = {
  id: 'save',
  icon: 'ion-md-checkmark-circle-outline',
  title: '保存'
};

const themes = [
  {
    id: 'default',
    name: 'デフォルト',
    description: '標準の白黒テーマ'
  },
  {
    id: 'brown',
    name: 'ブラウン',
    description: '茶色っぽいテーマ'
  }
];

export function createSettingsMenu(
  callback: OnMenuItemCallback
): HTMLDivElement {
  const t = createMenuContent();
  t.classList.add('menu-settings');
  {
    const h2 = createMenuTitle('スライドパッド');
    t.appendChild(h2);
  }
  {
    const div = document.createElement('div');
    div.classList.add('slidepad_select');
    [
      { id: 'left', label: '左' },
      { id: 'none', label: 'なし' },
      { id: 'right', label: '右' }
    ].forEach(i => {
      const d = document.createElement('div');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'slidepad_radio';
      input.value = i.id;
      input.id = 'slidepad_radio_' + i.id;
      d.appendChild(input);
      const l = document.createElement('label');
      l.textContent = i.label;
      l.setAttribute('for', 'slidepad_radio_' + i.id);
      d.appendChild(l);
      div.appendChild(d);
    });
    t.appendChild(div);
  }
  {
    const h2 = createMenuTitle('テーマ');
    t.appendChild(h2);
  }
  const div = document.createElement('div');
  div.classList.add('menu_center');
  {
    const sample = document.createElement('div');
    sample.id = 'theme_sample';
    sample.textContent = themes[0].description;
    const sel = document.createElement('select');
    sel.id = 'theme_select';
    sel.addEventListener('change', (ev: Event) => {
      if (!ev.target) {
        return;
      }
      const target = ev.target as HTMLSelectElement;
      const idx = target.selectedIndex;
      sample.textContent = themes[idx].description;
    });
    themes.forEach(theme => {
      const opt = document.createElement('option');
      opt.value = theme.id;
      opt.textContent = theme.name;
      sel.appendChild(opt);
    });
    div.appendChild(sel);
    div.appendChild(sample);
  }
  {
    const ul = document.createElement('ul');
    ul.classList.add('menu_item');
    ul.classList.add('control');
    const mCancel = new MenuItem(MENUITEM_CANCEL);
    const mSave = new MenuItem(MENUITEM_SAVE);
    ul.appendChild(mSave.toElement(callback));
    ul.appendChild(mCancel.toElement(callback));
    div.appendChild(ul);
  }
  t.appendChild(div);
  return t;
}
