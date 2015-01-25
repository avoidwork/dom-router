module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		concat : {
			options : {
				banner : "/**\n" +
				         " * <%= pkg.description %>\n" +
				         " *\n" +
				         " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
				         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
				         " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
				         " * @link <%= pkg.homepage %>\n" +
				         " * @module <%= pkg.name %>\n" +
				         " * @version <%= pkg.version %>\n" +
				         " */\n"
			},
			dist : {
				src : [
					"src/intro.js",
					"src/route.js",
					"src/router.js",
					"src/outro.js"
				],
				dest : "lib/<%= pkg.name %>.es6.js"
			}
		},
		"6to5": {
			options: {
				sourceMap: false
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
		mochaTest : {
			options: {
				reporter: "spec"
			},
			test : {
				src : ["test/*_test.js"]
			}
		},
		uglify: {
			options: {
				banner : "/*\n" +
				" <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
				" @version <%= pkg.version %>\n" +
				" */",
				sourceMap: true,
				sourceMapIncludeSources: true,
				mangle: {
					except: ["Router", "Descriptor", "CustomEvent", "define", "export"]
				}
			},
			target: {
				files: {
					"lib/dom-router.min.js" : ["lib/dom-router.js"]
				}
			}
		},
		watch : {
			js : {
				files : "<%= concat.dist.src %>",
				tasks : "default"
			},
			pkg: {
				files : "package.json",
				tasks : "default"
			}
		}
	});

	// tasks
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-mocha-test");
	grunt.loadNpmTasks("grunt-6to5");

	// aliases
	grunt.registerTask("test", ["mochaTest"]);
	grunt.registerTask("build", ["concat", "6to5", "copy", "test"]);
	grunt.registerTask("default", ["build", "uglify"]);
};
