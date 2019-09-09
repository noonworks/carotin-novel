import { circleLoader } from './circle';

export type LoaderTypes = 'circle';

interface SvgElements {
  circle: SVGElement;
}

export class Loader {
  private wrapper: HTMLElement;
  private svgelements: SvgElements;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.svgelements = {
      circle: circleLoader
    };
  }

  public set(name: LoaderTypes): void {
    this.wrapper.querySelectorAll('svg').forEach(e => {
      this.wrapper.removeChild(e);
    });
    this.wrapper.appendChild(this.svgelements[name]);
  }

  public show(): void {
    this.wrapper.classList.remove('off');
  }

  public hide(): void {
    if (!this.wrapper.classList.contains('off')) {
      this.wrapper.classList.add('off');
    }
  }
}
