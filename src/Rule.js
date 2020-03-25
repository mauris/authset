const accessMapping = require('./accessMapping');

function Rule(contexts, permissions) {
  if (!this) {
    throw new Error('Invalid usage of Rule: use the `new` keyword.');
  }

  const _permissions = new Set(
    permissions
      .map((permission) => {
        const [resource, access] = permission.split(':');
        if (!resource || !access) {
          return null;
        }
        let newAccess = access.toUpperCase();
        if (accessMapping[newAccess]) {
          newAccess = accessMapping[newAccess];
        }
        return `${resource}:${newAccess}`;
      })
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
