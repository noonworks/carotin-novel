import { UAParser } from 'ua-parser-js';

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
