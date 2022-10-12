import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import path from 'path';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const rootPath = process.cwd();

const packageFile = require(path.join(rootPath, 'package.json'));
const dependencies = []
  .concat(packageFile.dependencies ? Object.keys(packageFile.dependencies) : [])
  .concat(packageFile.devDependencies ? Object.keys(packageFile.devDependencies) : [])
  .concat(packageFile.peerDependencies ? Object.keys(packageFile.peerDependencies) : []);

export default [
  {
    external: dependencies,
    input: path.join(rootPath, 'src/index.js'),
    output: {
      file: path.join(rootPath, 'dist/development.js'),
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      babel({
        exclude: 'node_modules',
        babelHelpers: 'runtime',
      }),
      json(),
      resolve({
        extensions: ['.jsx', '.json', '.ts', '.tsx'],
        main: false,
        module: true,
      }),
    ],
  },

  {
    external: dependencies,
    input: path.join(rootPath, 'src/index.js'),
    output: {
      file: path.join(rootPath, 'dist/production.min.js'),
      format: 'es',
    },
    plugins: [
      babel({
        exclude: 'node_modules',
        babelHelpers: 'runtime',
      }),
      json(),
      resolve({
        extensions: ['.jsx', '.json', '.ts', '.tsx'],
        main: false,
        module: true,
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser(),
    ],
  },
];
