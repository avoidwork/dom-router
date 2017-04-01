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
				dest: "lib/<%= pkg.name %>.es6.js"
			}
		},
		babel: {
			options: {
				sourceMap: false,
				presets: ["babel-preset-es2015"]
			},
			dist: {
				files: {
					"lib/<%= pkg.name %>.js": "lib/<%= pkg.name %>.es6.js"
				}
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
				"lib/<%= pkg.name %>.es6.js",
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
							"lib/<%= pkg.name %>.es6.js"
						],
						dest: "lib/"
					}
				]
			}
		},
		uglify: {
			options: {
				banner: '/* <%= grunt.template.today("yyyy") %> <%= pkg.author %> */\n',
				sourceMap: true,
				sourceMapIncludeSources: true,
				mangle: {
					except: ["Router", "Descriptor", "CustomEvent", "define", "export"]
				}
			},
			target: {
				files: {
					"lib/<%= pkg.name %>.min.js": ["lib/<%= pkg.name %>.js"]
				}
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
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-mocha-test");
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-replace");

	// aliases
	grunt.registerTask("test", ["eslint", "mochaTest"]);
	grunt.registerTask("build", ["concat", "replace", "babel", "copy", "test"]);
	grunt.registerTask("default", ["build", "uglify"]);
};
