import { Theme } from './Theme';
import {
  getCSSStyleRules,
  getCSSRuleKeyValue,
  setRootDataValue,
  getRootDataValue
} from '../util';
import { DATA_TAG_THEME } from '../define';

function createTheme(map: { [key: string]: string }): Theme {
  return new Theme({
    version: map['meta-theme-version'] || '',
    namespace: map['meta-theme-namespace'] || '',
    id: map['meta-theme-id'] || '',
    name: map['meta-theme-name'] || '',
    description: map['meta-theme-description'] || '',
    author: map['meta-theme-author'] || '',
    href: map['meta-theme-href'] || '',
    license: map['meta-theme-license'] || '',
    data: map
  });
}

export const DEFAULT_THEME_NAMESPACE = 'carotin_novel';

class ThemeManager {
  private _themes: Theme[];
  private _defaultIndex: number;
  private _authorDefaultIndex: number;
  private _authorDefault: string;

  public get themes(): Theme[] {
    return this._themes;
  }

  public get default(): { index: number; theme: Theme | null } {
    return {
      index: this._defaultIndex,
      theme: this._defaultIndex >= 0 ? this._themes[this._defaultIndex] : null
    };
  }

  public get authorDefault(): { index: number; theme: Theme | null } {
    return {
      index: this._authorDefaultIndex,
      theme:
        this._authorDefaultIndex >= 0
          ? this._themes[this._authorDefaultIndex]
          : null
    };
  }

  public getTheme(
    namespace: string,
    id: string
  ): { index: number; theme: Theme | null } {
    for (let i = 0; i < this._themes.length; i++) {
      if (this._themes[i].namespace == namespace && this._themes[i].id == id) {
        return { index: i, theme: this._themes[i] };
      }
    }
    return this.default;
  }

  public apply(theme: { identifer: string }): void {
    setRootDataValue(DATA_TAG_THEME, theme.identifer);
  }

  constructor() {
    this._authorDefault = getRootDataValue(DATA_TAG_THEME) || '';
    this._themes = [];
    this._defaultIndex = -1;
    this._authorDefaultIndex = -1;
    this.load();
  }

  public load(): void {
    this._themes = [];
    const rules = getCSSStyleRules(DATA_TAG_THEME);
    for (let i = 0; i < rules.length; i++) {
      const map = getCSSRuleKeyValue(rules[i].rules);
      this._themes.push(createTheme(map));
    }
    this._authorDefaultIndex = -1;
    for (let i = 0; i < this._themes.length; i++) {
      const t = this._themes[i];
      if (t.identifier === this._authorDefault) {
        this._authorDefaultIndex = i;
      }
      if (t.namespace == DEFAULT_THEME_NAMESPACE && t.id == 'default') {
        this._defaultIndex = i;
      }
    }
  }
}

export const ThemeManagerInstance = new ThemeManager();
