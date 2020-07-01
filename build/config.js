// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');

const { name } = require('../package.json');
const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath);
};

module.exports = {
  input: resolveFile('src/index.ts'),
  output: {
    file: resolveFile(`dist/${name}.js`),
    format: 'cjs',
  },
  external: ['json-schema', 'axios', 'http', 'https', 'zlib', 'url'],
  plugins: [
    babel({
      presets: ['@babel/preset-env'],
    }),
    typescript(),
    json(),
    resolve(),
    commonjs({
      include: 'node_modules/**',
      exclude: [],
    }),
  ],
};
