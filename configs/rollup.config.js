import path from 'path';
import { fileURLToPath } from 'url';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

// ES does not provide require
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// ES does not provide __dirname
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Dir of current package, not this config file
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
      file: path.join(rootPath, 'dist/index.js'),
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      babel({
        configFile: path.resolve(__dirname, '../babel.config.json'),
        exclude: 'node_modules',
        babelHelpers: 'runtime',
      }),
      commonjs(),
      json(),
      resolve(),
    ],
  },

  {
    external: dependencies,
    input: path.join(rootPath, 'src/index.js'),
    output: {
      file: path.join(rootPath, 'dist/index.min.js'),
      format: 'es',
    },
    plugins: [
      babel({
        configFile: path.resolve(__dirname, '../babel.config.json'),
        exclude: 'node_modules',
        babelHelpers: 'runtime',
      }),
      commonjs(),
      json(),
      resolve(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser(),
    ],
  },
];
