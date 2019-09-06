const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

const entries = {
  'scripts/carotin': './src/scripts/index.ts',
  'styles/carotin': './src/styles/base.scss',
  'styles/fonts/WebSubsetKoburi': './src/styles/fonts/WebSubsetKoburi.scss'
};

module.exports = {
  mode: "development",

  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
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
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ]
};
