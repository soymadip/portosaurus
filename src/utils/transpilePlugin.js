module.exports = function (context, options) {
  return {
    name: "portosaurus-transpiler",
    configureWebpack(_config, isServer, utils) {
      return {
        module: {
          rules: [
            {
              test: /\.js$/,
              include: /node_modules\/portosaurus/,
              use: [utils.getJSLoader(isServer)],
            },
          ],
        },
      };
    },
  };
};
