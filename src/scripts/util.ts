export interface CSSCustomProperty {
  key: string;
  val: string;
}

export function getCSSCustomProperty(name: string): string {
  return document.documentElement.style.getPropertyValue(name);
}

export function updateCSSCustomProperty(opt: CSSCustomProperty): boolean {
  const v = getCSSCustomProperty(opt.key);
  if (v == opt.val) {
    return false;
  }
  document.documentElement.style.setProperty(opt.key, opt.val);
  return true;
}
