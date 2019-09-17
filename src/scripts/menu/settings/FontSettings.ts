import { StoreManagerInstance } from '../../store/StoreManager';
import { OverwritableSettings } from './OverwritableSettings';
import { WorkConfigInstance } from '../../WorkConfig';

export class FontSettings extends OverwritableSettings {
  private select: HTMLSelectElement;

  public get selected(): { id: string } {
    const opts = this.select.selectedOptions;
    if (opts.length < 1) {
      return { id: '' };
    }
    return { id: opts[0].value };
  }

  protected onChangeOverwriteCheck(): void {
    // dummy
  }

  constructor() {
    super({
      cautionLabel: 'フォント',
      checkboxId: 'overwrite-font',
      overwritable: WorkConfigInstance.authorDefault.font.index >= 0
    });
    {
      this.select = document.createElement('select');
      this.constructChangeDiv();
    }
  }

  private constructChangeDiv(): void {
    const curFont = StoreManagerInstance.config.font;
    const fChecked = (opt: HTMLOptionElement): void => {
      this.select.style.fontFamily = opt.style.fontFamily;
    };
    const fNotChecked = (): void => {};
    const opts = WorkConfigInstance.fonts.map(font => {
      return {
        value: font.id,
        text: font.name,
        data: {},
        selected: font.id === curFont.id,
        styles: { 'font-family': font.family },
        callback: font.id === curFont.id ? fChecked : fNotChecked
      };
    });
    this.constructSelect({
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
