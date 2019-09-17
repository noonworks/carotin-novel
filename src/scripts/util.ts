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

declare class UAParser {
  constructor();
  getResult(): {
    browser: {
      name: string | undefined;
    };
    device: {
      type: string | undefined;
    };
  };
}

export function addDummyForEdge(wrapper: HTMLDivElement): void {
  const result = new UAParser().getResult();
  if (
    !result ||
    !result.browser ||
    !result.browser.name ||
    result.browser.name.toLowerCase() == 'edge'
  ) {
    const span = document.createElement('span');
    span.style.opacity = '0';
    span.style.position = 'fixed';
    wrapper.appendChild(span);
  }
}

export function deleteTextNodeInRuby(wrapper: HTMLElement): void {
  const emptyVal = /^\s*$/;
  const rubies = wrapper.querySelectorAll('ruby');
  rubies.forEach(rby => {
    rby.childNodes.forEach(c => {
      if (
        c.nodeType == Node.TEXT_NODE &&
        c.nodeValue &&
        emptyVal.test(c.nodeValue)
      ) {
        rby.removeChild(c);
      }
    });
  });
}

export function setCustomRuby(body: HTMLElement): void {
  const result = new UAParser().getResult();
  if (!result || !result.browser || !result.device || !result.browser.name) {
    return;
  }
  if (
    result.browser.name.toLowerCase() == 'chrome' &&
    result.device.type != 'mobile'
  ) {
    body.classList.add('custom_ruby');
  }
}

const CSS_CUSTOM_VARIABLE_PREFIX = /^--carotinnovel--/;
export function removeCSSCustomVariablePrefix(str: string): string {
  return str.replace(CSS_CUSTOM_VARIABLE_PREFIX, '');
}

const DOUBLE_QUOTED = /^[ \t\r\n\s]*"([^"]*)"[ \t\r\n\s]*$/;
const SINGLE_QUOTED = /^[ \t\r\n\s]*'([^']*)'[ \t\r\n\s]*$/;
export function removeQuotes(str: string): string {
  return str.replace(DOUBLE_QUOTED, '$1').replace(SINGLE_QUOTED, '$1');
}

type DataTagRules = { dataValue: string; rules: CSSStyleRule[] };
const RULE_SUFFIX = /([^\]]*)\].*/;
export function getCSSStyleRules(dataTagName: string): DataTagRules[] {
  const RulePrefix = ':root[' + dataTagName + '=';
  const r: { [key: string]: CSSStyleRule[] } = {};
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].type.indexOf('css') < 0) {
      break;
    }
    const css = document.styleSheets[i] as CSSStyleSheet;
    try {
      const rules = css.rules;
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j] as CSSStyleRule;
        if (!rule.selectorText || rule.selectorText.indexOf(RulePrefix) != 0) {
          continue;
        }
        const val = removeQuotes(
          rule.selectorText
            .substring(RulePrefix.length)
            .replace(RULE_SUFFIX, '$1')
        );
        if (r[val] && r[val].length > 0) {
          r[val].push(rule);
        } else {
          r[val] = [rule];
        }
      }
    } catch (e) {
      break;
    }
  }
  const keys = Object.keys(r);
  return keys.map(k => {
    return { dataValue: k, rules: r[k] };
  });
}

type KV = { [key: string]: string };
export function getCSSRuleKeyValue(styles: CSSStyleRule[]): KV {
  const r: { [key: string]: string } = {};
  for (let i = 0; i < styles.length; i++) {
    const s = styles[i].style;
    for (let j = 0; j < s.length; j++) {
      const key = s[j];
      r[removeCSSCustomVariablePrefix(key)] = removeQuotes(
        s.getPropertyValue(key)
      );
    }
  }
  return r;
}
