import {
  ThemeManagerInstance,
  DEFAULT_THEME_NAMESPACE
} from '../../theme/ThemeManager';
import { StoreManagerInstance } from '../../store/StoreManager';
import { Theme } from '../../theme/Theme';
import { OverwritableSettings } from './OverwritableSettings';
import { WorkConfigInstance } from '../../WorkConfig';

const DATA_NAMESPACE = 'data-theme-namespace';
const DATA_ID = 'data-theme-id';

export class ThemeSettings extends OverwritableSettings {
  private sampleDiv: HTMLDivElement;
  private select: HTMLSelectElement;

  public get selected(): {
    id: string;
    namespace: string;
  } {
    const r = {
      id: '',
      namespace: ''
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

  protected onChangeOverwriteCheck(): void {
    // dummy
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

  constructor() {
    super({
      cautionLabel: 'テーマ',
      checkboxId: 'overwrite-theme',
      overwritable: WorkConfigInstance.authorDefault.theme.index >= 0
    });
    {
      this.select = document.createElement('select');
      this.sampleDiv = document.createElement('div');
      this.constructChangeDiv();
    }
  }

  private constructChangeDiv(): void {
    this.sampleDiv.id = 'theme_sample';
    const curTheme = StoreManagerInstance.config.theme;
    const opts = WorkConfigInstance.themes.map(theme => {
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
        this.setSample(WorkConfigInstance.themes[target.selectedIndex]);
      },
      options: opts
    });
    this.changeDiv.appendChild(this.select);
    this.changeDiv.appendChild(this.sampleDiv);
    const sel = this.selected;
    const t = ThemeManagerInstance.getTheme(sel.namespace, sel.id);
    if (t.theme) {
      this.setSample(t.theme);
    }
  }
}
