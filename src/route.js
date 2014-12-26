function Route ( arg ) {
	this.hash = arg.hash;
	this.element = arg.element;
}

function route ( arg ) {
	return new Route( arg );
}
