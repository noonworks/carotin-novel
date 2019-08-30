function isChromeDesktop() {
  const agent = window.navigator.userAgent;
  const chrome_mobile = /Chrome\/[0-9\.]+ Mobile/;
  if (chrome_mobile.test(agent)) { return false; }
  const chrome = /Chrome\/[0-9\.]+/;
  if (chrome.test(agent)) { return true; }
  return false;
}

function initialize() {
  if (isChromeDesktop()) {
    document.querySelector('body').classList.add('custom_ruby');
  }
}

window.addEventListener('DOMContentLoaded', initialize);
