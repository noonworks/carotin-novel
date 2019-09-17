import { SettingsBase } from './SettingsBase';

function createCautionBox(label: string): HTMLDivElement {
  const c = document.createElement('div');
  c.classList.add('menu-caution');
  c.appendChild(document.createTextNode('この作品には' + label + 'が'));
  c.appendChild(document.createElement('br'));
  c.appendChild(document.createTextNode('設定されています。'));
  c.appendChild(document.createElement('br'));
  const span = document.createElement('span');
  span.textContent = '（設定は上書きできます）';
  c.appendChild(span);
  return c;
}

type OverwritableSettingsParam = {
  cautionLabel: string;
  checkboxId: string;
};

export abstract class OverwritableSettings extends SettingsBase {
  protected cautionDiv: HTMLDivElement;
  protected overwriteCheck: HTMLInputElement;
  protected changeDiv: HTMLDivElement;

  constructor(param: OverwritableSettingsParam) {
    super();
    this.wrapper.classList.add('menu_center');
    this.cautionDiv = createCautionBox(param.cautionLabel);
    const chk = SettingsBase.createCheckBox({
      id: param.checkboxId,
      label: '作品の設定を上書きする'
    });
    this.overwriteCheck = chk.check;
    this.wrapper.appendChild(this.cautionDiv);
    this.wrapper.appendChild(chk.div);
    this.changeDiv = document.createElement('div');
    this.changeDiv.classList.add('menu-change');
    this.wrapper.appendChild(this.changeDiv);
  }
}
