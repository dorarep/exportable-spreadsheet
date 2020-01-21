const GasPlugin = require('gas-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: `${__dirname}/dist`,
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'awesome-typescript-loader' },
    ],
  },
  plugins: [
    new GasPlugin()
  ],
};
