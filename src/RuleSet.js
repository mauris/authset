const Rule = require('./Rule');

function unionInto(setA, setB) {
  setB.forEach(setA.add, setA);
}

function RuleSet(contexts) {
  if (!(this instanceof RuleSet)) {
    throw new Error('Invalid usage of RuleSet: use the `new` keyword.');
  }

  if (!contexts || contexts.length === 0) {
    throw new Error('Invalid argument `contexts` provided.');
  }

  const _rules = {};
  const _contexts = [...contexts];
  _contexts.forEach((context) => {
    _rules[context] = {};
  });

  this.addRule = (rule) => {
    if (!(rule instanceof Rule)) {
      throw new Error('Invalid argument `rule` given: must be an instance of `Rule`.');
    }
    const permissions = rule.getPermissions();

    _contexts.forEach((context) => {
      const contextIdentifiers = rule.getContextIdentifiers(context);
      if (contextIdentifiers.size === 0) {
        return;
      }
      contextIdentifiers.forEach((identifier) => {
        _rules[context][identifier] = new Set([
          ...(_rules[context][identifier] || []),
          ...permissions
        ]);
      });
    });
  };

  this.reset = () => {
    _contexts.forEach((context) => {
      _rules[context] = {};
    });
  };

  this.getContextPermissions = (givenContexts) => {
    const permissions = new Set();
    Object.keys(givenContexts)
      .forEach((context) => {
        if (!_rules[context]) {
          throw new Error(`Invalid context provided: ${context}`);
        }
        const identifiers = Array.isArray(givenContexts[context])
          ? givenContexts[context] : [givenContexts[context]];

        identifiers.forEach((identifier) => {
          unionInto(permissions, _rules[context][identifier] || []);
        });
      });
    return permissions;
  };
}

module.exports = RuleSet;
