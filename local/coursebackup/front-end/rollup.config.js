import { nodeResolve } from '@rollup/plugin-node-resolve';
// import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/index.js',
    output: {
      format: 'iife',
      dir: "./build"
    },
    plugins: [
      nodeResolve(),
      // terser({compress: true, output: {comments: ""}})
    ]
  };