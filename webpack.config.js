const path = require('path');

module.exports = {
  mode: "production",
  entry: "./src/scripts/index.ts",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: 'carotin.js',
    path: path.resolve(__dirname, 'build/scripts')
  }
};
