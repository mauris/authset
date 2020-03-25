const Rule = require('../src/Rule');
const RuleSet = require('../src/RuleSet');

test('RuleSet should throw error on incorrect instantiation', () => {
  expect(() => {
    RuleSet();
  }).toThrow();

  expect(() => {
    new RuleSet(null); /* eslint-disable-line no-new */
  }).toThrow();
});

test('RuleSet should return correct empty rules', () => {
  const ruleSet = new RuleSet(['users']);
  const rules = ruleSet.getContextPermissions({ users: 'test' });
  expect(rules).toBeInstanceOf(Set);
  expect(rules.size).toBe(0);
});

test('RuleSet should return correct empty rules', () => {
  const ruleSet = new RuleSet(['users']);
  const rules = ruleSet.getContextPermissions({ users: 'test' });
  expect(rules).toBeInstanceOf(Set);
  expect(rules.size).toBe(0);
});

test('RuleSet should throw error for invalid rule given', () => {
  expect(() => {
    const ruleSet = new RuleSet(['users']);
    ruleSet.addRule(null);
  }).toThrow();
});

test('RuleSet should throw error for invalid context', () => {
  expect(() => {
    const ruleSet = new RuleSet(['users']);
    ruleSet.getContextPermissions({ user: 'test' });
  }).toThrow();
});

test('RuleSet should add rules correctly', () => {
  const ruleSet = new RuleSet(['users']);
  ruleSet.addRule(new Rule({ users: ['test'] }, ['files:R']));

  const permissions = ruleSet.getContextPermissions({ users: 'test' });
  expect(permissions).toBeInstanceOf(Set);
  expect(permissions.size).toBe(1);
  expect(permissions).toContain('files:R');
});

test('RuleSet should add rules for multiple contexts correctly', () => {
  const ruleSet = new RuleSet(['users', 'groups']);
  ruleSet.addRule(new Rule({ users: ['test'] }, ['products:W']));
  ruleSet.addRule(new Rule({ groups: ['admin'] }, ['products:R', 'baskets:W', 'baskets:R']));
  ruleSet.addRule(new Rule({ users: ['rack'], groups: ['super'] }, ['admin:X']));

  const permissions1 = ruleSet.getContextPermissions({ users: 'test', groups: 'admin' });
  expect(permissions1).toBeInstanceOf(Set);
  expect(permissions1.size).toBe(4);
  expect(permissions1).toContain('products:W');
  expect(permissions1).toContain('products:R');
  expect(permissions1).toContain('baskets:W');
  expect(permissions1).toContain('baskets:R');

  const permissions2 = ruleSet.getContextPermissions({ users: 'test' });
  expect(permissions2.size).toBe(1);
  expect(permissions2).toContain('products:W');
  expect(permissions2).not.toContain('products:R');
  expect(permissions2).not.toContain('baskets:W');
  expect(permissions2).not.toContain('baskets:R');

  const permissions3 = ruleSet.getContextPermissions({ users: 'rack' });
  expect(permissions3.size).toBe(1);
  expect(permissions3).toContain('admin:X');

  const permissions4 = ruleSet.getContextPermissions({ users: 'rack', groups: 'super' });
  expect(permissions4.size).toBe(1);
  expect(permissions4).toContain('admin:X');
});
