const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
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

      return webpackConfig;
    },
  },
};
