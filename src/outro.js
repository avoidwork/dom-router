	// CJS, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = factory;
	} else if (typeof define === "function" && define.amd) {
		define(() => factory);
	} else {
		window.router = factory;
	}
}(document, window));
