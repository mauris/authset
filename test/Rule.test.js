const Rule = require('../src/Rule');

test('Rule should throw error on incorrect instantiation', () => {
  expect(() => {
    Rule();
  }).toThrow();
});

test('Rule should return correct permissions', () => {
  const rule = new Rule({ user: 'test' }, ['file:read', 'file:W']);

  const permissions = rule.getPermissions();
  expect(permissions).toBeInstanceOf(Set);
  expect(permissions.size).toBe(2);
  expect(permissions).toContain('file:R');
  expect(permissions).toContain('file:W');
});

test('Rule should return correct context identifiers', () => {
  const rule = new Rule({ user: 'test' }, ['file:read', 'file:W']);

  const identifiers1 = rule.getContextIdentifiers('user');
  expect(identifiers1).toBeInstanceOf(Set);
  expect(identifiers1).toContain('test');

  const identifiers2 = rule.getContextIdentifiers('group');
  expect(identifiers2).toBeInstanceOf(Set);
  expect(identifiers2.size).toBe(0);
});

test('Rule should return correct context identifiers for sets', () => {
  const users = new Set(['testA', 'testB'])
  const rule = new Rule({ users }, ['file:read', 'file:W']);

  const identifiers1 = rule.getContextIdentifiers('users');
  expect(identifiers1).toBeInstanceOf(Set);
  expect(identifiers1).toBe(users);
});
