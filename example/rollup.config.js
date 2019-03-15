import liveServer from 'rollup-plugin-live-server'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

// Convert CJS modules to ES6, so they can be included in a bundle
import postcss from 'rollup-plugin-postcss'
import postcssModules from 'postcss-modules'
import postcssPresetEnv from 'postcss-preset-env'

const production = !process.env.ROLLUP_WATCH

const devOutput = [
  {
    dir: 'dist',
    format: 'es',
    sourcemap: !production,
  },
]

const prodOutput = [
  devOutput,
  {
    dir: 'public/dist',
    format: 'system',
    sourcemap: !production,
  },
]

export default {
  input: [ 'src/app.js' ],
  output: production ? prodOutput : devOutput,
  watch: {
    include: [
      'src/**',
      '../lib/**'
    ],
  },
  plugins: [
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.json'],
    }),
    commonjs({
			include: /node_modules/,
			namedExports: {
			},
		}),
    // commonjs({

    //   include: ['node_modules/**'],
    //   exclude: ['node_modules/process-es6/**'],
    //   namedExports: {
    //     'node_modules/react/index.js': [
    //       'Children',
    //       'Component',
    //       'PropTypes',
    //       'createElement',
    //     ],
    //     'node_modules/react-dom/index.js': ['render'],
    //   },
    // }),
    postcss({
      modules: true,
      plugins: [
        postcssModules({
          generateScopedName: '[local]',
        }),
        postcssPresetEnv({
          stage: 0,
        }),
      ],
    }),
    babel({
      exclude: /node_modules/,
    }),
    !production && liveServer({
      port: 10001,
      root: 'public',
      file: 'index.html',
      mount: [ [ '/dist', './dist' ] ]
    }),
    production && uglify(),
  ],
}
