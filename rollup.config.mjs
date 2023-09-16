import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/client/main.js',
  output: {
    file: 'public/main.js',
    format: 'cjs',
  },
  plugins: [nodeResolve(), commonjs()],
};
