const main = require('../');
const Rule = require('../src/Rule');
const RuleSet = require('../src/RuleSet');
const Authorization = require('../src/Authorization');

test('index should have correct exports', () => {
  expect(main.Rule).toBe(Rule);
  expect(main.RuleSet).toBe(RuleSet);
  expect(main.Authorization).toBe(Authorization);
});
