const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    tgraph: path.join(__dirname, 'src', 'index.tsx'),
    GithubGraph: path.join(__dirname, "examples", "src", "main.tsx")
  },
  output: {
    library: 'tgraph',
    libraryTarget: "umd",
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'examples', 'src'),
        ],
        exclude: /node_modules/,
        loaders: 'ts-loader',
        options: { allowTsInNodeModules: true },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss' ]
  },
  devtool: 'source-map',
};