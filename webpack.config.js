const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_, { mode }) => ({
  entry: {
    'scripts/carotin': './src/scripts/index.ts',
    'styles/carotin': './src/styles/base.scss',
    'styles/fonts/WebSubsetKoburi': './src/styles/fonts/WebSubsetKoburi.scss'
  },

  output: {
    filename: mode == 'production' ? '[name].min.js' : '[name].js',
    path: path.resolve(__dirname, 'doc')
  },

  resolve: {
    extensions: [".ts", ".js", ".scss"]
  },

  module: {
    rules: [
      // TypeScript
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      // SCSS
      {
        test: /\.scss/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
              importLoaders: 2 // 2 => postcss-loader, sass-loader
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: mode == 'production' ? '[name].min.css' : '[name].css',
      chunkFilename: mode == 'production' ? '[id].min.css' : '[id].css',
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'doc'),
    host: '0.0.0.0'
  }
});
