interface FontOptions {
  id: string;
  name: string;
  description: string;
}

export class Font {
  public id: string;
  public name: string;
  public description: string;

  constructor(opt: FontOptions) {
    this.id = opt.id;
    this.name = opt.name;
    this.description = opt.description;
  }
}
