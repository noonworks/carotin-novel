import { Theme } from './Theme';

const RulePrefix = ':root[data-style-theme=';
function getThemeRules(): CSSStyleRule[] {
  const stylerules: CSSStyleRule[] = [];
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].type.indexOf('css') < 0) {
      break;
    }
    const css = document.styleSheets[i] as CSSStyleSheet;
    try {
      const rules = css.rules;
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j] as CSSStyleRule;
        if (rule.selectorText && rule.selectorText.indexOf(RulePrefix) >= 0) {
          stylerules.push(rule);
        }
      }
    } catch (e) {
      break;
    }
  }
  return stylerules;
}

const doublequoted = /^"(.*)"$/;
const singlequoted = /^'(.*)'$/;
function fixVal(val: string): string {
  return val.replace(doublequoted, '$1').replace(singlequoted, '$1');
}

const prefix = /^--carotinnovel--/;
function fixKey(key: string): string {
  return key.replace(prefix, '');
}

function getMap(style: CSSStyleDeclaration): { [key: string]: string } {
  const r: { [key: string]: string } = {};
  for (let i = 0; i < style.length; i++) {
    const key = style[i];
    r[fixKey(key)] = fixVal(style.getPropertyValue(key));
  }
  return r;
}

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

  public get themes(): Theme[] {
    return this._themes;
  }

  public get default(): Theme {
    return this._default;
  }

  constructor() {
    this._themes = [];
    this.load();
    this._default = this.themes[0];
    this._themes.forEach(t => {
      if (t.namespace == DEFAULT_THEME_NAMESPACE && t.id == 'default') {
        this._default = t;
      }
    });
  }

  public load(): void {
    this._themes = [];
    const stylerules = getThemeRules();
    for (let i = 0; i < stylerules.length; i++) {
      const map = getMap(stylerules[i].style);
      this._themes.push(createTheme(map));
    }
  }
}

export const ThemeManagerInstance = new ThemeManager();
