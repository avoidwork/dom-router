( function ( document, window ) {
"use strict";

var not_hash = /.*\#/,
	time = new Date().getTime(),
	render;

render = window.requestAnimationFrame || function ( fn ) {
	var offset = new Date().getTime() - time;

	setTimeout( function () {
		fn( offset );
	}, 16 );
};
