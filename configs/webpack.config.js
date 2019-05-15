const DirectoryNamedPlugin = require('directory-named-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    plugins: [
      new DirectoryNamedPlugin(true),
    ],
  },
};
