// Port by @noonworks
// Original: SVG-Loaders By Sam Herbert(@sherb) https://github.com/SamHerbert/SVG-Loaders

export const circleLoader = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
circleLoader.setAttribute('width', '44');
circleLoader.setAttribute('height', '44');
circleLoader.setAttribute('viewBox', '0 0 44 44');
circleLoader.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
group.setAttribute('fill', 'none');
group.setAttribute('fill-rule', 'evenodd');
group.setAttribute('stroke-width', '2');

const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
c1.setAttribute('cx', '22');
c1.setAttribute('cy', '22');
c1.setAttribute('r', '1.0');

const ac11 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
ac11.setAttribute('attributeName', 'r');
ac11.setAttribute('begin', '0s');
ac11.setAttribute('dur', '1.8s');
ac11.setAttribute('values', '1; 20');
ac11.setAttribute('calcMode', 'spline');
ac11.setAttribute('keyTimes', '0; 1');
ac11.setAttribute('keySplines', '0.165, 0.84, 0.44, 1');
ac11.setAttribute('repeatCount', 'indefinite');

const ac12 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
ac12.setAttribute('attributeName', 'stroke-opacity');
ac12.setAttribute('begin', '0s');
ac12.setAttribute('dur', '1.8s');
ac12.setAttribute('values', '1; 0');
ac12.setAttribute('calcMode', 'spline');
ac12.setAttribute('keyTimes', '0; 1');
ac12.setAttribute('keySplines', '0.3, 0.61, 0.355, 1');
ac12.setAttribute('repeatCount', 'indefinite');

c1.appendChild(ac11);
c1.appendChild(ac12);

const c2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
c2.setAttribute('cx', '22');
c2.setAttribute('cy', '22');
c2.setAttribute('r', '1.0');

const ac21 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
ac21.setAttribute('attributeName', 'r');
ac21.setAttribute('begin', '-0.9s');
ac21.setAttribute('dur', '1.8s');
ac21.setAttribute('values', '1; 20');
ac21.setAttribute('calcMode', 'spline');
ac21.setAttribute('keyTimes', '0; 1');
ac21.setAttribute('keySplines', '0.165, 0.84, 0.44, 1');
ac21.setAttribute('repeatCount', 'indefinite');

const ac22 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
ac22.setAttribute('attributeName', 'stroke-opacity');
ac22.setAttribute('begin', '-0.9s');
ac22.setAttribute('dur', '1.8s');
ac22.setAttribute('values', '1; 0');
ac22.setAttribute('calcMode', 'spline');
ac22.setAttribute('keyTimes', '0; 1');
ac22.setAttribute('keySplines', '0.3, 0.61, 0.355, 1');
ac22.setAttribute('repeatCount', 'indefinite');

c2.appendChild(ac21);
c2.appendChild(ac22);

group.appendChild(c1);
group.appendChild(c2);

circleLoader.appendChild(group);
