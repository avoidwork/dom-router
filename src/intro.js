( function ( document, window ) {
"use strict";

var $ = document.querySelectorAll.bind( document ),
	not_hash = /.*\#/,
	time = new Date().getTime(),
	render;

render = window.requestAnimationFrame || function ( fn ) {
	var offset = new Date().getTime() - time;

	setTimeout( function () {
		fn( offset );
	}, 16 );
};
