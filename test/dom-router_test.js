var Nightmare = require( "nightmare" ),
	turtleio = require( "turtle.io" );

describe( "Routing", function () {
	var port = 8000;

	turtleio().start( {
		port: port,
		default: "localhost",
		root: __dirname,
		vhosts: {
			localhost: "www"
		},
		logs: {
			stdout: false
		}
	} );

	it("GET without hash - returns #main", function ( done ) {
		new Nightmare()
			.goto( "http://localhost:8000/" )
			.evaluate( function () {
				return document.documentElement.innerHTML;
			}, function ( res ) {
				done();
			} )
			.run();
	} );
} );