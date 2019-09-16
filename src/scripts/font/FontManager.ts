import { Font } from './Font';
import { getCSSStyleRules, getCSSRuleKeyValue } from '../util';
import { DATA_TAG_FONT } from '../define';

function createFont(map: { [key: string]: string }, dataVal: string): Font {
  return new Font({
    id: dataVal || '',
    name: map['font-name'] || '',
    description: map['font-description'] || ''
  });
}

class FontManager {
  private _fonts: Font[];
  private _default: Font;
  private _defaultIndex: number;

  public get fonts(): Font[] {
    return this._fonts;
  }

  public get default(): Font {
    return this._default;
  }

  public get defaultIndex(): number {
    return this._defaultIndex;
  }

  public apply(fontId: string): void {
    document.documentElement.setAttribute(DATA_TAG_FONT, fontId);
  }

  constructor() {
    this._fonts = [];
    this._default = this._fonts[0];
    this._defaultIndex = 0;
    this.load();
  }

  public load(): void {
    this._fonts = [];
    const rules = getCSSStyleRules(DATA_TAG_FONT);
    for (let i = 0; i < rules.length; i++) {
      const map = getCSSRuleKeyValue(rules[i].rules);
      this._fonts.push(createFont(map, rules[i].dataValue));
    }
    for (let i = 0; i < this._fonts.length; i++) {
      const t = this._fonts[i];
      if (t.id == 'serif') {
        this._default = t;
        this._defaultIndex = i;
        break;
      }
    }
  }
}

export const FontManagerInstance = new FontManager();
