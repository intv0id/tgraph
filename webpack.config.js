const path = require('path');
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    library: 'tgraph',
    libraryTarget: "umd",
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: "tgraph.bundle.js",
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: [
        path.join(__dirname, 'src')
      ],
      exclude: /node_modules/,
      loader: 'ts-loader',
      options: { allowTsInNodeModules: true },
    }]
  },
  resolve: {
    extensions: ['.ts', '.js' ]
  },
  devtool: 'source-map',
};