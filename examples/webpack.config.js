const path = require('path');
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src/github.tsx'),
  output: {
    library: 'githubGraph',
    libraryTarget: "umd",
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: "GithubGraph.bundle.js",
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      include: [
        path.join(__dirname, 'src')
      ],
      exclude: /node_modules/,
      loader: 'ts-loader',
      options: { allowTsInNodeModules: true },
    }]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx' ]
  },
  devtool: 'source-map',
};