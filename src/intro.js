(function (document, window) {
	const not_hash = /.*\#/,
		contains = Array.contains || function (obj, arg) { return obj.indexOf(arg) > -1; },
		from = Array.from || function (arg) { return [].slice.call(arg); },
		has = function (a, b) { return a in b; },
		time = new Date().getTime(),
		render = window.requestAnimationFrame || function (fn) { setTimeout(fn(new Date().getTime() - time), 16); };
