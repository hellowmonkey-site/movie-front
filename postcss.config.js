module.exports = {
  plugins: {
    "postcss-preset-env": {
      browsers: `last 2 versions`,
      stage: 0,
    },
    // "postcss-pxtorem": {
    //   rootValue: 16,
    //   unitPrecision: 5,
    //   propList: ["*"],
    //   selectorBlackList: [],
    //   replace: true,
    //   mediaQuery: false,
    //   minPixelValue: 0,
    //   exclude: /node_modules/i,
    // },
  },
};
