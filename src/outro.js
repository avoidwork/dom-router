// CJS, AMD & window supported
if ( typeof exports != "undefined" ) {
	module.exports = router;
}
else if ( typeof define == "function" ) {
	define( () => {
		return router;
	} );
}
else {
	window.router = router;
}
}( document, window );
