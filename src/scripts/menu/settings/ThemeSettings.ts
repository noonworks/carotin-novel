import {
  ThemeManagerInstance,
  DEFAULT_THEME_NAMESPACE
} from '../../theme/ThemeManager';
import { StoreManagerInstance } from '../../store/StoreManager';
import { Theme } from '../../theme/Theme';
import { createCautionBox, createCheckBox, constructSelect } from './util';

const DATA_NAMESPACE = 'data-theme-namespace';
const DATA_ID = 'data-theme-id';

export class ThemeSettings {
  private wrapper: HTMLDivElement;
  private changeDiv: HTMLDivElement;
  private sampleDiv: HTMLDivElement;
  private cautionDiv: HTMLDivElement;
  private overwriteCheck: HTMLInputElement;
  private select: HTMLSelectElement;

  public get dom(): HTMLDivElement {
    return this.wrapper;
  }

  public get selected(): {
    id: string;
    namespace: string;
  } {
    const dt = ThemeManagerInstance.default.theme;
    const r = {
      id: dt ? dt.id : '',
      namespace: dt ? dt.namespace : ''
    };
    if (this.select.selectedOptions.length < 1) {
      return r;
    }
    const opt = this.select.selectedOptions[0];
    const id = opt.getAttribute(DATA_ID);
    const namespace = opt.getAttribute(DATA_NAMESPACE);
    if (!id || !namespace) {
      return r;
    }
    return { id, namespace };
  }

  public setSample(theme: Theme): void {
    this.sampleDiv.innerHTML = '';
    this.sampleDiv.textContent += theme.description;
    if (theme.namespace != DEFAULT_THEME_NAMESPACE) {
      const span = document.createElement('span');
      span.classList.add('author');
      span.textContent += '作者：';
      if (theme.href.length > 0) {
        const a = document.createElement('a');
        a.target = '_blank';
        a.href = theme.href;
        a.textContent = theme.author;
        span.appendChild(a);
      } else {
        span.textContent += theme.author;
      }
      this.sampleDiv.appendChild(span);
    }
    const colors = theme.getColor();
    this.sampleDiv.style.backgroundColor = colors.background;
    this.sampleDiv.style.color = colors.text;
  }

  constructor(theme: Theme | null) {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('menu_center');
    {
      this.cautionDiv = createCautionBox({
        id: 'theme-caution',
        title: 'テーマ'
      });
      const chk = createCheckBox({
        id: 'overwrite-theme',
        label: '作品の設定を上書きする'
      });
      this.overwriteCheck = chk.check;
      this.wrapper.appendChild(this.cautionDiv);
      this.wrapper.appendChild(chk.div);
    }
    {
      this.select = document.createElement('select');
      this.changeDiv = document.createElement('div');
      this.sampleDiv = document.createElement('div');
      this.constructChangeDiv(theme);
      this.wrapper.appendChild(this.changeDiv);
    }
  }

  private constructChangeDiv(theme: Theme | null): void {
    this.changeDiv.classList.add('menu-change');
    this.sampleDiv.id = 'theme_sample';
    if (theme) {
      this.setSample(theme);
    }
    const curTheme = StoreManagerInstance.config.theme;
    const opts = ThemeManagerInstance.themes.map(theme => {
      return {
        value: theme.id,
        text: theme.name,
        data: {
          [DATA_NAMESPACE]: theme.namespace,
          [DATA_ID]: theme.id
        },
        selected:
          theme.id === curTheme.id && theme.namespace === curTheme.namespace,
        styles: {},
        callback: (): void => {}
      };
    });
    constructSelect({
      select: this.select,
      id: 'theme_select',
      onchange: target => {
        this.setSample(ThemeManagerInstance.themes[target.selectedIndex]);
      },
      options: opts
    });
    this.changeDiv.appendChild(this.select);
    this.changeDiv.appendChild(this.sampleDiv);
  }
}
