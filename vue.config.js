module.exports = {


  configureWebpack: {
    devtool: 'source-map'
  },

  
  transpileDependencies: [
    'vuetify'
  ],
  runtimeCompiler: true,

/*
  configureWebpack: config => {

    config.externals = {
  
      //typeorm: "require('typeorm')",
      //sqlite3: "require('sqlite3')",
      

      
      typeorm: "commonjs typeorm",
      sqlite3: "commonjs sqlite3",
      

      


  
    }
  
  }
  */
}








