module.exports = function (api) {
  const env = api.env();
  api.cache(false);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: [
              'last 2 versions',
            ],
          },
          corejs: '3',
          useBuiltIns: 'usage',
        },
      ],
      [
        '@babel/react',
        {
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ],
        },
      ],
    ],
    plugins: [
      [
        'babel-plugin-conditional-compile', {
          define: {
            ENV: env,
          },
        },
      ],
    ],
  };
};
