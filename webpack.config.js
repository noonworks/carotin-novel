const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_, { mode }) => ({
  entry: {
    'scripts/carotin': './src/scripts/index.ts',
    'scripts/carotin_mini': './src/scripts/indexMini.ts',
    'styles/carotin': './src/styles/base.scss',
    'styles/demo': './src/styles/demo.scss',
    'styles/fonts/GenEiKoburiMin6-R-demo':
      './src/styles/fonts/GenEiKoburiMin6-R-demo.scss'
  },

  output: {
    filename: mode == 'production' ? '[name].min.js' : '[name].js',
    path: path.resolve(__dirname, 'docs')
  },

  resolve: {
    extensions: ['.ts', '.js', '.scss']
  },

  externals: {
    'ua-parser-js': 'UAParser'
  },

  module: {
    rules: [
      // TypeScript
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      // SCSS
      {
        test: /\.scss/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              importLoaders: 2 // 2 => postcss-loader, sass-loader
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: mode == 'production' ? '[name].min.css' : '[name].css',
      chunkFilename: mode == 'production' ? '[id].min.css' : '[id].css'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    host: '0.0.0.0'
  }
});
