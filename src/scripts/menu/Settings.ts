import { OnMenuItemCallback, MenuItem, MenuItemOption } from './MenuItem';
import { createMenuContent, createMenuTitle } from './util';
import {
  ThemeManagerInstance,
  DEFAULT_THEME_NAMESPACE
} from '../theme/ThemeManager';
import { Theme } from '../theme/Theme';

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

function getColor(theme: Theme): { bc: string; tc: string } {
  const b1 = theme.getValue('background-base');
  const b2 = theme.getValue('background-base-a');
  const bc = 'rgba(' + b1 + ', ' + b2 + ')';
  const t1 = theme.getValue('text-base');
  const t2 = theme.getValue('text-base-a');
  const tc = 'rgba(' + t1 + ', ' + t2 + ')';
  return { bc, tc };
}

function setSample(sample: HTMLDivElement, theme: Theme): void {
  sample.innerHTML = '';
  sample.textContent += theme.description;
  if (theme.namespace != DEFAULT_THEME_NAMESPACE) {
    // sample.appendChild(document.createElement('br'));
    const span = document.createElement('span');
    span.classList.add('author');
    span.textContent += '作者：';
    if (theme.href.length > 0) {
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = theme.href;
      a.textContent = theme.author;
      span.appendChild(a);
    } else {
      span.textContent += theme.author;
    }
    sample.appendChild(span);
  }
  const colors = getColor(theme);
  sample.style.backgroundColor = colors.bc;
  sample.style.color = colors.tc;
}

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
    setSample(sample, ThemeManagerInstance.themes[0]);
    const sel = document.createElement('select');
    sel.id = 'theme_select';
    sel.addEventListener('change', (ev: Event) => {
      if (!ev.target) {
        return;
      }
      const target = ev.target as HTMLSelectElement;
      const idx = target.selectedIndex;
      setSample(sample, ThemeManagerInstance.themes[idx]);
    });
    ThemeManagerInstance.themes.forEach(theme => {
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
