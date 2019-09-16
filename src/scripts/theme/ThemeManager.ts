import { Theme } from './Theme';
import { getCSSStyleRules, getCSSRuleKeyValue } from '../util';

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
  private _default: Theme;
  private _defaultIndex: number;

  public get themes(): Theme[] {
    return this._themes;
  }

  public get default(): Theme {
    return this._default;
  }

  public get defaultIndex(): number {
    return this._defaultIndex;
  }

  public getTheme(
    namespace: string,
    id: string
  ): { index: number; theme: Theme } {
    const r = { index: this._defaultIndex, theme: this._default };
    for (let i = 0; i < this._themes.length; i++) {
      const t = this._themes[i];
      if (t.namespace == namespace && t.id == id) {
        r.index = i;
        r.theme = t;
        return r;
      }
    }
    return r;
  }

  constructor() {
    this._themes = [];
    this._default = this.themes[0];
    this._defaultIndex = 0;
    this.load();
  }

  public load(): void {
    this._themes = [];
    const rules = getCSSStyleRules('data-style-theme');
    for (let i = 0; i < rules.length; i++) {
      const map = getCSSRuleKeyValue(rules[i].rules);
      this._themes.push(createTheme(map));
    }
    for (let i = 0; i < this._themes.length; i++) {
      const t = this._themes[i];
      if (t.namespace == DEFAULT_THEME_NAMESPACE && t.id == 'default') {
        this._default = t;
        this._defaultIndex = i;
        break;
      }
    }
  }
}

export const ThemeManagerInstance = new ThemeManager();
