module.exports = {
  presets: [
    [
      'babel-preset-env',
      {
        targets: {
          node: '6.10',
        },
      },
    ],
  ],
  plugins: [
    'babel-plugin-transform-class-properties',
    'babel-plugin-transform-object-rest-spread',
  ],
};
