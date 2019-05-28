const path = require('path');
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'index.ts'),
  output: {
    library: 'tgraph',
    libraryTarget: "umd",
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: "tgraph.bundle.js",
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      include: [
        path.resolve(__dirname)
      ],
      exclude: /node_modules/,
      loader: 'ts-loader',
    }]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  devtool: 'inline-source-map',
};