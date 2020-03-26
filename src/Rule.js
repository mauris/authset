const processPermission = require('./processPermission');

function Rule(contexts, permissions) {
  if (!(this instanceof Rule)) {
    throw new Error('Invalid usage of Rule: use the `new` keyword.');
  }

  const _permissions = new Set(
    permissions
      .map(processPermission)
      .filter(permission => Boolean(permission))
  );

  const _contexts = {};
  Object.keys(contexts)
    .forEach((context) => {
      if (contexts[context] instanceof Set) {
        _contexts[context] = contexts[context];
        return;
      }
      _contexts[context] = new Set(
        Array.isArray(contexts[context])
          ? contexts[context] : [contexts[context]]
      );
    });

  this.getContextIdentifiers = (context) => {
    if (!_contexts[context]) {
      return new Set();
    }

    return _contexts[context];
  };

  this.getPermissions = () => {
    return _permissions;
  };
}

module.exports = Rule;
