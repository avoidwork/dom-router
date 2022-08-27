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

const umdOutBase = { compact: true, format: "umd", name: pkg.author };
const esmOutBase = { compact: true, format: "esm", name: pkg.author };

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
				banner: bannerLong,
				file: `dist/${pkg.name}.esm.js`
			},
			{
				...esmOutBase,
				banner: bannerShort,
				file: `dist/${pkg.name}.esm.min.js`,
				plugins: [terser()],
				sourcemap: true
			},
			{
				...umdOutBase,
				banner: bannerLong,
				file: `dist/${pkg.name}.js`,
				name: "domRouter"
			},
			{
				...umdOutBase,
				banner: bannerShort,
				file: `dist/${pkg.name}.min.js`,
				name: "domRouter",
				plugins: [terser()],
				sourcemap: true
			},
			{
				...umdOutBase,
				banner: bannerShort,
				file: `dist/${pkg.name}.min.js`,
				name: "domRouter",
				plugins: [terser()],
				sourcemap: true
			}
		]
	}
];
