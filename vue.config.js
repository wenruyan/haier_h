const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  publicPath: process.env.NODE_ENV == 'production' ? '/' : '/',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      "/api": {
        // target: "http://192.168.31.224:3000", // 于哲
        target: "http://192.168.31.246:3000", // 李亮
        // target: "http://192.168.31.174:3000", // 杨林
        // target: "http://192.168.31.176:3000",
        // target: "http://192.168.33.202:3000",
        // target: "http://saasuat.focus-base.com:3101", // uat
        // target: "http://192.168.33.2:3001",
        // target: 'https://dietcoke.focus-base.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: (config) => {
    /* 添加分析工具 */
    if (process.env.NODE_ENV === 'production') {
      config.optimization
        .splitChunks({
          cacheGroups: {},
          minSize: 0,
          minChunks: 2
        });
      config.plugins.delete('prefetch')
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end();
        config.plugins.delete('prefetch')
      }
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据进行压缩
          deleteOriginalAssets: false // 是否删除原文件
        })]
      }
    }
  }
}
