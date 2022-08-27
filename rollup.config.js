import pkg from "./package.json";

const {terser} = require("rollup-plugin-terser");
const year = new Date().getFullYear();
const bannerLong = `/**
 * ${pkg.name}
 *
 * @copyright ${year} ${pkg.author}
 * @license ${pkg.license}
 * @version ${pkg.version}
 */`;
const bannerShort = `/*!
 ${year} Jason Mulligan <jason.mulligan@avoidwork.com>
 @version ${pkg.version}
*/`;
const defaultOutBase = {compact: true, name: pkg.name};
const umdOutBase = {...defaultOutBase, banner: bannerLong, format: "umd"};
const umdOutBaseMin = {...umdOutBase, banner: bannerShort, plugins: [terser()], sourcemap: true};
const esmOutBase = {...defaultOutBase, banner: bannerLong, format: "esm"};
const esmOutBaseMin = {...esmOutBase, banner: bannerShort, plugins: [terser()], sourcemap: true};

export default [
	{
		input: "./src/router.js",
		output: [
			{
				banner: bannerLong,
				file: `dist/${pkg.name}.cjs.js`,
				format: "cjs",
				exports: "named"
			},
			{
				...esmOutBase,
				file: `dist/${pkg.name}.esm.js`
			},
			{
				...esmOutBaseMin,
				file: `dist/${pkg.name}.esm.min.js`
			},
			{
				...umdOutBase,
				banner: bannerLong,
				file: `dist/${pkg.name}.js`,
				name: "domRouter"
			},
			{
				...umdOutBaseMin,
				file: `dist/${pkg.name}.min.js`,
				name: "domRouter"
			},
			{
				...umdOutBase,
				file: `test/www/${pkg.name}.js`,
				name: "domRouter"
			}
		]
	}
];
