import { ScrollableWrapper } from '../ScrollableWrapper';
import { SlideScrollManager } from './SlideScrollManager';
import nipplejs from 'nipplejs';

export type SlidePadSize = 'small' | 'middle' | 'large';
const AttributeName = 'data-slide-pad-size';

export class SlidepadManager {
  private slidePadArea: HTMLElement;
  private scrollManager: SlideScrollManager;
  private joystickManager: nipplejs.JoystickManager | null = null;
  private size: SlidePadSize = 'middle';

  constructor(slidepadArea: HTMLElement, contentArea: ScrollableWrapper) {
    this.slidePadArea = slidepadArea;
    this.scrollManager = new SlideScrollManager(contentArea);
  }

  public changeSize(size: SlidePadSize): void {
    if (this.size == size) {
      return;
    }
    this.hide();
    document.documentElement.setAttribute(AttributeName, size);
    this.show();
  }

  public show(): void {
    if (!this.joystickManager) {
      this.add(this.slidePadArea.scrollWidth);
    }
    this.slidePadArea.classList.remove('hidden');
  }

  public hide(): void {
    if (this.joystickManager) {
      this.joystickManager.destroy();
      this.joystickManager = null;
    }
    this.slidePadArea.classList.add('hidden');
  }

  private add(size: number): void {
    this.joystickManager = nipplejs.create({
      zone: this.slidePadArea,
      color: 'white',
      size: size * 2,
      position: { left: '50%', top: '50%' },
      mode: 'static',
      lockY: true,
      restOpacity: 0.8
    });
    this.joystickManager.on('move', (_, data) => {
      this.scrollManager.setSpeed(data, size);
    });
    this.joystickManager.on('start', () => {
      this.scrollManager.start();
    });
    this.joystickManager.on('end', () => {
      this.scrollManager.stop();
    });
  }
}
