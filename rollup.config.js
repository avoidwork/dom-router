import pkg from "./package.json";
const {terser} = require("rollup-plugin-terser");

export default [
	{
		input: "./src/router.js",
		output: [
			{
				file: `dist/${pkg.name}.cjs.js`,
				format: "cjs",
				exports: "named"
			},
			{
				file: `dist/${pkg.name}.esm.js`,
				format: "es",
				compact: false,
				plugins: [terser()]
			},
			{
				file: `dist/${pkg.name}.js`,
				name: "domRouter",
				format: "umd",
				compact: false,
				plugins: [terser()]
			}
		]
	}
];
