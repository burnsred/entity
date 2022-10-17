
module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:jsdoc/recommended',
  ],

  env: {
    node: true,
    es6: true,
    jest: true,
    browser: true,
    commonjs: true,
  },

  parser: '@babel/eslint-parser',

  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },

  plugins: [
    'react',
    'react-hooks',
    'import',
    'jsx-a11y',
    'eslint-comments',
    'jest',
    'promise',
    'unicorn',
    'jsdoc',
  ],

  rules: {
    'arrow-parens': ['warn', 'as-needed'],

    // disable camelcase
    camelcase: 0,

    'class-methods-use-this': 0,

    // use consistent for every element in array
    'function-paren-newline': ['error', 'consistent'],

    // disable for the following files
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__mocks__/**',
          '**/*.config.js',
          '**/*.test.js',
          '**/*.test.jsx',
          '**/*.stories.jsx',
          '**/stories.jsx',
          '**/.storybook/**',
        ],
      },
    ],

    'import/no-unresolved': ['error', { commonjs: true, caseSensitive: true }],

    // Require one line before @returns after @param
    'jsdoc/tag-lines': ['warn', 'never', {
      tags: { returns: { lines: 'always', count: 1 } },
    }],

    'jsx-a11y/label-has-for': [
      'error',
      {
        components: ['Label'],
        required: {
          every: ['nesting', 'id'],
        },
        allowChildren: true,
      },
    ],

    // remove max-length for line. should consider restoring this one
    'max-len': 0,

    'no-underscore-dangle': 0,

    // use consistent for every element in object
    'object-curly-newline': ['error', { consistent: true }],

    // need to reconsider
    'react/destructuring-assignment': 0,

    'react-hooks/rules-of-hooks': 'error',

    // disabled until custom PropTypes is fixed
    'react/no-typos': 0,

    // ignore required prop-types for className
    'react/prop-types': [2, { ignore: ['className'] }],

    'react/sort-comp': [2, {
      order: [
        'static-methods',
        'lifecycle',
        'getters',
        'setters',
        'everything-else',
        'rendering',
      ],

      groups: {
        lifecycle: [
          'displayName',
          'contextTypes',
          'childContextTypes',
          'propTypes',
          'defaultProps',
          'getDerivedStateFromProps',
          'mixins',
          'statics',
          'constructor',
          'state',
          'instance-variables',
          '/^handle.+$/',
          'getChildContext',
          'getDefaultProps',
          'getInitialState',
          'getSnapshotBeforeUpdate',
          'componentDidCatch',
          'componentDidMount',
          'componentDidUpdate',
          'componentWillMount',
          'componentWillReceiveProps',
          'componentWillUnmount',
          'componentWillUpdate',
          'shouldComponentUpdate',
          'UNSAFE_componentWillReceiveProps',
          'UNSAFE_componentWillMount',
          'UNSAFE_componentWillUpdate',
        ],

        rendering: [
          '/^render.+$/',
          'render',
        ],
      },
    }],

    'unicorn/filename-case': 'off',

    'unicorn/new-for-builtins': 'off',

    'unicorn/no-array-reduce': 'warn',

    'unicorn/prefer-node-append': 'off',

    'unicorn/prefer-query-selector': 'off',

    'unicorn/prevent-abbreviations': 'off',
  },
  settings: {
    react: {
      pragma: 'React',
      version: '16.8.4',
    },
  },
};
