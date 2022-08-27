const {terser} = require("rollup-plugin-terser");

export default [
	{
		input: "./src/router.js",
		output: [
			{
				file: "dist/router.cjs.js",
				format: "cjs",
				exports: "named"
			},
			{
				file: "dist/router.esm.js",
				format: "es",
				compact: true,
				plugins: [terser()]
			},
			{
				file: "dist/router.js",
				name: "afm",
				format: "umd",
				compact: true,
				plugins: [terser()]
			}
		]
	}
];
