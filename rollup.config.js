import path from 'path';

// import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import packageJson from './package.json';

const outDir = path.dirname(packageJson.main);
const peerDependencies = Object.keys(packageJson.peerDependencies);

const config = {
  input: 'src/index.ts',
  output: {
    dir: outDir,
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    del({ targets: `${outDir}/*` }),
    typescript(),
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
