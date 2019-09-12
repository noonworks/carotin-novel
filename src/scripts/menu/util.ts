export function appendCSS(): void {
  const links = document.head.querySelectorAll('link');
  let foundIonicons = false;
  let foundGFNotoSerifJP = false;
  links.forEach(l => {
    if (l.rel.toLowerCase() != 'stylesheet') {
      return;
    }
    if (l.href.indexOf('ionicons') >= 0) {
      foundIonicons = true;
    }
    if (
      l.href.indexOf('fonts.googleapis.com') >= 0 &&
      l.href.indexOf('Noto+Serif+JP') >= 0
    ) {
      foundGFNotoSerifJP = true;
    }
  });
  if (!foundIonicons) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css';
    document.head.appendChild(link);
  }
  if (!foundGFNotoSerifJP) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css?family=Noto+Serif+JP&display=swap';
    document.head.appendChild(link);
  }
}

export function createMenuContent(title?: string): HTMLDivElement {
  const t = document.createElement('div');
  t.classList.add('menu-content');
  if (title) {
    const h2 = document.createElement('h2');
    const l1 = document.createElement('span');
    l1.classList.add('line');
    const ttl = document.createElement('span');
    ttl.classList.add('title');
    ttl.textContent = title;
    h2.appendChild(l1);
    h2.appendChild(ttl);
    h2.appendChild(l1.cloneNode());
    t.appendChild(h2);
  }
  return t;
}

export function createMenuBack(callback: () => void): HTMLDivElement {
  const back = document.createElement('div');
  back.classList.add('menu-back');
  const ms = document.createElement('div');
  ms.classList.add('menu-slide');
  const i = document.createElement('i');
  i.classList.add('icon');
  i.classList.add('ion-ios-arrow-back');
  ms.appendChild(i);
  back.appendChild(ms);
  ms.addEventListener('click', callback);
  return back;
}
