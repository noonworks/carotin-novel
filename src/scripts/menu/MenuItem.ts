export type OnMenuItemCallback = (id: string) => void;

export interface MenuItemOption {
  id: string;
  icon: string;
  title: string;
}

export const MENUITEM_BACK: MenuItemOption = {
  id: 'back',
  icon: 'ion-md-arrow-back',
  title: '戻る'
};

export class MenuItem {
  private id: string;
  private icon: string;
  private title: string;

  constructor(option: MenuItemOption) {
    this.id = option.id;
    this.icon = option.icon;
    this.title = option.title;
  }

  public toElement(callback: OnMenuItemCallback): HTMLLIElement {
    const li = document.createElement('li');
    li.classList.add(this.id);
    const a = document.createElement('a');
    a.classList.add('button');
    const icon = document.createElement('i');
    icon.classList.add('icon');
    icon.classList.add(this.icon);
    const title = document.createElement('span');
    title.textContent = this.title;
    a.appendChild(icon);
    a.appendChild(title);
    li.appendChild(a);
    a.addEventListener('click', () => {
      callback(this.id);
    });
    return li;
  }
}
