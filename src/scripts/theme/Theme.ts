import { ThemeManagerInstance } from './ThemeManager';

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
    return this.data[name] || ThemeManagerInstance.default.data[name];
  }
}
