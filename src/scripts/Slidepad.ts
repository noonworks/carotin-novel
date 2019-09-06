import nipplejs from 'nipplejs';
import { ScrollableWrapper } from './ScrollableWrapper';

const SLIDE_PAD_SIZE = 45;

export class Slidepad {
  constructor(slidepadArea: HTMLElement, contentArea: ScrollableWrapper) {
    const scrollmgr = new SlideScrollManager(contentArea);
    const slide_pad_manager = nipplejs.create({
      zone: slidepadArea,
      color: 'white',
      size: SLIDE_PAD_SIZE * 2,
      position: { left: '50%', top: '50%' },
      mode: 'static',
      lockY: true,
      restOpacity: 0.8
    });
    slide_pad_manager.on('move', (_, data) => {
      scrollmgr.setSpeed(data);
    });
    slide_pad_manager.on('start', () => {
      scrollmgr.start();
    })
    slide_pad_manager.on('end', () => {
      scrollmgr.stop();
    });
  }
}

class SlideScrollManager {
  private animationId = -1;
  private previousSpeed = 0;
  private speed = 0;
  private scrollStartPos = 0;
  private scrollStartDt = -1;
  private wrapper: ScrollableWrapper;

  constructor(wrapper: ScrollableWrapper) {
    this.wrapper = wrapper;
  }

  public start(): void {
    window.cancelAnimationFrame(this.animationId);
    this.scrollStartPos = this.wrapper.scrollLeft;
    this.scrollStartDt = (new Date()).getTime();
    const loop = () => {
      this.draw();
      this.animationId = window.requestAnimationFrame(loop);
    };
    this.animationId = window.requestAnimationFrame(loop);
  }

  public stop(): void {
    window.cancelAnimationFrame(this.animationId);
    this.animationId = -1;
    this.resetSpeed();
    this.scrollStartPos = 0;
    this.scrollStartDt = -1;
  }

  public setSpeed(data: nipplejs.JoystickOutputData): void {
    if (!data || !data.direction || !data.distance) {
      this.resetSpeed();
      return;
    }
    const direction = data.direction.y == 'up' ? 1 : -1;
    const distance = data.distance / SLIDE_PAD_SIZE;
    const speed = Math.pow(distance, 2) * direction;
    if (this.previousSpeed != speed) {
      this.previousSpeed = this.speed;
      this.speed = speed;
      this.start();
    }
  }

  private resetSpeed(): void {
    this.previousSpeed = 0;
    this.speed = 0;
  }

  private draw(): void {
    if (this.scrollStartDt < 0) {
      return;
    }
    const t = (new Date()).getTime() - this.scrollStartDt;
    const pos = this.scrollStartPos + this.speed * t;
    this.wrapper.scrollTo(pos, false);
  }
}
