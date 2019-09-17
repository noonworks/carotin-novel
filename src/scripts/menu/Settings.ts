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

function getOverwriteConfig(
  articleId: string
): { theme: boolean; font: boolean } {
  const w = StoreManagerInstance.getWork(articleId);
  if (!w || !w.styles) {
    return { theme: false, font: false };
  }
  return { theme: w.styles.overwriteTheme, font: w.styles.overwriteFont };
}

type SettingsMenuOptions = {
  callback: OnMenuItemCallback;
  articleId: string;
};

export class SettingsMenu {
  private configRootDom: HTMLDivElement;
  private controlsDom: HTMLDivElement;
  private articleId: string;

  private slidepadSettings: SlidepadSettings;
  private themeSettings: ThemeSettings;
  private fontSettings: FontSettings;

  public get dom(): HTMLDivElement {
    return this.configRootDom;
  }

  private save(): void {
    // whole config
    const d: ConfigStore = {
      update: new Date().getTime(),
      slidepad: {
        position: this.slidepadSettings.selected
      },
      theme: this.themeSettings.selected,
      font: this.fontSettings.selected
    };
    StoreManagerInstance.updateConfig(d);
    // page config
    const styles = {
      styles: {
        overwriteTheme: this.themeSettings.overwrited,
        overwriteFont: this.fontSettings.overwrited
      }
    };
    StoreManagerInstance.updateWork(this.articleId, styles);
  }

  constructor(opt: SettingsMenuOptions) {
    this.articleId = opt.articleId;
    const overwrite = getOverwriteConfig(this.articleId);
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
      if (this.themeSettings.overwritable) {
        this.themeSettings.overwrite = overwrite.theme;
      }
      this.configRootDom.appendChild(this.themeSettings.dom);
    }
    {
      this.configRootDom.appendChild(createMenuTitle('フォント'));
      this.fontSettings = new FontSettings();
      if (this.fontSettings.overwritable) {
        this.fontSettings.overwrite = overwrite.font;
      }
      this.configRootDom.appendChild(this.fontSettings.dom);
    }
    {
      this.controlsDom = createControls((id: string) => {
        if (id == 'save') {
          this.save();
        }
        opt.callback(id);
      });
      this.configRootDom.appendChild(this.controlsDom);
    }
  }
}
