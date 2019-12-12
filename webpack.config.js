const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    tgraph: path.join(__dirname, 'src', 'index.tsx'),
    GithubGraph: path.join(__dirname, "examples", "src", "github.tsx")
  },
  output: {
    library: 'tgraph',
    libraryTarget: "umd",
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'examples', 'src'),
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