const processPermission = require('./processPermission');
const isWildcardPermission = require('./isWildcardPermission');
const accessMapping = require('./accessMapping');
const Rule = require('./Rule');
const RuleSet = require('./RuleSet');

const accessMappingValues = Object.values(accessMapping);

function Authorization(ruleSet) {
  if (!(this instanceof Authorization)) {
    throw new Error('Invalid usage of Authorization: use the `new` keyword.');
  }

  if (!(ruleSet instanceof RuleSet)) {
    throw new Error('Invalid argument `ruleSet` given: must be an instance of `RuleSet`.');
  }

  this.verify = (contexts, permission) => {
    const processedPermission = processPermission(permission);
    if (!processedPermission) {
      throw new Error('Invalid resource or access given to Authorization.verify().');
    }
    
    const givenPermissions = ruleSet.getContextPermissions(contexts);
    if (isWildcardPermission(processedPermission)) {
      const resource = processedPermission.split(':')[0];
      return accessMappingValues.reduce((acc, cur) => (acc || givenPermissions.has(`${resource}:${cur}`)), false);
    }

    return givenPermissions.has(processedPermission);
  };
  
  this.exportRule = (contexts) => {
    const givenPermissions = ruleSet.getContextPermissions(contexts);
    return new Rule(contexts, [...givenPermissions]);
  };
}

module.exports = Authorization;
