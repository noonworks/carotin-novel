import {
  ThemeManagerInstance,
  DEFAULT_THEME_NAMESPACE
} from '../../theme/ThemeManager';
import { StoreManagerInstance } from '../../store/StoreManager';
import { Theme } from '../../theme/Theme';
import { OverwritableSettings } from './OverwritableSettings';

const DATA_NAMESPACE = 'data-theme-namespace';
const DATA_ID = 'data-theme-id';

export class ThemeSettings extends OverwritableSettings {
  private sampleDiv: HTMLDivElement;
  private select: HTMLSelectElement;

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
    super({
      cautionLabel: 'テーマ',
      checkboxId: 'overwrite-theme'
    });
    {
      this.select = document.createElement('select');
      this.sampleDiv = document.createElement('div');
      this.constructChangeDiv(theme);
    }
  }

  private constructChangeDiv(theme: Theme | null): void {
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
    this.constructSelect({
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
