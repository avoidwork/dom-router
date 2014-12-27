var server = require( "turtle.io" )();

server.start( {
	port: 8000,
	default: "localhost",
	root: __dirname,
	vhosts: {
		localhost: "www"
	},
	logs: {
		stdout: false
	}
} );
