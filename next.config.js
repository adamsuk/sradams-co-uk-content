
module.exports = {
    webpack: function(config) {
      //config.externals.push({
      //  "react-native": true,
      //})
      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader',
      })
      return config
    }
  }
