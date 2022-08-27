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
const defaultOutBase = {compact: true, banner: bannerLong, name: pkg.name};
const cjOutBase = {...defaultOutBase, format: "cjs", exports: "named"};
const esmOutBase = {...defaultOutBase, format: "esm"};
const umdOutBase = {...defaultOutBase, format: "umd"};
const minOutBase = {banner: bannerShort, name: pkg.name, plugins: [terser()], sourcemap: true};


export default [
	{
		input: "./src/router.js",
		output: [
			{
				...cjOutBase,
				file: `dist/${pkg.name}.cjs.js`
			},
			{
				...esmOutBase,
				file: `dist/${pkg.name}.esm.js`
			},
			{
				...esmOutBase,
				...minOutBase,
				file: `dist/${pkg.name}.esm.min.js`
			},
			{
				...umdOutBase,
				file: `dist/${pkg.name}.js`,
				name: "domRouter"
			},
			{
				...umdOutBase,
				...minOutBase,
				file: `dist/${pkg.name}.min.js`,
				name: "domRouter"
			},
			{
				...umdOutBase,
				...minOutBase,
				file: `tests/specs/basic/www/${pkg.name}.js`,
				name: "domRouter"
			}
		]
	}
];
