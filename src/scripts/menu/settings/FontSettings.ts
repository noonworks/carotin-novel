import { constructSelect, createCautionBox, createCheckBox } from './util';
import { StoreManagerInstance } from '../../store/StoreManager';
import { FontManagerInstance } from '../../font/FontManager';

export class FontSettings {
  private wrapper: HTMLDivElement;
  private changeDiv: HTMLDivElement;
  private cautionDiv: HTMLDivElement;
  private overwriteCheck: HTMLInputElement;
  private select: HTMLSelectElement;

  public get dom(): HTMLDivElement {
    return this.wrapper;
  }

  public get selected(): { id: string } {
    const df = FontManagerInstance.default.font;
    const r = { id: df ? df.id : '' };
    const opts = this.select.selectedOptions;
    if (opts.length < 1) {
      return r;
    }
    r.id = opts[0].value;
    return r;
  }

  constructor() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('menu_center');
    {
      this.cautionDiv = createCautionBox({
        id: 'font-caution',
        title: 'フォント'
      });
      const chk = createCheckBox({
        id: 'overwrite-font',
        label: '作品の設定を上書きする'
      });
      this.overwriteCheck = chk.check;
      this.wrapper.appendChild(this.cautionDiv);
      this.wrapper.appendChild(chk.div);
    }
    {
      this.select = document.createElement('select');
      this.changeDiv = document.createElement('div');
      this.constructChangeDiv();
      this.wrapper.appendChild(this.changeDiv);
    }
  }

  private constructChangeDiv(): void {
    const curFont = StoreManagerInstance.config.font;
    const fChecked = (opt: HTMLOptionElement): void => {
      this.select.style.fontFamily = opt.style.fontFamily;
    };
    const fNotChecked = (): void => {};
    const opts = FontManagerInstance.fonts.map(font => {
      return {
        value: font.id,
        text: font.name,
        data: {},
        selected: font.id === curFont.id,
        styles: { 'font-family': font.family },
        callback: font.id === curFont.id ? fChecked : fNotChecked
      };
    });
    constructSelect({
      select: this.select,
      id: 'font_select',
      onchange: target => {
        this.select.style.fontFamily =
          target.selectedOptions[0].style.fontFamily;
      },
      options: opts
    });
    this.changeDiv.appendChild(this.select);
  }
}
