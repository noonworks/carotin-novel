import { StoreManagerInstance } from '../../store/StoreManager';
import { SlidepadPosition, isSlidepadPosition } from '../../store/IStore';

export class SlidepadSettings {
  private wrapper: HTMLDivElement;
  private radios: HTMLInputElement[];

  public get dom(): HTMLDivElement {
    return this.wrapper;
  }

  public get selected(): SlidepadPosition {
    for (let i = 0; i < this.radios.length; i++) {
      const radio = this.radios[i];
      if (radio.checked && isSlidepadPosition(radio.value)) {
        return radio.value;
      }
    }
    return 'right';
  }

  constructor() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('slidepad_select');
    this.radios = [];
    const cur = StoreManagerInstance.config.slidepad.position;
    [
      { id: 'left', label: '左' },
      { id: 'none', label: 'なし' },
      { id: 'right', label: '右' }
    ].forEach(i => {
      const d = document.createElement('div');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'slidepad_radio';
      input.value = i.id;
      input.id = 'slidepad_radio_' + i.id;
      if (i.id == cur) {
        input.checked = true;
      }
      d.appendChild(input);
      this.radios.push(input);
      const l = document.createElement('label');
      l.textContent = i.label;
      l.setAttribute('for', 'slidepad_radio_' + i.id);
      d.appendChild(l);
      this.wrapper.appendChild(d);
    });
  }
}
