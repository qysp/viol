import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'build/index.js',
    output: {
      file: 'lib/index.js',
      format: 'commonjs',
    },
    plugins: [
      commonjs(),
    ],
  },
  {
    input: 'build/index.d.ts',
    output: {
      file: 'lib/index.d.ts',
    },
    plugins: [
      dts(),
    ],
  },
];
