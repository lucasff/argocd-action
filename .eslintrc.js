module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    es6: true,
  },
  plugins: ['prettier'],
  extends: ['plugin:import/recommended', 'plugin:import/typescript', 'prettier', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'warn',
    'import/order': [
      'error',
      {
        groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'eol-last': ['error', 'always'],
  },
  ignorePatterns: ['dist/', 'lib/', 'node_modules/', 'jest.config.js'],
};
