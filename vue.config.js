const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/oauth': {
        target: 'http://localhost:9527',
        changeOrigin: true,
        secure: false,
        timeout: 30000,
        proxyTimeout: 30000,
        logLevel: 'debug'
      },
      '/api': {
        target: 'http://localhost:9527',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        },
        secure: false,
        timeout: 30000,
        proxyTimeout: 30000
      }
    }
  }
})
