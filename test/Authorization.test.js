const Rule = require('../src/Rule');
const RuleSet = require('../src/RuleSet');
const Authorization = require('../src/Authorization');

test('Authorization should throw error on incorrect instantiation', () => {
  expect(() => {
    Authorization();
  }).toThrow();

  expect(() => {
    new Authorization(null); /* eslint-disable-line no-new */
  }).toThrow();
});

test('RuleSet should verify correctly for given rules and context', () => {
  const ruleSet = new RuleSet(['users', 'groups']);
  ruleSet.addRule(new Rule({ users: ['test'] }, ['products:W']));
  ruleSet.addRule(new Rule({ groups: ['admin'] }, ['products:R', 'baskets:W', 'baskets:R']));

  const authorization = new Authorization(ruleSet);
  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'baskets', 'W')).toBe(true);
  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'baskets', 'R')).toBe(true);
  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'products', 'W')).toBe(true);
  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'products', 'R')).toBe(true);

  expect(authorization.verify({ users: 'test', groups: 'admin' }, 'products', 'X')).toBe(false);

  expect(authorization.verify({ users: 'test', groups: 'normalUsers' }, 'baskets', 'W')).toBe(false);
  expect(authorization.verify({ users: 'test', groups: 'normalUsers' }, 'baskets', 'R')).toBe(false);
  expect(authorization.verify({ users: 'test', groups: 'normalUsers' }, 'products', 'W')).toBe(true);
  expect(authorization.verify({ users: 'test', groups: 'normalUsers' }, 'products', 'R')).toBe(false);
});
