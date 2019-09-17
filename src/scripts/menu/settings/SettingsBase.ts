type OptionParams = {
  value: string;
  text: string;
  data: { [key: string]: string };
  selected: boolean;
  styles: { [key: string]: string };
  callback: (opt: HTMLOptionElement) => void;
};

function createOption(param: OptionParams): HTMLOptionElement {
  const opt = document.createElement('option');
  opt.value = param.value;
  opt.textContent = param.text;
  if (param.selected) {
    opt.selected = true;
  }
  const datas = Object.keys(param.data);
  datas.forEach(key => {
    opt.setAttribute(key, param.data[key]);
  });
  const styles = Object.keys(param.styles);
  styles.forEach(key => {
    opt.style.setProperty(key, param.styles[key]);
  });
  param.callback(opt);
  return opt;
}

export abstract class SettingsBase {
  protected wrapper: HTMLDivElement;

  public get dom(): HTMLDivElement {
    return this.wrapper;
  }

  constructor() {
    this.wrapper = document.createElement('div');
  }

  protected constructSelect(opt: {
    select: HTMLSelectElement;
    id: string;
    onchange: (target: HTMLSelectElement) => void;
    options: OptionParams[];
  }): void {
    opt.select.id = opt.id;
    opt.select.addEventListener('change', (ev: Event) => {
      if (!ev.target) {
        return;
      }
      const target = ev.target as HTMLSelectElement;
      opt.onchange(target);
    });
    opt.options.forEach(o => {
      const optelm = createOption(o);
      opt.select.appendChild(optelm);
    });
  }

  public static createCheckBox(opt: {
    id: string;
    label: string;
  }): { div: HTMLDivElement; check: HTMLInputElement } {
    const div = document.createElement('div');
    div.classList.add('menu-checkbox');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.id = opt.id;
    const label = document.createElement('label');
    label.setAttribute('for', opt.id);
    label.textContent = opt.label;
    div.appendChild(check);
    div.appendChild(label);
    return { div, check };
  }
}
