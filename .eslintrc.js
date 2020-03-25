module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base/legacy'
  ],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': 'off'
  },
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true
  },
  plugins: [
    'deprecate'
  ]
}