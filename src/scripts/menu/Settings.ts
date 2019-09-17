import { OnMenuItemCallback, MenuItem, MenuItemOption } from './MenuItem';
import { createMenuContent, createMenuTitle } from './util';
import { ThemeManagerInstance } from '../theme/ThemeManager';
import { StoreManagerInstance } from '../store/StoreManager';
import {
  SlidepadPosition,
  isSlidepadPosition,
  ConfigStore
} from '../store/IStore';
import { ThemeSettings } from './settings/ThemeSettings';
import { FontSettings } from './settings/FontSettings';

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
  private controlsDom: HTMLDivElement;

  private themeSettings: ThemeSettings;
  private fontSettings: FontSettings;

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

  private save(): void {
    const sp = this.getSlidepadPosition();
    const theme = this.themeSettings.selected;
    const font = this.fontSettings.selected;
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
      const theme = ThemeManagerInstance.getTheme(
        StoreManagerInstance.config.theme.namespace,
        StoreManagerInstance.config.theme.id
      );
      this.configRootDom.appendChild(createMenuTitle('テーマ'));
      this.themeSettings = new ThemeSettings(theme.theme);
      this.configRootDom.appendChild(this.themeSettings.dom);
    }
    {
      this.configRootDom.appendChild(createMenuTitle('フォント'));
      this.fontSettings = new FontSettings();
      this.configRootDom.appendChild(this.fontSettings.dom);
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
