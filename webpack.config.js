// webpack.config.js or webpack.dev.js

module.exports = {
  // other webpack configurations...
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Replace 'onBeforeSetupMiddleware' with your custom setup code
      // This is where you can add custom middlewares or modify the default ones.

      // Example middleware:
      middlewares.unshift((req, res, next) => {
        console.log("Custom middleware before setup");
        next();
      });

      // Return the middlewares array
      return middlewares;
    },
  },
};
