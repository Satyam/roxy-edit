import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/client/main.js',
    output: {
      file: 'public/main.js',
      format: 'cjs',
    },
    plugins: [nodeResolve(), commonjs()],
  },
  {
    input: 'src/server/index.js',
    output: {
      file: 'server/index.js',
      format: 'es',
    },
    plugins: [nodeResolve(), commonjs(), json()],
    // external: [/node_modules/],
  },
];
