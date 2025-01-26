const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    configure: (webpackConfig) => {
      const htmlPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof HtmlWebpackPlugin
      );

      if (htmlPlugin) {
        htmlPlugin.options.ANALYTICS_ID =
          process.env.ANALYTICS_ID === undefined ? 'analytics-empty-id' : process.env.ANALYTICS_ID;
      }

      // copy serviceWorker.js to the build directory
      webpackConfig.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'src/serviceWorker.js'),
              to: path.resolve(__dirname, 'build/serviceWorker.js'),
            },
          ],
        })
      );

      return webpackConfig;
    },
  },
};
