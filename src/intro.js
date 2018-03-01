(function (document, window) {
	const not_hash = /.*\#/,
		includes = typeof Array.includes === "function" ? (obj, arg) => obj.includes(arg) : (obj, arg) => obj.indexOf(arg) > -1,
		from = typeof Array.from === "function" ? arg => Array.from(arg) : arg => [].slice.call(arg),
		has = (a, b) => a in b,
		time = new Date().getTime(),
		render = window.requestAnimationFrame || function (fn) { setTimeout(fn(new Date().getTime() - time), 16); };
