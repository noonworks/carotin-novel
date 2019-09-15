const stylelint = require('stylelint');

const ruleName = 'plugin/carotin-novel-theme';
const messages = stylelint.utils.ruleMessages(ruleName, {
  invalid: (name, required, unknown) => {
    const rq = required.length > 0 ? 'needs [' + required.join(',') + ']' : '';
    const uk =
      unknown.length > 0 ? 'has unknown [' + unknown.join(',') + ']' : '';
    return 'Theme [' + name + ']:\n' + rq + uk;
  }
});

const prefix = '--carotinnovel';

const requiredValues = [
  '--meta-theme-version',
  '--meta-theme-namespace',
  '--meta-theme-id',
  '--meta-theme-name',
  '--meta-theme-description',
  '--meta-theme-author',
  '--meta-theme-href',
  '--meta-theme-license',
  '--background-base',
  '--background-base-a',
  '--text-base',
  '--text-base-a',
  '--link-base',
  '--link-base-a',
  '--link-base-decoration',
  '--link-hover',
  '--link-hover-a',
  '--link-hover-decoration',
  '--link-active',
  '--link-active-a',
  '--link-active-decoration',
  '--link-visited',
  '--link-visited-a',
  '--slidepad-opacity',
  '--slidepad-back',
  '--slidepad-back-a',
  '--slidepad-front',
  '--slidepad-front-a',
  '--slidepad-back-shadow',
  '--slidepad-back-shadow-a',
  '--slidepad-front-shadow',
  '--slidepad-front-shadow-a',
  '--loader-primary',
  '--loader-primary-a',
  '--menu-base',
  '--menu-base-a',
  '--menu-text',
  '--menu-text-a',
  '--menu-shadow-base',
  '--menu-shadow-base-a',
  '--menu-shadow-line',
  '--menu-shadow-line-a',
  '--menu-border',
  '--menu-border-a',
  '--menu-ripple',
  '--menu-ripple-a',
  '--menu-link-base',
  '--menu-link-base-a',
  '--menu-link-base-decoration',
  '--menu-link-hover',
  '--menu-link-hover-a',
  '--menu-link-hover-decoration',
  '--menu-link-active',
  '--menu-link-active-a',
  '--menu-link-active-decoration',
  '--menu-link-visited',
  '--menu-link-visited-a'
].map(v => prefix + v);

function checkTheme(rule) {
  const r = {
    required: [],
    unknown: []
  };
  const decls = rule.nodes.map(n => n.prop);
  requiredValues.forEach(v => {
    if (decls.indexOf(v) < 0) {
      r.required.push(v);
    }
  });
  decls.forEach(v => {
    if (requiredValues.indexOf(v) < 0) {
      r.unknown.push(v);
    }
  });
  return r;
}

module.exports = stylelint.createPlugin(ruleName, function(_po, _so) {
  // const themeVals = [];
  return function(postcssRoot, postcssResult) {
    postcssRoot.nodes.forEach(n => {
      if (
        n.type != 'rule' ||
        n.selector.indexOf(':root[data-style-theme=') < 0
      ) {
        return;
      }
      const r = checkTheme(n);
      if (r.unknown.length == 0 && r.required.length == 0) {
        return;
      }
      const themeName = n.selector
        .replace(':root[data-style-theme=', '')
        .replace(']', '');
      stylelint.utils.report({
        ruleName: ruleName,
        result: postcssResult,
        node: n,
        message: messages.invalid(themeName, r.required, r.unknown)
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
