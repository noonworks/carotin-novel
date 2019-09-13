interface ThemeOptions {
  version: string;
  namespace: string;
  id: string;
  name: string;
  description: string;
  author: string;
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
  public license: string;
  public data: { [key: string]: string };

  constructor(opt: ThemeOptions) {
    this.version = opt.version;
    this.namespace = opt.namespace;
    this.id = opt.id;
    this.name = opt.name;
    this.description = opt.description;
    this.author = opt.author;
    this.license = opt.license;
    this.data = opt.data;
  }
}
