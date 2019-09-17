import { OnMenuItemCallback, MenuItem, MenuItemOption } from './MenuItem';
import { createMenuContent, createMenuTitle } from './util';
import { ThemeManagerInstance } from '../theme/ThemeManager';
import { StoreManagerInstance } from '../store/StoreManager';
import { ConfigStore } from '../store/IStore';
import { ThemeSettings } from './settings/ThemeSettings';
import { FontSettings } from './settings/FontSettings';
import { SlidepadSettings } from './settings/SlidepadSettings';

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
  private controlsDom: HTMLDivElement;

  private slidepadSettings: SlidepadSettings;
  private themeSettings: ThemeSettings;
  private fontSettings: FontSettings;

  public get dom(): HTMLDivElement {
    return this.configRootDom;
  }

  private save(): void {
    const d: ConfigStore = {
      update: new Date().getTime(),
      slidepad: {
        position: this.slidepadSettings.selected
      },
      theme: this.themeSettings.selected,
      font: this.fontSettings.selected
    };
    StoreManagerInstance.updateConfig(d);
  }

  constructor(callback: OnMenuItemCallback) {
    this.configRootDom = createMenuContent();
    this.configRootDom.classList.add('menu-settings');
    {
      this.configRootDom.appendChild(createMenuTitle('スライドパッド'));
      this.slidepadSettings = new SlidepadSettings();
      this.configRootDom.appendChild(this.slidepadSettings.dom);
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
