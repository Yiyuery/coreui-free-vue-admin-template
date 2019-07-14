module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  devServer:{
    port:9000,
    proxy: {
      "/api": {
        target: "http://localhost:8100",
        pathRewrite: {"^/api" : "/capsule-data-analysis"}
      }
    }
  }
}
