Array.from = Array.from || ( arg ) => {
	return [].slice.call( arg );
};

( document, window ) => {
let not_hash = /.*\#/;
let time = new Date().getTime();

let contains = ( obj, arg ) => {
	return obj.indexOf( arg ) > -1;
};

let render = window.requestAnimationFrame || ( fn ) => {
	let offset = new Date().getTime() - time;

	setTimeout( () => {
		fn( offset );
	}, 16 );
};
