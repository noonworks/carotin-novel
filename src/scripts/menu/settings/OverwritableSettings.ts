import { SettingsBase } from './SettingsBase';

function createCautionBox(label: string): HTMLDivElement {
  const c = document.createElement('div');
  c.classList.add('menu-caution');
  c.appendChild(document.createTextNode('この作品には' + label + 'が'));
  c.appendChild(document.createElement('br'));
  c.appendChild(document.createTextNode('設定されています。'));
  return c;
}

type OverwritableSettingsParam = {
  cautionLabel: string;
  checkboxId: string;
  overwritable: boolean;
};

export abstract class OverwritableSettings extends SettingsBase {
  protected cautionDiv: HTMLDivElement;
  protected checkDiv: HTMLDivElement;
  protected overwriteCheck: HTMLInputElement;
  protected changeDiv: HTMLDivElement;
  protected overwritable: boolean;

  public get overwrited(): boolean {
    return this.overwriteCheck.checked;
  }

  protected set overwrite(overwrite: boolean) {
    this.overwriteCheck.checked = overwrite;
    this.changeOverwriteView(overwrite);
  }

  protected abstract onChangeOverwriteCheck(overwrite: boolean): void;

  private _onChangeOverwriteCheck(): void {
    this.changeOverwriteView(this.overwrited);
    this.onChangeOverwriteCheck(this.overwrited);
  }

  private changeOverwriteView(overwrite: boolean): void {
    if (overwrite) {
      this.cautionDiv.classList.add('off');
      this.changeDiv.classList.remove('off');
    } else {
      this.cautionDiv.classList.remove('off');
      this.changeDiv.classList.add('off');
    }
  }

  constructor(param: OverwritableSettingsParam) {
    super();
    this.wrapper.classList.add('menu_center');
    this.cautionDiv = createCautionBox(param.cautionLabel);
    {
      const chk = SettingsBase.createCheckBox({
        id: param.checkboxId,
        label: '作品の設定を上書きする'
      });
      this.checkDiv = chk.div;
      this.overwriteCheck = chk.check;
    }
    this.overwriteCheck.addEventListener('change', () => {
      this._onChangeOverwriteCheck();
    });
    this.wrapper.appendChild(this.cautionDiv);
    this.wrapper.appendChild(this.checkDiv);
    this.changeDiv = document.createElement('div');
    this.changeDiv.classList.add('menu-change');
    this.wrapper.appendChild(this.changeDiv);
    this.overwritable = param.overwritable;
    if (!this.overwritable) {
      this.cautionDiv.style.display = 'none';
      this.checkDiv.style.display = 'none';
    }
  }
}
