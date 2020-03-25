const accessMapping = require('./accessMapping');
const RuleSet = require('./RuleSet');

function Authorization(ruleSet) {
  if (!(this instanceof Authorization)) {
    throw new Error('Invalid usage of Authorization: use the `new` keyword.');
  }

  if (!(ruleSet instanceof RuleSet)) {
    throw new Error('Invalid argument `ruleSet` given: must be an instance of `RuleSet`.');
  }

  this.verify = (contexts, resource, access) => {
    if (!resource || !access) {
      throw new Error('Invalid resource or access given to Authorization.verify().');
    }

    let newAccess = access.toUpperCase();
    if (accessMapping[newAccess]) {
      newAccess = accessMapping[newAccess];
    }

    const givenPermissions = ruleSet.getContextPermissions(contexts);
    const requestedPermission = `${resource}:${newAccess}`;
    return givenPermissions.has(requestedPermission);
  };
}

module.exports = Authorization;
