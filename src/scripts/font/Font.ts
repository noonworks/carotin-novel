interface FontOptions {
  id: string;
  name: string;
  family: string;
  description: string;
}

export class Font {
  public id: string;
  public name: string;
  public family: string;
  public description: string;

  constructor(opt: FontOptions) {
    this.id = opt.id;
    this.name = opt.name;
    this.family = opt.family;
    this.description = opt.description;
  }
}
