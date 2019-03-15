import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

const input = './src/index.js'
const filename = 'react-conductor'

const external = id => !id.startsWith('.') && !id.startsWith('/')

const babelOptions = {
	exclude: /node_modules/,
}

const buildUmd = ({ env }) => ({
	input,
	external: [ 'react' ],
	output: {
		name: 'ReactConductor',
		format: 'umd',
		sourcemap: true,
		file: `./dist/${filename}.umd.${env}.js`,
		exports: 'named',
		globals: {
			react: 'React'
		},
	},

	plugins: [
		resolve(),
		babel(babelOptions),
		commonjs({
			include: /node_modules/,
			namedExports: {
			},
		}),
		sourceMaps(),
		env === 'production' && terser({
			sourcemap: true,
			output: { comments: false },
			compress: {
				keep_infinity: true,
				pure_getters: true,
			},
			warnings: true,
			ecma: 5,
			toplevel: false,
		}),
	]
})

const buildCjs = ({ env }) => ({
	input,
	external,
	output: {
		file: `./dist/${filename}.cjs.${env}.js`,
		format: 'cjs',
		sourcemap: true,
	},
	plugins: [
		resolve(),
		babel(babelOptions),
		sourceMaps(),
		env === 'production' &&
		terser({
			sourcemap: true,
			output: { comments: false },
			compress: {
				keep_infinity: true,
				pure_getters: true,
			},
			warnings: true,
			ecma: 5,
			// Compress and/or mangle variables in top level scope.
			// @see https://github.com/terser-js/terser
			toplevel: true,
		}),
	],
});

export default [
	buildUmd({ env: 'production' }),
	buildUmd({ env: 'development' }),
	buildCjs({ env: 'production' }),
	buildCjs({ env: 'development' }),
	{
		input,
		external,
		output: [
		  {
			file: `lib/${filename}.js`,
			format: 'esm',
			sourcemap: true,
		  },
		],
		plugins: [resolve(), babel(babelOptions), sourceMaps()],
	  },
];
