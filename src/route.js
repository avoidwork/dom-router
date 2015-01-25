class Route {
	constructor ( options ) {
		this.hash = options.hash;
		this.element = options.element;
		this.trigger = options.trigger;
		this.timestamp = new Date().toISOString();
	}
}

let route = ( arg ) => {
	return new Route( arg );
}
