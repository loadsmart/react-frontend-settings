// import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import ttypescript from 'ttypescript';

import packageJson from './package.json';

const { main, source } = packageJson;
const peerDependencies = Object.keys(packageJson.peerDependencies);

const config = {
  input: source,
  output: {
    dir: main,
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    del({ targets: `${main}/*` }),
    typescript({
      typescript: ttypescript,
      exclude: ['./tests*'],
    }),
    resolve({
      // Source: https://rollupjs.org/guide/en/#peer-dependencies
      customResolveOptions: {
        moduleDirectories: 'node_modules',
      },
    }),
    commonjs(),
  ],
  external: [...peerDependencies],
};

export default config;
