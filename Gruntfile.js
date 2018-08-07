module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			options: {
				banner: "/**\n" +
					" * <%= pkg.description %>\n" +
					" *\n" +
					" * @author <%= pkg.author %>\n" +
					" * @copyright <%= grunt.template.today('yyyy') %>\n" +
					" * @license <%= pkg.license %>\n" +
					" * @version <%= pkg.version %>\n" +
					" */\n"
			},
			dist: {
				src: [
					"src/intro.js",
					"src/route.js",
					"src/router.js",
					"src/outro.js"
				],
				dest: "lib/<%= pkg.name %>.js"
			}
		},
		copy: {
			test: {
				files: [
					{expand: true, flatten: true, src: ["lib/<%= pkg.name %>.js"], dest: "test/www"}
				]
			}
		},
		eslint: {
			target: [
				"Gruntfile.js",
				"lib/<%= pkg.name %>.js",
				"test/*.js"
			]
		},
		mochaTest: {
			options: {
				reporter: "spec"
			},
			test: {
				src: ["test/*_test.js"]
			}
		},
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: /{{VERSION}}/,
							replacement: "<%= pkg.version %>"
						}
					]
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: [
							"lib/<%= pkg.name %>.js"
						],
						dest: "lib/"
					}
				]
			}
		},
		watch: {
			js: {
				files: "<%= concat.dist.src %>",
				tasks: "default"
			},
			pkg: {
				files: "package.json",
				tasks: "default"
			}
		}
	});

	// tasks
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-mocha-test");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-replace");

	grunt.task.registerTask("babili", "Minifies ES2016+ code", function () {
		const fs = require("fs"),
			path = require("path"),
			data = fs.readFileSync(path.join(__dirname, "lib", "dom-router.js"), "utf8").replace("\"use strict\";", ""), // Stripping "use strict"; because it's injected
			pkg = require(path.join(__dirname, "package.json")),
			banner = "/*\n " + new Date().getFullYear() + " " + pkg.author + "\n @version " + pkg.version + "\n*/\n\"use strict\";";

		try {
			const minified = require("babel-core").transform(data, {sourceFileName: "dom-router.js", sourceMaps: true, presets: ["minify"]});

			fs.writeFileSync(path.join(__dirname, "lib", "dom-router.min.js"), banner + minified.code + "\n//# sourceMappingURL=dom-router.min.js.map", "utf8");
			grunt.log.ok("1 file created.");
			fs.writeFileSync(path.join(__dirname, "lib", "dom-router.min.js.map"), JSON.stringify(minified.map), "utf8");
			grunt.log.ok("1 sourcemap created.");
		} catch (e) {
			console.error(e.stack || e.message || e);
			throw e;
		}
	});

	// aliases
	grunt.registerTask("test", ["eslint", "mochaTest"]);
	grunt.registerTask("build", ["concat", "replace", "copy"]);
	grunt.registerTask("default", ["build", "babili", "test"]);
};
