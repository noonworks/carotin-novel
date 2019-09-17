import { OnMenuItemCallback, MenuItem, MenuItemOption } from './MenuItem';
import { createMenuContent, createMenuTitle } from './util';
import {
  ThemeManagerInstance,
  DEFAULT_THEME_NAMESPACE
} from '../theme/ThemeManager';
import { Theme } from '../theme/Theme';
import { StoreManagerInstance } from '../store/StoreManager';
import {
  SlidepadPosition,
  isSlidepadPosition,
  ConfigStore
} from '../store/IStore';
import { FontManagerInstance } from '../font/FontManager';

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

function createSlidepadDiv(): HTMLDivElement {
  const cur = StoreManagerInstance.config.slidepad.position;
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
    if (i.id == cur) {
      input.checked = true;
    }
    d.appendChild(input);
    const l = document.createElement('label');
    l.textContent = i.label;
    l.setAttribute('for', 'slidepad_radio_' + i.id);
    d.appendChild(l);
    div.appendChild(d);
  });
  return div;
}

const DATA_NAMESPACE = 'data-theme-namespace';
const DATA_ID = 'data-theme-id';

function createThemeDiv(): HTMLDivElement {
  const theme = ThemeManagerInstance.getTheme(
    StoreManagerInstance.config.theme.namespace,
    StoreManagerInstance.config.theme.id
  );
  const div = document.createElement('div');
  div.classList.add('menu_center');
  {
    const sample = document.createElement('div');
    sample.id = 'theme_sample';
    setSample(sample, theme.theme);
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
    const curTheme = StoreManagerInstance.config.theme;
    ThemeManagerInstance.themes.forEach(theme => {
      const opt = document.createElement('option');
      opt.value = theme.id;
      opt.textContent = theme.name;
      opt.setAttribute(DATA_NAMESPACE, theme.namespace);
      opt.setAttribute(DATA_ID, theme.id);
      if (theme.id === curTheme.id && theme.namespace === curTheme.namespace) {
        opt.selected = true;
      }
      sel.appendChild(opt);
    });
    div.appendChild(sel);
    div.appendChild(sample);
  }
  return div;
}

function createFontDiv(): HTMLDivElement {
  const div = document.createElement('div');
  div.classList.add('menu_center');
  {
    const sel = document.createElement('select');
    sel.id = 'font_select';
    sel.addEventListener('change', (ev: Event) => {
      if (!ev.target) {
        return;
      }
      const target = ev.target as HTMLSelectElement;
      const opt = target.selectedOptions[0];
      sel.style.fontFamily = opt.style.fontFamily;
    });
    const curFont = StoreManagerInstance.config.font;
    FontManagerInstance.fonts.forEach(font => {
      const opt = document.createElement('option');
      opt.value = font.id;
      opt.textContent = font.name;
      opt.style.fontFamily = font.family;
      if (font.id === curFont.id) {
        opt.selected = true;
        sel.style.fontFamily = font.family;
      }
      sel.appendChild(opt);
    });
    div.appendChild(sel);
  }
  return div;
}

function createControls(cb: OnMenuItemCallback): HTMLDivElement {
  const div = document.createElement('div');
  div.classList.add('menu_center');
  const ul = document.createElement('ul');
  ul.classList.add('menu_item');
  ul.classList.add('control');
  const mCancel = new MenuItem(MENUITEM_CANCEL);
  const mSave = new MenuItem(MENUITEM_SAVE);
  ul.appendChild(mSave.toElement(cb));
  ul.appendChild(mCancel.toElement(cb));
  div.appendChild(ul);
  return div;
}

export class SettingsMenu {
  private configRootDom: HTMLDivElement;
  private slidepadDom: HTMLDivElement;
  private themeDom: HTMLDivElement;
  private fontDom: HTMLDivElement;
  private controlsDom: HTMLDivElement;

  public get dom(): HTMLDivElement {
    return this.configRootDom;
  }

  private getSlidepadPosition(): SlidepadPosition {
    const radios = this.slidepadDom.querySelectorAll('input[type=radio]');
    let checked: SlidepadPosition = 'right';
    radios.forEach(r => {
      const radio = r as HTMLInputElement;
      if (radio.checked && isSlidepadPosition(radio.value)) {
        checked = radio.value;
      }
    });
    return checked;
  }

  private getSelectedTheme(): {
    id: string;
    namespace: string;
  } {
    const r = {
      id: ThemeManagerInstance.default.id,
      namespace: ThemeManagerInstance.default.namespace
    };
    const select = this.themeDom.querySelector('select');
    if (!select) {
      return r;
    }
    const opts = (select as HTMLSelectElement).selectedOptions;
    if (opts.length < 1) {
      return r;
    }
    const opt = opts[0];
    const id = opt.getAttribute(DATA_ID);
    const namespace = opt.getAttribute(DATA_NAMESPACE);
    if (!id || !namespace) {
      return r;
    }
    return { id, namespace };
  }

  private getSelectedFont(): { id: string } {
    const r = { id: FontManagerInstance.default.id };
    const select = this.fontDom.querySelector('select');
    if (!select) {
      return r;
    }
    const opts = (select as HTMLSelectElement).selectedOptions;
    if (opts.length < 1) {
      return r;
    }
    const opt = opts[0];
    r.id = opt.value;
    return r;
  }

  private save(): void {
    const sp = this.getSlidepadPosition();
    const theme = this.getSelectedTheme();
    const font = this.getSelectedFont();
    const d: ConfigStore = {
      update: new Date().getTime(),
      slidepad: {
        position: sp
      },
      theme: theme,
      font: font
    };
    StoreManagerInstance.updateConfig(d);
  }

  constructor(callback: OnMenuItemCallback) {
    this.configRootDom = createMenuContent();
    this.configRootDom.classList.add('menu-settings');
    {
      this.configRootDom.appendChild(createMenuTitle('スライドパッド'));
      this.slidepadDom = createSlidepadDiv();
      this.configRootDom.appendChild(this.slidepadDom);
    }
    {
      this.configRootDom.appendChild(createMenuTitle('テーマ'));
      this.themeDom = createThemeDiv();
      this.configRootDom.appendChild(this.themeDom);
    }
    {
      this.configRootDom.appendChild(createMenuTitle('フォント'));
      this.fontDom = createFontDiv();
      this.configRootDom.appendChild(this.fontDom);
    }
    {
      this.controlsDom = createControls((id: string) => {
        if (id == 'save') {
          this.save();
        }
        callback(id);
      });
      this.configRootDom.appendChild(this.controlsDom);
    }
  }
}
