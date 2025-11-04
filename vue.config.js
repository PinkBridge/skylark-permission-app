const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api/oauth': {
        target: 'http://localhost:9527',
        changeOrigin: true,
        pathRewrite: {
          '^/api/oauth': '/oauth'
        },
        // 如果需要处理 HTTPS 证书问题
        secure: false,
        // 增加代理超时时间
        timeout: 30000,
        // 连接超时
        proxyTimeout: 30000,
        // 日志输出
        logLevel: 'debug'
      }
    }
  }
})
