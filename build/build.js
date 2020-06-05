const path = require('path');
const { uglify } = require('rollup-plugin-uglify');

const baseConfig = require('./config');
const { input, output, plugins: baseConfigPlugins } = baseConfig;
const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath);
};

module.exports = {
  input,
  output,
  plugins: [...baseConfigPlugins, uglify()],
};
