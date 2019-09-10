import { ScrollableWrapper } from '../scroll/ScrollableWrapper';
import { SlideScrollManager } from './SlideScrollManager';
import nipplejs from 'nipplejs';
import { updateCSSCustomProperty, CSSCustomProperty } from '../util';

export type SlidePadSize = 'small' | 'middle' | 'large';
const AttributeName = 'data-slide-pad-size';

interface Position {
  top: string;
  right: string;
  bottom: string;
  left: string;
}
type Positions = 'top' | 'right' | 'bottom' | 'left';
const POSITION_PREFIX = '--slide-pad-position-';

function getMovePosition(pos: Partial<Position>): CSSCustomProperty[] {
  const change: { key: string; val: string }[] = [];
  for (const key in pos) {
    const p = pos[key as Positions];
    if (p) {
      change.push({
        key: POSITION_PREFIX + key,
        val: p
      });
    }
  }
  return change;
}

export class SlidepadManager {
  private slidePadArea: HTMLElement;
  private scrollManager: SlideScrollManager;
  private joystickManager: nipplejs.JoystickManager | null = null;
  private size: SlidePadSize = 'middle';

  constructor(slidepadArea: HTMLElement, contentArea: ScrollableWrapper) {
    this.slidePadArea = slidepadArea;
    this.scrollManager = new SlideScrollManager(contentArea);
  }

  public move(pos: Partial<Position>): void {
    const change = getMovePosition(pos);
    if (change.length == 0) {
      return;
    }
    change.forEach(c => {
      updateCSSCustomProperty(c);
    });
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
