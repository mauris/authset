const Rule = require('../src/Rule');
const RuleSet = require('../src/RuleSet');
const Authorization = require('../src/Authorization');

test('Authorization should throw error on incorrect instantiation', () => {
  expect(() => {
    Authorization();
  }).toThrow(/Invalid usage of Authorization/);

  expect(() => {
    new Authorization(null); /* eslint-disable-line no-new */
  }).toThrow(/Invalid argument `ruleSet` given/);
});

test('Authorization should throw error on invalid resource or access', () => {
  expect(() => {
    const ruleSet = new RuleSet(['users', 'groups']);
    const authorization = new Authorization(ruleSet);
    authorization.verify({ users: 'test', groups: 'admin' }, null);
  }).toThrow(/Invalid resource or access given/);
});

test('Authorization should allow wildcards', () => {
  const ruleSet = new RuleSet(['users', 'groups']);
  ruleSet.addRule(new Rule({ users: ['test'] }, ['products']));
  
  const authorization = new Authorization(ruleSet);
  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'products:*')).toBe(true);
});

test('Authorization should verify correctly for given rules and context', () => {
  const ruleSet = new RuleSet(['users', 'groups']);
  ruleSet.addRule(new Rule({ users: ['test'] }, ['products:W']));
  ruleSet.addRule(new Rule({ groups: ['admin'] }, ['products:R', 'baskets:W', 'baskets:R']));

  const authorization = new Authorization(ruleSet);
  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'baskets:W')).toBe(true);
  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'baskets:R')).toBe(true);
  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'products:W')).toBe(true);
  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'products:read')).toBe(true);

  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'products:X')).toBe(false);

  expect(authorization.verify({ users: 'test', groups: 'normalUsers' }, 'baskets:W')).toBe(false);
  expect(authorization.verify({ users: 'test', groups: 'normalUsers' }, 'baskets:R')).toBe(false);
  expect(authorization.verify({ users: 'test', groups: 'normalUsers' }, 'products:write')).toBe(true);
  expect(authorization.verify({ users: 'test', groups: 'normalUsers' }, 'products:R')).toBe(false);
});

test('Authorization should export rules correctly', () => {
  const ruleSet = new RuleSet(['users', 'groups']);
  ruleSet.addRule(new Rule({ users: ['test'] }, ['products']));
  ruleSet.addRule(new Rule({ groups: ['admin'] }, ['products:R', 'baskets:W', 'baskets:R']));
  
  const authorization = new Authorization(ruleSet);
  const newRule = authorization.exportRule({ users: 'test', groups: 'admin' });
  expect(newRule).toBeInstanceOf(Rule);
  const permissions = newRule.getPermissions();
  expect(permissions).toBeInstanceOf(Set);
  expect(permissions.size).toBe(4);
  expect(permissions).toContain('products:*');
  expect(permissions).toContain('products:R');
  expect(permissions).toContain('baskets:W');
  expect(permissions).toContain('baskets:R');
});
