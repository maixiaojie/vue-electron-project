module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    },
  },
  pluginOptions: {
    electronBuilder: {
      // List native deps here if they don't work
      externals: ['conf', 'profoundjs-node-pty'],
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeModulesPath: ['./node_modules']
    }
  }
}
