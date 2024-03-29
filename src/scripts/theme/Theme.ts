import { ThemeManagerInstance, DEFAULT_THEME_NAMESPACE } from './ThemeManager';

interface ThemeOptions {
  version: string;
  namespace: string;
  id: string;
  name: string;
  description: string;
  author: string;
  href: string;
  license: string;
  data: { [key: string]: string };
}

export function makeIdentifier(theme: {
  id: string;
  namespace: string;
}): string {
  if (theme.namespace == DEFAULT_THEME_NAMESPACE) {
    return theme.id;
  }
  return theme.namespace + '-' + theme.id;
}

export class Theme {
  public version: string;
  public namespace: string;
  public id: string;
  public name: string;
  public description: string;
  public author: string;
  public href: string;
  public license: string;
  public data: { [key: string]: string };

  public get identifier(): string {
    return makeIdentifier(this);
  }

  constructor(opt: ThemeOptions) {
    this.version = opt.version;
    this.namespace = opt.namespace;
    this.id = opt.id;
    this.name = opt.name;
    this.description = opt.description;
    this.author = opt.author;
    this.href = opt.href;
    this.license = opt.license;
    this.data = opt.data;
  }

  public getValue(name: string): string {
    const dt = ThemeManagerInstance.default.theme;
    return this.data[name] || (dt ? dt.data[name] : '');
  }

  public getColor(): { background: string; text: string } {
    const b1 = this.getValue('background-base');
    const b2 = this.getValue('background-base-a');
    const background = 'rgba(' + b1 + ', ' + b2 + ')';
    const t1 = this.getValue('text-base');
    const t2 = this.getValue('text-base-a');
    const text = 'rgba(' + t1 + ', ' + t2 + ')';
    return { background, text };
  }
}
