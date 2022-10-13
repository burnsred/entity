export default {
  presets: [
    ['@babel/env', {
      useBuiltIns: 'usage',
      shippedProposals: true,
      corejs: "3.25",
    }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }],
    '@babel/plugin-proposal-export-default-from',
    'babel-plugin-idx',
    'babel-plugin-react-intl-auto',
    ['babel-plugin-styled-components', { pure: true }],
    'lodash',
  ],
  env: {
    production: {
      plugins: [
        'transform-react-remove-prop-types',
      ],
    },
  },
};
