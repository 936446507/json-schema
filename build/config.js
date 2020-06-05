const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const typescript = require('rollup-plugin-typescript');

const { name } = require('../package.json');
const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath);
};

module.exports = {
  input: resolveFile('src/index.ts'),
  output: {
    file: resolveFile(`dist/${name}.js`),
    format: 'es',
  },
  plugins: [
    babel({
      presets: ['@babel/preset-env'],
    }),
    typescript(),
  ],
};
