const path = require('path');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const template = require('rollup-plugin-generate-html-template');

const baseConfig = require('./config');
const { output, plugins: baseConfigPlugins } = baseConfig;
const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath);
};
const PORT = 3002;

module.exports = {
  input: resolveFile('src/app.ts'),
  output,
  watch: {
    include: 'src/**',
  },
  plugins: [
    ...baseConfigPlugins,
    serve({
      port: PORT,
      contentBase: [resolveFile('dist')],
    }),
    livereload('dist'),
    template({
      template: resolveFile('src/index.html'),
      target: resolveFile('dist/index.html'),
    }),
  ],
};
